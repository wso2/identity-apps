/**
 * Copyright (c) 2021-2026, WSO2 LLC. (https://www.wso2.com).
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

const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs-extra");
const DeploymentConfig = require("../src/public/deployment.config.json");

dotenv.config();

let appFolder = "";

if (process.env.PRE_AUTH_CHECK === "true") {
    const trimmedAppBasePath = (process.env.APP_BASE_PATH || "").trim();
    const selectedAppBasePath = trimmedAppBasePath || DeploymentConfig.appBaseName || "";

    appFolder = selectedAppBasePath.replace(/^\/+|\/+$/g, "");
}

// eslint-disable-next-line no-console
const log = console.log;

const tmpDir = path.join(__dirname, "..", "src", "extensions", "i18n", "tmp");
const i18nDir = path.join(__dirname, "..", "build", "console", appFolder, "resources", "i18n");

if (fs.existsSync(tmpDir)) {
    const metaFiles = fs.readdirSync(tmpDir);
    const metaFileName = metaFiles ? metaFiles.filter(file => file.startsWith("meta"))[ 0 ] : null;

    if (!fs.existsSync(i18nDir)) {
        log(`Skipped post build i18n cleanup. Directory does not exist: ${i18nDir}`);
        fs.removeSync(tmpDir);

        process.exit(0);
    }

    const i18nFiles = fs.readdirSync(i18nDir);

    // Remove the redundant meta.json file from the i18n directory in the build directory.
    log("Removing the redundant meta.json file from the i18n directory in the build directory.");
    i18nFiles.forEach(file => {
        if (file.startsWith("meta") && file !== metaFileName) {
            fs.removeSync(path.join(i18nDir, file));
        }
    });
    log("Removed redundant meta.json file");

    // Remove tmp directory in the extensions directory
    log("Removing tmp directory in the extensions directory.");
    fs.removeSync(tmpDir);
    log("tmp directory removed.");
}
