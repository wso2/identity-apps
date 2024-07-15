/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

/**
 * @fileoverview This script generates a table of contents (TOC) for a markdown file.
 * It reads the markdown file, generates the TOC, and updates the file with the TOC.
 *
 * Arguments:
 * - The file name for which the TOC should be generated.
 *
 * @example node scripts/generate-markdown-toc.js README.md
 * @example node scripts/generate-markdown-toc.js docs/README.md
 *
 * Usage:
 * Add the following placeholders in the markdown file where the TOC should be placed.
 * <!-- TOC:START - Do not remove or modify this section -->
 *
 * <!-- TOC:END -->
 */

const fs = require("fs");
const toc = require("markdown-toc");

const logger = console;

const args = process.argv.slice(2);
const fileName = args[0];

if (!fileName) {
    logger.error("Please provide a file name as an argument.");
    process.exit(1);
}

fs.readFile(fileName, "utf8", function (err, data) {
    if (err) {
        return logger.error("An error occurred in reading the file.", err);
    }

    const startPlaceholder = "<!-- TOC:START - Do not remove or modify this section -->";
    const endPlaceholder = "<!-- TOC:END -->";

    // Remove existing TOC
    const tocStartIndex = data.indexOf(startPlaceholder) + startPlaceholder.length;
    const tocEndIndex = data.indexOf(endPlaceholder);
    const existingToc = data.slice(tocStartIndex, tocEndIndex);

    data = data.replace(existingToc, "\n\n");

    // Generate new TOC
    const tocContent = toc(data, {
        filter: function (_, ele) {
            // Skip the TOC itself.
            return ele.content.includes("Table of Content") ? 0 : -1;
        },
        firsth1: false
    }).content;
    const updatedData = data.replace(
        `${startPlaceholder}\n\n${endPlaceholder}`,
        `${startPlaceholder}\n\n${tocContent}\n\n${endPlaceholder}`
    );

    fs.writeFile(fileName, updatedData, "utf8", function (err) {
        if (err) {
            return logger.error("An error occurred in writing to the file.", err);
        }
    });
});
