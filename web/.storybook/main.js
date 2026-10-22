import { getPaths, importStatementPath } from '@cedarjs/project-config'

const cedarProjectPaths = getPaths()

const config = {
  framework: 'storybook-framework-cedarjs',

  stories: [
    `${importStatementPath(
      cedarProjectPaths.web.src
    )}/**/*.stories.@(js|jsx|ts|tsx|mdx)`,
  ],

  addons: ['@storybook/addon-essentials'],
}

export default config
