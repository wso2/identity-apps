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

import fs from "fs";
import path from "path";
import zlib, { BrotliOptions } from "zlib";
import nxReactWebpackConfig from "@nrwl/react/plugins/webpack.js";
import CompressionPlugin from "compression-webpack-plugin";
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

interface NxWebpackContextInterface {
    buildOptions:{
        index: string;
        baseHref: string;
    };
    options: {
        index: string;
        baseHref: string;
        port: string;
    };
}

module.exports = (config: WebpackOptionsNormalized, context: NxWebpackContextInterface) => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nxReactWebpackConfig(config);

    const ABSOLUTE_PATHS = getAbsolutePaths(config.mode, context);
    const RELATIVE_PATHS = getRelativePaths(config.mode, context);

    const isProduction = config.mode === "production";

    // Flag to determine if the app is intended to be deployed on an external tomcat server
    // outside of the Identity Server runtime. If true, references & usage of internally provided
    // jars and libs inside the JSP's will be removed.
    const isDeployedOnExternalTomcatServer = process.env.SERVER_TYPE === "tomcat";
    // Flag to determine if the app is deployed on an external static server.
    // With this option, all the `jsp` files and java specific folders will be dropped.
    const isDeployedOnExternalStaticServer = process.env.SERVER_TYPE === "static";

    // Build Modes.
    const isProfilingMode = process.env.ENABLE_BUILD_PROFILER === "true";
    const isAnalyzeMode = process.env.ENABLE_ANALYZER === "true";
    const analyzerPort = parseInt(process.env.ANALYZER_PORT, 10) || 8889;

    // Dev Server Options.
    const devServerPort = process.env.DEV_SERVER_PORT || config.devServer?.port;
    const isDevServerHostCheckDisabled = process.env.DISABLE_DEV_SERVER_HOST_CHECK === "true";
    const isESLintPluginDisabled = process.env.DISABLE_ESLINT_PLUGIN === "true";

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
    const indexHtmlWebpackPluginIndex = config.plugins.findIndex((plugin) => {
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
                filename: ABSOLUTE_PATHS.homeTemplateInDistribution,
                hash: true,
                // eslint-disable-next-line max-len
                hotjarSystemVariable: "<% String hotjar_track_code_system_var = System.getenv().getOrDefault(\"hotjar_tracking_code\", null); %>",
                // eslint-disable-next-line max-len
                hotjarSystemVariableNullCheck: "<% String hotjar_track_code = StringUtils.isNotBlank(hotjar_track_code_system_var) ? hotjar_track_code_system_var : null; %>",
                hotjarTrackingCode: "<%= hotjar_track_code %>",
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
                minify: false,
                publicPath: context.buildOptions?.baseHref ?? context.options.baseHref,
                serverUrl: !isDeployedOnExternalTomcatServer
                    ? "<%=getServerURL(\"\", true, true)%>"
                    : "",
                sessionState: "<%=request.getParameter(\"session_state\")%>",
                superTenantConstant: !isDeployedOnExternalTomcatServer
                    ? "<%=SUPER_TENANT_DOMAIN_NAME%>"
                    : "",
                template: ABSOLUTE_PATHS.homeTemplateInSource,
                tenantDelimiter: !isDeployedOnExternalTomcatServer
                    ? "\"/\"+'<%=TENANT_AWARE_URL_PREFIX%>'+\"/\""
                    : "",
                tenantPrefix: !isDeployedOnExternalTomcatServer
                    ? "<%=TENANT_AWARE_URL_PREFIX%>"
                    : "",
                themeHash: getThemeConfigs().styleSheetHash,
                vwoScriptVariable: "<%= vwo_ac_id %>",
                // eslint-disable-next-line max-len
                vwoSystemVariable: "<% String vwo_ac_id = System.getenv().getOrDefault(\"vwo_account_id\", null); %>"
            }) as unknown as WebpackPluginInstance
        );

        config.plugins.push(
            new HtmlWebpackPlugin({
                authenticatedIdPs: "<%=request.getParameter(\"AuthenticatedIdPs\")%>",
                authorizationCode: "<%=request.getParameter(\"code\")%>",
                basename: DeploymentConfig.appBaseName,
                clientID: DeploymentConfig.clientID,
                contentType: "<%@ page language=\"java\" contentType=\"text/html; charset=ISO-8859-1\" " +
                    "pageEncoding=\"ISO-8859-1\"%>",
                filename: ABSOLUTE_PATHS.indexTemplateInDistribution,
                hash: true,
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
                minify: false,
                publicPath: context.buildOptions?.baseHref ?? context.options.baseHref,
                requestForwardSnippet : "if(request.getParameter(\"code\") != null && "+
                    "!request.getParameter(\"code\").trim().isEmpty()) "+
                    "{request.getRequestDispatcher(\"/authenticate?code=\"+request.getParameter(\"code\")+"+
                    "\"&AuthenticatedIdPs=\"+request.getParameter(\"AuthenticatedIdPs\")"+
                    "+\"&session_state=\"+request.getParameter(\"session_state\")).forward(request, response);}",
                serverUrl: !isDeployedOnExternalTomcatServer
                    ? "<%=getServerURL(\"\", true, true)%>"
                    : "",
                sessionState: "<%=request.getParameter(\"session_state\")%>",
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
                themeHash: getThemeConfigs().styleSheetHash
            }) as unknown as WebpackPluginInstance
        );
    } else {
        config.plugins.push(
            new HtmlWebpackPlugin({
                filename: ABSOLUTE_PATHS.indexTemplateInDistribution,
                hash: true,
                minify: false,
                publicPath: context.buildOptions?.baseHref ?? context.options.baseHref,
                template: ABSOLUTE_PATHS.indexTemplateInSource,
                themeHash: getThemeConfigs().styleSheetHash
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
    const existingDefinePlugin = config.plugins.find((plugin) => {
        return plugin.constructor.name === "DefinePlugin";
    });

    if (config.plugins.indexOf(existingDefinePlugin) !== -1) {
        config.plugins.splice(config.plugins.indexOf(existingDefinePlugin), 1);

        config.plugins.push(
            new webpack.DefinePlugin({
                ...existingDefinePlugin["definitions"],
                "process.env": {
                    ...existingDefinePlugin["definitions"]["process.env"],
                    NODE_ENV: JSON.stringify("development"),
                    metaHash: JSON.stringify(getI18nConfigs().metaFileHash)
                },
                "typeof window": JSON.stringify("object")
            })
        );
    }

    // Update the existing `DefinePlugin` plugin added by NX.
    const existingCopyPlugin = config.plugins.find((plugin) => {
        return plugin.constructor.name === "CopyPlugin";
    });

    if (config.plugins.indexOf(existingCopyPlugin) !== -1) {
        config.plugins.splice(config.plugins.indexOf(existingCopyPlugin), 1);

        config.plugins.push(
            new CopyWebpackPlugin({
                ...existingCopyPlugin,
                patterns: [
                    ...existingCopyPlugin[ "patterns" ]
                        .map((pattern) => {
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
                                        }
                                    };
                                }
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
            react: path.resolve("node_modules/react")
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

    config.module.rules.push( {
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
            rule.oneOf.forEach((loader) => {
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
        publicPath: context.buildOptions?.baseHref ?? context.options.baseHref
    };

    config.devServer = {
        ...config.devServer,
        // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
        // websites from potentially accessing local content through DNS rebinding:
        // https://github.com/webpack/webpack-dev-server/issues/887
        // This has resulted in issues such as development in cloud environment or subdomains impossible.
        allowedHosts: isDevServerHostCheckDisabled ? "all" : "auto",
        devMiddleware: {
            ...config.devServer?.devMiddleware,
            writeToDisk: true
        },
        open: context.buildOptions?.baseHref ?? context.options.baseHref,
        port: devServerPort
    };

    return config;
};

const getThemeConfigs = () => {
    const THEME_TO_USE = DeploymentConfig.ui.theme.name || "default";
    const THEME_DIR = path.resolve(__dirname,
        "node_modules", "@wso2is", "theme", "dist", "lib", "themes",THEME_TO_USE);
    const files = fs.readdirSync(THEME_DIR);
    const file = files ? files.filter(file => file.endsWith(".min.css"))[ 0 ] : null;

    return {
        styleSheetHash: file ? file.split(".")[ 1 ] : null
    };
};

const getI18nConfigs = () => {
    const I18N_DIR = path.resolve(__dirname, "node_modules", "@wso2is", "i18n", "dist", "bundle");
    const metaFiles = fs.readdirSync(I18N_DIR);
    const metaFile = metaFiles ? metaFiles.filter(file => file.startsWith("meta"))[ 0 ] : null;

    return {
        metaFileHash: metaFile ? metaFile.split(".")[ 1 ] : null
    };
};

const getRelativePaths = (env: Configuration["mode"], context: NxWebpackContextInterface) => {

    // TODO: Remove supression once `isProduction` is actively used.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isProduction: boolean = env === "production";

    return {
        distribution: path.join("build", "console"),
        homeTemplate: "home.jsp",
        indexTemplate: context.buildOptions?.index ?? context.options.index,
        javaEEFolders: [ "**/WEB-INF/**/*" ],
        source: "src",
        staticJs: path.join("static", "js"),
        staticMedia: path.join("static", "media")
    };
};

const getAbsolutePaths = (env: Configuration["mode"], context: NxWebpackContextInterface) => {

    const isProduction: boolean = env === "production";
    const RELATIVE_PATHS = getRelativePaths(env, context);

    return {
        appNodeModules: path.resolve(__dirname, "node_modules"),
        appSrc: path.resolve(__dirname, "src"),
        distribution: path.resolve(__dirname, RELATIVE_PATHS.distribution),
        entryPoints: [
            "@babel/polyfill",
            path.resolve(__dirname, "src", "init", "init.ts")
        ],
        eslintCache: path.resolve(__dirname, "node_modules", ".cache", ".eslintcache"),
        eslintrc: isProduction
            ? path.resolve(__dirname, ".prod.eslintrc.js")
            : path.resolve(__dirname, ".eslintrc.js"),
        homeTemplateInDistribution: path.resolve(__dirname, RELATIVE_PATHS.distribution, RELATIVE_PATHS.homeTemplate),
        homeTemplateInSource: path.resolve(__dirname, RELATIVE_PATHS.source, RELATIVE_PATHS.homeTemplate),
        indexTemplateInDistribution: path.resolve(__dirname, RELATIVE_PATHS.distribution, RELATIVE_PATHS.indexTemplate),
        indexTemplateInSource: path.resolve(__dirname, RELATIVE_PATHS.source, RELATIVE_PATHS.indexTemplate)
    };
};
