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
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const WriteFilePlugin = require("write-file-webpack-plugin");
const deploymentConfig = require("./src/public/deployment.config.json");

module.exports = (env) => {
    const basename = deploymentConfig.appBaseName;
    const devServerPort = 9002;
    const publicPath = `/${ basename }`;

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
                authorizationCode: "<%=request.getParameter(\"code\")%>",
                contentType: "<%@ page language=\"java\" contentType=\"text/html; charset=UTF-8\" " +
                    "pageEncoding=\"UTF-8\" %>",
                favicon: faviconImage,
                filename: path.join(distFolder, "index.jsp"),
                hash: true,
                importSuperTenantConstant: "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                    "MultitenantConstants.SUPER_TENANT_DOMAIN_NAME\"%>",
                importTenantPrefix: "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                    "MultitenantConstants.TENANT_AWARE_URL_PREFIX\"%>",
                importUtil: "<%@ page import=\"" +
                    "static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL\" %>",
                publicPath: publicPath,
                serverUrl: "<%=getServerURL(\"\", true, true)%>",
                sessionState: "<%=request.getParameter(\"session_state\")%>",
                superTenantConstant: "<%=SUPER_TENANT_DOMAIN_NAME%>",
                template: path.join(__dirname, "src", "index.jsp"),
                tenantDelimiter: "\"/\"+'<%=TENANT_AWARE_URL_PREFIX%>'+\"/\"",
                tenantPrefix: "<%=TENANT_AWARE_URL_PREFIX%>",
                title: titleText
            });
        } else {
            return new HtmlWebpackPlugin({
                favicon: faviconImage,
                filename: path.join(distFolder, "index.html"),
                hash: true,
                publicPath: publicPath,
                template: path.join(__dirname, "src", "index.html"),
                title: titleText
            });
        }
    };

    return {
        devServer: {
            before: function (app) {
                app.get("/", function (req, res) {
                    res.redirect(publicPath);
                });
            },
            contentBase: distFolder,
            historyApiFallback: true,
            host: "localhost",
            https: true,
            inline: true,
            openPage: basename,
            port: devServerPort
        },
        devtool: "eval",
        entry: ["./src/index.tsx"],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
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
                    enforce: "pre",
                    test: /\.js$/,
                    use: ["source-map-loader"]
                }
            ]
        },
        node: {
            fs: "empty"
        },
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
        },
        output: {
            filename: "[name].js",
            path: distFolder,
            publicPath: `${ publicPath }/`
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
                    context: path.resolve(__dirname, "node_modules", "@wso2is", "theme"),
                    from: "src",
                    to: "themes-less"
                },
                {
                    context: path.join(__dirname, "node_modules", "@wso2is", "i18n"),
                    from: path.join("dist", "bundle"),
                    to: path.join("resources", "i18n")
                },
                {
                    context: path.join(__dirname, "src"),
                    force: true,
                    from: "public",
                    to: "."
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
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".json"]
        },
        watchOptions: {
            ignored: [/node_modules([\\]+|\/)+(?!@wso2is)/, /build/]
        }
    };
};
