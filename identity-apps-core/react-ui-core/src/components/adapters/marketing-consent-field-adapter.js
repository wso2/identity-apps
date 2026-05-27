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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Checkbox, Form } from "semantic-ui-react";
import { useTranslations } from "../../hooks/use-translations";
import { i18nLink, resolveElementText } from "../../utils/i18n-utils";
import "./rich-text-field-adapter.css";

let isAfterSanitizeHookRegistered = false;

const ensureAfterSanitizeAttributesHookRegistered = () => {
    if (isAfterSanitizeHookRegistered) {
        return;
    }

    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
        if (node.tagName === "A") {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noopener noreferrer");
        }
    });

    isAfterSanitizeHookRegistered = true;
};

/**
 * Resolves a purpose description to the best matching string for the current locale.
 * Accepts either a plain string (optionally an i18n key placeholder) or a locale map.
 *
 * @param {string | Record<string, string>} description - Raw description value.
 * @param {string} locale - Current locale (underscore-separated, e.g. "en_US").
 * @param {Object} translations - Translations map for resolving i18n placeholders.
 * @returns {string}
 */
const resolveDescription = (description, locale, translations) => {
    if (!description) {
        return "";
    }

    if (typeof description === "string") {
        return resolveElementText(translations, description);
    }

    // Locale map keyed by IETF tags (e.g. "en-US"). Normalize underscore → hyphen.
    const normalizedLocale = locale ? locale.replace("_", "-") : "en-US";

    return description[normalizedLocale]
        ?? description["en-US"]
        ?? Object.values(description)[0]
        ?? "";
};

/**
 * Serializes the current per-purpose attribute selection into the shared "consent"
 * form field as a JSON payload, merging with any existing consent entries for other
 * purpose types (e.g. "Policy") already stored in the ref.
 *
 * @param {{ [purposeId: string]: { [attrId: string]: boolean } }} checkedMap
 * @param {Function} formStateHandler
 * @param {string} purposeType
 * @param {{ current: string | null }} consentRef
 */
const reportMarketingState = (checkedMap, formStateHandler, purposeType, consentRef) => {
    const purposes = Object.entries(checkedMap).map(([ purposeId, attrMap ]) => {
        const acceptedAttributes = Object.keys(attrMap)
            .filter((id) => id !== "__accepted" && attrMap[id]);

        const accepted = attrMap.__accepted ?? acceptedAttributes.length > 0;

        return {
            accepted,
            attributes: acceptedAttributes,
            id: purposeId
        };
    });

    let existingConsent = {};

    try {
        const raw = consentRef.current;

        if (raw) {
            existingConsent = JSON.parse(raw);
        }
    } catch (e) {
        existingConsent = {};
    }

    const merged = { ...existingConsent, [purposeType]: { purposes } };
    const serialized = JSON.stringify(merged);

    consentRef.current = serialized;
    formStateHandler("marketing", serialized);
};

