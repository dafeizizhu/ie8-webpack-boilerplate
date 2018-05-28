const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const autoprefixer = require('autoprefixer')
const webpackConfig = require('./webpack.config.base')
const helpers = require('./helpers')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const env = require('../environment/prod.env')
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin')

const extractStyle = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true,
  disable: process.env.NODE_ENV === 'development'
})

webpackConfig.output = {
  ...webpackConfig.output,
  filename: 'js/[name].js',
  chunkFilename: 'js/[name].chunk.js'
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
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: 'img/[name].[ext]'
    }
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader?name=fonts/[name].[ext]'
  }
]

let pages = helpers.pages()

const htmlWebpackPlugins = pages.map(page => new HtmlWebpackPlugin({
  inject: false,
  filename: page + '.html',
  template: helpers.root('./src/page/' + page + '/index.html'),
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
  chunks: ['ie8-polyfill', 'manifest', 'vendor', 'common', page],
  env
}))

webpackConfig.plugins = [
  ...webpackConfig.plugins,
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  extractStyle,
  ...htmlWebpackPlugins,
  new webpack.HashedModuleIdsPlugin(),
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
  // split common js into its own file
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: (module, count) => {
      return count >= 2
    }
  }),
  // split vendor js into its own file
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module, count) => {
      // This prevents stylesheet resources with the .css or .scss extension
      // from being moved from their original chunk to the vendor chunk
      if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
        return false
      }
      return module.context && module.context.includes('node_modules')
    }
  }),
  // extract webpack runtime and module manifest to its own file in order to
  // prevent vendor hash from being updated whenever app bundle is updated
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }),
  // copy custom static assets
  new CopyWebpackPlugin([{
    from: path.resolve(__dirname, '../static'),
    to: webpackConfig.output.path,
    ignore: ['.*']
  }]),
  // beautify html
  new HtmlBeautifyPlugin()
]

module.exports = webpackConfig
