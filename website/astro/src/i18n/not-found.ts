import type { Locale } from './types';

export const notFoundCopy = {
  en: {
    title: 'Page not found',
    description: 'This page could not be found. Return to the English or Chinese homepage.',
    label: 'A turn off the map',
    heading: 'Page not found.',
    detail: 'The address may have changed. Find your way back to the homepage.',
    home: 'English home',
  },
  zh: {
    title: '找不到此页面',
    description: '此页面不存在。你可以返回英文或中文首页。',
    label: '在这里，换个方向',
    heading: '这一页，暂时走丢了。',
    detail: '地址可能已经更改，你可以从首页重新出发。',
    home: '返回中文首页',
  },
} satisfies Record<Locale, {
  title: string; description: string; label: string; heading: string; detail: string; home: string;
}>;
