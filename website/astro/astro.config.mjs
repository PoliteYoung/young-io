import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [sitemap({
    filter: (page) => !/\/404(?:\.html)?\/?$/.test(page),
    i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN' } },
    serialize: (item) => {
      const normalized = new URL(item.url);
      normalized.pathname = normalized.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
      item.url = normalized.href;
      // File output names the Chinese homepage zh.html, which the integration
      // cannot pair with the root before serialization. Pair normalized routes.
      const url = new URL(item.url);
      const path = url.pathname.replace(/^\/zh(?=\/|$)/, '') || '/';
      item.links = [
        { lang: 'x-default', url: new URL(path, url.origin).href },
        { lang: 'en', url: new URL(path, url.origin).href },
        { lang: 'zh-CN', url: new URL(`/zh${path === '/' ? '' : path}`, url.origin).href },
      ];
      return item;
    },
  })],
  site: 'https://pol1te.cc.cd',
  output: 'static',
  build: { format: 'file' },
  trailingSlash: 'never',
});
