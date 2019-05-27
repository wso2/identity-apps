const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const distFolder = path.resolve(__dirname, 'build');
const faviconImage = path.resolve(__dirname, 'node_modules', '@wso2is/theme/lib/assets/images/favicon.ico');
const titleText = 'WSO2 Identity Server';

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
                test: /\.ts$/,
                enforce: 'pre',
                use: [{
                    loader: 'tslint-loader'
                }]
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
        port: 9000
    },
    plugins: [
        new CopyWebpackPlugin([
            { context: path.resolve(__dirname, 'node_modules', '@wso2is', 'theme'), from: 'lib', to: 'themes' }
        ]),
        new HtmlWebpackPlugin({
            filename: path.join(distFolder, 'index.html'),
            template: path.resolve(__dirname, 'src', 'index.html'),
            hash: true,
            favicon: faviconImage,
            title: titleText
        })
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
