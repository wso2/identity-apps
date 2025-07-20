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

import DOMPurify from "dompurify";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useGlobalContext } from "../../hooks/use-global-context";
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

    /**
     * Get nested object value using dot notation key path.
     *
     * @param obj - The object to search in.
     * @param path - The dot notation path (e.g., "some.nested.key").
     * @param defaultValue - Default value if path is not found.
     * @returns The resolved value or default value.
     */
    const getNestedValue = (obj, path, defaultValue = "") => {
        try {
            return path.split(".").reduce((current, key) => {
                const value = current && current[key];

                // Check if value exists and is not empty/null/undefined.
                return value != null && value !== "" && value !== "null" ? value : defaultValue;
            }, obj);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(`Error resolving path "${path}":`, error);

            return defaultValue;
        }
    };

    /**
     * Replace placeholders in the format {{key.path}} with values from global context.
     *
     * @param text - The text containing placeholders.
     * @returns Text with resolved placeholders.
     */
    const resolvePlaceholders = (text) => {
        if (!text || typeof text !== "string") {
            return text;
        }

        return text.replace(/\{\{([^}]+)\}\}/g, (match, keyPath) => {
            try {
                const trimmedPath = keyPath.trim();
                const resolvedValue = getNestedValue(contextData, trimmedPath);

                // Return the resolved value or the original placeholder if not found.
                return resolvedValue !== "" ? resolvedValue : match;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.warn(`Error resolving placeholder "${match}":`, error);

                return match; // Return original placeholder on error.
            }
        });
    };

    // Resolve placeholders in the HTML content before sanitizing.
    const sanitizedHtml = useMemo(() => {
        const resolvedHtml = resolvePlaceholders(config.text || "");

        return DOMPurify.sanitize(resolvedHtml, {
            ADD_ATTR: [ "target" ]
        });
    }, [ config.text, contextData ]);

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
