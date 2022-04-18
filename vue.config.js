const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const config = {
  plugins: [
    new NodePolyfillPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.gltf$/,
        use: [
          {
            loader: 'file-loader',
            options: { esModule: false }
          },
          '@vxna/gltf-loader'
        ]
      },
      {
        test: /\.(bin|jpe?g|png)$/,
        loader: 'file-loader',
        options: { esModule: false }
      }
    ]
  }
}
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: config
})
