'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// our setup function adds behind-the-scenes bits to the config that all of our
// examples need
const { setup } = require('./util');
module.exports = setup({
  mode: 'none',
  context: __dirname,
  entry: '../test/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: '../test/index.html',
      title: 'sea web'
    })
  ]
});