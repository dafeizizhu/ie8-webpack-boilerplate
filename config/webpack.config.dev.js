const path = require('path')
const helpers = require('./helpers')
const webpackConfig = require('./webpack.config.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
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

let pages = ['index', 'sub']

const htmlWebpackPlugins = pages.map(page => new HtmlWebpackPlugin({
  inject: false,
  filename: page + '.html',
  template: helpers.root('./src/page/' + page + '/index.html'),
  chunkSortMode: 'dependency',
  chunks: ['ie8-polyfill', page]
}))

webpackConfig.plugins = [
  ...webpackConfig.plugins,
  new DefinePlugin({
    'process.env': env
  }),
  ...htmlWebpackPlugins,
  // copy custom static assets
  new CopyWebpackPlugin([{
    from: path.resolve(__dirname, '../static'),
    to: webpackConfig.output.path,
    ignore: ['.*']
  }])
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
