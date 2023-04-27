/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
const fs = require("fs-extra");
const themeFiles = path.join(__dirname, "..", "modules", "theme", "dist", "lib");
const apps = [ "authentication-portal", "recovery-portal", "x509-certificate-authentication-portal" ];

apps.forEach((app) => {
    fs.copy(themeFiles, path.join(__dirname, "apps", app, "src", "main", "webapp", "libs"))
        .then(() => {
            // eslint-disable-next-line no-console
            console.error("Theme files copied to " + app + ".");
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
        });
});
