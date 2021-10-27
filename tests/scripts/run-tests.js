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
 */

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const log = {
    info: console.log,
    error: console.error
};

const TEST_SUITE_CONFIG_FILE_NAME = "test-suite.config.json";
const TEST_SUITE_CONFIG_PATH = `./${TEST_SUITE_CONFIG_FILE_NAME}`;

const INTERACTIVE_MODE_ARG = "--interactive";
const HEADLESS_MODE_ARG = "--headless";
const SMOKE_ONLY_MODE_ARG = "--smoke";

const cliArgs = process.argv.slice(2);

const rawTestSuiteConfig = fs.readFileSync(TEST_SUITE_CONFIG_PATH);
const parsedTestSuiteConfig = JSON.parse(rawTestSuiteConfig.toString());

/**
 * Constructs the test command with selected specs.
 * @return {string} Constructed test command.
 */
const constructTestCommand = () => {
    let command = resolveCypressCommand();
    const specs = [];

    for (const suite of parsedTestSuiteConfig.suites) {
        if (suite.skip) {
            continue;
        }

        if (cliArgs.includes(HEADLESS_MODE_ARG) && cliArgs.includes(SMOKE_ONLY_MODE_ARG)) {
            if (suite.smokeTestPath) {
                specs.push(suite.smokeTestPath);
            }
            
            continue;
        }

        if (suite.smokeOnly && suite.smokeTestPath) {
            specs.push(suite.smokeTestPath);
            continue;
        }

        if (!path) {
            continue;
        }

        specs.push(suite.path);
    }

    // Multiple specs should be covered by double quotes and has to comma separated.
    // ex: "./integration/applications/**/*, ./integration/email-templates/**/*"
    if (specs.length > 0) {
        command = `${command} --spec "${specs.join(",")}"`;
    }

    return command;
};

/**
 * Resolves the initial cypress command.
 * @return {string} Resolved Cypress test command.
 */
const resolveCypressCommand = () => {
    if (cliArgs.includes(INTERACTIVE_MODE_ARG) && cliArgs.includes(HEADLESS_MODE_ARG)) {
        throw Error("Interactive mode and Headless mode can not be selected at once.");
    }

    if (cliArgs.includes(INTERACTIVE_MODE_ARG)) {
        log.info("Cypress is running in interactive mode.");
        
        if (cliArgs.includes(SMOKE_ONLY_MODE_ARG)) {
            log.info("Smoke only mode is only supported when the tests are running in headless mode. " +
                "Hence, Ignoring......");
        }

        return "npm run cypress open";
    }

    log.info("Cypress is running in headless mode.");
    return "npm run cypress run --headless";
};

// Simple `execSync(constructTestCommand())` seems to hang the test runner for some reason.
// Looks like a known issue in windows setups https://github.com/cypress-io/cypress/issues/5241.
const execution = exec(constructTestCommand());

execution.stdout.pipe(process.stdout);
execution.on("exit", () => {
    process.exit();
});
