/* eslint strict: 0 */
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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

module.exports = function(liveCSS) {
	var plugins = [];
	var cssloader = {
		test: /\.css$/
	};
	var scssloader = {
		test: /\.scss$/
	};

	if (liveCSS) {
		cssloader.loaders = ["style", "css"];
		scssloader.loaders = ["style", "css", "sass?sourceMap"];
	} else {
		cssloader.loader = ExtractTextPlugin.extract("css");
		scssloader.loader = ExtractTextPlugin.extract(["css", "sass?sourceMap"]);
		plugins.push(new ExtractTextPlugin("style.css"));
	}

	return {
		babelcmd: babelcmd,
		module: {
			loaders: [{
				test: /\.js$/,
				loaders: [babelcmd],
				exclude: /node_modules/
			},{
				test: /\.eot|.otf|.woff|\.ttf/,
				loader: "file"
			},
			cssloader,
			scssloader]
		},
		output: {
			path: path.join(__dirname, "dist"),
			filename: "bundle.js"
		},
		resolve: {
			extensions: ["", ".js"],
			packageMains: ["webpack", "browser", "web", "browserify", ["jam", "main"], "main"]
		},
		plugins: plugins,
		externals: []
	};
};