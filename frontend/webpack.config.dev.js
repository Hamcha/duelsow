/* eslint strict: 0 */
const webpack = require("webpack");
const baseConfig = require("./webpack.config.common");

const config = Object.create(baseConfig);
config.debug = true;
config.devtool = "cheap-module-eval-source-map";

console.log("[Development config] Adding hot-reload entrypoints");
config.entry = [
	"webpack-dev-server/client?http://127.0.0.1:4000",
	"webpack/hot/only-dev-server",
	"./app/index"
];

config.output.publicPath = "http://localhost:4000/dist/";
config.module.loaders[0].loaders = ["react-hot", config.babelcmd];

console.log("[Development config] Adding plugins");
config.plugins.push(
	new webpack.NoErrorsPlugin(),
	new webpack.DefinePlugin({
		"__DEV__": true,
		"process.env": {
			"NODE_ENV": JSON.stringify("development")
		}
	})
);

module.exports = config;