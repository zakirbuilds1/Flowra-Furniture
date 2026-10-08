import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { load, save } from './storage';

export type Currency = 'USD' | 'GBP' | 'CAD' | 'EUR';

// Fixed display rates from US dollars. Update these when you connect real checkout.
export const RATES: Record<Currency, number> = { USD: 1, GBP: 0.79, CAD: 1.37, EUR: 0.92 };

export const CURRENCIES: { code: Currency; label: string; symbol: string }[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
];

const LOCALE: Record<Currency, string> = { USD: 'en-US', GBP: 'en-GB', CAD: 'en-US', EUR: 'en-IE' };
const EURO_LANGS = ['de', 'fr', 'es', 'it', 'nl', 'pt', 'fi', 'el', 'sk', 'sl', 'et', 'lv', 'lt', 'ga', 'mt'];

function guessCurrency(): Currency {
  try {
    for (const tag of navigator.languages ?? [navigator.language]) {
      const [lang, region] = tag.split('-');
      if (region === 'GB') return 'GBP';
      if (region === 'CA') return 'CAD';
      if (region === 'US') return 'USD';
      if (EURO_LANGS.includes(lang) && region !== 'CH') return 'EUR';
    }
  } catch {
    /* ignore */
  }
  return 'USD';
}

/** Whole units of the chosen currency for a USD price (prices are rounded per item). */
export const convert = (usd: number, c: Currency) => Math.round(usd * RATES[c]);

/** Format an amount given in cents of the chosen currency. */
export function formatCents(cents: number, c: Currency) {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat(LOCALE[c], {
    style: 'currency',
    currency: c,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(cents / 100);
}

interface Ctx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Format a USD price in the chosen currency. */
  price: (usd: number) => string;
  /** Unit price in cents of the chosen currency. */
  cents: (usd: number) => number;
  money: (cents: number) => string;
}

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => load<Currency | null>('flowra-currency', null) ?? guessCurrency());
  useEffect(() => save('flowra-currency', currency), [currency]);
  const value = useMemo<Ctx>(
    () => ({
      currency,
      setCurrency,
      price: usd => formatCents(convert(usd, currency) * 100, currency),
      cents: usd => convert(usd, currency) * 100,
      money: cents => formatCents(cents, currency),
    }),
    [currency],
  );
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
