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

const less = require('less');
const path = require('path');
const RewriteImportPlugin = require("less-plugin-rewrite-import");
const NpmImportPlugin = require('less-plugin-npm-import');
const RewriteVariablePlugin = require("./plugins/less-plugin-variable-rewrite");

const semanticUILessDir = path.join("libs", "styles", "less", "semantic-ui-less");
const importPaths = (themePath) => {
    let replacers = {
        paths: {
            "../../theme.config": path.join(themePath, "semantic-ui.config"),
            "../../wso2.config": path.join(themePath, "wso2.config")
        }
    };

    if (typeof window !== "undefined") {
        replacers.paths["~semantic-ui-less/semantic.less"] = path.join(semanticUILessDir, "semantic.less");
        replacers.paths["~semantic-ui-less/themes/default/globals/site.variables"] = path.join(
            semanticUILessDir, "themes", "default", "globals", "site.variables"
        );
    }

    return replacers;
};

const rewriteVariblesForWebCompile = () => {
    if (typeof window !== "undefined") {
        return new RewriteVariablePlugin({
            "@themesFolder": {
                file: "semantic-ui.config",
                value: "../semantic-ui-less/themes"
            }
        });
    }
    return {};
};

const Theme = {
    compile: (filePath, themePath, options) => {
        const defaultOptions = {
            compress: false,
            env: "production",
            filename: path.resolve(filePath),
            plugins: [
                new NpmImportPlugin({ prefix: "~" }),
                new RewriteImportPlugin(importPaths(themePath)),
                rewriteVariblesForWebCompile()
            ],
            sourceMap: false
        };

        return new Promise((resolve, reject) => {
            // Handle file reading based on the enviroment. Node or Web
            if (typeof window === "undefined") {
                const fs = require('fs-extra');
                const src = fs.readFileSync(filePath, "utf8");

                less.render(src, Object.assign(defaultOptions, options))
                    .then((data) => {
                        return resolve(data);
                    }, (error) => {
                        return reject(error);
                    });
            } else {
                fetch(filePath)
                    .then((resp) => resp.text())
                    .then((src) => {
                        less.render(src, Object.assign(defaultOptions, options))
                            .then((data) => {
                                return resolve(data.css);
                            }, (error) => {
                                return reject(error);
                            });
                    });
            }
        });
    },
    update: (options) => {
        return Theme.compile(
            "./libs/styles/less/theme-module/themes/default/index.less",
            "./libs/styles/less/theme-module/themes/default", options
        );
    }
};

module.exports = Theme;
