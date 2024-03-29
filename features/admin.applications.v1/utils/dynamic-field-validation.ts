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

import { ValidationRule, ValidationRuleTypes } from "../models/dynamic-fields";

/**
 * Validate the provided value against the provided validation rules.
 *
 * value - The value needs validation.
 * validations - Validation rules.
 * @returns If the validation fails, return the corresponding error message; otherwise, return null.
 */
const validateField = (value: string, validations: ValidationRule[]): string => {
    if (!validations) {
        return null;
    }

    for (const validation of validations) {
        const { type, errorMessage } = validation;

        switch (type) {
            case ValidationRuleTypes.DOMAIN_NAME:
                if (!validateDomainName(value)) {
                    return errorMessage;
                }
        }
    }

    // If all validation rules are successful, return null for the errorMessage.
    return null;
};

/**
 * Verify if the provided value is a domain name.
 *
 * value - The value needs validation.
 * @returns Whether the provided value is a valid domain name or not.
 */
const validateDomainName = (value: string): boolean => {
    // Regular expression to validate domain name.
    const domainRegex: RegExp = /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/;

    // Test if the provided value matches the domain name regex.
    return domainRegex.test(value);
};

export default validateField;
