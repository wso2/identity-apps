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

"use strict";

const fs = require("fs-extra");
const path = require("path");
const zlib = require("zlib");
const dotenv = require("dotenv");
const { resolveBuildMode } = require("./resolve-build-mode");

dotenv.config({
    path: path.resolve(__dirname, "..", "..", ".env.local")
});

const workspaceRoot = path.resolve(__dirname, "..", "..", "..", "..");
const appRoot = path.resolve(__dirname, "..", "..");
const deploymentConfigPath = path.resolve(appRoot, "src", "public", "deployment.config.json");
const deploymentConfig = fs.readJsonSync(deploymentConfigPath);
const themeName = deploymentConfig?.ui?.theme?.name || "default";
const buildMode = resolveBuildMode(process.env);

const buildRoot = path.resolve(appRoot, "build", "console");
const appBuildRoot = path.resolve(buildRoot, buildMode.isStatic && buildMode.isPreAuthCheckEnabled
    ? buildMode.appBasePath
    : "");
const manifestPath = path.resolve(appBuildRoot, ".vite", "manifest.json");

/**
 * Resolve the theme hash from @wso2is/theme.
 *
 * @param {string} theme - Theme name.
 * @returns {string}
 */
function resolveThemeHash(theme) {
    const themeDir = path.resolve(
        workspaceRoot,
        "modules",
        "theme",
        "dist",
        "lib",
        "themes",
        theme
    );

    if (!fs.existsSync(themeDir)) {
        return "";
    }

    const themeFiles = fs.readdirSync(themeDir);
    const preferredFile = themeFiles.find((file) => !file.includes(".rtl.") && file.endsWith(".min.css"));

    if (!preferredFile) {
        return "";
    }

    const splitByDot = preferredFile.split(".");

    return splitByDot.length >= 3 ? splitByDot[1] : "";
}

/**
 * Render template placeholders in source JSP/HTML shells.
 *
 * @param {string} content - Template content.
 * @param {Record<string, string>} options - Replace options.
 * @returns {string}
 */
