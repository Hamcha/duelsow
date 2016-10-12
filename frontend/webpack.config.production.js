/* eslint strict: 0 */
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const baseConfig = require("./webpack.config.common");

const config = Object.create(baseConfig);
config.devtool = "source-map";
config.entry = "./src/index";
config.output.publicPath = "/dist/";
config.plugins.push(
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.DefinePlugin({
		"__DEV__": false,
		"process.env": {
			"NODE_ENV": JSON.stringify("production")
		}
	}),
	new webpack.optimize.UglifyJsPlugin({
		compressor: {
			screw_ie8: true,
			warnings: false
		}
	}),
	new ExtractTextPlugin("style.css", { allChunks: true })
);

module.exports = config;