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

/**
 * Dynamically imports the appropriate translations object for a given locale.
 * @param {string} locale - The locale code (e.g., 'en', 'fr', 'es').
 * @returns {Promise<Object>} - A promise that resolves to the translations object for the given locale.
 */
export const getLocaleTranslations = async (basePath, locale = "en-US") => {
    try {
        const translations = await require(`${basePath}/i18n/translations/${locale}.json`);

        return translations;
    } catch (error) {
        console.error(`Error loading locale ${locale}:`, error);
    }
};

/**
 * Safely accesses a translation value using a flat key.
 * @param {Object} translations - The translations object.
 * @param {string} key - The key (e.g., 'form.fields.password').
 * @returns {string} - The translation value.
 */
export const getTranslationByKey = (translations, key) => {

    return translations[key];
};

/**
 * Converts the translations object into a Map.
 * @param {string} locale - The locale code (e.g., 'en', 'fr', 'es').
 * @returns {Promise<Map>} - A promise that resolves to a Map of the translations for the given locale.
 */
export const getLocaleTranslationMap = async (basePath, locale = "en-US") => {
    const translationObject = await getLocaleTranslations(basePath, locale);

    return new Map(Object.entries(translationObject));
};

/**
 * Replaces i18n path placeholders in a given link with locale and country codes,
 * or appends a ui_locales query parameter when no placeholders are present.
 * Mirrors the server-side i18nLink(Locale, String) method in localize.jsp.
 * @param {string} locale - The locale string (e.g., 'en_US').
 * @param {string} link - The URL to transform.
 * @returns {string} - The transformed URL.
 */
export const i18nLink = (locale, link) => {
    if (!link) {
        return link;
    }

    try {
        const parts = locale.split("_");
        const langCode = parts[0] || "";
        const countryCode = parts[1] || "";
        const localeCode = locale;

        if (
            link.includes("{{lang}}") ||
            link.includes("{{country}}") ||
            link.includes("{{locale}}")
        ) {
            return link
                .replace(/\{\{lang\}\}/g, langCode)
                .replace(/\{\{country\}\}/g, countryCode)
                .replace(/\{\{locale\}\}/g, localeCode);
        }

        return link.includes("?")
            ? `${link}&ui_locales=${localeCode}`
            : `${link}?ui_locales=${localeCode}`;
    } catch (error) {
        return link;
    }
};

/**
 * Resolves the text of an element. Accepts either a wrapped i18n key
 * ({@code "{{some.key}}"}) or a bare dot-separated short key ({@code "some.key"}).
 * If the key cannot be resolved from the translations map, the unwrapped key is
 * returned so the UI does not render raw {{...}} artefacts.
 * @param {Object} translations - The translations object.
 * @param {string} text - The text to resolve.
 * @returns {string} - The resolved text.
 */
export const resolveElementText = (translations, text) => {
    if (!text) {
        return "";
    }

    // Wrapped i18n key ({{some.key}}) — return empty when unresolved so the calling component's
    // own default text renders instead of leaking the raw key to the UI.
    const wrappedMatch = text.match(/^\{\{(.+)\}\}$/);

    if (wrappedMatch) {
        const resolved = getTranslationByKey(translations, wrappedMatch[1]);

        return resolved != null ? resolved : "";
    }

    // Bare dot-separated short key (e.g. "account.restricted.message") — treat as an i18n
    // lookup when the shape matches, otherwise return the literal text untouched.
    if (/^[a-z][a-z0-9]*(?:\.[a-z0-9]+)+$/.test(text)) {
        const resolved = getTranslationByKey(translations, text);

        return resolved != null ? resolved : "";
    }

    return text;
};
