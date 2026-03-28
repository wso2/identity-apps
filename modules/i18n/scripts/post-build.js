/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

const crypto = require("crypto");
const path = require("path");
const fs = require("fs");


// eslint-disable-next-line no-console
const log = console.log;

const OUTPUT_DIR_NAME = "bundle";
const META_FILE_NAME = "meta.{hash}.json";
const PORTALS_FOLDER_NAME = "portals";
const EXTENSIONS_FILENAME = "extensions.{hash}.json";

// Path for the source translations directory (JSON files).
const translationsSrcPath = path.join(__dirname, "..", "src", "translations");

// Path for the distribution directory.
const dist = path.join(__dirname, "..", "dist");

// Path for the directory to store final hashed JSON bundle files.
const outputPath = path.join(dist, OUTPUT_DIR_NAME);

log("Running @wso2is/i18n module's post build script.");

// Verify the JSON source translations directory exists.
if (!fs.existsSync(translationsSrcPath)) {
    log("\nERROR in @wso2is/i18n module");
    log("\nCould not locate the JSON translation source files at: " + translationsSrcPath);
    process.exit(1);
}

// If the bundle folder exists, clean it first.
if (fs.existsSync(outputPath)) {
    log("\nBundle already exists. Cleaning it first...");
    fs.rmSync(outputPath, { recursive: true, force: true });
}

// Create the output directory.
fs.mkdirSync(outputPath, { recursive: true });

// Discover locale directories: any sub-directory that contains a meta.json file.
const localeCodes = fs.readdirSync(translationsSrcPath).filter((entry) => {
    const entryPath = path.join(translationsSrcPath, entry);
    return (
        fs.statSync(entryPath).isDirectory() &&
        fs.existsSync(path.join(entryPath, "meta.json"))
    );
});

if (localeCodes.length === 0) {
    log("\nERROR: No locale directories with meta.json found in " + translationsSrcPath);
    process.exit(1);
}

log("\nFound locales: " + localeCodes.join(", ") + "\n");

// Object to store the meta info of all the languages.
let metaFileContent = {};

// Process each locale.
for (const localeCode of localeCodes) {
    const localeDir   = path.join(translationsSrcPath, localeCode);
    const metaFile    = path.join(localeDir, "meta.json");
    const portalsDir  = path.join(localeDir, PORTALS_FOLDER_NAME);
    const langDirPath = path.join(outputPath, localeCode);

    // Read locale metadata.
    const localeMeta = JSON.parse(fs.readFileSync(metaFile, "utf8"));

    if (!localeMeta.code) {
        log("\nWARNING - meta.json for " + localeCode + " is missing a 'code' field – skipping.");
        continue;
    }

    // Create the output locale directory.
    fs.mkdirSync(langDirPath, { recursive: true });
    log("\nCreating a directory for the language - " + localeMeta.name + "\n");

    let resourcePaths = {};

    if (fs.existsSync(portalsDir)) {
        const subFolderPath = path.join(langDirPath, PORTALS_FOLDER_NAME);
        fs.mkdirSync(subFolderPath, { recursive: true });
        log("Creating " + PORTALS_FOLDER_NAME + " sub folder to store relevant namespace resources.");

        // Read each namespace JSON file (skip non-.json files).
        const nsFiles = fs.readdirSync(portalsDir).filter((f) => f.endsWith(".json"));

        for (const nsFile of nsFiles) {
            const nsKey     = path.basename(nsFile, ".json"); // e.g. "applications"
            const nsContent = JSON.parse(fs.readFileSync(path.join(portalsDir, nsFile), "utf8"));

            const hash     = crypto.createHash("sha1").update(JSON.stringify(nsContent)).digest("hex");
            const fileName = `${ nsKey }.${ hash.substr(0, 8) }.json`;
            const filePath = path.join(subFolderPath, fileName);

            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify(nsContent, undefined, 4));
            }

            log("Generating the JSON - " + fileName);

            resourcePaths = {
                ...resourcePaths,
                [ nsKey ]: path.join(localeCode, PORTALS_FOLDER_NAME, fileName)
                    .split(path.sep).join(path.posix.sep)
            };
        }

        // Add the extensions placeholder path (filled in by the app's pre-build script).
        resourcePaths = {
            ...resourcePaths,
            extensions: path.join(localeCode, PORTALS_FOLDER_NAME, EXTENSIONS_FILENAME)
                .split(path.sep).join(path.posix.sep)
        };
    }

    metaFileContent = {
        ...metaFileContent,
        [ localeMeta.code ]: {
            ...localeMeta,
            paths: resourcePaths
        }
    };
}

const hash = crypto.createHash("sha1").update(JSON.stringify(metaFileContent)).digest("hex");
const metaOutputPath = path.join(outputPath, META_FILE_NAME.replace("{hash}", hash.substr(0, 8)));

if (!fs.existsSync(metaOutputPath)) {
    fs.writeFileSync(metaOutputPath, JSON.stringify(metaFileContent, undefined, 4));
}

log("\nCreated the locale meta file.");
log("\nSuccessfully generated the locale bundle.");
