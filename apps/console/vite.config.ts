/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import type { ServerResponse } from "http";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { Connect, type PluginOption, type ViteDevServer, defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolveBuildMode } from "./scripts/build/resolve-build-mode";

interface DeploymentConfigInterface {
    ui?: {
        theme?: {
            name?: string;
        };
    };
}

interface PreRenderedOutputInfoInterface {
    name?: string;
}

const isDeploymentConfig = (value: unknown): value is DeploymentConfigInterface => {
    return typeof value === "object" && value !== null;
};

const isPathWithinRoot = (root: string, resolvedPath: string): boolean => {
    const resolvedRoot: string = path.resolve(root);
    const relativePath: string = path.relative(resolvedRoot, resolvedPath);

    return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
};

const resolvePathWithinRoot = (root: string, rawRelativePath: string): string | undefined => {
    const normalizedRelativePath: string = path.normalize(rawRelativePath).replace(/^[\\/]+/, "");

    if (/^\.\.(?:[\\/]|$)/.test(normalizedRelativePath)) {
        return undefined;
    }

    const resolvedPath: string = path.resolve(root, normalizedRelativePath);

    return isPathWithinRoot(root, resolvedPath) ? resolvedPath : undefined;
};

/**
 * Resolve the i18n meta hash generated during prebuild.
 *
 * @returns Resolved meta hash.
 */
const resolveMetaHash = (): string => {
    // Pre-build writes `meta.<hash>.json`; at runtime this hash is used to
    // reference the generated i18n metadata file deterministically.
    const tempI18nDir: string = path.resolve(__dirname, "src", "extensions", "i18n", "tmp");

    if (!fs.existsSync(tempI18nDir)) {
        return "";
    }

    const metaFile: string | undefined = fs
        .readdirSync(tempI18nDir)
        .find((fileName: string) => fileName.startsWith("meta.") && fileName.endsWith(".json"));

    if (!metaFile) {
        return "";
    }

    const splitByDot: string[] = metaFile.split(".");

    return splitByDot.length >= 3 ? splitByDot[1] : "";
};

/**
 * Preserve CRA/Webpack SVG import compatibility in Vite by rewriting
 * named SVG component imports to Vite's `?react` style imports.
 *
 * @returns Vite transform plugin.
 */
const reactComponentSvgImportCompatPlugin = (): PluginOption => {
    const filePattern: RegExp = /\.[cm]?[jt]sx?$/;
    const importPattern: RegExp =
        /import\s*\{\s*ReactComponent\s+as\s+([A-Za-z_$][\w$]*)\s*\}\s*from\s*["']([^"']+\.svg)["'];?/g;

    return {
        name: "react-component-svg-import-compat",
        transform(code: string, id: string) {
            if (!filePattern.test(id) || !importPattern.test(code)) {
                return null;
            }

            importPattern.lastIndex = 0;

            const transformedCode: string = code.replace(
                importPattern,
                (_match: string, importName: string, importPath: string) =>
                    `import ${ importName } from "${ importPath }?react";`
            );

            return transformedCode === code ? null : transformedCode;
        }
    };
};

/**
 * Preserve legacy worker import style by rewriting
 * worker imports to Vite's `?worker` style imports.
 *
 * @returns Vite transform plugin.
 */
const workerImportCompatPlugin = (): PluginOption => {
    const filePattern: RegExp = /\.[cm]?[jt]sx?$/;
    const importPattern: RegExp =
        /import\s+([A-Za-z_$][\w$]*)\s+from\s+["']([^"']+\.worker(?:\.[cm]?[jt]s)?)["'];?/g;

    return {
        name: "worker-import-compat",
        transform(code: string, id: string) {
            if (!filePattern.test(id) || !importPattern.test(code)) {
                return null;
            }

            importPattern.lastIndex = 0;

            const transformedCode: string = code.replace(
                importPattern,
                (_match: string, importName: string, importPath: string) =>
                    `import ${ importName } from "${ importPath }?worker";`
            );

            return transformedCode === code ? null : transformedCode;
        }
    };
};

/**
 * Rewrite dev-server requests from configured base path to root so that
 * `https://localhost:9001/console/` is served correctly in development.
 *
 * @param basePath - Public base path.
 * @returns Vite dev-server plugin.
 */
