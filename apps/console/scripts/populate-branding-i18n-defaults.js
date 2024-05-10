/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

/**
 * @fileOverview This file contains a script to prepare for Azure static deployment.
 * It copies the static-deploy-config.json file to the build directory.
 */

const path = require("path");
const fs = require("fs-extra");

// eslint-disable-next-line no-console
const logger = console;

const I18N_SUPPORTED_JAVA_APPS = {
    "authentication-portal": {
        groupId: [ "org", "wso2", "carbon", "identity", "application", "authentication" ],
        screenName: "login"
    },
    "recovery-portal": {
        groupId: [ "org", "wso2", "carbon", "identity", "mgt", "recovery" ],
        screenName: "recovery"
    }
};

const DEFAULT_LANGUAGE = "en-US";

const META_FLAGS = Object.freeze({
    EDITABLE: "EDITABLE",
    SCREEN: "SCREEN"
});

const RESOURCE_FILE_CONTAINING_META = "Resources.properties";


/**
 * Process the default `Resource.properties` file from the app i18n bundle.
 *
 * @remarks
 * The default properties file is the place where we add metadata related to the i18n key.
 * These metadata are added as comments.
 *
 * Following is a sample of such a key in the default file.
 *
 * ```
 * copyright=\u00A9 {{currentYear}} WSO2 LLC. # EDITABLE=true,SCREEN="Common"
 * site.title=WSO2 Identity Server # EDITABLE=true,SCREEN="Login"
 * ```
 *
 * Keys that are marked as `EDITABLE` here should only be processed even in other lang properties files.
 *
 * This function will return a JSON object with the following structure.
 *
 * ```
 * {
 *   'copyright': { EDITABLE: true, SCREEN: 'Common' },
 *   'site.title': { EDITABLE: true, SCREEN: 'Login' }
 * }
 * ```
 *
 * @param {string} defaultPropertiesPath - Path to the default `Resource.properties` file.
 * @returns {Promise<object>} A JSON object with the metadata.
 * @throws {Error} Throws an error if there is an issue reading or processing the file.
 */
async function processDefaultProperties(defaultPropertiesPath) {
    try {
        const content = fs.readFileSync(defaultPropertiesPath, "utf8");

        const lines = content.split("\n");
        const result = {};
        let currentMetadata = {}; // Store metadata for the current property

        for (const line of lines) {
            // Check if the line starts with '#', indicating a metadata comment.
            if (line.trim().startsWith("#") && line.trim().includes(META_FLAGS.EDITABLE)) {
                // Parse the metadata and update the currentMetadata object.
                const metadata = {};

                line
                    .trim()
                    .substring(1) // Remove '#' character
                    .split(",")
                    .forEach(comment => {
                        const [ key, value ] = comment.split("=");

                        try {
                            metadata[key.trim()] = JSON.parse(value.trim());
                        } catch(e) {
                            throw new Error(`Error occurred while parsing the meta value: ${value}`);
                        }
                    });

                currentMetadata = metadata;
            } else {
                if (line.split("=").length >= 2) {
                    // This line contains a property, associate it with the current metadata.
                    const [ keyValue ] = line.split("=");
                    const key = keyValue.trim();

                    if (key && currentMetadata.EDITABLE) {
                        result[key] = currentMetadata;
                    }
                } else {
                    currentMetadata = {};
                }
            }
        }

        return result;
    } catch (error) {
        throw new Error(`Error processing the default ${RESOURCE_FILE_CONTAINING_META}: ${error.message}`);
    }
}

/**
 * Process a .properties file and convert it to a JSON object based on the provided metadata.
 *
 * @remarks
 * This function reads the content of a .properties file and converts it to a JSON object. It only includes properties
 * marked as `EDITABLE` in the provided metadata object.
 *
 * @param {string} propertiesPath - Path to the .properties file to process.
 * @param {object} metadata - Metadata object that contains property metadata.
 * @returns {Promise<object>} A Promise that resolves to a JSON object containing the processed properties.
 * @throws {Error} Throws an error if there is an issue reading or processing the file.
 */
async function propertiesToJson(propertiesPath, metadata) {
    try {
        const content = fs.readFileSync(propertiesPath, "utf8");

        const lines = content.split("\n");
        const result = {};

        for (const line of lines) {
            // Split the line into parts based on '#' to separate the key-value pair and comments
            const [ keyValues ] = line.split("#");

            // If there are no key-value parts, skip the line
            if (!keyValues) {
                continue;
            }

            const keyValue = keyValues.split("=");
            const key = keyValue[0].trim();
            const value = keyValue[1].trim();

            // Check if the line contains comments that include the editable flag
            const isEditable = metadata[key] && metadata[key][META_FLAGS.EDITABLE];

            if (!isEditable || keyValue.length !== 2) {
                continue;
            }

            result[metadata[key].SCREEN] = {
                ...result[metadata[key].SCREEN],
                [key]: value
            };
        }

        return result;
    } catch (error) {
        throw new Error(`Error converting ${propertiesPath} to JSON: ${error.message}`);
    }
}

/**
 * Process .properties files in a specified directory, extracting translatable content and metadata.
 *
 * @remarks
 * This function reads .properties files in a directory, extracts translatable content,
 * and processes metadata from the default `Resource.properties` file found in the directory.
 * The metadata includes information like whether a property is editable and its associated screen.
 * The extracted content is organized by language and metadata.
 *
 * @param directoryPath - Path to the directory containing .properties files.
 * @returns A JSON object with translatable content organized by language and metadata.
 * @throws {Error} If there is an error reading or processing the .properties files.
 */
