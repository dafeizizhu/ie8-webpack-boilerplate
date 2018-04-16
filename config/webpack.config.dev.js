const helpers = require('./helpers')
const webpackConfig = require('./webpack.config.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const env = require('../environment/dev.env')

webpackConfig.module.rules = [
  ...webpackConfig.module.rules,
  {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader'
  },
  {
    test: /\.s?css$/,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader'
    ]
  }
]

webpackConfig.plugins = [
  ...webpackConfig.plugins,
  new DefinePlugin({
    'process.env': env
  }),
  new HtmlWebpackPlugin({
    inject: false,
    filename: 'index.html',
    template: helpers.root('./src/page/index/index.html'),
    favicon: helpers.root('./src/assets/favicon.png'),
    chunksSortMode: 'dependency',
    chunks: ['es5-polyfill', 'index']
  }),
  new HtmlWebpackPlugin({
    inject: false,
    filename: 'sub.html',
    template: helpers.root('./src/page/sub/index.html'),
    favicon: helpers.root('./src/assets/favicon.png'),
    chunksSortMode: 'dependency',
    chunks: ['es5-polyfill', 'sub']
  })
]

webpackConfig.devServer = {
  port: 10088,
  host: '0.0.0.0',
  historyApiFallback: true,
  disableHostCheck: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  contentBase: './src',
  open: true
}

module.exports = webpackConfig
