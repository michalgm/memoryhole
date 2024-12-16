// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/web',
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|lodash-es|export-to-csv|material-ui-confirm))',
  ],
  setupFilesAfterEnv: [
    'jest-matchmedia-mock',
    '<rootDir>/web/src/setupTests.js',
  ],
  moduleNameMapper: {
    'material-ui-confirm':
      'material-ui-confirm/dist/material-ui-confirm.esm.js',
  },
}

module.exports = config
