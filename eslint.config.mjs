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
    files: ['scripts/**'],
    rules: {
      'no-console': 'off',
    },
  },
]
