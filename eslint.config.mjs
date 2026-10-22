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
    languageOptions: {
      globals: { vi: 'readonly' },
    },
  },
  {
    files: ['scripts/**'],
    rules: {
      'no-console': 'off',
    },
  },
]
