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
import React, { useEffect, useRef } from "react";
import { useTranslations } from "../hooks/use-translations";
import { resolveElementText } from "../utils/i18n-utils";
import "./dynamic-error.css";

const DynamicError = ({ message, description, onRetry, supportEmail, supportText, retryText }) => {

    const { translations } = useTranslations();
    const resolvedMessage = resolveElementText(translations, message);
    const resolvedDescription = resolveElementText(translations, description);
    const wrapperRef = useRef(null);

    // The host page (execution-flow.jsp) wraps #react-root in `<div class="ui segment left aligned">`,
    // which renders as a white card with padding/border. The error UI mirrors execution_flow_error.jsp
    // which has no such wrapper, so flag the ancestor while DynamicError is mounted and let CSS
    // neutralise it. Using a class (not inline styles) keeps theme overrides possible.
    useEffect(() => {
        const node = wrapperRef.current;
        if (!node) return undefined;
        const host = node.closest(".ui.segment.left.aligned");
        if (!host) return undefined;
        host.classList.add("dynamic-error-host");
        return () => {
            host.classList.remove("dynamic-error-host");
        };
    }, []);

    return (
        <div className="dynamic-error-wrapper" ref={ wrapperRef }>
            <div className="dynamic-error-segment">
                <h3 className="dynamic-error-header">
                    { resolvedMessage || "Your action could not be completed. Please try again." }
                </h3>
                <p className="dynamic-error-description">
                    { resolvedDescription || "Please try again. If the problem persists, contact support." }
                </p>
                { onRetry && (
                    <div className="dynamic-error-button-container">
                        <button
                            type="button"
                            className="dynamic-error-retry-button"
                            onClick={ onRetry }
                        >
                            { retryText || "Try Again" }
                        </button>
                    </div>
                ) }
            </div>
            { supportEmail && (
                <div className="dynamic-error-support-card">
                    <p>
                        { supportText || "Need help? Contact us" } <br />
                        <a href={ `mailto:${supportEmail}` } target="_blank" rel="noopener noreferrer">
                            <span className="dynamic-error-support-email">{ supportEmail }</span>
                        </a>
                    </p>
                </div>
            ) }
        </div>
    );
};

DynamicError.propTypes = {
    description: PropTypes.string,
    message: PropTypes.string,
    onRetry: PropTypes.func,
    retryText: PropTypes.string,
    supportEmail: PropTypes.string,
    supportText: PropTypes.string
};

export default DynamicError;
