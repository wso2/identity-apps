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

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    stories: [ "../stories/**/*.stories.(tsx|mdx)" ],
    addons: [
        "@storybook/addon-knobs",
        "@storybook/addon-actions",
        {
            name: "@storybook/addon-docs",
            options: {
                configureJSX: true,
                sourceLoaderOptions: {
                    parser: "typescript"
                },
            },
        }
    ],
    webpackFinal: async config => {
        // Prevent SVG from loading via `file-loader`.
        config.module.rules = config.module.rules.map(rule => {
            if (rule.test.toString().includes("svg")) {
                const test = rule.test.toString().replace("svg|", "").replace(/\//g, "");
                return { ...rule, test: new RegExp(test) };
            } else {
                return rule;
            }
        });
        config.module.rules.push(
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: require.resolve("awesome-typescript-loader"),
                    },
                    {
                        loader: require.resolve("react-docgen-typescript-loader"),
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "@svgr/webpack",
                        options: {
                            svgoConfig: {
                                plugins: [{prefixIds: false}]
                            }
                        }
                    },
                    {
                        loader: "url-loader"
                    }
                ]
            }
        );
        config.node = {
            fs: "empty"
        };
        config.resolve.extensions.push(".ts", ".tsx");
        config.resolve.plugins = config.resolve.plugins
            ? [ ...config.resolve.plugins, new TsconfigPathsPlugin({configFile: __dirname + "/../tsconfig.json"}) ]
            : [ new TsconfigPathsPlugin() ];
        return config;
    },
};
