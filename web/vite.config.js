import dns from 'dns'

import { defineConfig } from 'vite'

// See: https://vitejs.dev/config/server-options.html#server-host
// So that Vite will load on local instead of 127.0.0.1
dns.setDefaultResultOrder('verbatim')

import redwood from '@redwoodjs/vite'

import { version } from '../package.json'; // Import version from package.json

const viteConfig = {
  plugins: [redwood()],
  define: {
    'process.env.BUILD_TIMESTAMP': JSON.stringify(new Date()),
    'process.env.APP_VERSION': JSON.stringify(version),
  },
}

export default defineConfig(viteConfig)
