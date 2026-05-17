import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://fraserxu.dev',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
  },
})
