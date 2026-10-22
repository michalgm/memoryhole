import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

import { cedar } from '@cedarjs/vite'

import { version } from '../package.json'

export default defineConfig(({ mode }) => ({
  // cedar() only enables its Vitest plugins (MockRouter, MSW, cell mocks) in test mode
  plugins: [cedar({ mode })],
  define: {
    // Note: These aren't real env vars - just using process.env.* pattern for safe string replacement
    'process.env.BUILD_TIMESTAMP': JSON.stringify(new Date()),
    'process.env.APP_VERSION': JSON.stringify(version),
  },
  ...(mode === 'test' && {
    resolve: {
      // Prefer packages' ESM builds in tests. Otherwise packages like mui-tiptap,
      // material-react-table and MUI's subpath imports load as CJS and pull in
      // duplicate copies of prosemirror / x-date-pickers / emotion that break
      // shared context
      conditions: ['module', 'browser', 'development'],
      mainFields: ['module', 'browser', 'main'],
    },
  }),
  test: {
    name: 'web',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.jsx'],
    exclude: [...configDefaults.exclude, 'templates/**'],
    deps: {
      // Cedar's MockProviders loads Routes.jsx (and so the whole app) in every
      // test file; pre-bundling MUI keeps that from taking ~40s per file
      optimizer: {
        client: {
          enabled: true,
          include: [
            'react',
            'react/jsx-runtime',
            'react-dom',
            '@emotion/react',
            '@emotion/styled',
            '@mui/material',
            '@mui/icons-material',
          ],
        },
      },
    },
    server: {
      deps: {
        inline: [
          // x-date-pickers imports '@mui/material/utils' as a directory, which
          // Node's ESM loader rejects
          /@mui\/x-date-pickers/,
          // Left to Node, user-event gets the CJS @testing-library/dom while
          // @testing-library/react configures the ESM one, so user-event's
          // events skip act() and every state update warns
          /@testing-library\/user-event/,
        ],
      },
    },
  },
}))
