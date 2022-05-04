const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const config = {
  plugins: [
    new NodePolyfillPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(bin|jpe?g|png|dds|vrm|glb|gltf|fbx)$/,
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
