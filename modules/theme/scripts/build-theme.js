/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 *
 */

const path = require('path');
const fs = require('fs-extra');
const rimraf = require('rimraf');
const CleanCSS = require('clean-css');
const Theme = require("../src/theme");

const libDir = path.join(__dirname, "..", "lib");
const buildDir = path.join(__dirname, "..", "build");
const themesDir = path.join(__dirname, "..", "src", "themes");
const lessNpmModuleDir = path.dirname(require.resolve("less"));
const semanticUIModuleDir = path.join(lessNpmModuleDir, "..", "semantic-ui");
const semanticUILessModuleDir = path.join(lessNpmModuleDir, "..", "semantic-ui-less");

const generateThemes = () => {
    const themes = fs.readdirSync(themesDir);

    const fileWritePromises = themes.map((theme) => {
        const filePath = path.join(themesDir, theme, "index.less");

        if (!fs.existsSync(filePath)) {
            return;
        }

        return Theme.compile(filePath, path.join(themesDir, theme), {}).then((output) => {
            const minifiedOutput = new CleanCSS().minify(output.css);
            const files = {
                ".css": output.css,
                ".css.map": output.map,
                ".min.css": minifiedOutput.styles
            };

            Object.keys(files).map((key) => writeFile(theme, key, files[key]));
        }, (error) => {
            console.error(error);
        });
    });

    Promise.all(fileWritePromises).then((buffers) => {
        copyFiles();
    }).catch((error) => {
        console.error(error);
    });
};

const writeFile = (theme, file, content) => {
    fs.writeFileSync(path.join(buildDir, "wso2-" + theme + file), content, (error) => {
        console.error("wso2-" + theme + file + " generation failed.");
        console.error(error);
    });

    console.info("wso2-" + theme + file + " generated.");
};

const copyFiles = () => {
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir);
        copyCSS();
    } else {
        rimraf(libDir + "/*", () => {
            copyCSS();
        });
    }
};

const copyCSS = () => {
    fs.copy(buildDir, libDir)
        .then(() => {
            console.error("generated css files copied.");
            copyJS();
        })
        .catch((error) => {
            console.error(error);
        });
};

const copyJS = () => {
    ["semantic.js", "semantic.min.js"].map((fileName) => {
        fs.copy(path.join(semanticUIModuleDir, "dist", fileName), path.join(libDir, fileName))
            .then(() => {
                console.error("semantic ui " + fileName + " file copied.");
            })
            .catch((error) => {
                console.error(error);
            });
    });
    copyAssets();
};

const copyAssets = () => {
    fs.copy(path.join(semanticUILessModuleDir, "themes", "default", "assets"), path.join(libDir, "assets"))
        .then(() => {
            console.error("semantic-ui-less assets copied.");

            fs.copy(path.join(themesDir, "default", "assets"), path.join(libDir, "assets"))
                .then(() => {
                    console.error("default theme assets copied.");
                    fs.removeSync(buildDir);
                    console.error("Done.");
                })
                .catch((error) => {
                    console.error(error);
                });
        })
        .catch((error) => {
            console.error(error);
        });
};

if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
    generateThemes();
} else {
    rimraf(buildDir + "/*", () => {
        generateThemes();
    });
}
