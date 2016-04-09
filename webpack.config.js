var path = require('path');
var webpack = require('webpack');
var argv = require('yargs').argv;
var mqpacker = require('css-mqpacker');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPlugincfg = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});
var UglifyJSPlugincfg = new webpack.optimize.UglifyJsPlugin({
  //sourceMap: false,
  compress: {
    sequences: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true
  },
  mangle: {
    except: ['$super', '$', 'exports', 'require']
  },
  output: {
    comments: false
  }
});


var cfg = {
  cssLoader: {
    test: /\.scss$/, include: __dirname + '/app/scss',
    loader: 'style!css?-minimize!resolve-url!sass?sourceMap'
  },
  devtoolSourceMap: 'source-map'
}

// Minification settings for production
if(argv.production) {
  cfg.cssLoader.loader = ExtractTextPlugin.extract('style', 'css?minimize!postcss!resolve-url!sass?sourceMap');
  cfg.devtoolSourceMap = '';
}

module.exports = {
  devtool: cfg.devtoolSourceMap,
  entry: [
    './app/index.js'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/, exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: 'react'
        }
      },
      cfg.cssLoader,
      {
        // Bootstrap includes font files which webpack needs to know how to handle
        test: /\.(otf|eot|ttf|woff|woff2)$/,
        loader: 'url-loader?limit=9000&name=./css/fonts/[hash].[ext]'
      },
      {
        test: /\.(svg|jpe?g|png)$/,
        loaders: [
          'file?&name=./img/[name].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },

  // Point webpack to bootstrap source files
  sassLoader: {
    includePaths: [path.resolve(__dirname, './node_modules/bootstrap/scss/')]
  },

  // Default css-loader minification missing mqpacker so load it
  postcss: function() {
    return [
      mqpacker()
    ];
  },

  plugins: argv.production ? [
    HtmlWebpackPlugincfg,
    UglifyJSPlugincfg,
    new ExtractTextPlugin('./css/site.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ] : [HtmlWebpackPlugincfg]
};
