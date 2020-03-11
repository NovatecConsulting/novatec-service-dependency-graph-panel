const baseWebpackConfig = require('./webpack.config');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var conf = baseWebpackConfig;
conf.mode = 'production';

conf.plugins.push(new ngAnnotatePlugin());
conf.plugins.push(new UglifyJSPlugin({}));

module.exports = conf;
