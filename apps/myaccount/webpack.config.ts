/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import fs from "fs";
import path from "path";
import zlib, { BrotliOptions } from "zlib";
import nxReactWebpackConfig from "@nrwl/react/plugins/webpack.js";
import CompressionPlugin from "compression-webpack-plugin";
import history from "connect-history-api-fallback";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import JsonMinimizerPlugin from "json-minimizer-webpack-plugin";
import webpack, {
    Configuration,
    RuleSetRule,
    RuleSetUseItem,
    WebpackOptionsNormalized,
    WebpackPluginInstance
} from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import DeploymentConfig from "./src/public/deployment.config.json";

/**
 * Different Server Types.
 */
enum ServerTypes {
    TOMCAT = "tomcat",
    STATIC = "static"
}

/**
 * Interface for the NX Webpack context.
 */
interface NxWebpackContextInterface {
    buildOptions: {
        index: string;
        staticIndex: string;
        baseHref: string;
    };
    options: {
        index: string;
        staticIndex: string;
        baseHref: string;
        port: string;
    };
}

/**
 * Represents a set of absolute paths used in the application.
 */
interface AbsolutePathsInterface {
    /**
     * The absolute path to the 'node_modules' directory for the application.
     */
    appNodeModules: string;
    /**
     * The absolute path to the application source directory.
     */
    appSrc: string;
    /**
     * Path to `auth.html` in src.
     */
    authTemplateInSource: string;
    /**
     * The absolute path to the distribution directory for the application.
     */
    distribution: string;
    /**
     * An array of absolute paths to the entry point files for the application.
     */
    entryPoints: string[];
    /**
     * The absolute path to the cache directory used by the 'eslint' utility.
     */
    eslintCache: string;
    /**
     * The absolute path to the '.eslintrc' configuration file for the application.
     */
    eslintrc: string;
    /**
     * The absolute path to the home page template file in the distribution directory.
     */
    homeTemplateInDistribution: string;
    /**
     * The absolute path to the home page template file in the source directory.
     */
    homeTemplateInSource: string;
    /**
     * The absolute path to the index page template file in the distribution directory.
     */
    indexTemplateInDistribution: string;
    /**
     * The absolute path to the index page template file in the source directory.
     */
    indexTemplateInSource: string;
}

/**
 * Represents a set of relative paths used in the application.
 */
interface RelativePathsInterface {
    /**
     * The relative path to the distribution directory for the application.
     */
    distribution: string;
    /**
     * The relative path to the home page template file.
     */
    homeTemplate: string;
    /**
     * The relative path to the index page template file.
     */
    indexTemplate: string;
    /**
     * An array of relative paths to the Java EE folders used in the application.
     */
    javaEEFolders: string[];
    /**
     * The relative path to the application source directory.
     */
    source: string;
    /**
     * The relative path to the static JavaScript files used in the application.
     */
    staticJs: string;
    /**
     * The relative path to the static media files used in the application.
     */
    staticMedia: string;
}

