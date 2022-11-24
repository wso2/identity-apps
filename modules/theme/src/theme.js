/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
