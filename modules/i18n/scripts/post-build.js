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


// eslint-disable-next-line no-console
const log = console.log;

const OUTPUT_DIR_NAME = "bundle";
const META_FILE_NAME = "meta.{hash}.json";
const TRANSLATIONS_FOLDER_NAME = "translations";
const EXTENSIONS_FILENAME = "extensions.{hash}.json";

// Path for the distribution directory.
const dist = path.join(__dirname, "..", "dist");

// Path for the translations after the build.
const translationsPath = path.join(dist, "src", TRANSLATIONS_FOLDER_NAME);

// Path for the directory to store final transpiled JSON files.
const outputPath = path.join(dist, OUTPUT_DIR_NAME);

log("Running @wso2is/i18n module's post build script.");

// Check if the `dist` and the `translations` folder exists and if not terminate the script.
// If the folders doesn't exist that means the build hasn't been performed.
if (!fs.existsSync(dist) || !fs.existsSync(translationsPath)) {

    log("\nERROR in @wso2is/i18 module");

    log("\nCould not locate the i18 translation build artifacts." +
        "Please execute the build command before running this script.");

    // Terminate the script.
    process.exit();
}

// If the bundle folder exists, clean it first.
if (fs.existsSync(outputPath)) {
    log("\nBundle already exists. Cleaning it first......");
    execSync("pnpm clean:bundle");
}

// Create the output directory if it doesn't exist.
createDirectory(outputPath, true);

// Load the translations.
const translations = require(translationsPath);

// Object to store the meta info of all the languages.
let metaFileContent = {};

// Create directories to store the locales for the corresponding language.
for (const value of Object.values(translations)) {

    const langDirPath = path.join(outputPath, value.meta.code);

    let resourcePaths = {};

    if (!value || !value.meta || !value.meta.code || !value.resources) {

        log("\nWARNING - Could not find the relevant locale meta or resources for the language");

        break;
    }

    // Create the language directories
    createDirectory(langDirPath, true);

    log("\nCreating a directory for the language - " + value.meta.name + "\n");

    // Iterate through the resources object to extract the sub folders.
    for (const [ objKey, objValue ] of Object.entries(value.resources)) {
        const subFolderPath = path.join(langDirPath, objKey);

        createDirectory(subFolderPath, true);

        log("Creating " + objKey + " sub folder to store relevant namespace resources.");

        // Extract and create the JSON files from the namespaces.
        for (const [ nsObjKey, nsObjValue ] of Object.entries(objValue)) {
            const hash = crypto.createHash("sha1").update(JSON.stringify(nsObjValue)).digest("hex");
            const fileName = `${ nsObjKey }.${ hash.substr(0, 8) }.json`;
            const filePath = path.join(subFolderPath, fileName);

            createFile(filePath, JSON.stringify(nsObjValue, undefined, 4), null, true);

            log("Generating the JSON - " + fileName);

            resourcePaths = {
                ...resourcePaths,
                [ nsObjKey ]: path.join(value.meta.code, objKey, fileName).split(path.sep).join(path.posix.sep)
            };
        }

        // Add extensions.json file to the path
        resourcePaths = {
            ...resourcePaths,
            extensions: path.join(value.meta.code, objKey, EXTENSIONS_FILENAME).split(path.sep).join(path.posix.sep)
        };
    }

    metaFileContent = {
        ...metaFileContent,
        [ value.meta.code ] : {
            ...value.meta,
            paths: resourcePaths
        }
    };
}

const hash = crypto.createHash("sha1").update(JSON.stringify(metaFileContent)).digest("hex");

createFile(path.join(outputPath, META_FILE_NAME.replace("{hash}", hash.substr(0, 8))),
    JSON.stringify(metaFileContent, undefined, 4), null, true);

log("\nCreated the locale meta file.");

log("\nSuccessfully generated the locale bundle.");

log("\nRunning cleanup task......");

execSync("pnpm clean:translations");

log("\nClean up task finished successfully......");

// Function to create directories.
function createDirectory(dirPath, checkIfExists) {

    if (!checkIfExists) {
        fs.mkdirSync(dirPath);

        return;
    }

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

// Function to create files.
function createFile(filePath, data, options, checkIfExists) {

    if (!checkIfExists) {
        fs.writeFileSync(filePath, data, options);

        return;
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, data, options);
    }
}
