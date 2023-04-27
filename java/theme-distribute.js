/**
 * Copyright (c) 2023, WSO2 LLC. (https://wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

const path = require("path");
const fs = require("fs-extra");
const themeFiles = path.join(__dirname, "..", "modules", "theme", "dist", "lib");
const apps = ["authentication-portal", "recovery-portal", "x509-certificate-authentication-portal"];

apps.forEach((app) => {
    fs.copy(themeFiles, path.join(__dirname, "apps", app, "src", "main", "webapp", "libs"))
        .then(() => {
            console.error("Theme files copied to " + app + ".");
        })
        .catch((error) => {
            console.error(error);
        });
});
