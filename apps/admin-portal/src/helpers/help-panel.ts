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

import yaml, { Schema } from "js-yaml";
import _ from "lodash";
import { ApplicationSampleInterface, PortalDocumentationStructureInterface } from "../models";

/**
 * Parses a raw YAML string to extract the portal document structure.
 *
 * @param {string} rawYAMLString - Raw YAML as a string.
 *
 * @return {PortalDocumentationStructureInterface} Parsed portal documentation structure.
 */
export const parsePortalDocumentationStructureYAML = (rawYAMLString: string): PortalDocumentationStructureInterface => {
    const parsedStructure = yaml.safeLoad(sanitizeYAMLString(rawYAMLString),
        { json: true, schema: getCustomYAMLSchema() });

    return convertYAMLArrayToObject<PortalDocumentationStructureInterface>(parsedStructure.nav);
};

/**
 * Converts the parsed YAML attributes which are in array form to objects.
 *
 * @example
 * // returns {"Applications": { "Overview": "overview.md", "Create Application": "new-application.md" }}
 * convertYAMLArrayToObject([{"applications": ["overview.md", { "createApplication": "new-application.md" }]}]);
 *
 * @param {object[]} parsed - Parsed doc structure.
 *
 * @return {T} Converted object.
 */
const convertYAMLArrayToObject = <T = {}>(parsed: object[]): T => {
    let formatted: T = null;

    if (!(parsed instanceof Array) || parsed.length < 1) {
        return formatted;
    }

    parsed.forEach((item) => {
        if (typeof item === "object") {
            for (const [key, value] of Object.entries(item)) {
                if (value instanceof Array) {
                    formatted = {
                        ...formatted,
                        [ key ]: convertYAMLArrayToObject(value)
                    }
                }
                if (typeof value === "string") {
                    formatted = {
                        ...formatted,
                        [ key ] : value
                    }
                }
            }
        } else if (typeof item === "string") {
            formatted = {
                ...formatted,
                [ "Overview" ]: item
            }
        }
    });

    return formatted;
};

/**
 * Get all the custom tags to help the parser.
 *
 * @return {Schema} Custom YAML schema.
 */
const getCustomYAMLSchema = (): Schema => {
    const customYamlType = new yaml.Type("!python/name:pymdownx.emoji.to_svg", { kind: "sequence" });
    return yaml.Schema.create([ customYamlType ]);
};

/**
 * Remove any inbuilt YAML types to avoid parsing errors.
 *
 * @param {string} raw - Raw YAML string.
 *
 * @return {string} Sanitized YAML string.
 */
const sanitizeYAMLString = (raw: string): string => {
    return raw.replace("!!", "");
};

/**
 * Generate the application samples for the help panel.
 *
 * @param {object} raw  - Set of samples.
 *
 * @return {ApplicationSampleInterface[]} Generated application samples.
 */
export const generateApplicationSamples = (raw: object): ApplicationSampleInterface[] => {
    if (typeof raw !== "object") {
        return [];
    }

    const samples: ApplicationSampleInterface[] = [];

    for (const [ key, value ] of Object.entries(raw)) {
        samples.push({
            displayName: key,
            docs: value.toString(),
            image: _.camelCase(key).toLowerCase(),
            name: _.camelCase(key).toLowerCase()
        })
    }

    return samples;
};
