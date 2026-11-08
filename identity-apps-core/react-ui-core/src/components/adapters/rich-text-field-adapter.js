/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
import React, { useMemo } from "react";
import { useGlobalContext } from "../../hooks/use-global-context";
import { useStepData } from "../../hooks/use-step-data";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import { escapeHtml, getNestedValue, getStepDataValue, resolvePlaceholders } from "../../utils/placeholder-utils";
import "./rich-text-field-adapter.css";

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.hasAttribute("target")) {
        const target = node.getAttribute("target");

        if (target === "_blank") {
            node.setAttribute("rel", "noopener noreferrer");
        }
    }
});

const RichTextAdapter = ({ component }) => {
    const { config } = component;
    const { contextData } = useGlobalContext();
    const stepData = useStepData();
    const { translations } = useTranslations();

    // Global data first, so existing pages resolve as before; step data only fills the keys global data does
    // not have. Step values can come from outside, such as a device, so they are escaped.
    const placeholderResolvers = [
        (key) => getNestedValue(contextData, key),
        (key) => {
            const value = getStepDataValue(stepData, key);

            return value !== "" ? escapeHtml(value) : "";
        }
    ];

    // Resolve placeholders in the HTML content before sanitizing.
    const sanitizedHtml = useMemo(() => {
    let html = resolveElementText(translations, config.text);
    html = resolvePlaceholders(html || "", placeholderResolvers);

    // If linkTarget is configured, update links to use that target
    if (config.linkTarget) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');

        links.forEach(link => {
            link.setAttribute('target', config.linkTarget);
            if (config.linkTarget === '_blank') {
                link.setAttribute('rel', 'noopener noreferrer');
            } else {
                link.removeAttribute('rel');
            }
        });

        html = doc.body.innerHTML;
    }

    return DOMPurify.sanitize(html, {
        ADD_ATTR: [ "target", "rel" ]
    });
}, [ config.text, config.linkTarget, contextData, stepData ]);

    return (
        <div className="rich-text-content">
            { parse(sanitizedHtml) }
        </div>
    );
};

RichTextAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            text: PropTypes.string.isRequired
        }).isRequired,
        id: PropTypes.string
    }).isRequired
};

export default RichTextAdapter;
