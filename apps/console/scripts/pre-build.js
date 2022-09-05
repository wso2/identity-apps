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
const crypto = require("crypto");
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
execSync("pnpm clean:build");

// Run theme content copying to source script.
execSync("pnpm copy:themes:src");

// Path of the build directory.
const distDirectory = path.join(__dirname, "..", "src", "extensions", "i18n", "dist", "src");
const i18nNodeModulesDir = path.join(__dirname,"..", "node_modules", "@wso2is", "i18n", "dist", "bundle");

log("Compiling i18N extensions...");

try {
    execSync("pnpm compile:i18n");
} catch (e) {
    log(e);
}
log("Completed compiling i18n extensions.");

const i18NTempExtensionsPath = path.join(distDirectory, "resources");
const i18nExtensions = require(i18NTempExtensionsPath);
const files = fs.readdirSync(i18nNodeModulesDir);
const metaJsonFileName = files.filter(file => file.startsWith("meta"))[ 0 ];
const metaFilePath = path.join(i18nNodeModulesDir, metaJsonFileName);
const meta = require(metaFilePath);

const namespaces = [];

log("Moving extensions.json files to the build directory");

for (const value of Object.values(i18nExtensions)) {
    if (!value || !value.name || !value.extensions) {
        continue;
    }

    const fileContent = JSON.stringify(value.extensions, undefined, 4);
    const hash = crypto.createHash("sha1").update(JSON.stringify(fileContent)).digest("hex");
    const fileName = `extensions.${ hash.substr(0, 8) }.json`;
    const filePath = path.join(i18nNodeModulesDir, value.name, "portals", fileName);

    createFile(filePath, fileContent, null, true);

    // Update the name of the extensions file in the meta.json file.
    meta[ value.name ].paths.extensions = meta[ value.name ].paths.extensions.replace("{hash}", hash.substr(0, 8));

    // Capture existing namespaces.
    namespaces.push(value.name);
}

// Remove non-existent namespaces from the meta.json file.
Object.keys(meta).forEach((key) => {
    if (!namespaces.includes(key)) {
        delete meta[ key ].paths.extensions;
    }
});

// Regenerate the meta.json file hash.
const hash = crypto.createHash("sha1").update(JSON.stringify(meta)).digest("hex");
const newMetaFileName = "meta." + hash.substr(0, 8) + ".json";
const tmpDir = path.join(__dirname, "..", "src", "extensions", "i18n", "tmp");

if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
}
const newMetaFilePath = path.join(tmpDir, newMetaFileName);

// Save meta.json file.
createFile(newMetaFilePath, JSON.stringify(meta, undefined, 4));

log("Cleaning the tmp directory...");
execSync("pnpm clean:i18n:dist");

log("\nFinishing up the pre build script.....");
