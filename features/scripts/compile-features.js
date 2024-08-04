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
/* eslint-disable no-console */

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

const mainFolder = path.resolve(__dirname, ".."); // Set to features folder

async function runRollup() {
    const subFolders = await getSubFolders(mainFolder);

    for (const folder of subFolders) {
        const hasPublicApi = await checkIfPublicApiExists(folder); // Check if public-api.ts exists

        if (!hasPublicApi) {
            console.log(`Skipping ${folder} as it does not contain public-api.ts`);

            continue;
        }

        const isBundled = await checkIfBundled(folder); // Check if rollup compiled

        if (!isBundled) {
            await runCommand(folder, "pnpm rollup -c"); // Run rollup if not compiled
        }
    }
}

async function getSubFolders(rootFolder) {
    const dirents = await fs.readdir(rootFolder, { withFileTypes: true });

    return dirents
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(rootFolder, dirent.name));
}

async function checkIfPublicApiExists(folder) {
    const publicApiPath = path.join(folder, "public-api.ts");

    return await fs.pathExists(publicApiPath);
}

async function checkIfBundled(folder) {
    const distFilePath = path.join(folder, "dist", "esm", "public-api.js");
    const packageJsonPath = path.join(folder, "package.json");

    return (await fs.pathExists(distFilePath)) && (await fs.pathExists(packageJsonPath));
}

async function runCommand(folder, command) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: folder }, (err, stdout) => {
            if (err) {
                console.error(`Error bundling ${folder}:`, err);
                reject(err);
            } else {
                console.log(`Bundled successfully - ${folder}:`, stdout);
                resolve();
            }
        });
    });
}

runRollup().catch(err => console.error("Error:", err));
