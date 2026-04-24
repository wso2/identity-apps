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
import "./dynamic-error.css";

const DynamicError = ({ error, onRetry }) => {

    const { translations } = useTranslations();
    const resolvedMessage = resolveElementText(translations, error);

    return (
        <div className="dynamic-error-segment">
            <h3 className="dynamic-error-header">
                { resolvedMessage || "Your action could not be completed. Please try again." }
            </h3>
            { onRetry && (
                <div className="dynamic-error-button-container">
                    <button
                        type="button"
                        className="dynamic-error-retry-button"
                        onClick={ onRetry }
                    >
                        Try Again
                    </button>
                </div>
            ) }
        </div>
    );
};

DynamicError.propTypes = {
    error: PropTypes.string.isRequired,
    onRetry: PropTypes.func
};

export default DynamicError;
