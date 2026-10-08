# Flowra: modern premium furniture store

A React + Vite storefront for **Flowra**, a fictional premium furniture brand selling to the US, UK, Canada and Europe. It has a glass-style video hero, a full shop with search and filters, product pages, a working cart with a currency switcher, a demo checkout, and About and Contact pages.

Built with React 19, Vite, Tailwind CSS v4, `motion/react` for animation and `lucide-react` for icons.

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:5173. To check the production build, run `npm run build` and then `npm run preview`.

## Folder structure

```
index.html              page shell, SEO tags, favicon
vercel.json             clean URLs for every page + cache headers
public/images/          all photos as WebP (2 sizes each) + hero poster
src/
  index.css             fonts, Tailwind theme, glass card styles
  main.tsx              router + currency/cart providers
  App.tsx               routes, sticky header, footer, cart drawer, checkout
  components/
    Hero.tsx, Navbar.tsx, HeroBadge.tsx,
    BottomLeftCard.tsx, BottomRightCorner.tsx   the hero from the brief
    ProductCard.tsx     crystal glass card with 3D tilt
    CartDrawer.tsx      cart, free-delivery meter, promo codes
    Checkout.tsx        checkout form + order confirmation
    PageHeader.tsx      photo header used on Shop, About and Contact
    NavParts.tsx, StickyNav.tsx, MobileMenu.tsx, Footer.tsx, Faq.tsx, Img.tsx, Bits.tsx
  pages/                Home, Shop, ProductPage, About, Contact, NotFound
  data/
    products.ts         every product, price, finish and description
    site.ts             phone, email, showrooms, FAQ, reviews
    lqip.json           tiny blurred placeholders for each photo
  lib/
    currency.tsx        currency switcher and exchange rates
    cart.tsx            cart, delivery rules and promo codes
```

## Where to change things

| What | File |
| --- | --- |
| Products, prices (US dollars), finishes, sizes | `src/data/products.ts` |
| Exchange rates for £, CA$ and € | `RATES` in `src/lib/currency.ts` |
| Free-delivery threshold ($1,500), delivery fee ($149) | `src/lib/cart.ts` |
| Promo codes (`WELCOME10` = 10% off) | `PROMOS` in `src/lib/cart.ts` |
| Phone, email, showroom addresses, FAQ, reviews | `src/data/site.ts` |
| Hero text and hero video | `src/components/Hero.tsx` |
| Colours and glass style | `src/index.css` |

Prices are stored once in US dollars. The site converts them per item and rounds to whole units, so the cart total always matches the prices shown. The visitor's currency is guessed from their browser language (UK → £, Canada → CA$, euro countries → €) and can be changed in the navbar, the mobile menu or the footer.

## Placeholders to replace before launch

- **Phone numbers** are fictional: `(800) 555-0142`, `(212) 555-0148`, `(416) 555-0137` (US/Canada 555 test range) and `020 7946 0321` (UK drama range).
- **Email** `hello@flowrahome.com` and the **showroom addresses**.
- **Reviews**, star ratings and review counts in `products.ts` and `site.ts` are sample content.
- **Team names and photos** on the About page are placeholders (stock photos).
- **Stats** ("12,400+ homes", "Founded 2016") are sample figures.
- **Hero video and font**: see `CREDITS.md` for licensing notes.

## Payments

Checkout is a **demo**: it validates the form and shows an order confirmation, but no payment is taken and no order is sent anywhere. The confirmation says this openly. Before launch, connect a real payment provider, for example:

- **Stripe Checkout**: send the cart lines to a small serverless function (e.g. `api/checkout.ts` on Vercel) that creates a Checkout Session, then redirect to it.
- **Shopify Buy Button / Storefront API**: keep this front end and use Shopify for products, stock and payments.

The contact form and newsletter also only show a success message. Connect them to a form service (Formspree, Basin) or your email tool (Mailchimp, Klaviyo) when you go live.

## Deploy (GitHub + Vercel)

1. On GitHub create a new repository, then click **uploading an existing file**.
2. GitHub accepts up to 100 files per upload, so upload in two rounds:
   - Round 1: drag in everything **except** the `public` folder, then **Commit changes**.
   - Round 2: **Add file → Upload files**, drag in the `public` folder, then **Commit changes**.
3. On vercel.com/new import the repository. Vercel detects **Vite** automatically: build command `npm run build`, output folder `dist`. Click **Deploy**.

Do not upload `node_modules` or `dist`; Vercel installs and builds everything itself.