module.exports = (config: WebpackOptionsNormalized, context: NxWebpackContextInterface) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nxReactWebpackConfig(config);

    context = rewriteContext(context);

    const ABSOLUTE_PATHS: AbsolutePathsInterface = getAbsolutePaths(config.mode, context);
    const RELATIVE_PATHS: RelativePathsInterface = getRelativePaths(config.mode, context);

    const isProduction: boolean = config.mode === "production";
    const baseHref: string = getBaseHref(
        context.buildOptions?.baseHref ?? context.options.baseHref,
        DeploymentConfig.appBaseName
    );

    // Flag to determine if the app is intended to be deployed on an external tomcat server
    // outside of the Identity Server runtime. If true, references & usage of internally provided
    // jars and libs inside the JSP's will be removed.
    const isDeployedOnExternalTomcatServer: boolean = process.env.SERVER_TYPE === ServerTypes.TOMCAT;
    // Flag to determine if the app is deployed on an external static server.
    // With this option, all the `jsp` files and java specific folders will be dropped.
    const isDeployedOnExternalStaticServer: boolean = process.env.SERVER_TYPE === ServerTypes.STATIC;
    // Flag to determine if the PRE_AUTH_CHECK option is enabled from the .env.local file.
    const isPreAuthCheckEnabled: boolean = process.env.PRE_AUTH_CHECK === "true";

    // Build Modes.
    const isProfilingMode: boolean = process.env.ENABLE_BUILD_PROFILER === "true";
    const isAnalyzeMode: boolean = process.env.ENABLE_ANALYZER === "true";
    const analyzerPort: number = parseInt(process.env.ANALYZER_PORT, 10) || 8888;

    // Dev Server Options.
    const devServerPort: number = process.env.DEV_SERVER_PORT || config.devServer?.port;
    const devServerHost: string = process.env.DEV_SERVER_HOST || config.devServer?.host;
    const isDevServerHostCheckDisabled: boolean = process.env.DISABLE_DEV_SERVER_HOST_CHECK === "true";
    const isESLintPluginDisabled: boolean = process.env.DISABLE_ESLINT_PLUGIN === "true";
    const devServerWebSocketHost: string = process.env.WDS_SOCKET_HOST;
    const devServerWebSocketPath: string = process.env.WDS_SOCKET_PATH;
    const devServerWebSocketPort: string = process.env.WDS_SOCKET_PORT;

    // Configurations resolved from deployment.config.json.
    const theme: string = DeploymentConfig.ui.theme.name || "default";

    config.entry = {
        ...config.entry,
        ...ABSOLUTE_PATHS.entryPoints
    } as WebpackOptionsNormalized["entry"];

    config.infrastructureLogging = {
        ...config.infrastructureLogging,
        // Log level is set to `none` by default to get rid of un-necessary logs from persistent cache etc.
        // This is set to `info` in profiling mode to get the desired result.
        level: process.env.LOG_LEVEL
            ? process.env.LOG_LEVEL
            : isProfilingMode
                ? "info"
                : "none"
    } as WebpackOptionsNormalized["infrastructureLogging"];

    // Remove `IndexHtmlWebpackPlugin` plugin added by NX and add `HtmlWebpackPlugin` instead.
    const indexHtmlWebpackPluginIndex: number = config.plugins.findIndex((plugin: webpack.WebpackPluginInstance) => {
        return plugin.constructor.name === "IndexHtmlWebpackPlugin";
    });

    if (indexHtmlWebpackPluginIndex !== -1) {
        config.plugins.splice(indexHtmlWebpackPluginIndex, 1);
    }

    if (isProduction && !isDeployedOnExternalStaticServer) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                authorizationCode: "<%=request.getParameter(\"code\")%>",
                contentType: "<%@ page language=\"java\" contentType=\"text/html; charset=UTF-8\" " +
                    "pageEncoding=\"UTF-8\" %>",
                // eslint-disable-next-line max-len
                cookieproDomainScriptId: "<% String cookiepro_domain_script_id = System.getenv(\"cookiepro_domain_script_id\"); %>",
                cookieproDomainScriptIdVar: "<%= cookiepro_domain_script_id %>",
                cookieproEnabledCheck: "<% if ((Boolean.TRUE.toString()).equals(is_cookiepro_enabled)) { %>",
                cookieproEnabledCheckEnd: "<% } %>",
                cookieproEnabledFlag: "<% String is_cookiepro_enabled = System.getenv(\"is_cookiepro_enabled\"); %>",
                // eslint-disable-next-line max-len
                cookieproInitialScriptTypeCheck: "<% String initialScriptType = (Boolean.TRUE.toString()).equals(is_cookiepro_enabled) ? \"text/plain\" : \"text/javascript\"; %>",
                cookieproInitialScriptTypeVar: "<%= initialScriptType %>",
                filename: ABSOLUTE_PATHS.homeTemplateInDistribution,
                getAdaptiveAuthenticationAvailability: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"static org.wso2.carbon.identity.application." +
                "authentication.framework.util.FrameworkUtils.isAdaptiveAuthenticationAvailable\"%>"
                    : "",
                getOrganizationManagementAvailability: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"static org.wso2.carbon.identity.application." +
                    "authentication.framework.util.FrameworkUtils.isOrganizationManagementEnabled\"%>"
                    : "",
                hash: true,
                importStringUtils: "<%@ page import=\"org.apache.commons.lang.StringUtils\" %>",
                importSuperTenantConstant: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                    "MultitenantConstants.SUPER_TENANT_DOMAIN_NAME\"%>"
                    : "",
                importTenantPrefix: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                    "MultitenantConstants.TENANT_AWARE_URL_PREFIX\"%>"
                    : "",
                importUtil: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"" +
                    "static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL\" %>"
                    : "",
                isAdaptiveAuthenticationAvailable: !isDeployedOnExternalTomcatServer
                    ? "<%= isAdaptiveAuthenticationAvailable() %>"
                    : "false",
                isOrganizationManagementEnabled: !isDeployedOnExternalTomcatServer
                    ? "<%= isOrganizationManagementEnabled() %>"
                    : "false",
                minify: false,
                publicPath: baseHref,
                serverUrl: !isDeployedOnExternalTomcatServer
                    ? "<%=getServerURL(\"\", true, true)%>"
                    : "",
                sessionState: "<%=request.getParameter(\"session_state\")%>",
                superTenantConstant: !isDeployedOnExternalTomcatServer
                    ? "<%=SUPER_TENANT_DOMAIN_NAME%>"
                    : "",
                template: path.join(__dirname, "src", "home.jsp"),
                tenantDelimiter: !isDeployedOnExternalTomcatServer
                    ? "\"/\"+'<%=TENANT_AWARE_URL_PREFIX%>'+\"/\""
                    : "",
                tenantPrefix: !isDeployedOnExternalTomcatServer
                    ? "<%=TENANT_AWARE_URL_PREFIX%>"
                    : "",
                theme: theme,
                themeHash: getThemeConfigs(theme).styleSheetHash
            }) as unknown as WebpackPluginInstance
        );

        config.plugins.push(
            new HtmlWebpackPlugin({
                authenticatedIdPs: "<%=request.getParameter(\"AuthenticatedIdPs\")%>",
                authorizationCode: "<%=Encode.forHtml(request.getParameter(\"code\"))%>",
                basename: DeploymentConfig.appBaseName,
                clientID: DeploymentConfig.clientID,
                contentType: "<%@ page language=\"java\" contentType=\"text/html; charset=UTF-8\" " +
                    "pageEncoding=\"UTF-8\" %>",
                filename: ABSOLUTE_PATHS.indexTemplateInDistribution,
                getAdaptiveAuthenticationAvailability: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"static org.wso2.carbon.identity.application." +
                "authentication.framework.util.FrameworkUtils.isAdaptiveAuthenticationAvailable\"%>"
                    : "",
                getOrganizationManagementAvailability: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"static org.wso2.carbon.identity.application." +
                    "authentication.framework.util.FrameworkUtils.isOrganizationManagementEnabled\"%>"
                    : "",
                hash: true,
                importOwaspEncode: "<%@ page import=\"org.owasp.encoder.Encode\" %>",
                importSuperTenantConstant: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                    "MultitenantConstants.SUPER_TENANT_DOMAIN_NAME\"%>"
                    : "",
                importTenantPrefix: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"static org.wso2.carbon.utils.multitenancy." +
                    "MultitenantConstants.TENANT_AWARE_URL_PREFIX\"%>"
                    : "",
                importUtil: !isDeployedOnExternalTomcatServer
                    ? "<%@ page import=\"" +
                    "static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL\" %>"
                    : "",
                inject: false,
                isAdaptiveAuthenticationAvailable: !isDeployedOnExternalTomcatServer
                    ? "<%= isAdaptiveAuthenticationAvailable() %>"
                    : "false",
                isOrganizationManagementEnabled: !isDeployedOnExternalTomcatServer
                    ? "<%= isOrganizationManagementEnabled() %>"
                    : "false",
                minify: false,
                publicPath: baseHref,
                requestForwardSnippet : "if(request.getParameter(\"code\") != null && "+
                    "!request.getParameter(\"code\").trim().isEmpty()) "+
                    "{request.getRequestDispatcher(\"/authenticate?code=\"+request.getParameter(\"code\")+"+
                    "\"&AuthenticatedIdPs=\"+request.getParameter(\"AuthenticatedIdPs\")"+
                    "+\"&session_state=\"+request.getParameter(\"session_state\")).forward(request, response);}",
                serverUrl: !isDeployedOnExternalTomcatServer
                    ? "<%=getServerURL(\"\", true, true)%>"
                    : "",
                sessionState: "<%=Encode.forHtml(request.getParameter(\"session_state\"))%>",
                superTenantConstant: !isDeployedOnExternalTomcatServer
                    ? "<%=SUPER_TENANT_DOMAIN_NAME%>"
                    : "",
                template: ABSOLUTE_PATHS.indexTemplateInSource,
                tenantDelimiter: !isDeployedOnExternalTomcatServer
                    ? "\"/\"+'<%=TENANT_AWARE_URL_PREFIX%>'+\"/\""
                    : "",
                tenantPrefix: !isDeployedOnExternalTomcatServer
                    ? "<%=TENANT_AWARE_URL_PREFIX%>"
                    : "",
                theme: theme,
                themeHash: getThemeConfigs(theme).styleSheetHash
            }) as unknown as WebpackPluginInstance
        );
    } else if (isPreAuthCheckEnabled) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                basename: DeploymentConfig.appBaseName,
                clientID: DeploymentConfig.clientID,
                filename: ABSOLUTE_PATHS.indexTemplateInDistribution,
                hash: true,
                inject: !isDeployedOnExternalStaticServer,
                minify: false,
                port: devServerPort,
                publicPath: (isDeployedOnExternalStaticServer && process.env.APP_BASE_PATH)
                    ? "/"+process.env.APP_BASE_PATH+"/"
                    : baseHref,
                template:
                    isDeployedOnExternalStaticServer
                        ? ABSOLUTE_PATHS.authTemplateInSource
                        : ABSOLUTE_PATHS.indexTemplateInSource,
                theme: theme,
                themeHash: getThemeConfigs(theme).styleSheetHash
            }) as unknown as WebpackPluginInstance
        );

        config.plugins.push(
            new HtmlWebpackPlugin({
                filename: ABSOLUTE_PATHS.homeTemplateInDistribution,
                hash: true,
                inject: isDeployedOnExternalStaticServer,
                minify: false,
                publicPath: baseHref,
                template: ABSOLUTE_PATHS.indexTemplateInSource,
                theme: theme,
                themeHash: getThemeConfigs(theme).styleSheetHash
            }) as unknown as WebpackPluginInstance
        );
    } else {
        config.plugins.push(
            new HtmlWebpackPlugin({
                filename: ABSOLUTE_PATHS.indexTemplateInDistribution,
                hash: true,
                minify: false,
                publicPath: baseHref,
                template: ABSOLUTE_PATHS.indexTemplateInSource,
                theme: theme,
                themeHash: getThemeConfigs(theme).styleSheetHash
            }) as unknown as WebpackPluginInstance
        );
    }

    isAnalyzeMode && config.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerHost: "localhost",
            analyzerPort: analyzerPort
        }) as unknown as WebpackPluginInstance
    );

    isProfilingMode && config.plugins.push(
        new webpack.ProgressPlugin({
            profile: true
        })
    );

    isProduction && config.plugins.push(
        new CompressionPlugin({
            algorithm: "gzip",
            filename: "[path][base].gz",
            minRatio: 0.8,
            test: /\.js$|\.css$|\.html$|\.png$|\.svg$|\.jpeg$|\.jpg$/,
            threshold: 10240
        }) as unknown as WebpackPluginInstance
    );

    isProduction && config.plugins.push(
        new CompressionPlugin({
            algorithm: "brotliCompress",
            compressionOptions: {
                params: {
                    [ zlib.constants.BROTLI_PARAM_QUALITY ]: 11
                }
            } as BrotliOptions,
            filename: "[path][base].br",
            minRatio: 0.8,
            test: /\.(js|css|html|png|svg|jpeg|jpg)$/,
            threshold: 10240
        }) as unknown as WebpackPluginInstance
    );

    !isESLintPluginDisabled && config.plugins.push(
        new ESLintPlugin({
            cache: true,
            cacheLocation: ABSOLUTE_PATHS.eslintCache,
            context: ABSOLUTE_PATHS.appSrc,
            eslintPath: require.resolve("eslint"),
            extensions: [ "js", "jsx", "ts", "tsx" ],
            lintDirtyModulesOnly: true,
            overrideConfigFile: ABSOLUTE_PATHS.eslintrc
        }) as unknown as WebpackPluginInstance
    );

    config.plugins.push(
        new webpack.ProvidePlugin({
            process: "process/browser"
        }) as unknown as WebpackPluginInstance
    );

    // Update the existing `DefinePlugin` plugin added by NX.
    const existingDefinePlugin: WebpackPluginInstance = config.plugins.find((plugin: WebpackPluginInstance) => {
        return plugin.constructor.name === "DefinePlugin";
    });

    if (config.plugins.indexOf(existingDefinePlugin) !== -1) {
        config.plugins.splice(config.plugins.indexOf(existingDefinePlugin), 1);

        config.plugins.push(
            new webpack.DefinePlugin({
                ...existingDefinePlugin["definitions"],
                "process.env": {
                    ...existingDefinePlugin["definitions"]["process.env"],
                    metaHash: JSON.stringify(getI18nConfigs().metaFileHash)
                },
                "typeof window": JSON.stringify("object")
            })
        );
    }

    // Update the existing `CopyPlugin` plugin added by NX.
    const existingCopyPlugin: webpack.WebpackPluginInstance = config.plugins.find(
        (plugin: WebpackPluginInstance) => {
            return plugin.constructor.name === "CopyPlugin";
        }
    );

    if (config.plugins.indexOf(existingCopyPlugin) !== -1) {
        config.plugins.splice(config.plugins.indexOf(existingCopyPlugin), 1);

        config.plugins.push(
            new CopyWebpackPlugin({
                ...existingCopyPlugin,
                patterns: [
                    ...existingCopyPlugin["patterns"]
                        .map((pattern: { from: string; context: string; globOptions: { ignore: string[] } }) => {
                            if (isDeployedOnExternalStaticServer) {
                                // For deployments on static servers, we don't require `auth.jsp`
                                // since we can't use `form_post` response mode.
                                if (pattern.from.match(/auth.jsp/)) {
                                    return false;
                                }
                                //
                                if (pattern.context.match(/public/)) {
                                    return {
                                        ...pattern,
                                        force: true,
                                        globOptions: {
                                            ...pattern.globOptions,
                                            ignore: [
                                                ...pattern.globOptions.ignore,
                                                // For deployments on static servers, we don't require the Java EE
                                                // specific folders like `WEB_INF` etc.
                                                ...RELATIVE_PATHS.javaEEFolders
                                            ]
                                        },
                                        info: {
                                            // No need to minify the `public` directory.
                                            minimized: true
                                        }
                                    };
                                }
                            }

                            // No need to minify the `public` directory.
                            if (pattern.context.match(/public/)) {
                                return {
                                    ...pattern,
                                    info: {
                                        minimized: true
                                    }
                                };
                            }

                            return pattern;
                        })
                        .filter(Boolean)
                ]
            })
        );
    }

    config.node = {
        ...config.node,
        // provides the global variable named "global"
        global: true
    };

    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.resolve.alias,
            // Can get rid of the relative paths when using the custom render function.
            // https://testing-library.com/docs/react-testing-library/setup/#configuring-jest-with-test-utils
            "@unit-testing": path.resolve(__dirname, "test-configs/utils"),
            react: path.resolve("node_modules/react"),
            /**
             * This is a workaround to resolve script getting removed issue when there are two Helmet instances.
             */
            "react-helmet": path.resolve("node_modules/react-helmet")
        },
        extensions: [
            ...config.resolve.extensions,
            ".json"
        ],
        // In webpack 5 automatic node.js polyfills are removed.
        // Node.js Polyfills should not be used in front end code.
        // https://github.com/webpack/webpack/issues/11282
        fallback: {
            ...config.resolve.fallback,
            buffer: false,
            crypto: false,
            fs: false,
            path: false,
            stream: false
        }
    };

    config.optimization.minimizer = [
        ...config.optimization.minimizer,
        new JsonMinimizerPlugin() as unknown as WebpackPluginInstance
    ];

    config.module.rules.unshift({
        test: /\.worker\.(ts|js)$/,
        use: {
            loader: "worker-loader",
            options: {
                inline: true
            }
        }
    });

    config.module.rules.push({
        exclude: /node_modules/,
        test: /.*(i18n).*\.*(portals).*\.json$/i,
        type: "asset/resource"
    });

    config.module.rules.push({
        test: /\.md$/,
        use: [ "raw-loader" ]
    });

    config.module.rules.forEach((rule: RuleSetRule) => {
        if (rule.type?.includes("asset") && rule.test instanceof RegExp && rule.test.toString().includes("png")) {
            rule.generator = {
                filename: isProduction
                    ? `${ RELATIVE_PATHS.staticMedia }/[hash][ext][query]`
                    : `${ RELATIVE_PATHS.staticMedia }/[path][name][ext]`
            };
        }

        if (rule.test.toString().includes("svg") && rule.test instanceof RegExp) {
            rule.oneOf.forEach((loader: RuleSetRule) => {
                loader.use instanceof Array && loader.use.forEach((item: RuleSetUseItem) => {
                    if (typeof item !== "string" && (item as any).loader.includes("url-loader")) {
                        (item as any).options.name = isProduction
                            ? `${ RELATIVE_PATHS.staticMedia }/[contenthash].[ext]`
                            : `${ RELATIVE_PATHS.staticMedia }/[path][name].[ext]`;
                    }
                });
            });
        }
    });

    config.output = {
        ...config.output,
        chunkFilename: isProduction
            ? `${ RELATIVE_PATHS.staticJs }/[name].[contenthash:8].chunk.js`
            : `${ RELATIVE_PATHS.staticJs }/[name].chunk.js`,
        filename: isProduction
            ? `${ RELATIVE_PATHS.staticJs }/[name].[contenthash:8].js`
            : `${ RELATIVE_PATHS.staticJs }/[name].js`,
        hotUpdateChunkFilename: "hot/[id].[fullhash].hot-update.js",
        hotUpdateMainFilename: "hot/[runtime].[fullhash].hot-update.json",
        path: (isPreAuthCheckEnabled && process.env.APP_BASE_PATH)
            ? `${config.output.path}/${process.env.APP_BASE_PATH}`
            : config.output.path,
        publicPath: baseHref
    };

    config.devServer = {
        ...config.devServer,
        // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
        // websites from potentially accessing local content through DNS rebinding:
        // https://github.com/webpack/webpack-dev-server/issues/887
        // This has resulted in issues such as development in cloud environment or subdomains impossible.
        allowedHosts: isDevServerHostCheckDisabled ? "all" : "auto",
        client: {
            overlay: false,
            webSocketURL: {
                // Enable custom sockjs hostname, pathname and port for websocket connection
                // to hot reloading server.
                hostname: devServerWebSocketHost,
                pathname: devServerWebSocketPath,
                port: devServerWebSocketPort
            }
        },
        devMiddleware: {
            ...config.devServer?.devMiddleware,
            publicPath: getStaticFileServePath(baseHref),
            writeToDisk: true
        },
        host: devServerHost,
        open: baseHref,
        port: devServerPort
    };

    if (isDeployedOnExternalStaticServer && isPreAuthCheckEnabled) {
        config.devServer = {
            ...config.devServer,
            onBeforeSetupMiddleware: (devServer: { app: { use: (arg0: any) => void; }; }) => {
                devServer.app.use(history({
                    rewrites: [
                        { from: /^\/$/, to: "/app" },
                        { from: /^\/app$/, to: "/app/index.html" },
                        { from: /^\/o\/.*$/, to: "/app/index.html" },
                        { from: /^\/t(\/.*)?$/, to: "/app/index.html" },
                        {
                            // eslint-disable-next-line max-len
                            from: /^\/app(\/.*(?<!\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|json|xml|txt)))?$/,
                            to: "/app/index.html"
                        }
                    ]
                }));
            }
        };
    } else {
        config.devServer = {
            ...config.devServer,
            // When running the apps on root context, we need to set this to `true` to route all
            // 404 to `index.html`. Setting to true doesn't seem to work when the apps are hosted
            // in a sub path and the default configuration works fine in that scenario.
            // https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
            historyApiFallback: baseHref !== "/"
                ? config.devServer?.historyApiFallback
                : true
        };
    }

    return config;
};

