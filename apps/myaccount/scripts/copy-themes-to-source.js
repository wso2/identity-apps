/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * @fileOverview Script to copy theme content from @wso2is/theme to source.
 *
 * All the images from themes are copied to the source so that webpack can
 * copy only the necessary files to the distribution and drop the un-used files
 * for optimization (supplement webpack treeshaking).
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

// eslint-disable-next-line no-console
const log = console.log;

const SOURCE_DIRECTORY = "src";                                              // Source code directory.
const THEMES_DIRECTORY = "themes";                                           // Themes directory in source.
const ASSETS_FOLDER_NAME = "assets";                                         // Assets folder name in respective Theme.
const IMAGES_FOLDER_NAME = "images";                                         // Assets folder name in respective Theme.
const THEME_VARIABLES_FILE = "theme-variables.json";                         // Theme variables file name.

// Paths.
const src = path.join(__dirname, "..", SOURCE_DIRECTORY);
const themeModule = path.join(__dirname, "..", "node_modules", "@wso2is", "theme", "dist", "lib", "themes");
const target = path.join(src, THEMES_DIRECTORY);
const imagesFolderRelPath = path.join(ASSETS_FOLDER_NAME, IMAGES_FOLDER_NAME);

log("\nStarted copying the theme images from @wso2is/theme to the portal source.");

// Check if the `@wso2is/theme` module is installed, if not terminate the script.
if (!fs.existsSync(themeModule)) {
    log("\nCouldn't find @wso2is/theme module."
        + "Please bootstrap dependencies again by executing `pnpm install` from root.");
    // Terminate the script.
    process.exit();
}

// If the themes folder already exists, clean it.
if (fs.existsSync(target)) {
    log("\nThemes folder already exists. Cleaning it first......");
    execSync("pnpm clean:themes:src");
}

log("\nStarted copying themes to the source......");

// Iterate through the themes.
fs.readdirSync(themeModule).map((theme) => {

    const themePath = path.join(themeModule, theme);

    if (fs.lstatSync(themePath).isDirectory()) {

        // Iterate through the theme folders and files.
        for (const item of fs.readdirSync(themePath)) {

            if (item === THEME_VARIABLES_FILE) {
                const themeVariablesFileOriginalPath = path.join(themePath, THEME_VARIABLES_FILE);
                const themeVariablesFileTargetPath = path.join(target, theme, THEME_VARIABLES_FILE);

                fs.copySync(themeVariablesFileOriginalPath, themeVariablesFileTargetPath);
                log("Copied theme variables file to " + themeVariablesFileTargetPath);
            }

            // If the folder name is `assets`, proceed.
            if (fs.lstatSync(path.join(themePath, item)).isDirectory() && item === ASSETS_FOLDER_NAME) {

                const imagesFolderOriginalPath = path.join(themePath, imagesFolderRelPath);
                const imagesFolderTargetPath = path.join(target, theme, imagesFolderRelPath);

                fs.mkdirSync(imagesFolderTargetPath, { recursive: true });
                log("\nCreated a directory for " + theme + " theme.");

                fs.copySync(imagesFolderOriginalPath, imagesFolderTargetPath);
                log("Copied images to " + imagesFolderTargetPath);
            }
        }
    }
});

log("\nFinishing up the theme copying process......");
