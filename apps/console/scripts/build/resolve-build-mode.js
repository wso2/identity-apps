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

/**
 * @typedef {Object} ConsoleBuildModeInterface
 * @property {string} appBasePath
 * @property {string} publicBase
 * @property {boolean} isExternalTomcat
 * @property {boolean} isPreAuthCheckEnabled
 * @property {boolean} isStatic
 * @property {string} outDir
 */

/**
 * Resolve build mode flags and output paths for Console app.
 *
 * @param {Record<string, string | undefined>} env - Environment variables.
 * @returns {ConsoleBuildModeInterface}
 */
function resolveBuildMode(env = {}) {
    const isStatic = env.SERVER_TYPE === "static";
    const isExternalTomcat = env.SERVER_TYPE === "tomcat";
    const isPreAuthCheckEnabled = env.PRE_AUTH_CHECK === "true";
    const rawAppBasePath = env.APP_BASE_PATH ?? "";
    const normalizedAppBasePath = rawAppBasePath.trim().replace(/^\/+|\/+$/g, "");
    const resolvedAppBasePath = normalizedAppBasePath || "app";
    const publicBase = isStatic && isPreAuthCheckEnabled
        ? `/${resolvedAppBasePath}/`
        : "/console/";

    return {
        appBasePath: resolvedAppBasePath,
        isExternalTomcat,
        isPreAuthCheckEnabled,
        isStatic,
        outDir: isStatic && isPreAuthCheckEnabled
            ? `build/console/${resolvedAppBasePath}`
            : "build/console",
        publicBase
    };
}

module.exports = {
    resolveBuildMode
};