function renderTemplate(content, options) {
    const parseExpression = (expression) => {
        const trimmedExpression = expression.trim();

        if (!trimmedExpression.includes("buildOptions.")) {
            return {
                handled: false,
                value: ""
            };
        }

        // Reject anything outside the small supported expression surface.
        if (!/^[\s\w.$'":+?()!\/-]*$/.test(trimmedExpression)) {
            throw new Error(`Unsupported template expression: ${trimmedExpression}`);
        }

        const unwrapParentheses = (value) => {
            let current = value.trim();

            while (current.startsWith("(") && current.endsWith(")")) {
                let depth = 0;
                let canUnwrap = true;

                for (let index = 0; index < current.length; index++) {
                    const char = current[index];

                    if (char === "(") {
                        depth++;
                    } else if (char === ")") {
                        depth--;
                    }

                    if (depth === 0 && index < current.length - 1) {
                        canUnwrap = false;
                        break;
                    }
                }

                if (!canUnwrap || depth !== 0) {
                    break;
                }

                current = current.slice(1, -1).trim();
            }

            return current;
        };

        const findTopLevelOperator = (value, operator) => {
            let depth = 0;
            let quote = "";

            for (let index = 0; index < value.length; index++) {
                const char = value[index];

                if (quote) {
                    if (char === quote && value[index - 1] !== "\\") {
                        quote = "";
                    }

                    continue;
                }

                if (char === '"' || char === "'") {
                    quote = char;

                    continue;
                }

                if (char === "(") {
                    depth++;

                    continue;
                }

                if (char === ")") {
                    depth--;

                    continue;
                }

                if (depth === 0 && char === operator) {
                    return index;
                }
            }

            return -1;
        };

        const splitTopLevel = (value, operator) => {
            const parts = [];
            let depth = 0;
            let quote = "";
            let start = 0;

            for (let index = 0; index < value.length; index++) {
                const char = value[index];

                if (quote) {
                    if (char === quote && value[index - 1] !== "\\") {
                        quote = "";
                    }

                    continue;
                }

                if (char === '"' || char === "'") {
                    quote = char;

                    continue;
                }

                if (char === "(") {
                    depth++;

                    continue;
                }

                if (char === ")") {
                    depth--;

                    continue;
                }

                if (depth === 0 && char === operator) {
                    parts.push(value.slice(start, index));
                    start = index + 1;
                }
            }

            parts.push(value.slice(start));

            return parts;
        };

        const evaluateToken = (token) => {
            const normalizedToken = unwrapParentheses(token.trim());

            if (normalizedToken.length === 0) {
                return "";
            }

            if ((normalizedToken.startsWith('"') && normalizedToken.endsWith('"')) ||
                (normalizedToken.startsWith("'") && normalizedToken.endsWith("'"))) {
                return normalizedToken.slice(1, -1);
            }

            if (normalizedToken.startsWith("buildOptions.")) {
                const optionKey = normalizedToken.slice("buildOptions.".length);

                if (!/^[a-zA-Z0-9_]+$/.test(optionKey)) {
                    throw new Error(`Unsupported buildOptions key access: ${normalizedToken}`);
                }

                return options[optionKey];
            }

            if (normalizedToken === "true") {
                return true;
            }

            if (normalizedToken === "false") {
                return false;
            }

            if (normalizedToken === "null") {
                return null;
            }

            if (normalizedToken.startsWith("!")) {
                return !Boolean(evaluateExpression(normalizedToken.slice(1)));
            }

            throw new Error(`Unsupported token in template expression: ${normalizedToken}`);
        };

        const evaluateExpression = (value) => {
            const normalizedValue = unwrapParentheses(value.trim());

            const ternaryQuestionIndex = findTopLevelOperator(normalizedValue, "?");

            if (ternaryQuestionIndex !== -1) {
                const ternaryCondition = normalizedValue.slice(0, ternaryQuestionIndex);
                const ternaryRemainder = normalizedValue.slice(ternaryQuestionIndex + 1);
                const ternaryColonIndex = findTopLevelOperator(ternaryRemainder, ":");

                if (ternaryColonIndex === -1) {
                    throw new Error(`Invalid ternary expression: ${normalizedValue}`);
                }

                const truthyBranch = ternaryRemainder.slice(0, ternaryColonIndex);
                const falsyBranch = ternaryRemainder.slice(ternaryColonIndex + 1);

                return Boolean(evaluateExpression(ternaryCondition))
                    ? evaluateExpression(truthyBranch)
                    : evaluateExpression(falsyBranch);
            }

            const plusSegments = splitTopLevel(normalizedValue, "+");

            if (plusSegments.length > 1) {
                return plusSegments
                    .map((segment) => evaluateExpression(segment))
                    .map((segment) => segment === undefined || segment === null ? "" : String(segment))
                    .join("");
            }

            return evaluateToken(normalizedValue);
        };

        return {
            handled: true,
            value: evaluateExpression(trimmedExpression)
        };
    };

    return content.replace(/<%=\s*([\s\S]*?)\s*%>/g, (match, expression) => {
        if (!expression.includes("buildOptions.")) {
            return match;
        }

        try {
            const parsedExpression = parseExpression(expression);

            if (!parsedExpression.handled) {
                return match;
            }

            const value = parsedExpression.value;

            if (value === undefined || value === null) {
                return "";
            }

            return String(value);
        } catch (_error) {
            // Fallback for simple key access if expression evaluation fails.
            const optionKeyMatch = expression.match(/^buildOptions\.([a-zA-Z0-9_]+)$/);

            if (optionKeyMatch && Object.prototype.hasOwnProperty.call(options, optionKeyMatch[1])) {
                return options[optionKeyMatch[1]];
            }

            return "";
        }
    });
}

/**
 * Collect entry assets from Vite manifest.
 *
 * @param {Record<string, any>} manifest - Vite manifest object.
 * @param {string} entryKey - Entry key.
 * @returns {{ css: string[], js: string[] }}
 */
function collectEntryAssets(manifest, entryKey) {
    const css = [];
    const js = [];
    const visited = new Set();

    function visit(key) {
        if (!key || visited.has(key) || !manifest[key]) {
            return;
        }

        visited.add(key);

        const chunk = manifest[key];
        const imports = chunk.imports || [];

        // Depth-first walk ensures imported chunks are processed before entry.
        // This preserves deterministic CSS/JS injection order in generated shells.
        imports.forEach((importKey) => visit(importKey));

        if (Array.isArray(chunk.css)) {
            chunk.css.forEach((file) => {
                if (!css.includes(file)) {
                    css.push(file);
                }
            });
        }

        if (chunk.file && !js.includes(chunk.file)) {
            js.push(chunk.file);
        }
    }

    visit(entryKey);

    return { css, js };
}

/**
 * Build script/link tags for an entry.
 *
 * @param {Record<string, any>} manifest - Vite manifest.
 * @param {string} entryKey - Entry key.
 * @param {string} publicBase - Base path.
 * @returns {string}
 */
function buildEntryTags(manifest, entryKey, publicBase) {
    const assets = collectEntryAssets(manifest, entryKey);
    const normalizedBase = publicBase.endsWith("/") ? publicBase : `${publicBase}/`;
    const linkTags = assets.css.map((file) => {
        return `<link rel="stylesheet" href="${normalizedBase}${file}" />`;
    });
    const scriptTags = assets.js.map((file) => {
        // Built assets are ESM; Tomcat/JSP shells must load them as modules.
        return `<script type="module" src="${normalizedBase}${file}"></script>`;
    });

    return [ ...linkTags, ...scriptTags ].join("\n");
}

/**
 * Copy theme assets to destination.
 */
function copyThemeAssets() {
    const source = path.resolve(workspaceRoot, "modules", "theme", "dist", "lib");
    const destination = path.resolve(appBuildRoot, "libs");

    fs.copySync(source, destination, {
        filter: (sourcePath) => {
            const relativeSourcePath = path.relative(source, sourcePath).replace(/\\/g, "/");

            if (relativeSourcePath === "") {
                return true;
            }

            const isJavaScript = relativeSourcePath.endsWith(".js");
            const isLess = relativeSourcePath.endsWith(".less");

            if (isJavaScript || isLess) {
                return false;
            }

            const imagesPathMarker = "/assets/images/";
            const isImagesPath = relativeSourcePath.includes(imagesPathMarker);

            if (!isImagesPath) {
                return true;
            }

            const pathAfterImages = relativeSourcePath.split(imagesPathMarker)[1] || "";
            const imagePathParts = pathAfterImages.split("/");
            const firstSegment = imagePathParts[0] || "";
            const hasSubDirectory = imagePathParts.length > 1;

            // Preserve previous build glob behavior:
            // ignore: "**/assets/images/!(branding|identity-providers|flags.png)/**"
            // Direct files under assets/images are included.
            if (!hasSubDirectory) {
                return true;
            }

            return (
                firstSegment === "branding" ||
                firstSegment === "identity-providers" ||
                firstSegment === "flags.png"
            );
        },
        overwrite: true
    });
}

/**
 * Recursively list files under the provided directory.
 *
 * @param {string} directoryPath - Directory to walk.
 * @returns {string[]} File paths.
 */
function listFiles(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        return [];
    }

    const files = [];
    const pathsToVisit = [ directoryPath ];

    while (pathsToVisit.length > 0) {
        const currentPath = pathsToVisit.pop();
        const stat = fs.statSync(currentPath);

        if (stat.isDirectory()) {
            const children = fs.readdirSync(currentPath);

            children.forEach((child) => {
                pathsToVisit.push(path.join(currentPath, child));
            });

            continue;
        }

        files.push(currentPath);
    }

    return files;
}

