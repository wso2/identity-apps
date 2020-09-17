/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.worker\.ts$/,
                use: {
                    loader: "worker-loader",
                    options: {
                        inline: true
                    }
                }
            },
            {
                exclude: /(node_modules|dist)/,
                test: /\.(ts|js)?$/,
                use: "babel-loader"
            },
            {
                exclude: /(node_modules|dist)/,
                test: /\.(ts?|js)$/,
                use: [
                    {
                        loader: "eslint-loader",
                        options: {
                            happyPackMode: true,
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    output: {
        filename: "main.js",
        globalObject: "this",
        library: "AsgardioAuth",
        libraryTarget: "umd",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};