const devServerBasePathRewritePlugin = (basePath: string): PluginOption => {
    const normalizedBasePath: string = basePath.endsWith("/") ? basePath : `${basePath}/`;
    const basePathWithoutTrailingSlash: string = normalizedBasePath.replace(/\/$/, "");
    const appSegment: string = basePathWithoutTrailingSlash.split("/").filter(Boolean).pop() || "";
    const escapedAppSegment: string = appSegment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match /console, /t/<tenant>/console, /o/<org>/console and combined variants.
    const tenantAwarePattern: RegExp = new RegExp(
        `^\\/(?:t\\/[^/]+\\/)?(?:o\\/[^/]+\\/)?${escapedAppSegment}(\\/.*)?$`
    );

    return {
        apply: "serve",
        configureServer(server: ViteDevServer) {
            if (normalizedBasePath === "/") {
                return;
            }

            server.middlewares.use((
                request: Connect.IncomingMessage,
                _response: ServerResponse,
                next: () => void
            ) => {
                const requestMessage: {
                    url?: string;
                } = request as { url?: string };
                const requestUrl: string | undefined = requestMessage.url;

                if (!requestUrl) {
                    next();

                    return;
                }

                const [ pathName, query = "" ] = requestUrl.split("?");
                const tenantAwareMatch: RegExpExecArray | null = tenantAwarePattern.exec(pathName);
                const isBaseRootRequest: boolean =
                    pathName === basePathWithoutTrailingSlash || pathName === normalizedBasePath;
                const isBasePathRequest: boolean = pathName.startsWith(normalizedBasePath);
                const shouldRewrite: boolean = isBaseRootRequest || isBasePathRequest || Boolean(tenantAwareMatch);

                if (!shouldRewrite) {
                    next();

                    return;
                }

                const rewrittenPathName: string = tenantAwareMatch
                    ? tenantAwareMatch[1] || "/"
                    : isBaseRootRequest
                        ? "/"
                        : pathName.substring(normalizedBasePath.length - 1) || "/";

                // Hand back to Vite as if app is mounted at root during dev.
                requestMessage.url = query.length > 0
                    ? `${rewrittenPathName}?${query}`
                    : rewrittenPathName;

                next();
            });
        },
        name: "dev-server-base-path-rewrite"
    };
};

/**
 * Serve a dev HTML shell for Console app routes in Vite dev server.
 * This mirrors the previous dev-server template behavior.
 *
 * @param basePath - Public base path.
 * @returns Vite dev-server plugin.
 */