/**
 * Copy compatibility assets to output root when expected by legacy deploy paths.
 */
function copyLegacyCompatibilityAssets() {
    // Some deployment/runtime paths still expect these files at app root,
    // even though Vite emits them under static/*.
    const staticMediaDirectory = path.resolve(appBuildRoot, "static", "media");
    const emittedAssets = listFiles(staticMediaDirectory);
    const aiBannerAssetPath = emittedAssets.find((filePath) => {
        return /ai-banner-background-white\..+\.svg$/i.test(path.basename(filePath));
    });

    if (aiBannerAssetPath) {
        const destinationPath = path.resolve(appBuildRoot, path.basename(aiBannerAssetPath));

        fs.copyFileSync(aiBannerAssetPath, destinationPath);
    }

    const staticJavaScriptDirectory = path.resolve(appBuildRoot, "static", "js");
    const emittedScripts = listFiles(staticJavaScriptDirectory);
    const workerAssets = emittedScripts.filter((filePath) => {
        return /\.worker\.js$/i.test(path.basename(filePath));
    });

    workerAssets.forEach((workerAssetPath) => {
        const destinationPath = path.resolve(appBuildRoot, path.basename(workerAssetPath));

        fs.copyFileSync(workerAssetPath, destinationPath);
    });
}

/**
 * Generate gzip and brotli compressed files for production parity.
 */
