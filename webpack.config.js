var path = require('path');
var mqpacker = require('css-mqpacker');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});

// Minify CSS for production only
var cssLoader;
if(process.env.NODE_ENV === 'production') {
  cssLoader = 'css?minimize!postcss!resolve-url!sass'
}
else {
  cssLoader = 'css?-minimize!resolve-url!sass?sourceMap'
}

module.exports = {
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
        loader: 'babel-loader'
      },
      {
        // Use ExtractTextPlugin to create separate css file
        test: /\.scss$/, include: __dirname + '/app/scss',
        loader: ExtractTextPlugin.extract(
          'style', cssLoader
        )
      },
      {
        // Bootstrap includes font files which webpack needs to know how to handle
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader?limit=9000&name=./css/fonts/[hash].[ext]'
      }
    ]
  },

  // Point webpack to bootstrap source files
  sassLoader: {
    includePaths: [path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')]
  },

  // Default css-loader minification missing mqpacker so load it
  postcss: function() {
    return [
      mqpacker()
    ];
  },

  plugins: [
    HtmlWebpackPluginConfig,
    new ExtractTextPlugin('./css/site.css', {
      //allChunks: true
    })
  ]
};
