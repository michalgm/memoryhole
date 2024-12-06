const plugins = [
  [
    'transform-imports',
    {
      '@mui/icons-material': {
        // Use "transform" to specify how to transform the import
        transform: '@mui/icons-material/${member}',
        // Prevent importing the entire module
        preventFullImport: true,
      },
    },
  ],
  'babel-plugin-transform-vite-meta-env',
  '@babel/plugin-proposal-class-properties'
]

module.exports = {
  plugins,
  presets: ['@babel/preset-react'],
}
