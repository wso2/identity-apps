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
import { resolveElementText } from "../utils/i18n-utils";

/**
 * ValidationError Component
 *
 * @param {Object} errors - The validation errors.
 */
const ValidationError = ({ name, errors }) => {

    const { translations } = useTranslations();

    const formError = errors.formStateErrors.length > 0 &&
            errors.formStateErrors.filter(error => error.label === name);
    const fieldError = formError[0] && formError[0].error ||
        (errors.fieldErrors.length > 0 ? errors.fieldErrors[0].error : null);

    return (
        <>
            {
                fieldError ? (
                    <div className="validation-criteria mt-1">
                        <div className="field form-group error">
                            <i className="pr-2 red exclamation circle fitted icon"></i>
                            <span className="validation-error-message">
                                { resolveElementText(translations, fieldError) }
                            </span>
                        </div>
                    </div>
                ) : null
            }
        </>
    );
};

ValidationError.propTypes = {
    errors: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired
};

export default ValidationError;