function generateCompressedArtifacts() {
    // Keep compression behavior near the previous build contract.
    // We only emit compressed siblings when the file is large enough
    // and compression ratio is acceptable.
    const minimumCompressThreshold = 10240;
    const minimumCompressionRatio = 0.8;
    const compressiblePattern = /\.(js|css|html|png|svg|jpe?g)$/i;
    const files = listFiles(buildRoot);

    files.forEach((filePath) => {
        if (/\.(gz|br)$/i.test(filePath) || !compressiblePattern.test(filePath)) {
            return;
        }

        const sourceContent = fs.readFileSync(filePath);

        if (sourceContent.length < minimumCompressThreshold) {
            return;
        }

        const gzipContent = zlib.gzipSync(sourceContent);
        const gzipRatio = gzipContent.length / sourceContent.length;

        if (gzipRatio <= minimumCompressionRatio) {
            fs.writeFileSync(`${filePath}.gz`, gzipContent);
        }

        const brotliContent = zlib.brotliCompressSync(sourceContent, {
            params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 9
            }
        });
        const brotliRatio = brotliContent.length / sourceContent.length;

        if (brotliRatio <= minimumCompressionRatio) {
            fs.writeFileSync(`${filePath}.br`, brotliContent);
        }
    });
}

/**
 * Copy static/public assets to destination.
 */
function copyPublicAssets() {
    const source = path.resolve(appRoot, "src", "public");

    fs.copySync(source, appBuildRoot, {
        filter: (sourcePath) => {
            if (!buildMode.isStatic) {
                return true;
            }

            const relativeSourcePath = path.relative(source, sourcePath).replace(/\\/g, "/");

            if (relativeSourcePath === "") {
                return true;
            }

            if (relativeSourcePath === "WEB-INF" || relativeSourcePath.startsWith("WEB-INF/")) {
                return false;
            }

            return true;
        },
        overwrite: true
    });
}

/**
 * Copy i18n bundle files.
 */
function copyI18nAssets() {
    const i18nBundleSource = path.resolve(workspaceRoot, "modules", "i18n", "dist", "bundle");
    const i18nBundleDestination = path.resolve(appBuildRoot, "resources", "i18n");

    fs.copySync(i18nBundleSource, i18nBundleDestination, {
        overwrite: true
    });

    const tempI18nMetaSource = path.resolve(appRoot, "src", "extensions", "i18n", "tmp");

    if (!fs.existsSync(tempI18nMetaSource)) {
        return;
    }

    fs.copySync(tempI18nMetaSource, i18nBundleDestination, {
        filter: (sourcePath) => {
            if (fs.lstatSync(sourcePath).isDirectory()) {
                return true;
            }

            return path.basename(sourcePath).startsWith("meta.") && path.basename(sourcePath).endsWith(".json");
        },
        overwrite: true
    });
}

/**
 * Copy login portal layouts.
 */
function copyLoginPortalLayouts() {
    const source = path.resolve(appRoot, "src", "login-portal-layouts");
    const destination = path.resolve(appBuildRoot, "libs", "login-portal-layouts");

    if (!fs.existsSync(source)) {
        return;
    }

    fs.copySync(source, destination, {
        overwrite: true
    });
}

/**
 * Build template option map.
 *
 * @returns {Record<string, string>}
 */
