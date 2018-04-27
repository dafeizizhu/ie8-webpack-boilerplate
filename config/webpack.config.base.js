const path = require('path')
const helpers = require('./helpers')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')

const config = {
  entry: {
    'ie8-polyfill': helpers.root('./src/common/js/ie8-polyfill.js'),
    'index': helpers.root('./src/page/index/index.js'),
    'huya': helpers.root('./src/page/huya/index.js')
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