async function processPropertiesFiles(directoryPath) {
    try {
        const files = await fs.readdir(directoryPath);
        const jsonFiles = {};

        // Path to the default `Resources.properties` file.
        const defaultResourceFilePath = path.join(directoryPath, RESOURCE_FILE_CONTAINING_META);
        let metadata = {};

        if (fs.existsSync(defaultResourceFilePath)) {
            metadata = await processDefaultProperties(defaultResourceFilePath);

            for (const file of files) {
                if (file.endsWith(".properties")) {
                    const filePath = path.join(directoryPath, file);
                    const jsonData = await propertiesToJson(filePath, metadata);

                    let language = file
                        .replace("Resources_", "")
                        .replace(".properties", "")
                        .replace("_", "-");

                    if (language === "Resources") {
                        language = DEFAULT_LANGUAGE;
                    }

                    Object.entries(jsonData).forEach(([ screen, translations ]) => {
                        let filteredMetadata = {};

                        // Filter metadata based on the screen.
                        Object.entries(metadata).forEach(([ metaKey, meta ]) => {
                            if (meta[META_FLAGS.SCREEN] === screen) {
                                filteredMetadata = {
                                    ...filteredMetadata,
                                    [metaKey]: meta
                                };
                            }
                        });

                        jsonFiles[screen] = {
                            ...jsonFiles[screen],
                            [language]: translations,
                            meta: filteredMetadata
                        };
                    });
                }
            }

            return [ jsonFiles, metadata ];
        } else {
            throw new Error(`There is no default : ${RESOURCE_FILE_CONTAINING_META} found. Aborting...`);
        }
    } catch (error) {
        throw new Error(`Error processing .properties files in ${directoryPath}: ${error.message}`);
    }
}

/**
 * Save JSON files containing translated content in specified directories.
 *
 * @remarks
 * This function takes a JSON object containing translated content and organizes it into directories
 * based on screens and languages. It then writes JSON files with the translations in these directories.
 * The JSON object should be structured as follows:
 *
 * ```
 * {
 *   translations: {
 *     [screenName]: {
 *       [languageCode]: {
 *         // Translated content for this screen and language
 *       },
 *       // ...
 *     },
 *     // ...
 *   }
 * }
 * ```
 *
 * @param data - JSON object containing translated content organized by screens and languages.
 * @param outputDirectory - The directory where the JSON files will be saved.
 * @throws {Error} If there is an error creating directories or writing JSON files.
 */
async function saveJsonFiles(data, outputDirectory) {
    try {
        await fs.ensureDir(outputDirectory);
        const universalMeta = {
            locales: [],
            screens: []
        };

        for (const [ screen, bundles ] of Object.entries(data.translations)) {
            const screenDirectory = path.join(outputDirectory, "screens", screen);

            universalMeta["screens"] = [ ...universalMeta["screens"], screen ];

            await fs.ensureDir(screenDirectory);

            for (const [ code, translations ] of Object.entries(bundles)) {
                const outputPath = path.join(screenDirectory, `${code}.json`);

                if (!universalMeta["locales"].includes(code) && code !== "meta") {
                    universalMeta["locales"] = [ ...universalMeta["locales"], code ];
                }

                await fs.writeJson(outputPath, translations, { spaces: 2 });
                logger.info(`JSON file saved: ${outputPath}`);
            }
        }

        const universalMetaOutputPath = path.join(outputDirectory, "meta.json");

        await fs.writeJson(universalMetaOutputPath, universalMeta, { spaces: 2 });

        logger.info("\nProcess completed.\n");
    } catch (error) {
        throw new Error(`Error saving JSON files: ${error.message}`);
    }
}

/**
 * Extract and process `.properties` files from supported Java applications into JSON format.
 *
 * @remarks
 * This function iterates over supported Java applications, extracts `.properties` files from their
 * internationalization (i18n) directories, and converts them into JSON format. The JSON files are
 * organized by screens and languages. The resulting JSON structure includes translations for
 * each screen and language. The structure is as follows:
 *
 * ```
 * {
 *   translations: {
 *     [screenName]: {
 *       [languageCode]: {
 *         // Translated content for this screen and language
 *       },
 *       // ...
 *     },
 *     // ...
 *   }
 * }
 * ```
 *
 * The function also specifies the output directory where the JSON files will be saved.
 *
 * @throws {Error} If there is an error processing the `.properties` files or saving the JSON files.
 */
async function extractPropertiesToJson() {
    try {
        let result = {};

        for (const [ app, meta ] of Object.entries(I18N_SUPPORTED_JAVA_APPS)) {
            const i18nDirectoryPath = path.resolve(
                __dirname,
                "..",
                "..",
                "..",
                "identity-apps-core",
                "apps",
                app,
                "src",
                "main",
                "resources",
                ...meta.groupId,
                "endpoint",
                "i18n"
            );

            const [ jsonFiles ] = await processPropertiesFiles(i18nDirectoryPath);

            result = {
                ...result,
                translations: {
                    ...result.translations,
                    ...jsonFiles
                }
            };
        }

        // Specify the output directory for JSON files
        const outputDirectory = path.resolve(
            __dirname,
            "..",
            "src",
            "public",
            "resources",
            "branding",
            "i18n"
        );

        await saveJsonFiles(result, outputDirectory);
    } catch (error) {
        logger.error(error.message);
    }
}

// Run the main extraction process
logger.info("\ni18n default bundle population started.\n");

extractPropertiesToJson();
