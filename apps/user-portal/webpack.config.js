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

module.exports = env => {
    const basename = 'user-portal';
    const devServerPort = 9000;

    /**
     * Runtime configurations
     */
    const loginPagePath = '/login';
    const homePagePath = '/overview';
    const serverHost = 'https://localhost:9443';
    const clientHost = (env.NODE_ENV === 'prod') ? serverHost : `https://localhost:${devServerPort}`;
    const externalLoginClientID = (env.NODE_ENV === 'prod') ? 'USER_PORTAL' : 'USER_PORTAL';
    const externalLoginCallbackURL = `${clientHost}/${basename}/login`;
    const externalLogoutCallbackURL = `${clientHost}/${basename}/logout`;

    /**
     * Build configurations
     */
    const distFolder = path.resolve(__dirname, 'build', basename);
    const faviconImage = path.resolve(__dirname, 'node_modules', '@wso2is/theme/lib/assets/images/favicon.ico');
    const titleText = 'WSO2 Identity Server';

    return {
        entry: ["./src/index.tsx"],
        output: {
            path: distFolder,
            filename: "[name].js",
            publicPath: `/${basename}/`
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".json"]
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.less$/,
                    use: ["style-loader", "css-loader", "less-loader"]
                },
                {
                    test: /\.(png|jpg|cur|gif|eot|ttf|woff|woff2)$/,
                    use: ["url-loader"]
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: "@svgr/webpack",
                            options: {
                                svgoConfig: {
                                    plugins: [{ prefixIds: false }]
                                }
                            }
                        },
                        {
                            loader: "url-loader"
                        }
                    ]
                },
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /(node_modules|diagram)/,
                    exclude: /\.test.tsx?$/
                },
                {
                    test: /\.ts$/,
                    enforce: "pre",
                    use: [
                        {
                            loader: "tslint-loader"
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    use: ["source-map-loader"],
                    enforce: "pre"
                }
            ]
        },
        watchOptions: {
            ignored: [/node_modules([\\]+|\/)+(?!@wso2is)/, /build/]
        },
        devServer: {
            https: true,
            contentBase: distFolder,
            inline: true,
            host: "localhost",
            port: devServerPort,
            historyApiFallback: true
        },
        node: {
            fs: "empty"
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    context: path.resolve(__dirname, "node_modules", "@wso2is", "theme"),
                    from: "lib",
                    to: "libs/styles/css"
                },
                // TODO: Removed temporally. Currently we don't use it in runtime
                // {
                //     context: path.resolve(__dirname, 'node_modules', '@wso2is', 'theme'),
                //     from: 'src',
                //     to: 'libs/styles/less/theme-module'
                // },
                // {
                //     context: path.resolve(__dirname, 'node_modules'),
                //     from: 'semantic-ui-less',
                //     to: 'libs/styles/less/semantic-ui-less'
                // },
                {
                    context: path.resolve(__dirname, "src"),
                    from: "public",
                    to: "."
                }
            ]),
            new HtmlWebpackPlugin({
                filename: path.join(distFolder, "index.html"),
                template: path.resolve(__dirname, "src", "index.html"),
                hash: true,
                favicon: faviconImage,
                title: titleText
            }),
            new webpack.DefinePlugin({
                APP_BASENAME: JSON.stringify(basename),
                APP_HOME_PATH: JSON.stringify(homePagePath),
                APP_LOGIN_PATH: JSON.stringify(loginPagePath),
                CLIENT_ID: JSON.stringify(externalLoginClientID),
                CLIENT_HOST: JSON.stringify(clientHost),
                LOGIN_CALLBACK_URL: JSON.stringify(externalLoginCallbackURL),
                LOGOUT_CALLBACK_URL: JSON.stringify(externalLogoutCallbackURL),
                SERVER_HOST: JSON.stringify(serverHost),
                "typeof window": JSON.stringify("object"),
                "process.env": {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                }
            })
        ],
        devtool: "source-map",
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        keep_fnames: true
                    }
                })
            ]
        }
    };
};
