/* eslint strict: 0 */
const path = require("path");

const buildQS = function(props) {
	"use strict";
	let out = [];
	for (let prop in props) {
		out.push(props[prop].map((item) => `${prop}[]=${item}`).join(","));
	}
	return out.join(",");
}

const babelcmd = "babel?" + buildQS({
	presets: [
		"es2015",
		"stage-0"
	]
});

module.exports = {
	babelcmd: babelcmd,
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: [babelcmd],
			exclude: /node_modules/
		},{
			test: /\.eot|.otf|.woff|\.ttf/,
			loader: "file"
		},{
			test: /\.scss$/,
			loaders: [
				"style",
				"css",
				"sass?sourceMap"
			]
		}, {
			test: /\.css$/,
			loaders: [
				"style",
				"css"
			]
		}]
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: ["", ".js"],
		packageMains: ["webpack", "browser", "web", "browserify", ["jam", "main"], "main"]
	},
	plugins: [],
	externals: []
};