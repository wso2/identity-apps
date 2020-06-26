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

// Path for the distribution directory.
const src = path.join(__dirname, "..", "src");
const assets = path.join(src, "assets");
const dist = path.join(__dirname, "..", "dist");
const target = path.join(dist, "src", "assets");

log("Copying assets to the distribution.");

// Check if the assets folder exists, if not terminate the script.
if (!fs.existsSync(assets)) {
    log("\nCouldn't find the assets folder." + "Terminating the script......");
    // Terminate the script.
    process.exit();
}

// If the target folder already exists in the distribution, clean it first.
if (fs.existsSync(target)) {
    log("\nAssets folder already exists in the distribution. Cleaning it first......");
    execSync("npm run clean:assets");
}

log("\nStarted copying the assets to the distribution......");

// Copy the content in `src/assets` in to the distribution folder.
fs.copySync(assets, target);

log("\nFinishing up......");