const getThemeConfigs = (theme: string) => {
    const THEME_DIR: string = path.resolve(
        __dirname,
        "node_modules",
        "@wso2is",
        "theme",
        "dist",
        "lib",
        "themes",
        theme
    );
    const files: string[] = fs.readdirSync(THEME_DIR);
    const file: string = files ? files.filter((file: string) => file.endsWith(".min.css"))[0] : null;

    return {
        styleSheetHash: file ? file.split(".")[ 1 ] : null
    };
};

const getI18nConfigs = () => {
    const I18N_DIR: string = path.resolve(__dirname, "node_modules", "@wso2is", "i18n", "dist", "bundle");

    let metaFiles: string[] = null;

    try {
        metaFiles = fs.readdirSync(I18N_DIR);
    } catch (e) {
        // Log Infastructure Error.
    }

    const metaFile: string = metaFiles ? metaFiles.filter((file: string) => file.startsWith("meta"))[ 0 ] : null;

    return {
        metaFileHash: metaFile ? metaFile.split(".")[ 1 ] : null
    };
};

const getRelativePaths = (env: Configuration["mode"], context: NxWebpackContextInterface): RelativePathsInterface => {
    // TODO: Remove supression once `isProduction` is actively used.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isProduction: boolean = env === "production";

    let homeTemplate: string = "home.jsp";

    if (process.env.PRE_AUTH_CHECK === "true" && process.env.SERVER_TYPE === ServerTypes.STATIC) {
        homeTemplate = "index.html";
    }

    return {
        distribution: path.join("build", "myaccount"),
        homeTemplate,
        indexTemplate: context.buildOptions?.index ?? context.options.index,
        javaEEFolders: [ "**/WEB-INF/**/*" ],
        source: "src",
        staticJs: path.join("static", "js"),
        staticMedia: path.join("static", "media")
    };
};

