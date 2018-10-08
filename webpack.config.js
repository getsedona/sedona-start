const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: {
		app: './src/js/app.js'
	},
	output: {
		filename: './js/[name].js'
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'less-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: './css/main.[hash].css'
		})
	]
}
