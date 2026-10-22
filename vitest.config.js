import { defineConfig } from 'vitest/config'

// `yarn cedar test [web|api]` runs vitest from here with --project <side>
export default defineConfig({
  test: {
    projects: ['web/vite.config.js', 'api/vitest.config.js'],
  },
})