const getAbsolutePaths = (env: Configuration["mode"], context: NxWebpackContextInterface) => {
    const isProduction: boolean = env === "production";
    const RELATIVE_PATHS: RelativePathsInterface = getRelativePaths(env, context);

    let homeTemplateInDistribution: string = path.resolve(
        __dirname,
        RELATIVE_PATHS.distribution,
        RELATIVE_PATHS.homeTemplate
    );

    if (process.env.SERVER_TYPE === ServerTypes.STATIC) {
        homeTemplateInDistribution = path.resolve(
            __dirname,
            RELATIVE_PATHS.distribution,
            DeploymentConfig.appBaseName,
            RELATIVE_PATHS.indexTemplate
        );
    }

    return {
        appNodeModules: path.resolve(__dirname, "node_modules"),
        appSrc: path.resolve(__dirname, "src"),
        appTemplateInDistribution: path.resolve(
            __dirname,
            RELATIVE_PATHS.distribution,
            RELATIVE_PATHS.indexTemplate
        ),
        authTemplateInSource: path.resolve(
            __dirname,
            RELATIVE_PATHS.source,
            "auth.html"
        ),
        distribution: path.resolve(__dirname, RELATIVE_PATHS.distribution),
        entryPoints: [
            "@babel/polyfill",
            path.resolve(__dirname, "src", "init", "init.ts")
        ],
        eslintCache: path.resolve(__dirname, "node_modules", ".cache", ".eslintcache"),
        eslintrc: isProduction
            ? path.resolve(__dirname, ".prod.eslintrc.js")
            : path.resolve(__dirname, ".eslintrc.js"),
        homeTemplateInDistribution,
        homeTemplateInSource: path.resolve(__dirname, RELATIVE_PATHS.source, RELATIVE_PATHS.homeTemplate),
        indexTemplateInDistribution: path.resolve(
            __dirname,
            RELATIVE_PATHS.distribution,
            RELATIVE_PATHS.indexTemplate
        ),
        indexTemplateInSource: path.resolve(__dirname, RELATIVE_PATHS.source, RELATIVE_PATHS.indexTemplate)
    };
};

