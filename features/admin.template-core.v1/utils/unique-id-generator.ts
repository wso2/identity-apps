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
import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique ID and replace the templated placeholder with it.
 *
 * @param templateValue - Value defined in the template.
 * @param formValues - Object containing initial values for the form.
 * @param fieldName - Path of the field value within the object.
 * @param placeholder - Placeholder that needs to be replaced.
 */
const uniqueIDGenerator = (
    templateValue: string,
    formValues:Record<string, unknown>,
    fieldName: string,
    placeholder: string
): void => {
    const currentValue: any = get(formValues, fieldName);

    if (currentValue && typeof currentValue === "string" && currentValue.includes(`\${${placeholder}}`)) {
        set(formValues, fieldName, currentValue?.replace(`\${${placeholder}}`, uuidv4()));
    } else if (templateValue && typeof templateValue === "string") {
        set(formValues, fieldName, templateValue?.replace(`\${${placeholder}}`, uuidv4()));
    }
};

export default uniqueIDGenerator;
