/*
 * Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const fs = require('fs');

const licenseHeader = fs.readFileSync(
    path.resolve(__dirname, 'LICENSE-HEADER.txt'), 'utf8');

module.exports = {
    entry: './ui-components/index.js',
    output: {
        filename: 'react-ui-components.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'ReactUIComponents',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false, // Avoid extracting comments to a separate file
                terserOptions: {
                    format: {
                        preamble: licenseHeader,
                    },
                },
            }),
        ],
    },
    mode: 'production',
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    }
};
