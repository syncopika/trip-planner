// https://webpack.js.org/guides/typescript/
// since I'm using vue-cli, I don't think I should be doing this but rather this:
// https://stackoverflow.com/questions/52768078/in-vue-cli-3-0-how-to-generate-complete-webpack-config-js
// but it looks a bit complicated so I will revisit it. I just want my .ts to .js for my iframe html!!!lol :<

//const path = require('path');

module.exports = {
	entry: './public/iframeSetup.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	output: {
		filename: 'bundle.js',
		path: __dirname + '/public',
	},
};