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

import PropTypes from "prop-types";
import React from "react";
import { useTranslations } from "../hooks/use-translations";
import { t } from "../utils/i18n-utils";

/**
 * A helper that looks up a condition in `rule.conditions` by key,
 * then tries to interpret the string value:
 * - "true" -> true
 * - "false" -> false
 * - numeric -> parseInt(...)
 * - otherwise -> the original string
 *
 * Returns `null` if no matching key is found.
 */
const getConditionValue = (rule, key) => {
    const found = rule.conditions.find((condition) => condition.key === key);

    if (!found) {
        return null;
    }

    const rawValue = found.value;

    if (rawValue === "true") {
        return true;
    }
    if (rawValue === "false") {
        return false;
    }

    const asNumber = parseInt(rawValue, 10);

    if (!isNaN(asNumber)) {
        return asNumber;
    }

    return rawValue;
};

export const getRuleLabel = (rule, translations = {}) => {
    if (rule.label) {
        return rule.label;
    }

    const minLen = getConditionValue(rule, "min.length");
    const maxLen = getConditionValue(rule, "max.length");
    const confirmPassword = getConditionValue(rule, "confirm.password");
    const isValidatorEnabled = getConditionValue(rule, "enable.validator");
    const minUniqueChars = getConditionValue(rule, "min.unique.character");
    const maxRepeatedChars = getConditionValue(rule, "max.consecutive.character");

    switch (rule.name) {
        case "LengthValidator":
            if (minLen && maxLen) {
                return t(
                    translations,
                    "validation.criteria.LengthValidator.minAndMax",
                    { max: maxLen, min: minLen },
                    `Must be between ${minLen} and ${maxLen} characters long.`
                );
            } else if (minLen) {
                return t(
                    translations,
                    "validation.criteria.LengthValidator.minOnly",
                    { min: minLen },
                    `Must be at least ${minLen} characters long.`
                );
            } else if (maxLen) {
                return t(
                    translations,
                    "validation.criteria.LengthValidator.maxOnly",
                    { max: maxLen },
                    `Must be at most ${maxLen} characters long.`
                );
            }

            return t(translations, "validation.criteria.LengthValidator.default", null,
                "Must be within the required length.");

        case "NumeralValidator":
            if (minLen) {
                return t(
                    translations,
                    "validation.criteria.NumeralValidator.minOnly",
                    { min: minLen },
                    `Must contain at least ${minLen} number(s).`
                );
            }

            return t(translations, "validation.criteria.NumeralValidator.default", null,
                "Must contain the required number(s).");

        case "UpperCaseValidator":
            if (minLen) {
                return t(
                    translations,
                    "validation.criteria.UpperCaseValidator.minOnly",
                    { min: minLen },
                    `Must contain at least ${minLen} uppercase letter(s).`
                );
            }

            return t(translations, "validation.criteria.UpperCaseValidator.default", null,
                "Must contain uppercase letter(s).");

        case "LowerCaseValidator":
            if (minLen) {
                return t(
                    translations,
                    "validation.criteria.LowerCaseValidator.minOnly",
                    { min: minLen },
                    `Must contain at least ${minLen} lowercase letter(s).`
                );
            }

            return t(translations, "validation.criteria.LowerCaseValidator.default", null,
                "Must contain lowercase letter(s).");

        case "SpecialCharacterValidator":
            if (minLen && minLen > 0) {
                return t(
                    translations,
                    "validation.criteria.SpecialCharacterValidator.minOnly",
                    { min: minLen },
                    `Must contain at least ${minLen} special character(s).`
                );
            }

            break;
        case "ConfirmPasswordValidator":
            if (confirmPassword) {
                return t(translations, "validation.criteria.ConfirmPasswordValidator.match", null,
                    "Must match with the password.");
            }

            return null;

        case "EmailFormatValidator":
            if (isValidatorEnabled) {
                return t(translations, "validation.criteria.EmailFormatValidator.format", null,
                    "Must use a valid email address.");
            }

            return null;

        case "AlphanumericValidator":
            if (isValidatorEnabled) {
                return t(translations, "validation.criteria.AlphanumericValidator.format", null,
                    "Must contain only alphanumeric characters.");
            }

            return null;

        case "UniqueCharacterValidator":
            if (minUniqueChars) {
                return t(
                    translations,
                    "validation.criteria.UniqueCharacterValidator.minOnly",
                    { min: minUniqueChars },
                    `Must contain at least ${minUniqueChars} unique character(s).`
                );
            }

            return null;

        case "RepeatedCharacterValidator":
            if (maxRepeatedChars) {
                return t(
                    translations,
                    "validation.criteria.RepeatedCharacterValidator.maxOnly",
                    { max: maxRepeatedChars },
                    `Must not contain more than ${maxRepeatedChars} repeated character(s).`
                );
            }

            return null;

        default:
            return null;
    }
};

/**
 * The small icon or status element, showing neutral, pass, or fail.
 */
const PolicyValidationStatus = ({ value, isValid }) => {
    if (value.length === 0) {
        return <i className="inverted grey circle icon"></i>;
    }

    return isValid
        ? <i className="circle icon green check"></i>
        : <i className="circle icon red times"></i>;
};

const ValidationCriteria = ({ validationConfig, errors = [], value = "" }) => {
    const { translations } = useTranslations();

    return (
        <div className="validation-criteria mt-1">
            { Array.isArray(validationConfig) && validationConfig.length > 0 && (
                validationConfig.map((rule, ruleIndex) => {
                    const label = getRuleLabel(rule, translations);

                    if (!label) {
                        return null;
                    }

                    const hasError = errors.some((err) => err.includes(label));

                    return (
                        <div key={ ruleIndex } className="mt-1">
                            <div className="password-policy-description mb-2">
                                <PolicyValidationStatus
                                    value={ value }
                                    isValid={ !hasError }
                                />
                                <p className="pl-4">{ label }</p>
                            </div>
                        </div>
                    );
                })
            ) }
        </div>
    );
};

PolicyValidationStatus.propTypes = {
    isValid: PropTypes.boolean,
    value: PropTypes.string
};

ValidationCriteria.propTypes = {
    errors: PropTypes.array,
    validationConfig: PropTypes.array,
    value: PropTypes.string
};

export default ValidationCriteria;
