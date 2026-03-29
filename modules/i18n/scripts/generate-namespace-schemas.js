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

const EN_US_PORTALS_PATH = path.join(__dirname, "..", "src", "translations", "en-US", "portals");
const OUTPUT_DIR_PATH = path.join(__dirname, "..", "src", "models", "schemas", "namespaces");
const INDEX_FILE_NAME = "index.json";

// eslint-disable-next-line no-console
const log = console.log;

const normalizeType = (value) => {
    if (Array.isArray(value)) {
        return "array";
    }

    if (value === null) {
        return "null";
    }

    return typeof value;
};

const createSchemaForValue = (value) => {
    const type = normalizeType(value);

    if (type === "string") {
        return { type: "string" };
    }

    if (type === "number") {
        return { type: "number" };
    }

    if (type === "boolean") {
        return { type: "boolean" };
    }

    if (type === "null") {
        return {
            anyOf: [
                { type: "null" },
                { type: "string" }
            ]
        };
    }

    if (type === "array") {
        if (value.length === 0) {
            return {
                items: {},
                type: "array"
            };
        }

        const itemSchemas = value.map((item) => JSON.stringify(createSchemaForValue(item)));
        const uniqueSchemaStrings = [ ...new Set(itemSchemas) ];

        if (uniqueSchemaStrings.length === 1) {
            return {
                items: JSON.parse(uniqueSchemaStrings[0]),
                type: "array"
            };
        }

        return {
            items: {
                anyOf: uniqueSchemaStrings.map((schema) => JSON.parse(schema))
            },
            type: "array"
        };
    }

    if (type === "object") {
        const entries = Object.entries(value);
        const properties = {};
        const required = [];

        for (const [ key, nestedValue ] of entries) {
            properties[key] = createSchemaForValue(nestedValue);
            required.push(key);
        }

        return {
            additionalProperties: false,
            properties,
            required,
            type: "object"
        };
    }

    return {};
};

const createNamespaceSchema = (namespace, resource) => {
    const schema = createSchemaForValue(resource);

    if (schema.type === "object") {
        schema.properties = {
            $schema: {
                type: "string"
            },
            ...(schema.properties || {})
        };
    }

    return {
        $id: `https://wso2is.dev/i18n/schemas/namespaces/${namespace}.schema.json`,
        $schema: "https://json-schema.org/draft/2020-12/schema",
        ...schema,
        title: `${namespace} namespace translation schema`
    };
};

const stripSchemaHint = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return value;
    }

    const { ...withoutSchemaHint } = value;

    return withoutSchemaHint;
};

const cleanOldSchemas = () => {
    if (!fs.existsSync(OUTPUT_DIR_PATH)) {
        fs.mkdirSync(OUTPUT_DIR_PATH, { recursive: true });

        return;
    }

    const files = fs.readdirSync(OUTPUT_DIR_PATH);

    for (const fileName of files) {
        if (fileName.endsWith(".schema.json") || fileName === INDEX_FILE_NAME) {
            fs.rmSync(path.join(OUTPUT_DIR_PATH, fileName), { force: true });
        }
    }
};

const main = () => {
    log("Generating i18n namespace schemas from en-US resources.");

    if (!fs.existsSync(EN_US_PORTALS_PATH)) {
        log(`ERROR: Could not find source namespace directory: ${EN_US_PORTALS_PATH}`);
        process.exit(1);
    }

    cleanOldSchemas();

    const namespaceFiles = fs.readdirSync(EN_US_PORTALS_PATH)
        .filter((fileName) => fileName.endsWith(".json"))
        .sort();

    const schemaIndex = {};

    for (const namespaceFileName of namespaceFiles) {
        const namespace = path.basename(namespaceFileName, ".json");
        const namespaceSourcePath = path.join(EN_US_PORTALS_PATH, namespaceFileName);
        const namespaceContent = JSON.parse(fs.readFileSync(namespaceSourcePath, "utf8"));
        const namespaceContentWithoutSchemaHint = stripSchemaHint(namespaceContent);
        const schema = createNamespaceSchema(namespace, namespaceContentWithoutSchemaHint);
        const schemaFileName = `${namespace}.schema.json`;
        const schemaOutputPath = path.join(OUTPUT_DIR_PATH, schemaFileName);

        fs.writeFileSync(schemaOutputPath, JSON.stringify(schema, null, 4));

        schemaIndex[namespace] = `./${schemaFileName}`;

        log(`Generated schema: ${schemaFileName}`);
    }

    fs.writeFileSync(path.join(OUTPUT_DIR_PATH, INDEX_FILE_NAME), JSON.stringify(schemaIndex, null, 4));

    log(`Generated ${namespaceFiles.length} namespace schemas.`);
};

main();
