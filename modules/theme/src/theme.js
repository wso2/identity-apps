/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

const path = require("path");
const less = require("less");
const RewriteVariablePlugin = require("less-plugin-rewrite-variable");

export const Theme = {
    compile: (file, options) => {
        return new Promise((resolve, reject) => {

            // Handle file reading based on the enviroment. Node or Web
            if (typeof window === "undefined") {

                const fs = require("fs-extra");
                const src = fs.readFileSync(file, "utf8");
                const defaultOptions = {
                    compress: false,
                    env: "production",
                    filename: path.resolve(file),
                    plugins: [ new RewriteVariablePlugin(options.modifyVars) ],
                    sourceMap: false
                };

                less.render(src, defaultOptions)
                    .then((data) => {
                        return resolve(data);
                    }, (error) => {
                        return reject(error);
                    });
            } else {

                const defaultOptions = {
                    compress: true,
                    env: "development",
                    filename: path.resolve(file),
                    plugins: [ new RewriteVariablePlugin(options.modifyVars) ],
                    sourceMap: false
                };

                fetch(file)
                    .then((resp) => resp.text())
                    .then((src) => {
                        less.render(src, defaultOptions)
                            .then((data) => {
                                return resolve(data.css);
                            }, (error) => {
                                return reject(error);
                            });
                    });
            }
        });
    }
};
