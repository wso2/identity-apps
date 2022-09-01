/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
const lernaManifest = require("../lerna.json");

/**
 * TODO: Remove this once the logger is added.
 * Tracked here https://github.com/wso2/product-is/issues/11650.
 */
const logger = {
    // eslint-disable-next-line no-console
    debug: console.log,
    // eslint-disable-next-line no-console
    error: console.error,
    // eslint-disable-next-line no-console
    info: console.log
};

const debug = process.argv.indexOf("--debug") > -1 || true;        // CLI arg to set the debug mode.
const silent = process.argv.indexOf("--silent") > -1 || false;     // CLI arg to set the silent mode.
const verbose = process.argv.indexOf("--verbose") > -1;            // CLI arg to set the verbose mode.

const NYC_OUTPUT_DIR_NAME = ".nyc_output";
const NYC_OUTPUT_DIR_PATH = path.resolve(__dirname, "..", NYC_OUTPUT_DIR_NAME);
const AGGREGATED_COVERAGE_OUTPUT_DIR_NAME = "coverage";
const AGGREGATED_COVERAGE_OUTPUT_DIR_PATH = path.resolve(__dirname, "..", AGGREGATED_COVERAGE_OUTPUT_DIR_NAME);
const TEXT_REPORT_FILE_NAME = "report.txt";
const TEXT_REPORT_SUMMARY_NAME = "report-summary.txt";

const getPackageDirectories = () => {

    return lernaManifest.packages.map((packageName) => {
        // remove any asterisks
        packageName = packageName.replace("*", "");
        // remove any leading slashes
        packageName = packageName.startsWith("/")
            ? packageName.substr(1)
            : packageName;
        // remove any trailing slashes
        packageName = packageName.endsWith("/")
            ? packageName.substr(0, packageName.length - 1)
            : packageName;

        return packageName;
    });
};

/**
 * Creates a temp directory for all the reports
 */
const createTempDir = () => {

    if (debug) {
        logger.debug(`Creating a temp ${ NYC_OUTPUT_DIR_NAME } directory...`);
    }

    if (fs.existsSync(NYC_OUTPUT_DIR_PATH)) {
        return;
    }

    fs.mkdirSync(NYC_OUTPUT_DIR_PATH);
};

/**
 * Generate a report for each package and copies it to the temp reports dir
 */
const generateReports = () => {

    getPackageDirectories().forEach((packageDirectory) => {

        const packageDirPath = path.resolve(__dirname, "..", packageDirectory);

        fs.readdir(packageDirPath, (readError, items) => {
            if (readError) {
                if (!silent) {
                    logger.error("An error occurred while reading the packages", readError);
                }

                return;
            }

            items.forEach((item) => {
                const itemPath = path.resolve(packageDirPath, item);

                fs.stat(itemPath, (statsError, stats) => {
                    if (statsError) {
                        if (!silent) {
                            logger.error("An error occurred while reading the file status", statsError);
                        }
                    }

                    // if that item is a directory
                    if (stats.isDirectory()) {
                        try {
                            const targetFilePath = path.resolve(itemPath, "coverage", "coverage-final.json");

                            // Check if the report file exists and try to copy.
                            if (fs.existsSync(targetFilePath)) {
                                if (debug) {
                                    logger.debug(`Copying the coverage report of ${ item }...`);
                                }

                                const destFilePath = path.resolve(NYC_OUTPUT_DIR_PATH, `${ item }.json`);

                                fs.copyFileSync(targetFilePath, destFilePath);
                            }
                        } catch (error) {
                            if (!silent) {
                                logger.error("Failed to generate reports", error);
                            }
                        }
                    }
                });
            });
        });
    });
};

/**
 * Aggregate separate coverage reports.
 */
const aggregateReports = () => {

    // Collecting the Full Report.
    exec("pnpm nyc:full-report", (_, fullReport) => {

        // Collecting the Report Summary
        exec("nyc:text-summary-report", (_, reportSummary) => {
            if (debug) {
                logger.debug("\nWriting coverage summary to a file...");
            }

            if (verbose) {
                logger.info(reportSummary);
            }

            fs.writeFileSync(path.resolve(AGGREGATED_COVERAGE_OUTPUT_DIR_PATH, TEXT_REPORT_SUMMARY_NAME),
                reportSummary);

            if (debug) {
                logger.debug("\nWriting full coverage to a file...");
            }

            if (verbose) {
                logger.info(fullReport);
            }

            fs.writeFileSync(path.resolve(AGGREGATED_COVERAGE_OUTPUT_DIR_PATH, TEXT_REPORT_FILE_NAME), fullReport);
        });
    });
};

// Run
(() => {
    createTempDir();
    generateReports();
    aggregateReports();
})();
