/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const production = true;
const basename = 'user-portal';
const homePagePath = '/home';

const distFolder = path.resolve(__dirname, 'build', basename);
const faviconImage = path.resolve(__dirname, 'node_modules', '@wso2is/theme/lib/assets/images/favicon.ico');
const titleText = 'WSO2 Identity Server';

module.exports = {
    entry: [
        './src/index.tsx',
    ],
    output: {
        path: distFolder,
        filename: '[name].js',
        publicPath: `/${basename}/`
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
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
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
        port: 9000,
        historyApiFallback: true
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new CopyWebpackPlugin([{
                context: path.resolve(__dirname, 'node_modules', '@wso2is', 'theme'),
                from: 'lib',
                to: 'libs/styles/css'
            },
            {
                context: path.resolve(__dirname, 'node_modules', '@wso2is', 'theme'),
                from: 'src',
                to: 'libs/styles/less/theme-module'
            },
            {
                context: path.resolve(__dirname, 'node_modules'),
                from: 'semantic-ui-less',
                to: 'libs/styles/less/semantic-ui-less'
            }
        ]),
        new HtmlWebpackPlugin({
            filename: path.join(distFolder, 'index.html'),
            template: path.resolve(__dirname, 'src', 'index.html'),
            hash: true,
            favicon: faviconImage,
            title: titleText
        }),
        new webpack.DefinePlugin({
            APP_BASENAME: JSON.stringify(basename),
            APP_PRODUCTION: JSON.stringify(production),
            APP_HOME_PATH: JSON.stringify(homePagePath),
            'typeof window': JSON.stringify('object'),
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
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
};
