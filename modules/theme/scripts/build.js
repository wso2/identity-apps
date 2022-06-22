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

const crypto = require("crypto");
const path = require("path");
const CleanCSS = require("clean-css");
const fs = require("fs-extra");
const lessToJson = require("less-to-json");
const mergeFiles = require("merge-files");
const replace = require("replace");
const { Theme } = require("../src/theme");

/**
 * TODO: Remove this once the logger is added.
 * Tracked here https://github.com/wso2/product-is/issues/11650.
 */
const log = {
    // eslint-disable-next-line no-console
    error: console.error,
    // eslint-disable-next-line no-console
    info: console.log
};

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

const skipSample = process.argv.indexOf("--skipSample") > -1;     // CLI arg to skip the sample theme generation.
const skipManifest = process.argv.indexOf("--skipManifest") > -1; // CLI arg to skip the asset manifest generation.
const skipHashing = process.argv.indexOf("--skipHashing") > -1;   // CLI arg to skip the hashing the css artifacts.

/**
 * Generate Default Site Variables JSON files.
 *
 * @param theme - Theme to generate variables.
 * @return {Promise<void>}
 */
const createVariablesLessJson = async (theme) => {

    const exportJsFileName = "theme-variables.json";
    const exportMergeLessFileName = "theme-variables.less";
    
    const themeDistDir = path.join(distDir, "lib", "themes", theme);

    const exportMergeLessFile = path.join(themeDistDir, exportMergeLessFileName);
    const exportJsFile = path.join(themeDistDir, exportJsFileName);

    /**
     * Merges the LESS variable files.
     * `mergeFiles` has a limitation when merging more than 2 files at once. Hence, temp files should be maintained.
     *
     * @param files - Files to be merge.
     * @return {Promise<void>}
     */
    const mergeVariableFiles = async (files) => {

        const exportMergeLessTempFileWithSiteVariables = path.join(themeDistDir, exportMergeLessFileName + "-temp-001");
        const exportMergeLessTempFileWithLoginVariables = path.join(themeDistDir,
            exportMergeLessFileName + "-temp-002");

        await mergeFiles([ files[0], files[1] ], exportMergeLessTempFileWithSiteVariables);
        await mergeFiles([ exportMergeLessTempFileWithSiteVariables, files[2] ],
            exportMergeLessTempFileWithLoginVariables);

        fs.removeSync(exportMergeLessFile);
        fs.removeSync(exportMergeLessTempFileWithSiteVariables);
        fs.renameSync(exportMergeLessTempFileWithLoginVariables, exportMergeLessFile);
    };

    const semanticUISiteVariablesFile = path.join(semanticUICorePath, DEFAULT_THEME_NAME, "globals", "site.variables");
    const themeCoreSiteVariablesFile = path.join(themesDir, DEFAULT_THEME_NAME, "globals", "site.variables");
    const themeCoreLoginPortalVariablesFile = path.join(themesDir, DEFAULT_THEME_NAME, "apps",
        "login-portal.variables");

    await mergeVariableFiles([
        semanticUISiteVariablesFile,
        themeCoreSiteVariablesFile,
        themeCoreLoginPortalVariablesFile
    ]);

    // If the requested theme is a sub theme, merge the sub theme's `site.variables` too.
    if (theme !== DEFAULT_THEME_NAME) {
        const subThemeSiteVariablesFile = path.join(themesDir, theme, "globals", "site.variables");
        const subThemeLoginPortalVariablesFile = path.join(themesDir, theme, "apps", "login-portal.variables");

        await mergeVariableFiles([
            exportMergeLessFile,
            subThemeSiteVariablesFile,
            subThemeLoginPortalVariablesFile
        ]);
    }

    const variablesJson = lessToJson(exportMergeLessFile);

    fs.writeFileSync(exportJsFile, JSON.stringify(variablesJson, null, 4), (error) => {
        log.error(exportJsFileName + " generation failed.");
        log.error(error);
    });

    log.info(exportJsFileName + " for " + theme + " theme generated.");

    log.info("build finished.");
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
        log.error(theme + "/" + "theme" + file + " generation failed.");
        log.error(error);
    });

    log.info(theme + "/" + "theme" + file + " generated.");
};

/*
 * Copy semantic.js files to each theme to make them self contained
 *
 * @param {theme} Theme name
 */
const copySemanticUIJSFiles = (theme) => {
    [ "semantic.js", "semantic.min.js" ].map((fileName) => {
        try {
            fs.copySync(
                path.join(semanticUICSSModuleDir, fileName),
                path.join(distDir, "lib", "themes", theme, fileName));
            log.info(theme + "/" + fileName + " file copied.");
        } catch (error) {
            log.error(error);
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
        log.info(theme + "/assets copied.");
        copySemanticUIJSFiles(theme);
    } catch (error) {
        log.error(error);
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
        log.error("failed to create the manifest file at ", targetManifestFile, ". Trace - ", error);
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

            Object.keys(files).map((key) => {

                let ext = key;

                if (!skipHashing) {
                    const hash = files[ key ] && crypto.createHash("sha1").update(files[ key ]).digest("hex");

                    ext = hash
                        ? `.${ hash.substr(0, 8) }${ key }`
                        : key;
                }

                writeFile(theme, ext, files[ key ], themeIndexFile);
            });

            copyAssets(theme, filePath);

            if (!skipManifest) {
                createAssetManifest(theme, filePath)
                    .then(() => {
                        log.info("assets manifest generation for " + theme + " theme succeeded.");
                    })
                    .catch((error) => {
                        log.error("assets manifest generation for " + theme + " theme failed with error - ", error);
                    });
            }
        }, (error) => {
            log.error(error);
        });
    });

    Promise.all(fileWritePromises)
        .then(() => {
            // Generate Variables files for all the themes.
            themes.map((theme) => {
                if (!fs.lstatSync(path.join(themesDir, theme)).isDirectory()) {
                    return;
                }

                createVariablesLessJson(theme)
                    .catch((error) => {
                        log.error(error);
                    });
            });
        })
        .catch((error) => {
            log.error(error);
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
                                log.error(error);
                            });
                        }
                    });
                }
            }
        });

        log.info("themes/sample/assets created.");
        log.info("themes/sample .variables & .overrides files created.");

        /*
        * Copy index.less to sample theme
        */
        fs.copySync(path.join(srcDir, "templates", "index.less"), path.join(sampleThemePath, "index.less"));
        log.info("themes/sample/index.less copied.");
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

        log.info("node_modules/semantic-ui-less/definitions .less files copied.");

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

        log.info("node_modules/semantic-ui-less/definitions folder cleansed.");

        /*
         * Copy default theme .variable & .override files from semantic ui less module to src/semantic-ui-core folder
         */
        fs.copySync(path.join(semanticUILessModuleDir, "themes", DEFAULT_THEME_NAME),
            path.join(semanticUICorePath, DEFAULT_THEME_NAME));

        log.info("node_modules/semantic-ui-less/themes/default copied.");

        /*
         * Update copied definition .less files theme import logic support
         */
        replace({
            paths: [ semanticUICoreDefinitions ],
            recursive: true,
            regex: /@import \(multiple\) '\.\.\/\.\.\/theme\.config';/gi,
            replacement: "@import (multiple) '../../theme.less';\n.loadVariables();",
            silent: true
        });

        log.info("semantic-ui-core/definitions changes updated.");

        createSampleTheme();

    } catch (error) {
        log.error(error);
    }
};

// Start the build with creating the src/semantic-ui-core folder dynamically
fs.removeSync(distDir);
createSemanticUICore();
