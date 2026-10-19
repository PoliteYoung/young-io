import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [sitemap({ filter: (page) => !/\/404(?:\.html)?\/?$/.test(page), serialize: (item) => { item.url = item.url.replace(/\.html$/, ''); return item; } })],
  site: 'https://pol1te.cc.cd',
  output: 'static',
  build: { format: 'file' },
  trailingSlash: 'never',
});
