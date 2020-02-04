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

const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const { execSync } = require("child_process");

// tslint:disable-next-line:no-console
const log = console.log;

const OUTPUT_DIR_NAME = "bundle";
const META_FILE_NAME = "meta.json";

// Path for the distribution directory.
const dist = path.join(__dirname, "..", "dist");

// Path for the locale content after the build.
const contentPath = path.join(dist, "src", "content");

// Path for the directory to store final transpiled JSON files.
const outputPath = path.join(dist, OUTPUT_DIR_NAME);

log(chalk.greenBright.bold("Running ", chalk.yellowBright("@wso2is/i18n"), " module's post build script."));

// Check if the `dist` and the `content` folder exists and if not terminate the script.
// If the folders doesn't exist that means the build hasn't been performed.
if (!fs.existsSync(dist) || !fs.existsSync(contentPath)) {

    log(chalk.whiteBright.bgRed("\nERROR") + " in " +
        chalk.yellowBright("@wso2is/i18") + " module");

    log(chalk.redBright("\nCould not locate the i18 content build artifacts." +
        "Please execute the build command before running this script."));

    // Terminate the script.
    process.exit();
}

// If the bundle folder exists, clean it first.
if (fs.existsSync(outputPath)) {
    log(chalk.cyanBright("\nBundle already exists. Cleaning it first......"));
    execSync("npm run clean:bundle");
}

// Create the output directory if it doesn't exist.
createDirectory(outputPath, true);

// Load the locale content.
const content = require(contentPath);

// Object to store the meta info of all the languages.
let metaFileContent = {};

// Create directories to store the locales for the corresponding language.
for (const [key, value] of Object.entries(content)) {

    const langDirPath = path.join(outputPath, value.meta.code);

    let resourcePaths = {};

    if (!value || !value.meta || !value.meta.code || !value.resources) {

        log(chalk.whiteBright.bgYellow("\nWARNING") +
            chalk.yellowBright(" - Could not find the relevant locale meta or resources for the language"));

        return;
    }

    // Create the language directories
    createDirectory(langDirPath, true);

    log(chalk.blueBright.bold("\nCreating a directory for the language - " + value.meta.name + "\n"));

    // Iterate through the resources object to extract the namespaces.
    // These names will be used to create the corresponding resource JSON files.
    for (const [objKey, objValue] of Object.entries(value.resources)) {
        const fileName = objKey + ".json";
        const filePath = path.join(langDirPath, fileName);

        createFile(filePath, JSON.stringify(objValue, undefined, 4), null, true);

        log(chalk.whiteBright.bold("Creating " + fileName + " to store relevant namespace resources"));

        resourcePaths = {
            ...resourcePaths,
            [ objKey ]: path.join(value.meta.code, fileName),
        };
    }

    metaFileContent = {
        ...metaFileContent,
        [ value.meta.code ] : {
            ...value.meta,
            paths: resourcePaths,
        },
    };
}

createFile(path.join(outputPath, META_FILE_NAME),
    JSON.stringify(metaFileContent, undefined, 4), null, true);

log(chalk.cyanBright.bold("\nCreated the locale meta file."));

log(chalk.greenBright.bold("\nSuccessfully generated the locale bundle."));

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
