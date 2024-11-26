import { getPaths, importStatementPath } from '@redwoodjs/project-config'

const redwoodProjectPaths = getPaths()

const config = {
  framework: 'storybook-framework-redwoodjs-vite',

  stories: [
    `${importStatementPath(
      redwoodProjectPaths.web.src
    )}/**/*.stories.@(js|jsx|ts|tsx|mdx)`,
  ],

  addons: ['@storybook/addon-essentials'],
}

export default config
