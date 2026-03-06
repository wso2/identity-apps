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
 * Expand object field into multiple flattened key-value pairs.
 *
 * @param formValues - Object containing form values.
 * @param fieldName - Path of the field value within the object.
 * @param delimiter - Delimiter to use between the base field name and the object keys.
 */
const expandObjectFields = (
    formValues: Record<string, unknown>,
    fieldName: string,
    delimiter: string = ":"
): void => {
    const fieldValue: unknown = get(formValues, fieldName);

    if (fieldValue && typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
        const objectValue: Record<string, unknown> = fieldValue as Record<string, unknown>;

        // Expand each key-value pair in the object
        for (const [ key, value ] of Object.entries(objectValue)) {
            const expandedKey: string = `${fieldName}${delimiter}${key}`;

            set(formValues, expandedKey, value);
        }
        // Remove the original object field
        unset(formValues, fieldName);
    }
};

export default expandObjectFields;
