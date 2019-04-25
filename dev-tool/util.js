'use strict';

/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  setup(config) {
    const defaults = { mode: 'development', plugins: [], devServer: {} };
    const result = Object.assign(defaults, config);
    const before = function before(app) {
      app.get('/.assets/*', (req, res) => {
        const filename = path.join(__dirname, '/', req.path);
        res.sendFile(filename);
      });
    };
    
    result.plugins.push(new webpack.NamedModulesPlugin());
    result.plugins.push(new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../test/index.html')
    }));

    if (result.devServer.before) {
      const proxy = result.devServer.before;
      result.devServer.before = function replace(app) {
        before(app);
        proxy(app);
      };
    } else {
      result.devServer.before = before;
    }

    result.output = { path: path.dirname(module.parent.filename) };

    return result;
  }
};