function buildTemplateOptions() {
    const basename = buildMode.isStatic && buildMode.isPreAuthCheckEnabled
        ? buildMode.appBasePath
        : "console";
    const publicPath = buildMode.publicBase;
    const themeHash = resolveThemeHash(themeName);
    const isExternalTomcat = buildMode.isExternalTomcat;

    // Centralized values used by JSP/HTML templates.
    return {
        authenticatedIdPs: "<%=request.getParameter(\"AuthenticatedIdPs\")%>",
        authorizationCode: "<%=Encode.forHtml(request.getParameter(\"code\"))%>",
        basename,
        clientID: deploymentConfig.clientID || "CONSOLE",
        contentType: "<%@ page language=\"java\" contentType=\"text/html; charset=UTF-8\" pageEncoding=\"UTF-8\" %>",
        cookieproDomainScriptId: "<% String cookiepro_domain_script_id = System.getenv(\"cookiepro_domain_script_id\"); %>",
        cookieproDomainScriptIdVar: "<%= cookiepro_domain_script_id %>",
        cookieproEnabledCheck: "<% if ((Boolean.TRUE.toString()).equals(is_cookiepro_enabled)) { %>",
        cookieproEnabledCheckEnd: "<% } %>",
        cookieproEnabledFlag: "<% String is_cookiepro_enabled = System.getenv(\"is_cookiepro_enabled\"); %>",
        cookieproInitialScriptTypeCheck: "<% String initialScriptType = (Boolean.TRUE.toString()).equals(is_cookiepro_enabled) ? \"text/plain\" : \"text/javascript\"; %>",
        cookieproInitialScriptTypeVar: "<%= initialScriptType %>",
        getAdaptiveAuthenticationAvailability: !isExternalTomcat
            ? "<%@ page import=\"static org.wso2.carbon.identity.application.authentication.framework.util.FrameworkUtils.isAdaptiveAuthenticationAvailable\"%>"
            : "",
        getOrganizationManagementAvailability: !isExternalTomcat
            ? "<%@ page import=\"static org.wso2.carbon.identity.application.authentication.framework.util.FrameworkUtils.isOrganizationManagementEnabled\"%>"
            : "",
        importIdentityTenantUtil: !isExternalTomcat
            ? "<%@ page import=\"static org.wso2.carbon.identity.core.util.IdentityTenantUtil.isTenantQualifiedUrlsEnabled\" %>"
            : "",
        importIsSuperTenantRequiredInUrl: !isExternalTomcat
            ? "<%@ page import=\"static org.wso2.carbon.identity.core.util.IdentityTenantUtil.isSuperTenantRequiredInUrl\" %>"
            : "",
        importOwaspEncode: "<%@ page import=\"org.owasp.encoder.Encode\" %>",
        importStringUtils: "<%@ page import=\"org.apache.commons.lang.StringUtils\" %>",
        importSuperTenantConstant: !isExternalTomcat
            ? "<%@ page import=\"static org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME\"%>"
            : "",
        importTenantPrefix: !isExternalTomcat
            ? "<%@ page import=\"static org.wso2.carbon.utils.multitenancy.MultitenantConstants.TENANT_AWARE_URL_PREFIX\"%>"
            : "",
        importUtil: !isExternalTomcat
            ? "<%@ page import=\"static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL\" %>"
            : "",
        isAdaptiveAuthenticationAvailable: !isExternalTomcat
            ? "<%= isAdaptiveAuthenticationAvailable() %>"
            : "false",
        isOrganizationManagementEnabled: !isExternalTomcat
            ? "<%= isOrganizationManagementEnabled() %>"
            : "false",
        isSuperTenantRequiredInUrl: !isExternalTomcat
            ? "<%=isSuperTenantRequiredInUrl()%>"
            : "",
        isTenantQualifiedUrlsEnabled: !isExternalTomcat
            ? "<%=isTenantQualifiedUrlsEnabled()%>"
            : "",
        proxyContextPath: !isExternalTomcat
            ? "<%=ServerConfiguration.getInstance().getFirstProperty(PROXY_CONTEXT_PATH)%>"
            : "",
        proxyContextPathConstant: !isExternalTomcat
            ? "<%@ page import=\"static org.wso2.carbon.identity.core.util.IdentityCoreConstants.PROXY_CONTEXT_PATH\" %>"
            : "",
        publicPath,
        requestForwardSnippet: "if(request.getParameter(\"code\") != null && !request.getParameter(\"code\").trim().isEmpty()) {request.getRequestDispatcher(\"/authenticate?code=\"+request.getParameter(\"code\")+\"&AuthenticatedIdPs=\"+request.getParameter(\"AuthenticatedIdPs\")+\"&session_state=\"+request.getParameter(\"session_state\")).forward(request, response);}",
        serverConfiguration: !isExternalTomcat
            ? "<%@ page import=\"org.wso2.carbon.base.ServerConfiguration\" %>"
            : "",
        serverUrl: !isExternalTomcat
            ? "<%=getServerURL(\"\", true, true)%>"
            : "",
        sessionState: "<%=Encode.forHtml(request.getParameter(\"session_state\"))%>",
        superTenantConstant: !isExternalTomcat
            ? "<%=SUPER_TENANT_DOMAIN_NAME%>"
            : "",
        tenantDelimiter: !isExternalTomcat
            ? "\"/\"+'<%=TENANT_AWARE_URL_PREFIX%>'+\"/\""
            : "",
        tenantPrefix: !isExternalTomcat
            ? "<%=TENANT_AWARE_URL_PREFIX%>"
            : "",
        theme: themeName,
        themeHash
    };
}

