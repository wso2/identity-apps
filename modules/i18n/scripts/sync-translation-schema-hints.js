/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

const TRANSLATIONS_PATH = path.join(__dirname, "..", "src", "translations");
const SCHEMA_INDEX_PATH = path.join(
    __dirname,
    "..",
    "src",
    "models",
    "schemas",
    "namespaces",
    "index.json"
);

// eslint-disable-next-line no-console
const log = console.log;

const SCHEMA_HINT_PREFIX = "../../../models/schemas/namespaces";

const getLocaleDirectories = () => {
    return fs.readdirSync(TRANSLATIONS_PATH).filter((entry) => {
        const entryPath = path.join(TRANSLATIONS_PATH, entry);

        return fs.statSync(entryPath).isDirectory() && fs.existsSync(path.join(entryPath, "meta.json"));
    });
};

const main = () => {
    log("Syncing JSON Schema hints for translation namespace files.");

    if (!fs.existsSync(SCHEMA_INDEX_PATH)) {
        log(`ERROR: Schema index file not found at ${SCHEMA_INDEX_PATH}`);
        process.exit(1);
    }

    const schemaIndex = JSON.parse(fs.readFileSync(SCHEMA_INDEX_PATH, "utf8"));
    const locales = getLocaleDirectories();
    let updatedFilesCount = 0;
    let processedFilesCount = 0;

    for (const locale of locales) {
        const metaFilePath = path.join(TRANSLATIONS_PATH, locale, "meta.json");
        const localeMeta = JSON.parse(fs.readFileSync(metaFilePath, "utf8"));
        const namespaces = localeMeta.namespaces || [];

        for (const namespace of namespaces) {
            const namespaceFilePath = path.join(TRANSLATIONS_PATH, locale, "portals", `${namespace}.json`);

            if (!fs.existsSync(namespaceFilePath)) {
                continue;
            }

            if (!schemaIndex[namespace]) {
                continue;
            }

            const raw = fs.readFileSync(namespaceFilePath, "utf8");
            const parsed = JSON.parse(raw);
            const schemaHint = `${SCHEMA_HINT_PREFIX}/${namespace}.schema.json`;
            const currentHint = parsed.$schema;

            processedFilesCount++;

            if (currentHint === schemaHint) {
                continue;
            }

            const { ...contentWithoutSchemaHint } = parsed;
            const updatedContent = {
                $schema: schemaHint,
                ...contentWithoutSchemaHint
            };

            fs.writeFileSync(namespaceFilePath, `${JSON.stringify(updatedContent, null, 4)}\n`);
            updatedFilesCount++;
        }
    }

    log(`Processed ${processedFilesCount} translation namespace files.`);
    log(`Updated ${updatedFilesCount} translation namespace files with schema hints.`);
};

main();
