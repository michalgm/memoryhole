import vitest from 'eslint-plugin-vitest'
import globals from 'globals'

import cedarConfig from '@cedarjs/eslint-config'

export default [
  {
    ignores: [
      '**/dist/',
      'web/src/test/mocks/generated.ts',
      'api/db/generated/**',
    ],
  },
  ...(await cedarConfig()),
  {
    rules: {
      camelcase: 'off',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],
      // Your custom rules here
    },
  },
  {
    // Cedar's config provides Jest's test globals; vitest (globals: true) also adds `vi`
    files: [
      '**/*.test.*',
      '**/setupTests.*',
      '**/test/setup/**',
      '**/*.mock.*',
    ],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: { ...vitest.environments.env.globals },
    },
  },
  {
    files: ['scripts/**'],
    rules: {
      'no-console': 'off',
    },
  },
]
