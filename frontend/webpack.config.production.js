/* eslint strict: 0 */
const webpack = require("webpack");
const config = require("./webpack.config.common")(false);
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
	})
);

module.exports = config;