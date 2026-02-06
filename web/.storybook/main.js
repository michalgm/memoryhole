import { getPaths, importStatementPath } from '@cedarjs/project-config'

const redwoodProjectPaths = getPaths()

const config = {
  framework: 'storybook-framework-cedarjs',

  stories: [
    `${importStatementPath(
      redwoodProjectPaths.web.src
    )}/**/*.stories.@(js|jsx|ts|tsx|mdx)`,
  ],

  addons: ['@storybook/addon-essentials'],
}

export default config
