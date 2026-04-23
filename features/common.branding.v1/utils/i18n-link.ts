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
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Replaces i18n placeholders in a policy URL with locale parts or appends a
 * `ui_locales` query parameter when no placeholders are present.
 *
 * @param locale - Current locale string (for example, `en-US` or `en_US`).
 * @param link - The URL to transform.
 * @returns The localized URL.
 */
export const i18nLink = (locale: string, link: string): string => {
    if (!link) {
        return link;
    }

    try {
        const parts: string[] = locale.split(/[-_]/);
        const langCode: string = parts[0] || "";
        const countryCode: string = parts[1] || "";

        if (
            link.includes("{{lang}}") ||
            link.includes("{{country}}") ||
            link.includes("{{locale}}")
        ) {
            return link
                .replace(/\{\{lang\}\}/g, langCode)
                .replace(/\{\{country\}\}/g, countryCode)
                .replace(/\{\{locale\}\}/g, locale);
        }

        return link.includes("?")
            ? `${ link }&ui_locales=${ locale }`
            : `${ link }?ui_locales=${ locale }`;
    } catch {
        return link;
    }
};
