/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import DOMPurify from "dompurify";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { Checkbox } from "semantic-ui-react";
import { useTranslations } from "../../hooks/use-translations";
import { i18nLink, resolveElementText } from "../../utils/i18n-utils";
import "./rich-text-field-adapter.css";

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
    }
});

/**
 * Reports the current accepted and rejected policy ID lists to the form state.
 *
 * @param {Record<string, boolean>} checkedMap - Map of policyId → checked boolean.
 * @param {Function} formStateHandler - Form state updater.
 */
const reportPolicyState = (checkedMap, formStateHandler) => {
    const acceptedIds = Object.keys(checkedMap).filter((id) => checkedMap[id]).join(",");
    const rejectedIds = Object.keys(checkedMap).filter((id) => !checkedMap[id]).join(",");

    formStateHandler("consent.Policy", acceptedIds);
    formStateHandler("consent.rejected.Policy", rejectedIds);
};

const PolicyConsentFieldAdapter = ({ component, formStateHandler, fieldErrorHandler }) => {

    const { description, identifier = "consent_policy", policies: rawPolicies = [] } = component.config;
    const { locale, translations } = useTranslations();

    const policiesToShow = useMemo(() => rawPolicies.map((p) => ({
        description: p.description,
        id: p.purposeId,
        mandatory: p.mandatory,
        name: p.name,
        url: p.policyUrl
    })), [ rawPolicies ]);

    const [ checkedMap, setCheckedMap ] = useState({});

    const handlePolicyValidation = (map, policies) => {
        const hasUncheckedMandatory = policies.some((policy) => policy.mandatory && !map[policy.id]);

        fieldErrorHandler(identifier, hasUncheckedMandatory ? [ "You must accept all required policies." ] : null);
    };

    useEffect(() => {
        if (policiesToShow.length === 0) {
            return;
        }

        const initial = {};

        policiesToShow.forEach((policy) => {
            initial[policy.id] = policy.id in checkedMap ? checkedMap[policy.id] : false;
        });

        setCheckedMap(initial);
        reportPolicyState(initial, formStateHandler);
        handlePolicyValidation(initial, policiesToShow);
    }, [ policiesToShow ]);

    const handleChange = (_e, data, policy) => {
        const updated = { ...checkedMap, [policy.id]: data.checked };

        setCheckedMap(updated);
        reportPolicyState(updated, formStateHandler);
        handlePolicyValidation(updated, policiesToShow);
    };

    return (
        <div className="consent-field">
            { description && (
                <div className="rich-text-content">
                    <p className="rich-text-paragraph">
                        { resolveElementText(translations, description) }
                    </p>
                </div>
            ) }
            { policiesToShow.map((policy) => {
                const descriptionText = resolveElementText(translations, policy.description);
                const nameText = resolveElementText(translations, policy.name);

                const htmlWithLocalizedLinks = (descriptionText || "").replace(
                    /href="([^"]*)"/g,
                    (_match, url) => `href="${ i18nLink(locale, url) }"`
                );

                const sanitizedHtml = DOMPurify.sanitize(htmlWithLocalizedLinks, {
                    ADD_ATTR: [ "target", "rel" ],
                    ALLOWED_TAGS: [ "p", "a", "strong", "em", "u", "br", "span", "h1", "h2", "h3", "h4", "h5" ]
                });

                return (
                    <div
                        key={ policy.id }
                        className="rich-text-content"
                        style={ { alignItems: "center", display: "flex", gap: "10px" } }
                    >
                        <Checkbox
                            name={ policy.id }
                            checked={ checkedMap[policy.id] || false }
                            onChange={ (_e, data) => handleChange(_e, data, policy) }
                        />
                        <label style={ { cursor: "pointer", flex: 1, margin: 0 } }>
                            { sanitizedHtml ? (
                                <div className="rich-text-paragraph">
                                    { parse(sanitizedHtml) }
                                    { policy.mandatory && (
                                        <span aria-hidden="true" style={ { color: "red" } }> *</span>
                                    ) }
                                </div>
                            ) : (
                                <div className="rich-text-paragraph">
                                    { resolveElementText(translations, "I have read and agree to the ") }
                                    <a
                                        href={ policy.url ? i18nLink(locale, policy.url) : undefined }
                                        target={ policy.url ? "_blank" : undefined }
                                        rel={ policy.url ? "noopener noreferrer" : undefined }
                                        className="rich-text-link"
                                        onClick={ (e) => e.stopPropagation() }
                                    >
                                        { nameText }
                                    </a>
                                    { policy.mandatory && (
                                        <span aria-hidden="true" style={ { color: "red" } }> *</span>
                                    ) }
                                </div>
                            ) }
                        </label>
                    </div>
                );
            }) }
        </div>
    );
};

PolicyConsentFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    fieldErrorHandler: PropTypes.func.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default PolicyConsentFieldAdapter;
