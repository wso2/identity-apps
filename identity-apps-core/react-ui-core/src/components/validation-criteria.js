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

/**
 * Parse a numeric condition from rule.conditions, if present.
 *
 * @param {object} rule - The rule object containing conditions.
 * @param {string} key - The conditions key to search for (e.g. "min.length").
 * @returns {number|null} The numeric value or null if not found.
 */
const getConditionValue = (rule, key) => {
    const found = rule?.conditions?.find((cond) => cond.key === key);
    return found ? parseInt(found.value, 10) : null;
};

export const getRuleLabel = (rule) => {
    // If the rule has a custom label, return it directly.
    if (rule.label) {
        return rule.label;
    }

    // Extract min/max length from conditions if relevant.
    const minLen = getConditionValue(rule, "min.length");
    const maxLen = getConditionValue(rule, "max.length");
    const confirmPassword = getConditionValue(rule, "confirm.password");

    switch (rule.name) {
        case "LengthValidator":
            if (minLen && maxLen) {
                return `Must be between ${minLen} and ${maxLen} characters long.`;
            } else if (minLen) {
                return `Must be at least ${minLen} characters long.`;
            } else if (maxLen) {
                return `Must be at most ${maxLen} characters long.`;
            }
            return "Must be within the required length.";

        case "NumeralValidator":
            if (minLen) {
                return `Must contain at least ${minLen} number(s).`;
            }
            return "Must contain the required number(s).";

        case "UpperCaseValidator":
            if (minLen) {
                return `Must contain at least ${minLen} uppercase letter(s).`;
            }
            return "Must contain uppercase letter(s).";

        case "LowerCaseValidator":
            if (minLen) {
                return `Must contain at least ${minLen} lowercase letter(s).`;
            }
            return "Must contain lowercase letter(s).";

        case "SpecialCharacterValidator":
            if (minLen && minLen > 0) {
                return `Must contain at least ${minLen} special character(s).`;
            }

        case "ConfirmPasswordValidator":

            if (confirmPassword) {
                return "Must match with the password.";
            }
            return "Must match with the password.";

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
    return (
        <div className="validation-criteria mt-1">
            { Array.isArray(validationConfig) && validationConfig.length > 0 && (
                validationConfig.map((rulesGroup, groupIndex) => (
                    <React.Fragment key={ groupIndex }>
                        { rulesGroup.map((rule, ruleIndex) => {
                            const label = getRuleLabel(rule);

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
                        }) }
                    </React.Fragment>
                ))
            ) }
        </div>
    );
};

ValidationCriteria.propTypes = {
    errors: PropTypes.array,
    validationConfig: PropTypes.array,
    value: PropTypes.string
};

export default ValidationCriteria;
