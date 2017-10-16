const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = ({webpackPublicPath}) => {
    return {
		output: {
			publicPath: webpackPublicPath,
            filename: '[name].js',
			chunkFilename: '[id].js'	
		},	
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/              
                }
            ]
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                chunks: ['vendor']
            }),
            new UglifyJSPlugin({
                sourceMap: true
            })
        ]
    }
}