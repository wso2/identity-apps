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

const fs = require("fs");
const path = require("path");

// eslint-disable-next-line no-console
const log = console.log;

// Path of the cypress.json file.
const cypressConfigFilePath = path.join(__dirname, "..", "cypress.json");

log("Pre build script for cypress tests started.....");

// Check if the cypress.json file exists, if not terminate the script.
if (!fs.existsSync(cypressConfigFilePath)) {
    log("\nCouldn't find the cypress.json file." + "Terminating the script...");
    // Terminate the script.
    process.exit();
}
