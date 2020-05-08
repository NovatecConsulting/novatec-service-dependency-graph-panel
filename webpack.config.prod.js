const baseWebpackConfig = require('./webpack.config');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

var conf = baseWebpackConfig;
conf.mode = 'production';

conf.plugins.push(new ngAnnotatePlugin());

conf.optimization = {
    minimize: true,
    minimizer: [new TerserPlugin()],
};

module.exports = conf;
