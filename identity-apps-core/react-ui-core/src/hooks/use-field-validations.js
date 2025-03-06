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

const useFieldValidation = (validationConfig) => {

    const [ fieldErrors, setFieldErrors ] = useState([]);

    const validateCriterion = useCallback((criterion, value) => {
        switch (criterion.type) {
            case "REQUIRED":
                if (!value) {
                    return criterion.error || "This field is required.";
                }

                break;

            case "MIN_LENGTH":
                if (value.length < criterion.value) {
                    return criterion.error || `Must be at least ${criterion.value} characters long.`;
                }

                break;

            case "MAX_LENGTH":
                if (value.length > criterion.value) {
                    return criterion.error || `Must be at most ${criterion.value} characters long.`;
                }

                break;

            case "PATTERN":
                if (!new RegExp(criterion.value).test(value)) {
                    return criterion.error || "Invalid pattern.";
                }

                break;

            case "MIN_NUMBERS":
                if ((value.match(/[0-9]/g) || []).length < criterion.value) {
                    return criterion.error || `Must contain at least ${criterion.value} number(s).`;
                }

                break;

            case "MIN_UPPERCASE_LETTERS":
                if ((value.match(/[A-Z]/g) || []).length < criterion.value) {
                    return criterion.error || `Must contain at least ${criterion.value} uppercase letter(s).`;
                }

                break;

            case "MIN_LOWERCASE_LETTERS":
                if ((value.match(/[a-z]/g) || []).length < criterion.value) {
                    return criterion.error || `Must contain at least ${criterion.value} lowercase letter(s).`;
                }

                break;

            case "MIN_SPECIAL_CHARACTERS":
                if ((value.match(/[^a-zA-Z0-9]/g) || []).length < criterion.value) {
                    return criterion.error || `Must contain at least ${criterion.value} special character(s).`;
                }

                break;

            case "MAX_REPEATED_CHARACTERS":
                {
                    const repeatedChars = value.split("").filter((char, i, arr) => arr.indexOf(char) !== i);

                    if (repeatedChars.length > criterion.value) {
                        return criterion.error || "Must not contain repeated characters.";
                    }
                }

                break;

            default:
                break;
        }

        return null;
    }, []);

    const validate = useCallback((config, value) => {
        let validationErrors = [];

        if (validationConfig) {
            if (validationConfig.type === "CRITERIA" && validationConfig.criteria) {
                for (const criterion of validationConfig.criteria) {
                    for (const validation of criterion.validation) {
                        const error = validateCriterion(validation, value);

                        if (error) {
                            validationErrors.push({
                                error,
                                label: criterion.label
                            });
                        }
                    }
                }
            } else {
                const error = validateCriterion(validationConfig, value);

                if (error) {
                    validationErrors.push({
                        error,
                        label: validationConfig.label
                    });
                }
            }
        }

        if (config.required && !value) {
            validationErrors.push({
                error: "This field is required.",
                label: config.name
            });
        }

        setFieldErrors(validationErrors);

        return validationErrors.length === 0;
    }, [ validationConfig, validateCriterion ]);

    return { fieldErrors, validate };
};

export default useFieldValidation;
