var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/js/es6/index.js'
  ],
  output: {
    path: path.join(__dirname, 'build/js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: path.join(__dirname, 'src/js/es6'),
        query: {
          presets: 'es2015',
        },
      },
      {
        loader: "style-loader!css-loader",
        test: /\.css$/
      },

      {
        loader: "file",
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/
      },
      {
        loader: "url?prefix=font/&limit=5000",
        test: /\.(woff|woff2)$/
      },
      {
        loader: "url?limit=10000&mimetype=application/octet-stream",
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/
      },
      {
        loader: "url?limit=10000&mimetype=image/svg+xml",
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/
      }
    ]
  },
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin()
  ],
  stats: {
    // Nice colored output
    colors: true
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map',
};