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

// eslint-disable-next-line no-console
const log = console.log;

// Paths.
const src = path.join(__dirname, "..", "src");
const themeModule = path.join(__dirname, "..", "node_modules", "@wso2is", "theme", "dist", "lib");
const target = path.join(src, "themes");

log("Copying the theme content from @wso2is/theme module to the portal source.");

// Check if the `@wso2is/theme` module is installed, if not terminate the script.
if (!fs.existsSync(themeModule)) {
    log("\nCouldn't find @wso2is/theme module." + "Please install dependencies with npm/yarn and try again.");
    // Terminate the script.
    process.exit();
}

// If the themes folder already exists, clean it.
if (fs.existsSync(target)) {
    log("\nThemes folder already exists. Cleaning it first......");
    execSync("npm run clean:themes");
}

log("\nStarted copying themes to the source......");

// Copy the content in `wso2is/theme` in to target folder.
fs.copySync(themeModule, src);

log("\nFinishing up the theme copying process......");
