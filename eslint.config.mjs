import cedarConfig from '@cedarjs/eslint-config'

export default [
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
]
