const path = require('path')
const helpers = require('./helpers')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')

const config = {
  entry: {
    'index': helpers.root('./src/page/index/index.js'),
    'sub': helpers.root('./src/page/sub/index.js'),
    'es5-polyfill': 'es5-polyfill'
  },
  output: {
    path: helpers.root('/dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
    publicPath: '/'
  },
  devtool: 'source-map',
  resolve: {
    symlinks: true,
    extensions: ['.js', '.jsx', '.html', '.css', '.scss'],
    alias: {
      '@': path.join(__dirname, '..', 'src')
    }
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new NamedModulesPlugin()
  ]
}

module.exports = config
