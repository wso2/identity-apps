/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

const fs = require("fs");
const path = require("path");

const files = [
    "identity-apps-core/apps/authentication-portal/src/main/resources/org/wso2/carbon/identity/application/authentication/endpoint/i18n/Resources_nl_NL.properties",
    "identity-apps-core/apps/recovery-portal/src/main/resources/org/wso2/carbon/identity/mgt/recovery/endpoint/i18n/Resources_nl_NL.properties",
    "identity-apps-core/apps/accounts/src/main/resources/org/wso2/carbon/identity/application/accounts/endpoint/i18n/Resources_nl_NL.properties",
    "identity-apps-core/apps/x509-certificate-authentication-portal/src/main/resources/org/wso2/carbon/identity/application/authentication/endpoint/i18n/Resources_nl_NL.properties"
];

const langFiles = [
    "identity-apps-core/apps/authentication-portal/src/main/resources/LanguageOptions.properties",
    "identity-apps-core/apps/recovery-portal/src/main/resources/LanguageOptions.properties",
    "identity-apps-core/apps/accounts/src/main/resources/LanguageOptions.properties",
    "identity-apps-core/apps/x509-certificate-authentication-portal/src/main/resources/LanguageOptions.properties"
];

let passed = 0;
let failed = 0;

files.forEach((file) => {
    const exists = fs.existsSync(path.resolve(file));
    console.log(`${exists ? "✓" : "✗"} ${file.split("/").pop()}`);
    if (exists) {
        passed++;
    } else {
        failed++;
    }
});

langFiles.forEach((file) => {
    const content = fs.readFileSync(path.resolve(file), "utf8");
    const hasNl = content.includes("lang.switch.nl_NL");
    console.log(`${hasNl ? "✓" : "✗"} ${file.split("/").slice(-2).join("/")} has nl_NL entry`);
    if (hasNl) {
        passed++;
    } else {
        failed++;
    }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);