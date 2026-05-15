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

/**
 * Allowed HTML tags for descriptions.
 */
const ALLOWED_TAGS: string[] = [ "p", "a", "strong", "em", "u", "br", "span", "h1", "h2", "h3", "h4", "h5" ];

/**
 * Allowed HTML attributes for descriptions.
 */
const ALLOWED_ATTRS: string[] = [ "target", "rel" ];

let domPurifyInitialized: boolean = false;

const initDOMPurify = (): void => {
    if (domPurifyInitialized) {
        return;
    }
    DOMPurify.addHook("afterSanitizeAttributes", (node: Element) => {
        if (node.tagName === "A") {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noopener noreferrer");
        }
    });
    domPurifyInitialized = true;
};

/**
 * Sanitize HTML content for safe rendering.
 *
 * @param html - HTML string to sanitize.
 * @returns Sanitized HTML string.
 */
export const sanitizedHtml = (html: string | null | undefined): string => {
    initDOMPurify();

    return DOMPurify.sanitize(html || "", {
        ADD_ATTR: ALLOWED_ATTRS,
        ALLOWED_TAGS
    });
};

/**
 * Replace URLs in href attributes with localized versions.
 *
 * @param html - HTML string containing href attributes.
 * @param locale - Locale/language code (e.g. "en-US").
 * @param linkMapper - Function that maps a URL to its localized version.
 * @returns HTML string with localized URLs in href attributes.
 */
const localizeHtmlLinks = (
    html: string,
    locale: string,
    linkMapper: (locale: string, url: string) => string
): string => {
    return html.replace(
        /href="([^"]*)"/g,
        (_match: string, url: string): string => `href="${ linkMapper(locale, url) }"`
    );
};

/**
 * Sanitize HTML and localize links in a single operation.
 *
 * @param html - HTML string to sanitize.
 * @param locale - Locale/language code (e.g. "en-US").
 * @param linkMapper - Function that maps a URL to its localized version.
 * @returns Sanitized HTML string with localized links.
 */
export const sanitizedHtmlWithLocalizedLinks = (
    html: string | null | undefined,
    locale: string,
    linkMapper: (locale: string, url: string) => string
): string => {
    const localized: string = localizeHtmlLinks(html || "", locale, linkMapper);
    return sanitizedHtml(localized);
};
