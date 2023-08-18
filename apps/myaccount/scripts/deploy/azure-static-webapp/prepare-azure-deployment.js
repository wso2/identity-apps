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
 * @fileOverview This file contains a script to prepare for Azure static deployment.
 * It copies the static-deploy-config.json file to the build directory.
 */

const fs = require("fs");
const path = require("path");

// eslint-disable-next-line no-console
const logger = console;

const AZURE_STATIC_DEPLOY_CONFIG_FILENAME = "staticwebapp.config.json";
const PATHS = {
    AZURE_STATIC_DEPLOY_CONFIG: path.resolve(path.join(__dirname, AZURE_STATIC_DEPLOY_CONFIG_FILENAME)),
    BUILD: path.resolve(path.join(__dirname, "..", "..", "..", "build", "myaccount"))
};

logger.info("\nPrerequisites for for Azure Static app deployment.\n");

/**
 * Copies the static-deploy-config.json file to the build directory.
 * @param {string} err - Error message, if any.
 */
fs.copyFile(PATHS.AZURE_STATIC_DEPLOY_CONFIG, path.join(PATHS.BUILD, AZURE_STATIC_DEPLOY_CONFIG_FILENAME), (err) => {
    if (err) {
        logger.error(err);

        return;
    }
});
