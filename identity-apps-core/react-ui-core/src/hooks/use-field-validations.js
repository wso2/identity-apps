/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { useCallback, useState } from "react";
import { validateEmail } from "../utils/validation-utils";

/**
 * A custom hook for validating form fields using a flexible “rules” approach.
 *
 * @param {object} config - The component config, including:
 *   - required: boolean (if the field is mandatory)
 *   - validations: an array of validation group arrays (e.g. [[rule1, rule2], [rule3]])
 *   - name: a unique name/identifier for the field
 * @returns {{ fieldErrors: string[], validate: (value: string) => boolean }}
 */
const useFieldValidation = (validationConfig) => {
    const [ fieldErrors, setFieldErrors ] = useState([]);

    /**
     * Utility: Extract a numeric condition (e.g. "min.length") from the conditions array.
     */
    const getNumCondition = (conditions = [], conditionKey) => {
        const found = conditions.find(cond => cond.key === conditionKey);

        return found ? parseInt(found.value, 10) : null;
    };

    /**
     * Utility: Extract a string condition (e.g. "pattern") from the conditions array.
     */
    const getStrCondition = (conditions = [], conditionKey) => {
        const found = conditions.find(cond => cond.key === conditionKey);

        return found ? found.value : null;
    };

    /**
     * Validate a single rule object (e.g. { type: "RULE", name: "LengthValidator", conditions: [...] }).
     * Return an error message if invalid, or `null` if valid.
     */
    const validateRule = useCallback((rule, value, compareValue) => {
        if (rule.type !== "RULE") return null;

        const { name, conditions } = rule;

        console.log("rule", rule);

        switch (name) {
            case "LengthValidator": {
                const minLen = getNumCondition(conditions, "min.length");
                const maxLen = getNumCondition(conditions, "max.length");

                if (minLen && maxLen) {
                    if (value.length < minLen || value.length > maxLen) {
                        return `Must be between ${minLen} and ${maxLen} characters long.`;
                    }
                }
                else if (minLen) {
                    if (value.length < minLen) {
                        return `Must be at least ${minLen} characters long.`;
                    }
                }
                else if (maxLen) {
                    if (value.length > maxLen) {
                        return `Must be at most ${maxLen} characters long.`;
                    }
                }

                break;
            }

            case "NumeralValidator": {
                const minNumbers = getNumCondition(conditions, "min.length");

                if (minNumbers) {
                    const digitCount = (value.match(/\d/g) || []).length;

                    if (digitCount < minNumbers) {
                        return `Must contain at least ${minNumbers} number(s).`;
                    }
                }

                break;
            }

            case "UpperCaseValidator": {
                const minUpper = getNumCondition(conditions, "min.length");

                if (minUpper) {
                    const upperCount = (value.match(/[A-Z]/g) || []).length;

                    if (upperCount < minUpper) {
                        return `Must contain at least ${minUpper} uppercase letter(s).`;
                    }
                }

                break;
            }

            case "LowerCaseValidator": {
                const minLower = getNumCondition(conditions, "min.length");

                if (minLower) {
                    const lowerCount = (value.match(/[a-z]/g) || []).length;

                    if (lowerCount < minLower) {
                        return `Must contain at least ${minLower} lowercase letter(s).`;
                    }
                }

                break;
            }

            case "SpecialCharacterValidator": {
                const minSpecial = getNumCondition(conditions, "min.length");

                if (minSpecial && minSpecial > 0) {
                    const specialCount = (value.match(/[^a-zA-Z0-9]/g) || []).length;

                    if (specialCount < minSpecial) {
                        return `Must contain at least ${minSpecial} special character(s).`;
                    }
                }

                break;
            }

            case "RegexValidator": {
                const pattern = getStrCondition(conditions, "pattern");

                if (pattern) {
                    const re = new RegExp(pattern);

                    if (!re.test(value)) {
                        return "Invalid format.";
                    }
                }

                break;
            }

            case "PhoneNumberValidator": {
                const pattern = getStrCondition(conditions, "pattern");

                if (pattern) {
                    const re = new RegExp(pattern);

                    if (!re.test(value)) {
                        return "Please enter a valid phone number.";
                    }
                }

                break;
            }

            case "ConfirmPasswordValidator": {
                if (value !== compareValue) {
                    return "Must match with the password.";
                }

                break;
            }

            case "EmailFormatValidator": {
                const emailPattern = "^([a-zA-Z0-9!#$'\\+=^_\\.{|}~\\-&])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,10})+$";

                if (!validateEmail(value, emailPattern)) {
                    return "Must use a valid email address.";
                }

                break;
            }


            default:
                return null;
        }

        return null;
    }, []);

    /**
     * Validate the given `value` using the config’s required property
     * and all rule arrays in config.validations.
     */
    const validate = useCallback((config, value, compareValue) => {
        const validationErrors = [];

        if (config.required && !value) {
            validationErrors.push("This field is required.");
        }

        const validations = validationConfig || [];

        for (const rule of validations) {
            const error = validateRule(rule, value, compareValue);

            if (error) {
                validationErrors.push(error);
            }
        }

        setFieldErrors(validationErrors);

        return validationErrors.length === 0;
    }, [ validationConfig, validateRule ]);

    return { fieldErrors, validate };
};

export default useFieldValidation;
