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
 *
 */

require("@babel/register");

const { Theme } = require("../src/theme");
const path = require("path");
const fs = require("fs-extra");
const CleanCSS = require("clean-css");
const replace = require("replace");
const lessToJson = require("less-to-json");
const mergeFiles = require("merge-files");

const srcDir = path.join(__dirname, "..", "src");
const distDir = path.join(__dirname, "..", "dist");
const themesDir = path.join(srcDir, "themes");
const semanticUICorePath = path.join("src", "semantic-ui-core");
const semanticUICoreDefinitions = path.join(semanticUICorePath, "definitions");

const lessNpmModuleDir = path.dirname(require.resolve("less"));
const semanticUICSSModuleDir = path.join(lessNpmModuleDir, "..", "semantic-ui-css");
const semanticUILessModuleDir = path.join(lessNpmModuleDir, "..", "semantic-ui-less");

const SAMPLE_THEME_NAME = "sample";
const DEFAULT_THEME_NAME = "default";
const MANIFEST_FILE_NAME = "assets-manifest.json";

const skipSample = process.argv.indexOf('--skipSample') > -1;

/*
 * Generate Default Site Variables JSON files
 */
const createVariablesLessJson = async () => {
    const exportJsFileName = "theme-variables.json";
    const exportMergeLessFileName = "theme-variables.less";

    const exportMergeLessFile = path.join(distDir, exportMergeLessFileName);
    const exportJsFile = path.join(distDir, exportJsFileName);

    const semanticUISiteVariablesFile = 
        path.join(semanticUICorePath, DEFAULT_THEME_NAME, "globals", "site.variables");
    const themeCoreSiteVariablesFile = path.join(themesDir, DEFAULT_THEME_NAME, "globals", "site.variables");

    const inputPathList = [ semanticUISiteVariablesFile, themeCoreSiteVariablesFile ];

    await mergeFiles(inputPathList, exportMergeLessFile);

    const variablesJson =  lessToJson(exportMergeLessFile);

    fs.writeFileSync(exportJsFile, JSON.stringify(variablesJson, null, 4), (error) => {
        console.error(exportJsFileName + " generation failed.");
        console.error(error);
    });

    console.log(exportJsFileName + " generated.");

    console.log("build finished.");
};

/*
 * Export compiled theme string to files
 *
 * @param {theme} Theme name
 * @param {file} Copiled CSS File type
 * @param {content} Compiled css string
 */
const writeFile = (theme, file, content) => {
    fs.ensureDirSync(path.join(distDir, "lib", "themes", theme));

    fs.writeFileSync(path.join(distDir, "lib", "themes", theme, "theme" + file), content || "", (error) => {
        console.error(theme + "/" + "theme" + file + " generation failed.");
        console.error(error);
    });

    console.log(theme + "/" + "theme" + file + " generated.");
};

/*
 * Copy semantic.js files to each theme to make them self contained
 *
 * @param {theme} Theme name
 */
const copySemanticUIJSFiles = (theme) => {
    ["semantic.js", "semantic.min.js"].map((fileName) => {
        try {
            fs.copySync(
                path.join(semanticUICSSModuleDir, fileName),
                path.join(distDir, "lib", "themes", theme, fileName));
            console.log(theme + "/" + fileName + " file copied.");
        } catch (error) {
            console.error(error);
        }
    });
};

/*
 * Copy theme assets to each theme to make them self contained
 *
 * @param {theme} Theme name
 * @param {filePath} Theme assets path
 */
const copyAssets = (theme, filePath) => {
    try {
        fs.copySync(path.join(filePath, "assets"), path.join(distDir, "lib", "themes", theme, "assets"));
        console.log(theme + "/assets copied.");
        copySemanticUIJSFiles(theme);
    } catch (error) {
        console.error(error);
    }
};

/*
 * Generate assets manifest file.
 */
/**
 * Generates an assets manifest file.
 *
 * @param theme - Theme name.
 * @param themePath - Path for the theme in "src".
 * @return {Promise<void>}
 */
const createAssetManifest = async (theme, themePath) => {

    const themePathInDist = path.join(distDir, "lib", "themes", theme);
    const themeAssetsPath = path.join(themePath, "assets");
    const targetManifestFile = path.join(themePathInDist, MANIFEST_FILE_NAME);
    const pathToReplace = path.join(__dirname, "..", "src");
    const filesToSkip = [ ".DS_Store" ];
    let manifest = {};

    const extractFilePaths = (folderPath, folder, files = []) => {
        if (fs.statSync(folderPath).isDirectory()) {
            fs.readdirSync(folderPath).map((fileName) => {
                if (!fs.statSync(path.join(folderPath, fileName)).isDirectory() && !filesToSkip.includes(fileName)) {
                    manifest = {
                        ...manifest,
                        [ folder ]: {
                            ...manifest[folder],
                            [ fileName ]: path.relative(pathToReplace, path.join(folderPath, fileName))
                        }
                    };
                }

                extractFilePaths(files[files.push(path.join(folderPath, fileName)) - 1], folder, files);
            });
        }
    };

    // Get all the folders in theme "assets" folder and extract all the file paths recursively.
    fs.readdirSync(themeAssetsPath).map((folder) => {

        if (filesToSkip.includes(folder) || !fs.statSync(path.join(themeAssetsPath, folder)).isDirectory()) {
            return;
        }

        extractFilePaths(path.join(themeAssetsPath, folder), folder);
    });

    fs.writeFileSync(targetManifestFile, JSON.stringify(manifest, null, 4), (error) => {
        console.error("failed to create the manifest file at ", targetManifestFile, ". Trace - ", error);
    });
};

/*
 * Less compile themes method. Which will read the themes folder and compile all the themes
 */
