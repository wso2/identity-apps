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

const less = require("less");
const path = require("path");

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
                    sourceMap: false
                };

                less.render(src, Object.assign(defaultOptions, options))
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
                    sourceMap: false
                };

                fetch(file)
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
    }
};
