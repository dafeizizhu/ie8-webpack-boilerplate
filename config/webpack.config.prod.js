const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const webpackConfig = require('./webpack.config.base')
const helpers = require('./helpers')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const env = require('../environment/prod.env')

const extractStyle = new ExtractTextPlugin({
  filename: 'css/[name]_[chunkhash:8].css',
  allChunks: true,
  disable: process.env.NODE_ENV === 'development'
})

webpackConfig.output = {
  ...webpackConfig.output,
  filename: 'js/[name]_[chunkhash:8].js',
  chunkFilename: 'js/[name]_[chunkhash:8].chunk.js'
}

webpackConfig.module.rules = [...webpackConfig.module.rules,
  {
    test: /\.s?css$/,
    use: extractStyle.extract({
      use: [{
        loader: 'css-loader',
        options: {
          minimize: true,
          importLoaders: 2
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [
            autoprefixer
          ]
        }
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded'
        }
      }],
      // use style-loader in development
      fallback: 'style-loader'
    })
  },
  {
    test: /\.(jpg|png|gif)$/,
    loader: 'file-loader?name=assets/img/[name].[ext]'
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader?name=fonts/[name].[ext]'
  }
]

webpackConfig.plugins = [...webpackConfig.plugins,
  extractStyle,
  new HtmlWebpackPlugin({
    inject: false,
    filename: 'index.html',
    template: helpers.root('/src/page/index/index.html'),
    favicon: helpers.root('/src/assets/favicon.png'),
    minify: {
      removeComments: true,
      collapseWhitespace: false,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    },
    chunksSortMode: 'dependency',
    chunks: ['es5-polyfill', 'manifest', 'vendor', 'common', 'index']
  }),
  new HtmlWebpackPlugin({
    inject: false,
    filename: 'sub.html',
    template: helpers.root('/src/page/sub/index.html'),
    favicon: helpers.root('/src/assets/favicon.png'),
    minify: {
      removeComments: true,
      collapseWhitespace: false,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    },
    chunksSortMode: 'dependency',
    chunks: ['es5-polyfill', 'manifest', 'vendor', 'common', 'sub']
  }),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
      screw_ie8: false,
      keep_fnames: true,
      properties: false,
      keep_quoted: true
    },
    compress: {
      warnings: false,
      screw_ie8: false,
      properties: false
    },
    output: {
      keep_quoted_props: true
    },
    comments: false
  }),
  new DefinePlugin({
    'process.env': env
  }),
  // keep module.id stable when vender modules does not change
  new webpack.HashedModuleIdsPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: 2
  }),
  // split vendor js into its own file
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf('es5-polyfill') < 0 &&
        module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
      )
    }
  }),
  // extract webpack runtime and module manifest to its own file in order to
  // prevent vendor hash from being updated whenever app bundle is updated
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  })
]

module.exports = webpackConfig
