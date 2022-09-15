/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

const { execSync } = require("child_process");

const log = console.log;

log("[Pre Install] Installing Asgardeo specific dependencies.....\n");

execSync("pnpm add @microsoft/applicationinsights-web");
log("Microsoft application insights web installation finished.....");

execSync("pnpm add @microsoft/applicationinsights-react-js");
log("Microsoft application insights react-js plugin installation finished.....");

execSync("pnpm add @microsoft/applicationinsights-core-js");
log("Microsoft application insights core-js plugin installation finished.....");

execSync("pnpm add uuid");
execSync("pnpm add @types/uuid");
log("UUID package & typings installation finished.....");

log("\n[Pre Install] Finishing up pre-install script.....");
