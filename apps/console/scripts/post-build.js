/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

const path = require("path");
const fs = require("fs-extra");

// eslint-disable-next-line no-console
const log = console.log;

const tmpDir = path.join(__dirname, "..", "src", "extensions", "i18n", "tmp");
const metaFiles = fs.readdirSync(tmpDir);
const metaFileName = metaFiles ? metaFiles.filter(file => file.startsWith("meta"))[ 0 ] : null;
const i18nDir = path.join(__dirname, "..", "build", "console", "resources", "i18n");
const i18nFiles = fs.readdirSync(i18nDir);

// Remove tmp directory in the extensions directory
log("Removing tmp directory in the extensions directory.");
fs.removeSync(tmpDir);
log("tmp directory removed.");

// Remove the redundant meta.json file from the i18n directory in the build directory.
log("Removing the redundant meta.json file from the i18n directory in the build directory.");
i18nFiles.forEach(file => {
    if (file.startsWith("meta") && file !== metaFileName) {
        fs.removeSync(path.join(i18nDir, file));
    }
});
log("Removed redundant meta.json file");
