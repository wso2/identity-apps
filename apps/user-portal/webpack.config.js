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

const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const deploymentConfig = require("./src/public/deployment.config.json");

module.exports = (env) => {
    const basename = deploymentConfig.appBaseName;
    const devServerPort = 9000;
    const publicPath = `/${basename}`;

    const isProd = env.NODE_ENV === "production";

    /**
     * Build configurations
     */
    const distFolder = path.resolve(__dirname, "build", basename);
    const faviconImage = path.resolve(__dirname, "node_modules",
        "@wso2is/theme/dist/lib/themes/default/assets/images/favicon.ico");
    const titleText = deploymentConfig.ui.appTitle;

    const compileAppIndex = () => {
        if (isProd) {
            return new HtmlWebpackPlugin({
                filename: path.join(distFolder, "index.jsp"),
                template: path.join(__dirname, "src", "index.jsp"),
                hash: true,
                favicon: faviconImage,
                title: titleText,
                publicPath: publicPath,
                contentType: "<%@ page language=\"java\" contentType=\"text/html; charset=UTF-8\" " +
                                "pageEncoding=\"UTF-8\" %>",
                importUtil: "<%@ page import=\"" + 
                                "static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL\" %>",
                importTenantPrefix: "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                    "MultitenantConstants.TENANT_AWARE_URL_PREFIX\"%>",
                importSuperTenantConstant: "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                    "MultitenantConstants.SUPER_TENANT_DOMAIN_NAME\"%>",
                serverUrl: "<%=getServerURL(\"\", true, true)%>",
                sessionState: "<%=request.getParameter(\"session_state\")%>",
                superTenantConstant: "<%=SUPER_TENANT_DOMAIN_NAME%>",
                tenantDelimiter: "\"/\"+'<%=TENANT_AWARE_URL_PREFIX%>'+\"/\"",
                tenantPrefix: "<%=TENANT_AWARE_URL_PREFIX%>",
                authorizationCode: "<%=request.getParameter(\"code\")%>"
            });
        }
        else {
            return new HtmlWebpackPlugin({
                filename: path.join(distFolder, "index.html"),
                template: path.join(__dirname, "src", "index.html"),
                hash: true,
                favicon: faviconImage,
                title: titleText,
                publicPath: publicPath
            });
        }
    };

    return {
        entry: ["./src/index.tsx"],
        output: {
            path: distFolder,
            filename: "[name].js",
            publicPath: `${publicPath}/`
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
                    exclude: /(node_modules)/,
                    test: /\.tsx?$/,
                    use: [
                        { loader: "cache-loader" },
                        {
                            loader: "thread-loader",
                            options: {
                                // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                                workers: 1
                            }
                        },
                        {
                            loader: "ts-loader",
                            options: {
                                happyPackMode: true,
                                transpileOnly: true
                            }
                        }
                    ]
                },
                {
                    enforce: "pre",
                    exclude: /(node_modules|dist|build|target|plugins)/,
                    test: /\.(ts|tsx|js|jsx)$/,
                    use: [
                        { loader: "cache-loader" },
                        {
                            loader: "thread-loader",
                            options: {
                                // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                                workers: 1
                            }
                        },
                        {
                            loader: "eslint-loader",
                            options: {
                                happyPackMode: true,
                                transpileOnly: true
                            }
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
            new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
            new WriteFilePlugin({
                // Exclude hot-update files
                test: /^(?!.*(hot-update)).*/
            }),
            new CopyWebpackPlugin([
                {
                    context: path.join(__dirname, "node_modules", "@wso2is", "theme", "dist"),
                    from: "lib",
                    to: "libs"
                },
                {
                    context: path.join(__dirname, "node_modules", "@wso2is", "i18n"),
                    from: path.join("dist", "bundle"),
                    to: path.join("resources", "i18n")
                },
                {
                    context: path.join(__dirname, "src"),
                    from: "public",
                    to: ".",
                    force: true
                }
            ]),
            compileAppIndex(),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(env.NODE_ENV)
                },
                "typeof window": JSON.stringify("object")
            })
        ],
        devtool: "eval",
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    cache: path.resolve(__dirname, "cache"),
                    extractComments: true,
                    terserOptions: {
                        keep_fnames: true
                    }
                })
            ].filter(Boolean),
            splitChunks: {
                chunks: "all"
            }
        }
    };
};