/**
 * Render template from source to destination.
 *
 * @param {string} sourceFileName - Source template file.
 * @param {string} destinationPath - Destination output file.
 * @param {Record<string, string>} options - Replace options.
 * @param {string | undefined} entryTags - Script/link tags to inject into head.
 */
function renderTemplateToFile(sourceFileName, destinationPath, options, entryTags) {
    const sourcePath = path.resolve(appRoot, "src", sourceFileName);
    const templateContent = fs.readFileSync(sourcePath, "utf8");
    let renderedTemplate = renderTemplate(templateContent, options);

    if (entryTags && entryTags.trim().length > 0) {
        // Inject Vite manifest-driven entry tags into templates that own a head tag.
        renderedTemplate = renderedTemplate.replace("</head>", `${entryTags}</head>`);
    }

    if (/buildOptions\./.test(renderedTemplate)) {
        // Fail fast so unresolved legacy placeholders never reach deployment artifacts.
        throw new Error(
            `Unresolved template placeholder found while rendering "${sourceFileName}" to "${destinationPath}".`
        );
    }

    fs.ensureDirSync(path.dirname(destinationPath));
    fs.writeFileSync(destinationPath, renderedTemplate, "utf8");
}

/**
 * Rewrite generated deployment config based on selected build mode.
 */
function rewriteDeploymentConfig() {
    const destinationPath = path.resolve(appBuildRoot, "deployment.config.json");

    if (!fs.existsSync(destinationPath)) {
        return;
    }

    const destinationConfig = fs.readJsonSync(destinationPath);

    if (buildMode.isStatic && buildMode.isPreAuthCheckEnabled) {
        destinationConfig.appBaseName = buildMode.appBasePath;
    }

    fs.writeJsonSync(destinationPath, destinationConfig, {
        spaces: 4
    });
    fs.appendFileSync(destinationPath, "\n");
}

/**
 * Render output shell files.
 */
function renderShellFiles() {
    const templateOptions = buildTemplateOptions();
    const hasManifest = fs.existsSync(manifestPath);

    if (!hasManifest) {
        throw new Error(
            `renderShellFiles failed: Vite manifest is missing at "${manifestPath}". ` +
            "Cannot call buildEntryTags or renderTemplateToFile without a valid manifest."
        );
    }

    const manifest = fs.readJsonSync(manifestPath);
    const entryTags = buildEntryTags(manifest, "src/init/vite-entry.ts", buildMode.publicBase);

    if (buildMode.isStatic && buildMode.isPreAuthCheckEnabled) {
        renderTemplateToFile("auth.html", path.resolve(buildRoot, "index.html"), templateOptions);
        renderTemplateToFile("index.html", path.resolve(appBuildRoot, "index.html"), templateOptions, entryTags);

        return;
    }

    renderTemplateToFile("index.jsp", path.resolve(appBuildRoot, "index.jsp"), templateOptions);
    renderTemplateToFile("home.jsp", path.resolve(appBuildRoot, "home.jsp"), templateOptions, entryTags);
    fs.copyFileSync(path.resolve(appRoot, "src", "auth.jsp"), path.resolve(appBuildRoot, "auth.jsp"));
}

function run() {
    copyThemeAssets();
    copyPublicAssets();
    copyI18nAssets();
    copyLoginPortalLayouts();
    rewriteDeploymentConfig();
    renderShellFiles();
    copyLegacyCompatibilityAssets();
    generateCompressedArtifacts();
    fs.removeSync(path.resolve(appBuildRoot, ".vite"));
}

run();
