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

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

function createFile(filePath, data, options, checkIfExists) {

    if (!checkIfExists) {
        fs.writeFileSync(filePath, data, options);

        return;
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, data, options);
    }
}

// eslint-disable-next-line no-console
const log = console.log;

log("Pre build script started.....");

// Run the clean script.
execSync("npm run clean");

// Run theme content copying to source script.
execSync("npm run copy:themes:src");

// Path of the build directory.
const distDirectory = path.join(__dirname, "..", "src", "extensions", "i18n", "dist", "src");
const i18nNodeModulesDir = path.join(__dirname,"..", "node_modules", "@wso2is", "i18n", "dist", "bundle");
log("Compiling i18N extensions...");
try {
    execSync("npm run compile:i18n");
} catch (e) {
    log(e);
}
log("Completed compiling i18n extensions.");

const i18NTempExtensionsPath = path.join(distDirectory, "resources");
const i18nExtensions = require(i18NTempExtensionsPath);

log("Moving extensions.json files to the build directory");
for (const value of Object.values(i18nExtensions)) {
    if (!value || !value.name || !value.extensions) {
        continue;
    }

    const fileContent = JSON.stringify(value.extensions, undefined, 4);
    const fileName = "extensions.json";
    const filePath = path.join(i18nNodeModulesDir, value.name, "portals", fileName);
    createFile(filePath, fileContent, null, true);
}

log("Cleaning the tmp directory...");
execSync("npm run clean:i18n:dist");

log("\nFinishing up the pre build script.....");
