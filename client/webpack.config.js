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
        loader: "style!css",
        test: /\.css$/
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