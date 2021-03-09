const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'index.bundle.js'
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './public'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                  {
                    loader: 'html-loader',
                    options: {}
                  }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(scss|css|sass)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'assets/img',
            },
            { test: /\.(|woff|woff2|eot|ttf)$/, use: ['url-loader?limit=100000'] }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
    ],
}

