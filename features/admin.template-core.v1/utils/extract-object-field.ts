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

import get from "lodash-es/get";
import set from "lodash-es/set";
import unset from "lodash-es/unset";

/**
 * Extract flattened key-value pairs and collapse them into a single object field.
 *
 * @param formValues - Object containing form values.
 * @param fieldName - Base field name to collapse into.
 */
const extractObjectField = (
    formValues: Record<string, unknown>,
    fieldName: string
): void => {
    const collapsedObject: Record<string, unknown> = {};
    const keysToRemove: string[] = [];

    // Find all keys that start with "fieldName:"
    for (const key of Object.keys(formValues)) {
        if (key.startsWith(`${fieldName}:`)) {
            const objectKey: string = key.substring(fieldName.length + 1);
            const value: unknown = get(formValues, key);

            collapsedObject[objectKey] = value;
            keysToRemove.push(key);
        }
    }

    // If we found expanded fields, collapse them into a single object
    if (Object.keys(collapsedObject).length > 0) {
        set(formValues, fieldName, collapsedObject);

        // Remove the expanded fields
        keysToRemove.forEach((key: string) => {
            unset(formValues, key);
        });
    }
};

export default extractObjectField;