const generateThemes = () => {
    const themes = fs.readdirSync(themesDir);

    const fileWritePromises = themes.map((theme) => {
        const filePath = path.join(themesDir, theme);
        const themeIndexFile = path.join(filePath, "index.less");

        if (!fs.existsSync(themeIndexFile)) {
            return;
        }

        if (theme === SAMPLE_THEME_NAME) {
            return;
        }

        return Theme.compile(themeIndexFile, {}).then((output) => {
            const minifiedOutput = new CleanCSS().minify(output.css);
            const files = {
                ".css": output.css,
                ".css.map": output.map,
                ".min.css": minifiedOutput.styles
            };

            Object.keys(files).map((key) => writeFile(theme, key, files[key], themeIndexFile));
            copyAssets(theme, filePath);

            createAssetManifest(theme, filePath)
                .then(() => {
                    console.log("assets manifest generation for " + theme + " theme succeeded.");
                })
                .catch((error) => {
                    console.error("assets manifest generation for " + theme + " theme failed with error - ", error);
                });
        }, (error) => {
            console.error(error);
        });
    });

    Promise.all(fileWritePromises).then(() => {
        createVariablesLessJson();
    }).catch((error) => {
        console.error(error);
    });
};

/*
 * Util method to convert string to title case
 */
const titleCase = (string, spliter) => {
    const sentence = string.toLowerCase().split(spliter);

    for(var i = 0; i< sentence.length; i++){
       sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }

    return sentence.join(" ");
};

/*
 * Create example sub theme folder
 */
const createSampleTheme = () => {
    if (!skipSample) {
        const sampleThemePath = path.join(themesDir, SAMPLE_THEME_NAME);
        const defaultThemePath = path.join(themesDir, DEFAULT_THEME_NAME);

        fs.ensureDirSync(sampleThemePath);
        fs.emptyDirSync(sampleThemePath);

        /*
        * Remove empty definition folders from the copied
        */
        const defaultThemeContent = fs.readdirSync(defaultThemePath);
        
        defaultThemeContent.map((contentItem) => {
            const contentItemPath = path.join(defaultThemePath, contentItem);
        
            if (fs.lstatSync(contentItemPath).isDirectory()) {
                const folder = contentItem;
                const folderPath = path.join(sampleThemePath, folder);

                if (folder === "assets") {
                    const assetsFolderPath = path.join(defaultThemePath, folder);

                    fs.copySync(path.join(assetsFolderPath), folderPath);
                }
                else {
                    fs.ensureDirSync(folderPath);

                    const files = fs.readdirSync(path.join(defaultThemePath, folder));

                    files.map((file) => {
                        const fileNameSplit = file.split(".");

                        if (fileNameSplit.length > 0 &&
                            (fileNameSplit[1] === "variables" || fileNameSplit[1] === "overrides")) {

                            const content = "/*******************************\n" +
                                `     ${titleCase(fileNameSplit[0], "-")} ${titleCase(fileNameSplit[1], " ")}\n` +
                                "********************************\n";

                            fs.writeFileSync(path.join(folderPath, file), content, (error) => {
                                console.error(error);
                            });
                        }
                    });
                }
            }
        });

        console.log("themes/sample/assets created.");
        console.log("themes/sample .variables & .overrides files created.");

        /*
        * Copy index.less to sample theme
        */
        fs.copySync(path.join(srcDir, "templates", "index.less"), path.join(sampleThemePath, "index.less"));
        console.log("themes/sample/index.less copied.");
    }

    /*
     * Start compile themes
     */
    generateThemes();
};

/*
 * Create theme module dependency semantic-ui-core folder 
 */
const createSemanticUICore = () => {
    try {

        /*
         * Copy theme definition .less file from semantic ui less module to src/semantic-ui-core folder
         */
        fs.ensureDirSync(semanticUICoreDefinitions);
        fs.copySync(
            path.join(semanticUILessModuleDir, "definitions"),
            semanticUICoreDefinitions,
            {
                filter: (src) => {
                    // @return true if 'src' is a folder
                    if (fs.lstatSync(src).isDirectory()) {
                       return true;
                    }
                    
                    // @return true if 'src' is a file & type .less
                    const result = /\.less$/.test(src);
                    return result;
               }
            });

        console.log("node_modules/semantic-ui-less/definitions .less files copied.");
        
        /*
         * Remove empty definition folders from the copied
         */
        const folders = fs.readdirSync(semanticUICoreDefinitions);

        folders.map((folder) => {
            const folderPath = path.join(semanticUICoreDefinitions, folder);
            if (fs.readdirSync(folderPath).length === 0) {
                fs.removeSync(folderPath);
            }
        });

        console.log("node_modules/semantic-ui-less/definitions folder cleansed.");
        
        /*
         * Copy default theme .variable & .override files from semantic ui less module to src/semantic-ui-core folder
         */
        fs.copySync(path.join(semanticUILessModuleDir, "themes", DEFAULT_THEME_NAME),
            path.join(semanticUICorePath, DEFAULT_THEME_NAME));

        console.log("node_modules/semantic-ui-less/themes/default copied.");

        /*
         * Update copied definition .less files theme import logic support
         */
        replace({
            regex: /@import \(multiple\) '\.\.\/\.\.\/theme\.config';/gi,
            replacement: "@import (multiple) '../../theme.less';\n.loadVariables();",
            paths: [ semanticUICoreDefinitions ],
            recursive: true,
            silent: true,
        });

        console.log("semantic-ui-core/definitions changes updated.");

        createSampleTheme();

    } catch (error) {
        console.error(error);
    }
};

// Start the build with creating the src/semantic-ui-core folder dynamically
fs.removeSync(distDir); 
createSemanticUICore();
