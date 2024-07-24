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
import unset from "lodash-es/unset";

/**
 * Replace placeholders of templated properties.
 *
 * @param templateValue - Value defined in the template.
 * @param formValues - Object containing initial values for the form.
 * @param fieldName - Path of the field value within the object.
 * @param propertyPath - Path of the templated property.
 */
const templatedProperty = (
    templateValue: string,
    formValues:Record<string, unknown>,
    fieldName: string,
    propertyPath: string
): void => {
    const currentValue: any = get(formValues, propertyPath);
    const placeholderValue: any = get(formValues, fieldName);

    if (placeholderValue && typeof placeholderValue === "string") {
        if (currentValue && typeof currentValue === "string" && currentValue.includes(`\${${fieldName}}`)) {
            set(formValues, propertyPath, currentValue?.replace(`\${${fieldName}}`, placeholderValue));
        } else if (templateValue && typeof templateValue === "string") {
            set(formValues, propertyPath, templateValue?.replace(`\${${fieldName}}`, placeholderValue));
        }
        unset(formValues, fieldName);
    }
};

export default templatedProperty;
