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

const path = require("path");
const BrotliPlugin = require("brotli-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WriteFilePlugin = require("write-file-webpack-plugin");
const deploymentConfig = require("./src/public/deployment.config.json");

// Flag to enable source maps in production.
const isSourceMapsEnabledInProduction = false;

// Enable/Disable profiling in Production.
const isProfilingEnabledInProduction = false;

// ESLint Config File Names
const DEVELOPMENT_ESLINT_CONFIG = ".eslintrc.js";
const PRODUCTION_ESLINT_CONFIG = ".prod.eslintrc.js";

module.exports = (env) => {

    // Build Environments.
    const isProduction = env.NODE_ENV === "production";
    const isDevelopment = env.NODE_ENV === "development";

    // Flag to determine if the app is intended to be deployed on an external server.
    // If true, references & usage of internal JAVA classes and resources inside the index.jsp
    // will be removed. Since these resources are only available inside IS runtime, when hosted
    // externally, the server (tomcat etc.) will throw errors when trying to resolve them.
    const isDeployedOnExternalServer = env.IS_DEPLOYED_ON_EXTERNAL_SERVER;

    // Checks if analyzing mode enabled.
    const isAnalyzeMode = env.ENABLE_ANALYZER === "true";

    const basename = deploymentConfig.appBaseName;
    const devServerPort = 9000;
    const publicPath = `/${ basename }`;

    // Build configurations.
    const distFolder = path.resolve(__dirname, "build", basename);
    const titleText = deploymentConfig.ui.appTitle;

    // Paths to configs & other required files.
    const PATHS = {
        eslintrc: isProduction
            ? path.resolve(__dirname, PRODUCTION_ESLINT_CONFIG)
            : path.resolve(__dirname, DEVELOPMENT_ESLINT_CONFIG)
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
        devtool: isProduction
            ? isSourceMapsEnabledInProduction
                ? "source-map"
                : false
            : isDevelopment && "cheap-module-source-map",
        entry: {
            init: [ "@babel/polyfill","./src/init/init.ts"],
            main: "./src/index.tsx",
            rpIFrame: "./src/init/rpIFrame-script.ts"
        },
        mode: isProduction ? "production" : "development",
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    exclude: /node_modules/,
                    test: /\.css$/,
                    use: [ "postcss-loader" ]
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
                    exclude: {
                        not: [
                            /joi/,
                            /react-notification-system/,
                            /less-plugin-rewrite-variable/,
                            /@wso2is(\\|\/)forms/,
                            /@wso2is(\\|\/)react-components/,
                            /@wso2is(\\|\/)theme/,
                            /@wso2is(\\|\/)validation/ ],
                        test: [
                            /\.(spec|test).(ts|js)x?$/,
                            /node_modules(\\|\/)(core-js)/
                        ]
                    },
					test: /\.(ts|js)x?$/,
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
                            loader: "babel-loader"
                        }
                    ]
                },
                {
                    enforce: "pre",
                    test: /\.js$/,
                    use: ["source-map-loader"]
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
                                configFile: PATHS.eslintrc,
                                happyPackMode: true,
                                transpileOnly: true
                            }
                        }
                    ]
                }
            ],
            // Makes missing exports an error instead of warning.
            strictExportPresence: true
        },
        node: {
            fs: "empty"
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    cache: path.resolve(__dirname, "cache"),
                    extractComments: true,
                    sourceMap: isSourceMapsEnabledInProduction,
                    terserOptions: {
                        compress: {
                            // Disabled because of an issue with Uglify breaking seemingly valid code:
                            // https://github.com/mishoo/UglifyJS2/issues/2011
                            comparisons: false,
                            ecma: 5,
                            // Disabled because of an issue with Terser breaking valid code:
                            // https://github.com/terser-js/terser/issues/120
                            inline: 2,
                            warnings: false
                        },
                        // prevent the compressor from discarding class names.
                        keep_classnames: isProfilingEnabledInProduction,
                        // Prevent discarding or mangling of function names.
                        keep_fnames: isProfilingEnabledInProduction,
                        output: {
                            // Regex is not minified properly using default.
                            // https://github.com/mishoo/UglifyJS/issues/171
                            ascii_only: true,
                            comments: false,
                            ecma: 5
                        },
                        parse: {
                            ecma: 8
                        }
                    }
                })
            ].filter(Boolean),
            // Keep the runtime chunk separated to enable long term caching
            // https://twitter.com/wSokra/status/969679223278505985
            runtimeChunk: {
                name: entryPoint => `runtime-${entryPoint.name}`
            },
            splitChunks: {
                chunks: "all"
            }
        },
        output: {
            chunkFilename: isProduction
                ? "static/js/[name].[contenthash:8].chunk.js"
                : "static/js/[name].chunk.js",
            filename: isProduction
                ? "static/js/[name].[contenthash:8].js"
                : "static/js/[name].js",
            path: distFolder,
            publicPath: `${ publicPath }/`
        },
        plugins: [
            isAnalyzeMode && new BundleAnalyzerPlugin(),
            new ForkTsCheckerWebpackPlugin({
                async: isDevelopment,
                checkSyntacticErrors: true,
                eslint: true,
                measureCompilationTime: true,
                reportFiles: [
                    "**",
                    "!**/__tests__/**",
                    "!**/?(*.)(spec|test).*"
                ],
                silent: true,
                tsconfig: path.resolve(__dirname, "./tsconfig.json"),
                useTypescriptIncrementalApi: true,
                workers: 1
            }),
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
                    force: true,
                    from: "public",
                    to: "."
                },
                {
                    context: path.join(__dirname, "src"),
                    force: true,
                    from: "auth.jsp",
                    to: "."
                }
            ]),
            isProduction
                ? new HtmlWebpackPlugin({
                    authorizationCode: "<%=request.getParameter(\"code\")%>",
                    contentType: "<%@ page language=\"java\" contentType=\"text/html; charset=UTF-8\" " +
                        "pageEncoding=\"UTF-8\" %>",
                    excludeChunks: [ "rpIFrame" ],
                    filename: path.join(distFolder, "index.jsp"),
                    hash: true,
                    importSuperTenantConstant: !isDeployedOnExternalServer
                        ? "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                        "MultitenantConstants.SUPER_TENANT_DOMAIN_NAME\"%>"
                        : "",
                    importTenantPrefix: !isDeployedOnExternalServer
                        ? "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                        "MultitenantConstants.TENANT_AWARE_URL_PREFIX\"%>"
                        : "",
                    importUtil: !isDeployedOnExternalServer
                        ? "<%@ page import=\"" +
                        "static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL\" %>"
                        : "",
                    publicPath: publicPath,
                    serverUrl: !isDeployedOnExternalServer
                        ? "<%=getServerURL(\"\", true, true)%>"
                        : "",
                    sessionState: "<%=request.getParameter(\"session_state\")%>",
                    superTenantConstant: !isDeployedOnExternalServer
                        ? "<%=SUPER_TENANT_DOMAIN_NAME%>"
                        : "",
                    template: path.join(__dirname, "src", "index.jsp"),
                    tenantDelimiter: !isDeployedOnExternalServer
                        ? "\"/\"+'<%=TENANT_AWARE_URL_PREFIX%>'+\"/\""
                        : "",
                    tenantPrefix: !isDeployedOnExternalServer
                        ? "<%=TENANT_AWARE_URL_PREFIX%>"
                        : "",
                    title: titleText
                })
                : new HtmlWebpackPlugin({
                    excludeChunks: [ "rpIFrame" ],
                    filename: path.join(distFolder, "index.html"),
                    hash: true,
                    publicPath: publicPath,
                    template: path.join(__dirname, "src", "index.html"),
                    title: titleText
                }),
            new HtmlWebpackPlugin({
                excludeChunks: [ "main", "init" ],
                filename: path.join(distFolder, "rpIFrame.html"),
                hash: true,
                publicPath: publicPath,
                template: path.join(__dirname, "src", "rpIFrame.html")
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(env.NODE_ENV)
                },
                "typeof window": JSON.stringify("object")
            }),
            // Moment locales take up ~160KB. Since this portal currently doesn't require all the moment locales,
            // temporarily require only the ones for the languages supported by default.
            // TODO: Remove this when dynamic runtime localization support is announced.
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /pt|si|ta/),
            isProduction && new CompressionPlugin({
                algorithm: "gzip",
                filename: "[path].gz[query]",
                minRatio: 0.8,
                test: /\.(js|css|html|svg)$/,
                threshold: 10240
            }),
            isProduction && new BrotliPlugin({
                asset: "[path].br[query]",
                minRatio: 0.8,
                test: /\.(js|css|html|svg)$/,
                threshold: 10240
            })
        ].filter(Boolean),
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".json"]
        },
        watchOptions: {
            ignored: [/node_modules([\\]+|\/)+(?!@wso2is)/, /build/]
        }
    };
};
