import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://executorfile.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  markdown: {
    // Commands on this site are plain text an executor types, not code to
    // colour; inline highlight styles would also fight the print stylesheet.
    syntaxHighlight: false,
  },
  build: {
    format: 'directory',
  },
});
