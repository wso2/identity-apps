const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const distFolder = path.resolve(__dirname, 'build');

module.exports = {
    entry: [
        './src/index.tsx',
    ],
    output: {
        path: distFolder,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|svg|cur|gif|eot|svg|ttf|woff|woff2)$/,
                use: ['url-loader'],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /(node_modules|diagram)/
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    },
    watchOptions: {
        ignored: [
            /node_modules([\\]+|\/)+(?!@wso2is)/,
            /build/
        ]
    },
    devServer: {
        contentBase: distFolder,
        inline: true,
        host: 'localhost',
        port: 9000,
        stats: 'errors-only'
    },
    plugins: [
        new CopyWebpackPlugin([
            { context: path.resolve(__dirname, 'node_modules', '@wso2is', 'theme'), from: 'lib', to: 'themes' }
        ]),
        new HtmlWebpackPlugin({
            filename: path.join(distFolder, 'index.html'),
            template: path.resolve(__dirname, 'src', 'index.html'),
            hash: true,
        }),
    ],
    devtool: 'source-map',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    keep_fnames: true,
                }
            })
        ]
    }
}