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

/**
 * Check if the field is filled with a value.
 *
 * @param value - The value need to be validated.
 * @returns Whether the provided value is a non empty value.
 */
const requiredField = (value: unknown): string | null => {
    if (!value) {
        return "templateCore:forms.resourceCreateWizard.common.validations.required";
    }

    return null;
};

export default requiredField;
