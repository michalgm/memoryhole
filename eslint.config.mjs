import eslintConfigPrettier from 'eslint-config-prettier/flat'

import cedarConfig from '@cedarjs/eslint-config'

export default [
  ...(await cedarConfig()),
  eslintConfigPrettier,
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
]
