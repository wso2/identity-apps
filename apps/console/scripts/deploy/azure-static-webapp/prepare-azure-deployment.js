/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
    BUILD: path.resolve(path.join(__dirname, "..", "..", "..", "build", "console"))
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