const MarketingConsentFieldAdapter = ({ component, formStateHandler, fieldErrorHandler }) => {

    const {
        identifier = "marketing_consent",
        purposes: rawPurposes = [],
        purposeType = "Marketing"
    } = component.config;

    const { locale, translations } = useTranslations();

    const purposes = useMemo(
        () => rawPurposes.filter((p) => p.attributes !== undefined && p.attributes !== null),
        [ rawPurposes ]
    );

    // checkedMap: { [purposeId]: { [attrId]: boolean } }
    const [ checkedMap, setCheckedMap ] = useState({});
    const consentRef = useRef(null);

    useEffect(() => {
        if (purposes.length === 0) {
            return;
        }

        const initial = {};

        purposes.forEach((purpose) => {
            initial[purpose.purposeId] = {};
            (purpose.attributes || []).forEach((attr) => {
                initial[purpose.purposeId][attr.id] =
                    checkedMap[purpose.purposeId]?.[attr.id] ?? false;
            });
        });

        setCheckedMap(initial);
        reportMarketingState(initial, formStateHandler, purposeType, consentRef);
        fieldErrorHandler(identifier, null);
    }, [ purposes ]);

    const handleAttributeChange = (_e, data, purposeId, attrId) => {
        const updated = {
            ...checkedMap,
            [purposeId]: { ...checkedMap[purposeId], [attrId]: data.checked }
        };

        setCheckedMap(updated);
        reportMarketingState(updated, formStateHandler, purposeType, consentRef);
    };

    const handleSelectAll = (_e, data, purposeId, attrIds) => {
        const updatedPurpose = {};

        attrIds.forEach((id) => { updatedPurpose[id] = data.checked; });

        // For purposes with no attributes, track acceptance via __accepted flag
        if (attrIds.length === 0) {
            updatedPurpose.__accepted = data.checked;
        }

        const updated = { ...checkedMap, [purposeId]: updatedPurpose };

        setCheckedMap(updated);
        reportMarketingState(updated, formStateHandler, purposeType, consentRef);
    };


    if (purposes.length === 0) {
        return null;
    }

    ensureAfterSanitizeAttributesHookRegistered();

    return (
        <Form.Group grouped className="consent-field">
            { purposes.map((purpose) => {
                const description = resolveDescription(purpose.description, locale, translations);
                const attrIds = (purpose.attributes || []).map((a) => a.id);
                const attrMap = checkedMap[purpose.purposeId] ?? {};
                const allChecked = attrIds.length === 0
                    ? attrMap.__accepted ?? false
                    : attrIds.every((id) => attrMap[id]);
                const isIndeterminate = attrIds.length > 0
                    && !allChecked
                    && attrIds.some((id) => attrMap[id]);

                const purposeName = resolveElementText(translations, purpose.name) || purpose.name || "";
                const resolvedTemplate = resolveElementText(translations, "{{consent.marketing.exampleDescription}}")
                    || "I agree to receive {consentName} communications.";
                const fallbackDescription = resolvedTemplate.replace("{consentName}", purposeName);
                const rawDescription = description || fallbackDescription;

                const htmlWithLocalizedLinks = rawDescription.replace(
                    /href="([^"]*)"/g,
                    (_match, url) => `href="${ i18nLink(locale, url) }"`
                );
                const sanitizedHtml = DOMPurify.sanitize(htmlWithLocalizedLinks, {
                    ADD_ATTR: [ "target", "rel" ],
                    ALLOWED_TAGS: [ "p", "a", "strong", "em", "u", "br", "span", "h1", "h2", "h3", "h4", "h5" ]
                });

                return (
                    <div key={ purpose.purposeId }>
                        <div style={ { alignItems: "center", display: "flex", gap: "8px", marginBottom: "12px" } }>
                            <Checkbox
                                id={ `marketing-consent-${ purpose.purposeId }` }
                                checked={ allChecked }
                                indeterminate={ isIndeterminate }
                                size="small"
                                style={ { padding: 0 } }
                                onChange={ (_e, data) => handleSelectAll(_e, data, purpose.purposeId, attrIds) }
                            />
                            <label
                                htmlFor={ `marketing-consent-${ purpose.purposeId }` }
                                style={ { fontSize: "0.875rem", lineHeight: 1.5, margin: 0, cursor: "pointer" } }
                            >
                                { sanitizedHtml
                                    ? <span className="rich-text-paragraph">{ parse(sanitizedHtml) }</span>
                                    : rawDescription
                                }
                            </label>
                        </div>
                        { purpose.attributes.length > 0 && (
                            <div style={ { display: "flex", flexDirection: "column", marginLeft: "28px", marginTop: "-8px" } }>
                                { purpose.attributes.map((attr) => (
                                    <div
                                        key={ attr.id }
                                        style={ {
                                            alignItems: "center",
                                            display: "flex",
                                            gap: "8px",
                                            marginBottom: "4px",
                                            marginTop: "4px"
                                        } }
                                    >
                                        <Checkbox
                                            id={ `marketing-consent-${ purpose.purposeId }-${ attr.id }` }
                                            name={ attr.id }
                                            checked={ attrMap[attr.id] || false }
                                            size="small"
                                            style={ { padding: 0 } }
                                            onChange={ (_e, data) =>
                                                handleAttributeChange(_e, data, purpose.purposeId, attr.id) }
                                        />
                                        <label
                                            htmlFor={ `marketing-consent-${ purpose.purposeId }-${ attr.id }` }
                                            style={ { fontSize: "0.8125rem", margin: 0, cursor: "pointer" } }
                                        >
                                            { attr.displayName ?? attr.name }
                                        </label>
                                    </div>
                                )) }
                            </div>
                        ) }
                    </div>
                );
            }) }
        </Form.Group>
    );
};

MarketingConsentFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    fieldErrorHandler: PropTypes.func.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default MarketingConsentFieldAdapter;
