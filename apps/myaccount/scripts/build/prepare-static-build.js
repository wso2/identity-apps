/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
 * @fileOverview This file contains a script to prepare for Static deployment.
 * It modifies the .env file, the deployment.config.json file, etc.
 *
 * Specify --revert flag to revert the changes done with this script.
 * @example node scripts/build/prepare-static-build.js --revert
 */

const fs = require("fs");
const path = require("path");

// eslint-disable-next-line no-console
const logger = console;

const PATHS = {
    DEPLOYMENT_CONFIG: path.resolve(path.join(__dirname, "..", "..", "src", "public", "deployment.config.json")),
    ENV_LOCAL: path.resolve(path.join(__dirname, "..", "..", ".env.local"))
};

const IS_REVERT_MODE = process.argv[2] && process.argv[2].includes("revert");

if (IS_REVERT_MODE) {
    logger.info("Reverting the build back to default.\n");
} else {
    logger.info("\nPreparing the build for Static app deployment.\n");
}

/**
 * Reads and modifies the .env file to update the server type, enable pre-auth check, and set the app base path.
 * @param {string} err - Error message, if any.
 * @param {string} data - Contents of the .env file.
 */
fs.readFile(PATHS.ENV_LOCAL, "utf8", (err, data) => {
    if (err) {
        logger.error(err);

        return;
    }

    let result;

    if (IS_REVERT_MODE) {
        // Comment out the lines that match the specified variables and values.
        result = data
            .replace(/^(\s*)(SERVER_TYPE=)(.*)$/gm, "$1#$2$3")
            .replace(/^(\s*)(PRE_AUTH_CHECK=)(.*)$/gm, "$1#$2$3")
            .replace(/^(\s*)(APP_BASE_PATH=)(.*)$/gm, "$1#$2$3");
    } else {
        // Uncomment the lines that match the specified variables and values.
        result = data
            .replace(/^#\s*(SERVER_TYPE=)(.*)$/gm, "$1static")
            .replace(/^#\s*(PRE_AUTH_CHECK=)(.*)$/gm, "$1true")
            .replace(/^#\s*(APP_BASE_PATH=)(.*)$/gm, "$1app");
    }

    // Overwrite the .env file with the modified content
    fs.writeFile(PATHS.ENV_LOCAL, result, "utf8", (err) => {
        if (err) logger.error(err);
    });
});

/**
 * Reads and modifies the deployment.config.json file to set the app base name.
 * @param {string} err - Error message, if any.
 * @param {string} data - Contents of the deployment.config.json file.
 */
fs.readFile(PATHS.DEPLOYMENT_CONFIG, "utf8", (err, data) => {
    if (err) {
        logger.error(err);

        return;
    }

    const config = JSON.parse(data);

    if (IS_REVERT_MODE) {
        config.appBaseName = "";
    } else {
        config.appBaseName = "app";
    }

    // Overwrite the deployment.config.json file with the modified content
    fs.writeFile(PATHS.DEPLOYMENT_CONFIG, JSON.stringify(config, null, 4), "utf8", (err) => {
        if (err) logger.error(err);
    });
});
