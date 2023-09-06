/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
 * The following function returns the corresponding validation.
 * 
 * @returns Corresponding default validation.
 */
export const getValidation = (
    value: string | number | any,
    allValues: Record<string, unknown>,
    meta: string | number | any,
    required: boolean,
    validation?: (value: string | number | any, allValues: Record<string, unknown>) => any
): any => {

    const FIELD_REQUIRED_ERROR = "This field cannot be empty";

    if (!meta.modified) {
        return;
    }

    if (meta.modified && required && !value) {
        return FIELD_REQUIRED_ERROR;
    }

    if (!value) {
        return;
    }

    if (validation instanceof Promise) {
        validation(value, allValues).then((message: string) => {
            return message;
        });
    }

    if (typeof(validation) === "function") {
        
        return validation(value, allValues);
    }
    
};
