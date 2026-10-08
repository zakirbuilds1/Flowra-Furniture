import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// "artifact" mode builds a relative-path, hash-routed copy for the private preview link.
export default defineConfig(({ mode }) => ({
  base: mode === 'artifact' ? './' : '/',
  plugins: [react(), tailwindcss()],
}));
