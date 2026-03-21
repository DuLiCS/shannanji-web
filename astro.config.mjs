import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shannanji.com',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});