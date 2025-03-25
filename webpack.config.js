const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'), // Absolute path.
  output: {
    filename: '[name].[contenthash].bundle.js',
    path:     path.resolve(__dirname, 'dist'),
    clean:    true, // Clean the output directory before emit.
  },
  module: {
    rules: [
      {
        test:    /\.js$/,
        exclude: /(node_modules|bower_components|functions)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline'
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "css-loader",
            options: {
                modules: true,
            }
          },
        ],
      },
    ]
  },
  resolve: {
    extensions: [".js"],
    alias: {
      CSS: path.resolve(__dirname, './src/css/'),
      JS:  path.resolve(__dirname, './src/js/'),
    }
  },
  devServer: {
    host: '0.0.0.0',
    open: false,
    compress: true,
    hot: true,
    port: 8080
  },
  optimization: {},
  plugins: [
    new HtmlWebpackPlugin({ // A HTML page that will load that JavaScript bundle as a script.
      title: 'Phaser',
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "assets/", noErrorOnMissing: true },
      ],
    })
  ]
};