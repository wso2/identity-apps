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

import get from "lodash-es/get";
import set from "lodash-es/set";

/**
 * Convert templated property values into regex patterns.
 *
 * @param template - Templated property value.
 * @returns The regex pattern identifies the templated strings.
 */
const templateToRegex = (template: string): RegExp => {
    // Escape special regex characters in the template
    const escapedTemplate: string = template.replace(/[-\\^$*+?.,()|[\]{}]/g, "\\$&");

    // Replace ${variable} with a named capturing group pattern
    const regexString: string = escapedTemplate.replace(/\\\$\\\{([^}]+)\\\}/g, "(?<$1>.+)");

    // Create and return the regular expression object
    return new RegExp("^" + regexString + "$");
};

/**
 * Extract template strings from the current value.
 *
 * @param templateValue - Value defined in the template.
 * @param formValues - Object containing initial values for the form.
 * @param fieldName - Path of the field value within the object.
 * @param propertyPath - Path of the templated property.
 */
const extractTemplatedFields = (
    templateValue: string,
    formValues:Record<string, unknown>,
    fieldName: string,
    propertyPath: string
): void => {
    const currentValue: string = get(formValues, propertyPath) as string;

    if (currentValue && typeof currentValue === "string"
        && templateValue && typeof templateValue === "string") {
        const regex: RegExp = templateToRegex(templateValue);

        const match: RegExpMatchArray = currentValue.match(regex);

        set(formValues, fieldName, match?.groups?.[fieldName] ?? "");
    }
};

export default extractTemplatedFields;
