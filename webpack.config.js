const fs = require("fs");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
const lessToJs = require("less-vars-to-js");

function getViews() {
	const views = [];
	const viewsPath = path.resolve(__dirname, "src/html/views");
	const files = fs.readdirSync(viewsPath);
	files.forEach(file => {
		views.push(
			new HtmlWebpackPlugin({
				title: file.replace(".html", ""),
				filename: file,
				template: path.resolve(viewsPath, file)
			})
		);
	});

	return views;
}

function getLessVariables() {
	const variablesPath = path.resolve(__dirname, "src/less/variables.less");
	const paletteLess = fs.readFileSync(variablesPath, "utf8");
	const palette = lessToJs(paletteLess, {
		resolveVariables: true,
		stripPrefix: true
	});

	return palette;
}

module.exports = {
	entry: {
		app: "./src/js/app.js"
	},
	output: {
		filename: "js/[name].[hash].js",
		path: path.resolve(__dirname, "dist")
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	stats: {
		children: false,
		version: false,
		timings: false,
		reasons: false,
		moduleTrace: false,
		builtAt: false,
		hash: false
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		open: true,
		port: 3000,
		clientLogLevel: "warning",
		stats: "errors-only"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "less-loader",
						options: {
							modifyVars: getLessVariables()
						}
					}
				]
			}
		]
	},
	plugins: [
		...getViews(),
		new CleanWebpackPlugin(["dist"]),
		new MiniCssExtractPlugin({
			filename: "css/[name].[hash].css"
		}),
		new WebpackBar({
			name: "sedona start"
		})
	]
};
