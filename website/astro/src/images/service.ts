import sharpService from 'astro/assets/services/sharp';
import type { LocalImageService } from 'astro';
import sharp from 'sharp';

// Astro's Sharp service always disables enlargement. Social cards need exact
// output dimensions, so allow it only when a caller explicitly opts in.
const service: LocalImageService = {
  ...sharpService,
  propertiesToHash: [...(sharpService.propertiesToHash ?? []), 'allowUpscale'],
  async getURL(options, config) {
    const url = await sharpService.getURL(options, config);
    return options.allowUpscale ? `${url}&upscale=1` : url;
  },
  parseURL(url, config) {
    const options = sharpService.parseURL(url, config);
    if (options instanceof Promise) throw new Error('Expected the built-in Sharp URL parser to be synchronous.');
    return options ? { ...options, allowUpscale: url.searchParams.get('upscale') === '1' } : undefined;
  },
  async transform(input, options, config) {
    if (options.allowUpscale && options.width && options.height) {
      // Enlarge losslessly before delegating the crop and encoder to Astro.
      // Other image requests retain Astro's normal no-enlargement behavior.
      input = await sharp(input).rotate().resize({
        width: options.width, height: options.height,
        fit: 'outside', withoutEnlargement: false,
      }).png().toBuffer();
    }
    return sharpService.transform(input, options, config);
  },
};

export default service;
