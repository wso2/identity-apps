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
import { getTranslationByKey } from "../utils/i18n-utils";

/**
 * ValidationCriteria Component
 *
 * @param {Object} props - The component props.
 * @param {Object} props.validationConfig - The validation configuration object.
 * @param {string} props.value - The value to validate.
 */
const ValidationCriteria = ({ validationConfig, errors, value }) => {

    const { translations } = useTranslations();

    const PolicyValidationStatus = ({ isValid }) => {
        return (
            <div>
                {
                    value.length === 0
                        ? (
                            <i id="password-validation-neutral-special-chr" className="inverted grey circle icon"></i>
                        ) : (
                            <>
                                {
                                    isValid
                                        ? (
                                            <i className="circle icon green check"></i>
                                        )
                                        : (
                                            <i className="circle icon red times"></i>
                                        )
                                }
                            </>
                        )

                }
            </div>
        );
    };

    return (
        <div className="validation-criteria mt-1">
            {
                (validationConfig && validationConfig.type === "CRITERIA" &&
                    validationConfig.showValidationCriteria) && (
                    <>
                        {
                            validationConfig.criteria.map((criterion, criteriaIndex) => {
                                const hasError = errors.some(
                                    (error) => error.label === criterion.label
                                );

                                return (
                                    <div key={ criteriaIndex } className="mt-1">
                                        <div className="password-policy-description mb-2">
                                            <PolicyValidationStatus isValid={ !hasError } />
                                            <p className="pl-4">
                                                { getTranslationByKey(translations, criterion.label) }
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </>
                )
            }
        </div>
    );
};

ValidationCriteria.propTypes = {
    errors: PropTypes.array,
    validationConfig: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired
};

export default ValidationCriteria;
