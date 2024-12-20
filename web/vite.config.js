import dns from 'dns'

import { defineConfig } from 'vite'

// See: https://vitejs.dev/config/server-options.html#server-host
// So that Vite will load on local instead of 127.0.0.1
dns.setDefaultResultOrder('verbatim')

import redwood from '@redwoodjs/vite'

import { version } from '../package.json' // Import version from package.json
const viteConfig = {
  plugins: [redwood()],
  define: {
    APP_VERSION: JSON.stringify(version),
    BUILD_TIMESTAMP: new Date(),
  },
}

export default defineConfig(viteConfig)
