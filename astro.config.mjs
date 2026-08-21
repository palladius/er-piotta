import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://palladius.github.io',
  base: '/er-piotta',
  integrations: [tailwind({
    applyBaseStyles: true,
  })]
});