const consoleDevHtmlPlugin = (basePath: string): PluginOption => {
    const normalizedBasePath: string = basePath.endsWith("/") ? basePath : `${basePath}/`;
    const basePathWithoutTrailingSlash: string = normalizedBasePath.replace(/\/$/, "");
    const appSegment: string = basePathWithoutTrailingSlash.split("/").filter(Boolean).pop() || "console";
    const deploymentConfigPath: string = path.resolve(__dirname, "src/public/deployment.config.json");
    let deploymentConfigUnknown: unknown = {};

    if (fs.existsSync(deploymentConfigPath)) {
        try {
            deploymentConfigUnknown = JSON.parse(fs.readFileSync(deploymentConfigPath, "utf8"));
        } catch (error: unknown) {
            // eslint-disable-next-line no-console
            console.warn(
                `Failed to parse deployment config at ${deploymentConfigPath}. Falling back to defaults.`,
                error
            );
        }
    }

    const deploymentConfig: DeploymentConfigInterface = isDeploymentConfig(deploymentConfigUnknown)
        ? deploymentConfigUnknown
        : {};
    const themeName: string = deploymentConfig?.ui?.theme?.name || "default";
    const themeDirectoryPath: string = path.resolve(__dirname, "../../modules/theme/dist/lib/themes", themeName);
    const themeStyleSheetFileName: string | undefined = fs.existsSync(themeDirectoryPath)
        ? fs.readdirSync(themeDirectoryPath)
            .find((fileName: string) => !fileName.includes(".rtl.") && fileName.endsWith(".min.css"))
        : undefined;
    const themeStyleSheetPath: string = themeStyleSheetFileName
        ? `${normalizedBasePath}libs/themes/${themeName}/${themeStyleSheetFileName}`
        : "";

    return {
        apply: "serve",
        configureServer(server: ViteDevServer) {
            const escapedAppSegment: string = appSegment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const tenantAwarePattern: RegExp = new RegExp(
                `^\\/(?:t\\/[^/]+\\/)?(?:o\\/[^/]+\\/)?${escapedAppSegment}(\\/.*)?$`
            );

            server.middlewares.use(async (
                request: Connect.IncomingMessage,
                response: ServerResponse,
                next: () => void
            ) => {
                const requestMessage: { method?: string; url?: string } = request as { method?: string; url?: string };
                const requestUrl: string | undefined = requestMessage.url;
                const method: string | undefined = requestMessage.method;

                if (!requestUrl || (method !== "GET" && method !== "HEAD")) {
                    next();

                    return;
                }

                const [ pathName ] = requestUrl.split("?");
                const isRootPathRequest: boolean = pathName === "/";
                const isFavIconRequest: boolean = pathName === "/favicon.ico";
                const isViteInternalRequest: boolean =
                    pathName.startsWith("/@vite/") ||
                    pathName.startsWith("/@id/") ||
                    pathName.startsWith("/@fs/") ||
                    pathName.startsWith("/node_modules/");
                const isBaseRoute: boolean =
                    pathName === basePathWithoutTrailingSlash || pathName === normalizedBasePath;
                const tenantAwareMatch: RegExpExecArray | null = tenantAwarePattern.exec(pathName);
                const tenantAwareSubPath: string = tenantAwareMatch?.[1] || "/";
                const isTenantAwareRoute: boolean = Boolean(tenantAwareMatch);
                // If the tenant-aware path already points to an asset, we should
                // not serve the HTML shell; let static middleware resolve it.
                const isTenantAwareAssetPath: boolean =
                    tenantAwareSubPath.startsWith("/libs/") ||
                    tenantAwareSubPath.startsWith("/resources/") ||
                    tenantAwareSubPath.startsWith("/extensions/") ||
                    tenantAwareSubPath.startsWith("/static/") ||
                    tenantAwareSubPath.startsWith("/node_modules/") ||
                    tenantAwareSubPath.startsWith("/@vite/") ||
                    tenantAwareSubPath.startsWith("/@id/") ||
                    tenantAwareSubPath.startsWith("/@fs/") ||
                    /\.[a-zA-Z0-9]+$/.test(tenantAwareSubPath);

                if (isRootPathRequest) {
                    response.statusCode = 302;
                    response.setHeader("Location", normalizedBasePath);
                    response.end();

                    return;
                }

                if (isFavIconRequest || isViteInternalRequest) {
                    next();

                    return;
                }

                if (!isBaseRoute && (!isTenantAwareRoute || isTenantAwareAssetPath)) {
                    next();

                    return;
                }

                const developmentHtml: string = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="referrer" content="no-referrer" />
    <script type="text/javascript" src="${normalizedBasePath}update.config.js"></script>
    <script type="text/javascript" src="${normalizedBasePath}config.js"></script>
    ${themeStyleSheetPath
        ? `<link href="${themeStyleSheetPath}" rel="stylesheet" type="text/css" />`
        : ""}
    <link rel="shortcut icon" href="${normalizedBasePath}libs/themes/${themeName}/assets/images/branding/favicon.ico" />
    <link rel="stylesheet" type="text/css" href="${normalizedBasePath}extensions/stylesheet.css" />
    <script src="${normalizedBasePath}startup-config.js"></script>
    <script>
      var contextPathGlobal = "${normalizedBasePath}";
      var serverOriginGlobal = startupConfig.serverUrlGlobal;
      var proxyContextPathGlobal = startupConfig.proxyContextPathGlobal;
      var isSuperTenantRequiredInUrl = startupConfig.isSuperTenantRequiredInUrl;
      var superTenantGlobal = startupConfig.superTenant;
      var tenantPrefixGlobal = startupConfig.tenantPrefix;
      var isAdaptiveAuthenticationAvailable = true;
      var isOrganizationManagementEnabled = true;
      if (window.top === window.self && sessionStorage.getItem("auth_callback_url_console") === null) {
        var authCallbackUrl = window.location.pathname + window.location.hash;
        sessionStorage.setItem("auth_callback_url_console", authCallbackUrl);
      }
    </script>
    <script id="head-script" defer type="text/javascript" data-public-path="${normalizedBasePath}"
      data-name="head-extensions" src="${normalizedBasePath}extensions/head-script.js" data-page-id="home"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/init/vite-entry.ts"></script>
  </body>
</html>`;

                const transformedHtml: string = await server.transformIndexHtml(requestUrl, developmentHtml);

                response.statusCode = 200;
                response.setHeader("Content-Type", "text/html");
                response.end(transformedHtml);
            });
        },
        name: "console-dev-html"
    };
};

/**
 * Serve i18n bundle files in dev mode from module build artifacts.
 *
 * @returns Vite dev-server plugin.
 */
const devI18nAssetsPlugin = (): PluginOption => {
    const i18nBundlePath: string = path.resolve(__dirname, "../../modules/i18n/dist/bundle");
    const i18nMetaPath: string = path.resolve(__dirname, "src/extensions/i18n/tmp");

    return {
        apply: "serve",
        configureServer(server: ViteDevServer) {
            server.middlewares.use((
                request: Connect.IncomingMessage,
                response: ServerResponse,
                next: () => void
            ) => {
                const requestMessage: { method?: string; url?: string } = request as { method?: string; url?: string };
                const requestUrl: string | undefined = requestMessage.url;
                const method: string | undefined = requestMessage.method;

                if (!requestUrl || (method !== "GET" && method !== "HEAD")) {
                    next();

                    return;
                }

                const [ pathName ] = requestUrl.split("?");

                if (!pathName.startsWith("/resources/i18n/")) {
                    next();

                    return;
                }

                const relativeFilePath: string = pathName.replace("/resources/i18n/", "");
                const resolvedBundlePath: string | undefined = resolvePathWithinRoot(i18nBundlePath, relativeFilePath);
                const resolvedMetaPath: string | undefined = resolvePathWithinRoot(i18nMetaPath, relativeFilePath);

                if (!resolvedBundlePath || !resolvedMetaPath) {
                    response.statusCode = 400;
                    response.end("Invalid asset path.");

                    return;
                }

                // Keep lookup order aligned with previous build pipeline:
                // 1) module bundle output, 2) app-local generated meta file.
                const candidatePaths: string[] = [
                    resolvedBundlePath,
                    resolvedMetaPath
                ];

                const existingPath: string | undefined = candidatePaths.find((candidatePath: string) => {
                    return fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile();
                });

                if (!existingPath) {
                    next();

                    return;
                }

                const content: Buffer = fs.readFileSync(existingPath);
                const isJson: boolean = existingPath.endsWith(".json");

                response.statusCode = 200;
                response.setHeader(
                    "Content-Type",
                    isJson ? "application/json; charset=utf-8" : "application/octet-stream"
                );
                response.end(content);
            });
        },
        name: "dev-i18n-assets"
    };
};

/**
 * Serve /libs assets in dev mode to mimic copied deployment assets.
 *
 * @returns Vite dev-server plugin.
 */
const devLibsAssetsPlugin = (): PluginOption => {
    const themeLibPath: string = path.resolve(__dirname, "../../modules/theme/dist/lib");
    const loginLayoutsPath: string = path.resolve(__dirname, "src/login-portal-layouts");

    return {
        apply: "serve",
        configureServer(server: ViteDevServer) {
            server.middlewares.use((
                request: Connect.IncomingMessage,
                response: ServerResponse,
                next: () => void
            ) => {
                const requestMessage: { method?: string; url?: string } = request as { method?: string; url?: string };
                const requestUrl: string | undefined = requestMessage.url;
                const method: string | undefined = requestMessage.method;

                if (!requestUrl || (method !== "GET" && method !== "HEAD")) {
                    next();

                    return;
                }

                const [ pathName ] = requestUrl.split("?");

                if (!pathName.includes("/libs/")) {
                    next();

                    return;
                }

                const relativeLibPath: string = pathName.substring(pathName.indexOf("/libs/") + "/libs/".length);
                const loginLayoutsRelativePath: string = relativeLibPath.replace(/^login-portal-layouts\//, "");
                const resolvedThemeLibPath: string | undefined = resolvePathWithinRoot(themeLibPath, relativeLibPath);
                const resolvedLoginLayoutsPath: string | undefined = resolvePathWithinRoot(
                    loginLayoutsPath,
                    loginLayoutsRelativePath
                );

                if (!resolvedThemeLibPath && !resolvedLoginLayoutsPath) {
                    response.statusCode = 400;
                    response.end("Invalid asset path.");

                    return;
                }

                // Resolve from copied theme dist first, then app login layouts.
                const candidatePaths: string[] = [
                    resolvedThemeLibPath,
                    resolvedLoginLayoutsPath
                ].filter((candidatePath: string | undefined): candidatePath is string => Boolean(candidatePath));

                const existingPath: string | undefined = candidatePaths.find((candidatePath: string) => {
                    return fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile();
                });

                if (!existingPath) {
                    next();

                    return;
                }

                const content: Buffer = fs.readFileSync(existingPath);
                const extension: string = path.extname(existingPath).toLowerCase();
                const contentTypeByExtension: Record<string, string> = {
                    ".css": "text/css; charset=utf-8",
                    ".ico": "image/x-icon",
                    ".jpeg": "image/jpeg",
                    ".jpg": "image/jpeg",
                    ".png": "image/png",
                    ".svg": "image/svg+xml",
                    ".woff": "font/woff",
                    ".woff2": "font/woff2"
                };

                response.statusCode = 200;
                response.setHeader(
                    "Content-Type",
                    contentTypeByExtension[extension] || "application/octet-stream"
                );
                response.end(content);
            });
        },
        name: "dev-libs-assets"
    };
};

export default defineConfig(({ mode }: { mode: string }) => {
    const environment: Record<string, string> = loadEnv(mode, __dirname, "");
    const buildMode: ReturnType<typeof resolveBuildMode> = resolveBuildMode(environment);
    const isDevelopment: boolean = mode !== "production";
    const publicBasePath: string = isDevelopment ? "/" : buildMode.publicBase;
    const metaHash: string = resolveMetaHash();
    const devServerPort: number = Number(environment.DEV_SERVER_PORT || 9001);
    const devServerHost: string = environment.DEV_SERVER_HOST || "localhost";
    const devServerWebSocketHost: string = environment.WDS_SOCKET_HOST || devServerHost;
    const devServerWebSocketPort: number = Number(environment.WDS_SOCKET_PORT || devServerPort);
    const devServerWebSocketPath: string = environment.WDS_SOCKET_PATH || "/";
    const nodeEnvironment: string = mode === "production" ? "production" : "development";
    const alias: Record<string, string> = {
        "@unit-testing": path.resolve(__dirname, "test-configs/utils")
    };

    // Dev-only alias avoids production bundle/export mismatches from dist output
    // while still giving local-source behavior during `vite serve`.
    if (isDevelopment) {
        alias["@wso2is/i18n"] = path.resolve(__dirname, "../../modules/i18n/src/index.ts");
    }

    return {
        base: publicBasePath,
        build: {
            commonjsOptions: {
                include: [
                    /node_modules/,
                    /modules[\\/].*[\\/]dist[\\/].*\.js$/
                ],
                transformMixedEsModules: true
            },
            copyPublicDir: false,
            emptyOutDir: true,
            manifest: true,
            outDir: buildMode.outDir,
            rollupOptions: {
                input: path.resolve(__dirname, "src", "init", "vite-entry.ts"),
                output: {
                    assetFileNames: (assetInfo: PreRenderedOutputInfoInterface) => {
                        const resolvedAssetName: string =
                            "name" in assetInfo && typeof assetInfo.name === "string"
                                ? assetInfo.name
                                : "";
                        const lowerCasedName: string = resolvedAssetName.toLowerCase();

                        if (lowerCasedName.endsWith(".css")) {
                            return "static/css/[name].[hash][extname]";
                        }

                        return "static/media/[name].[hash][extname]";
                    },
                    chunkFileNames: "static/js/[name].[hash].js",
                    entryFileNames: "static/js/[name].[hash].js"
                }
            },
            sourcemap: false
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // This silences the legacy JS API warning specifically
                    silenceDeprecations: [ "legacy-js-api" ]
                }
            }
        },
        define: {
            global: "globalThis",
            "process.env.NODE_ENV": JSON.stringify(nodeEnvironment),
            "process.env.metaHash": JSON.stringify(metaHash)
        },
        optimizeDeps: {
            esbuildOptions: {
                define: {
                    global: "globalThis"
                }
            }
        },
        plugins: [
            tsconfigPaths({
                projects: [ path.resolve(__dirname, "../../tsconfig.base.json") ]
            }),
            basicSsl(),
            consoleDevHtmlPlugin(buildMode.publicBase),
            devServerBasePathRewritePlugin(buildMode.publicBase),
            devI18nAssetsPlugin(),
            devLibsAssetsPlugin(),
            workerImportCompatPlugin(),
            reactComponentSvgImportCompatPlugin(),
            svgr({
                include: "**/*.svg?react"
            }),
            react()
        ],
        publicDir: path.resolve(__dirname, "src", "public"),
        resolve: {
            alias,
            dedupe: [ "react", "react-dom" ]
        },
        server: {
            hmr: {
                host: devServerWebSocketHost,
                path: devServerWebSocketPath,
                port: devServerWebSocketPort
            },
            host: devServerHost,
            https: true,
            open: buildMode.publicBase,
            port: devServerPort,
            strictPort: true
        },
        worker: {
            rollupOptions: {
                output: {
                    entryFileNames: "[hash].worker.js"
                }
            }
        }
    };
});
