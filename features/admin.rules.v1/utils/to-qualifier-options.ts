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
 * One selectable qualifier, as the autocomplete consumes it.
 */
interface QualifierListOptionInterface {
    /**
     * The qualifier saved in the rule.
     */
    id: string;
    /**
     * Label shown for the qualifier.
     */
    label: string;
}

/**
 * Whether a value is a plain object, as each listed resource is.
 *
 * @param value - The value to check.
 * @returns True if the value is a non-null object that is not an array.
 */
const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Reads the list out of a qualifier's linked endpoint response.
 *
 * @param resources - The endpoint's response.
 * @returns The listed resources, or an empty list.
 */
export const toResourceList = (resources: unknown): Record<string, unknown>[] => {
    if (!resources || typeof resources !== "object") {
        return [];
    }

    // A response can hold other arrays besides its list, such as the `schemas` a SCIM list starts with, so the list
    // is the first array that holds resources.
    const list: unknown[] = Array.isArray(resources)
        ? resources
        : Object.values(resources).find((candidate: unknown): candidate is unknown[] =>
            Array.isArray(candidate) && candidate.some(isRecord))
            ?? [];

    return list.filter(isRecord);
};

/**
 * Finds the resource a stored qualifier refers to.
 *
 * @param resources          - The endpoint's response.
 * @param referenceAttribute - Attribute holding the stored qualifier.
 * @param qualifier          - The stored qualifier.
 * @returns The resource, or undefined when it is not listed.
 */
export const findQualifierResource = (
    resources: unknown,
    referenceAttribute: string,
    qualifier: string
): Record<string, unknown> | undefined => {
    if (!qualifier) {
        return undefined;
    }

    return toResourceList(resources).find((resource: Record<string, unknown>) =>
        resource?.[referenceAttribute] === qualifier);
};

/**
 * Turns the response of a qualifier's linked endpoint into selectable options.
 *
 * @param resources          - The endpoint's response.
 * @param referenceAttribute - Attribute holding the value to store.
 * @param displayAttribute   - Attribute holding the label to show.
 * @returns The options, sorted by label.
 */
const toQualifierOptions = (
    resources: unknown,
    referenceAttribute: string,
    displayAttribute: string
): QualifierListOptionInterface[] => {
    const options: QualifierListOptionInterface[] = [];

    for (const resource of toResourceList(resources)) {
        const id: unknown = resource[referenceAttribute];
        const label: unknown = resource[displayAttribute];

        if (typeof id === "string" && id) {
            options.push({ id, label: typeof label === "string" && label ? label : id });
        }
    }

    return options.sort((a: QualifierListOptionInterface, b: QualifierListOptionInterface) =>
        (a.label > b.label ? 1 : -1));
};

export default toQualifierOptions;
