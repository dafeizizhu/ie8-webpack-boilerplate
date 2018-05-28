const webpackConfig = require('./webpack.config.test')

webpackConfig.output = {
  ...webpackConfig.output,
  path: '/path/to/public',
  publicPath: '//www.cdn.com/path/to/public/',
  filename: 'js/[name].js',
  chunkFilename: 'js/[name].chunk.js'
}

module.exports = webpackConfig
