const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/client/index.js',
	module: {
		rules: [
			{
				test: '/.js$/',
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				use: [ 'style-loader', 'css-loader', 'sass-loader' ]
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './src/client/views/index.html',
			filename: './index.html',
			title: 'Progressive Web Application'
		}),
		// new WorkboxPlugin.GenerateSW({
		// 	// these options encourage the ServiceWorkers to get in there fast
		// 	// and not allow any straggling "old" SWs to hang around
		// 	clientsClaim: true,
		// 	skipWaiting: true
		// }),
		new CleanWebpackPlugin({
			// Simulate the removal of files
			dry: true,
			// Write Logs to Console
			verbose: true,
			// Automatically remove all unused webpack assets on rebuild
			cleanStaleWebpackAssets: true,
			protectWebpackAssets: false
		})
	]
};
