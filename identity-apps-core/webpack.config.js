/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

const fs = require("fs");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const licenseHeader = fs.readFileSync(
    path.resolve(__dirname, "LICENSE-HEADER.txt"), "utf8");

module.exports = {
    entry: "./react-ui-core/src/index.js",
    externals: {
        react: "React",
        "react-dom": "ReactDOM"
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.(js|jsx)$/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/i,
                use: [ "style-loader", "css-loader" ]
            },
            {
                test: /\.svg$/,
                use: [ "@svgr/webpack" ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        preamble: licenseHeader
                    }
                }
            })
        ]
    },
    output: {
        filename: "react-ui-core.min.js",
        globalObject: "this",
        library: "ReactUICore",
        libraryTarget: "umd",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [ ".js", ".jsx" ]
    }
};
