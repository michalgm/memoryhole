import { defineConfig } from 'vitest/config'

import { cedarVitestPreset } from '@cedarjs/vite/api'

export default defineConfig({
  plugins: [cedarVitestPreset()],
  test: {
    name: 'api',
    globals: true,
    globalSetup: ['./vitest.globalSetup.js'],
  },
})
