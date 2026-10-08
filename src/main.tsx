import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import App from './App';
import { CurrencyProvider } from './lib/currency';
import { CartProvider } from './lib/cart';
import { UiProvider } from './lib/ui';
import './index.css';

// Clean URLs on Vercel; the private preview build uses #/hash URLs because it is served from a sub-folder.
const Router = import.meta.env.MODE === 'artifact' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <MotionConfig reducedMotion="user">
        <CurrencyProvider>
          <CartProvider>
            <UiProvider>
              <App />
            </UiProvider>
          </CartProvider>
        </CurrencyProvider>
      </MotionConfig>
    </Router>
  </StrictMode>,
);