/**
 * Try to figure out if the `baseHref` is trying to be overridden by the `deployment.config.json`.
 * TODO: Add capability to override the webpack configuration instead.
 *
 * @param baseHrefFromProjectConf - `baseHref` defined in `project.json`. ex: `/console/`.
 * @param baseHrefFromDeploymentConf - `appBaseName` defined in `deployment.config.json`. ex: `console`.
 * @returns A resolved baseHref.
 */
const getBaseHref = (baseHrefFromProjectConf: string, baseHrefFromDeploymentConf: string): string => {
    // Try to check if they are the same value.
    // CONTEXT: `appBaseName` doesn't have leading or trailing slashes.
    if (baseHrefFromProjectConf.includes(baseHrefFromDeploymentConf)
        && baseHrefFromProjectConf.length > 2
        && baseHrefFromProjectConf.length - 2 === baseHrefFromDeploymentConf.length) {

        return baseHrefFromProjectConf;
    }

    return baseHrefFromDeploymentConf.replace(/^\/?([^/]+(?:\/[^/]+)*)\/?$/, "/$1/") || "/";
};

/**
 * Get the static file serve path.
 * ATM, when the context is re-written, dev server static file path is not getting overridden.
 *
 * @param baseHref - Resolved BaseHref.
 * @returns Static file serve path.
 */
const getStaticFileServePath = (baseHref: string): string => {
    if (baseHref.length === 1) {
        return baseHref;
    }

    return baseHref.replace(/\/$/, "");
};

/**
 * Re-write the Nx Webpack build context.
 *
 * @param context - Nx Webpack build context.
 * @returns Modified Nx Webpack build context.
 */
const rewriteContext = (context: NxWebpackContextInterface): NxWebpackContextInterface => {
    // For DEV environment.
    if (context.buildOptions?.baseHref) {
        context.buildOptions.baseHref = getBaseHref(context.buildOptions.baseHref, DeploymentConfig.appBaseName);
    }

    // For PROD environment.
    if (context.options?.baseHref) {
        context.options.baseHref = getBaseHref(context.options.baseHref, DeploymentConfig.appBaseName);
    }

    // Re-write the context for static server deployments.
    if (process.env.SERVER_TYPE === ServerTypes.STATIC) {
        if (context.buildOptions?.index) {
            context.buildOptions.index = context.buildOptions.staticIndex;
        }

        if (context.options?.index) {
            context.options.index = context.options.staticIndex;
        }
    }

    return context;
};
