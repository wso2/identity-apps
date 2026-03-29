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

/**
 * Validates all locale translation JSON files against their generated JSON Schemas.
 *
 * This script is part of the `validate:translations` pipeline:
 *
 *   pnpm sync:translation-schema-hints   — injects/updates "$schema" hints in every locale file
 *   pnpm generate:translation-schemas    — (re)generates schemas from the en-US source-of-truth
 *   node scripts/validate-namespace-schemas.js  ← this script
 *
 * The pipeline is gated into the `build` script, so any locale file that violates its
 * namespace schema will fail the build before compilation begins.
 *
 * NOTE: Translation files carry a "$schema" hint as their first key (used by IDEs for
 * real-time validation). This script strips that key before validating so it does not
 * produce false "unexpected property" errors against `additionalProperties: false` schemas.
 */

const fs = require("fs");
const path = require("path");

const TRANSLATIONS_PATH = path.join(__dirname, "..", "src", "translations");
const SCHEMA_PATH = path.join(__dirname, "..", "src", "models", "schemas", "namespaces");

// eslint-disable-next-line no-console
const log = console.log;
// eslint-disable-next-line no-console
const error = console.error;

const normalizeType = (value) => {
    if (Array.isArray(value)) {
        return "array";
    }

    if (value === null) {
        return "null";
    }

    return typeof value;
};

const isTypeMatch = (schemaType, value) => {
    const valueType = normalizeType(value);

    return schemaType === valueType;
};

const validateWithSchema = (schema, value, valuePath, errors) => {
    if (!schema || Object.keys(schema).length === 0) {
        return;
    }

    if (schema.anyOf && Array.isArray(schema.anyOf)) {
        const branchErrors = [];
        let matched = false;

        for (const candidateSchema of schema.anyOf) {
            const candidateErrors = [];

            validateWithSchema(candidateSchema, value, valuePath, candidateErrors);

            if (candidateErrors.length === 0) {
                matched = true;

                break;
            }

            branchErrors.push(candidateErrors);
        }

        if (!matched) {
            errors.push(`${valuePath}: value does not match anyOf schema variants.`);
            branchErrors.flat().forEach((branchError) => {
                errors.push(`  ${branchError}`);
            });
        }

        return;
    }

    if (schema.type && !isTypeMatch(schema.type, value)) {
        errors.push(`${valuePath}: expected type ${schema.type}, found ${normalizeType(value)}.`);

        return;
    }

    if (schema.type === "object") {
        const properties = schema.properties || {};
        const required = schema.required || [];

        for (const requiredKey of required) {
            if (!Object.prototype.hasOwnProperty.call(value, requiredKey)) {
                errors.push(`${valuePath}: missing required key "${requiredKey}".`);
            }
        }

        if (schema.additionalProperties === false) {
            for (const actualKey of Object.keys(value)) {
                if (!Object.prototype.hasOwnProperty.call(properties, actualKey)) {
                    errors.push(`${valuePath}: unexpected key "${actualKey}".`);
                }
            }
        }

        for (const [ key, childSchema ] of Object.entries(properties)) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                validateWithSchema(childSchema, value[key], `${valuePath}.${key}`, errors);
            }
        }
    }

    if (schema.type === "array") {
        const itemSchema = schema.items;

        for (let i = 0; i < value.length; i++) {
            validateWithSchema(itemSchema, value[i], `${valuePath}[${i}]`, errors);
        }
    }
};

const getLocaleDirectories = () => {
    return fs.readdirSync(TRANSLATIONS_PATH).filter((entry) => {
        const entryPath = path.join(TRANSLATIONS_PATH, entry);
        const metaPath = path.join(entryPath, "meta.json");

        return fs.statSync(entryPath).isDirectory() && fs.existsSync(metaPath);
    });
};

const loadSchemas = () => {
    if (!fs.existsSync(SCHEMA_PATH)) {
        throw new Error(`Schema directory not found: ${SCHEMA_PATH}`);
    }

    const schemaFiles = fs.readdirSync(SCHEMA_PATH).filter((fileName) => fileName.endsWith(".schema.json"));
    const schemas = {};

    for (const schemaFileName of schemaFiles) {
        const namespace = schemaFileName.replace(".schema.json", "");
        const schemaFilePath = path.join(SCHEMA_PATH, schemaFileName);

        schemas[namespace] = JSON.parse(fs.readFileSync(schemaFilePath, "utf8"));
    }

    return schemas;
};

const stripSchemaHint = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return value;
    }

    // eslint-disable-next-line no-unused-vars
    const { $schema: _, ...withoutSchemaHint } = value;

    return withoutSchemaHint;
};

const validateLocaleNamespace = (locale, namespace, schema, allErrors) => {
    const namespaceFilePath = path.join(TRANSLATIONS_PATH, locale, "portals", `${namespace}.json`);

    if (!fs.existsSync(namespaceFilePath)) {
        allErrors.push(`${locale}:${namespace} -> missing file ${namespaceFilePath}`);

        return;
    }

    const content = JSON.parse(fs.readFileSync(namespaceFilePath, "utf8"));
    const contentWithoutSchemaHint = stripSchemaHint(content);
    const errors = [];

    validateWithSchema(schema, contentWithoutSchemaHint, "$", errors);

    errors.forEach((schemaError) => {
        allErrors.push(`${locale}:${namespace} -> ${schemaError}`);
    });
};

const main = () => {
    log("Validating locale namespaces against JSON schemas.");

    if (!fs.existsSync(TRANSLATIONS_PATH)) {
        error(`ERROR: Translations directory not found: ${TRANSLATIONS_PATH}`);
        process.exit(1);
    }

    let schemas = {};

    try {
        schemas = loadSchemas();
    } catch (schemaError) {
        error(`ERROR: ${schemaError.message}`);
        error("Hint: Run `pnpm generate:translation-schemas` first.");
        process.exit(1);
    }

    const localeDirectories = getLocaleDirectories();
    const allErrors = [];
    let validatedNamespaceCount = 0;

    for (const locale of localeDirectories) {
        const metaFilePath = path.join(TRANSLATIONS_PATH, locale, "meta.json");
        const meta = JSON.parse(fs.readFileSync(metaFilePath, "utf8"));
        const namespaces = meta.namespaces || [];

        for (const namespace of namespaces) {
            const schema = schemas[namespace];

            if (!schema) {
                allErrors.push(`${locale}:${namespace} -> missing schema for namespace.`);

                continue;
            }

            validateLocaleNamespace(locale, namespace, schema, allErrors);
            validatedNamespaceCount++;
        }
    }

    if (allErrors.length > 0) {
        error("\nTranslation schema validation failed:\n");
        allErrors.forEach((validationError) => error(`- ${validationError}`));
        process.exit(1);
    }

    log(`Validated ${validatedNamespaceCount} locale namespace files successfully.`);
};

main();
