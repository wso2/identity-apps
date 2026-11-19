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

import { PredefinedLayouts } from "../models/branding-preferences";

/**
 * URL prefixes allowed for the background image. Matches the check in the login portals' `theme-skeleton.jsp`.
 */
const ALLOWED_URL_PREFIXES: string[] = [ "http://", "https://" ];

/**
 * Layouts that show their side image in place of the background image.
 */
const LAYOUTS_WITHOUT_BACKGROUND_IMAGE: string[] = [ PredefinedLayouts.LEFT_IMAGE, PredefinedLayouts.RIGHT_IMAGE ];

/**
 * Characters that can end a double-quoted CSS string or the enclosing style block.
 */
// Control characters, such as newlines, end a CSS string, so they must be matched and escaped.
// eslint-disable-next-line no-control-regex
const CSS_STRING_UNSAFE_CHARACTERS: RegExp = /["\\<>\u0000-\u001F\u007F]/g;

/**
 * Checks whether the given layout supports the page background image.
 *
 * @param activeLayout - Name of the active layout.
 * @returns `true` if the layout supports the background image.
 */
export const isBackgroundImageSupportedLayout = (activeLayout?: string): boolean =>
    !LAYOUTS_WITHOUT_BACKGROUND_IMAGE.includes(activeLayout);

/**
 * Checks whether the given value is an absolute `http` or `https` URL that can be used as the background image.
 *
 * @param imageURL - Image URL entered by the user.
 * @returns `true` if the URL can be used as the background image.
 */
export const isValidBackgroundImageURL = (imageURL?: string): boolean => {
    const trimmedURL: string = imageURL?.trim();

    if (!trimmedURL) {
        return false;
    }

    const lowerCaseURL: string = trimmedURL.toLowerCase();

    if (!ALLOWED_URL_PREFIXES.some((prefix: string) => lowerCaseURL.startsWith(prefix))) {
        return false;
    }

    try {
        new URL(trimmedURL);
    } catch (_error: unknown) {
        return false;
    }

    return true;
};

/**
 * Resolves an image URL into a value that can be safely used for the CSS `background-image` property.
 *
 * Only absolute `http` and `https` URLs are accepted. The URL is kept as entered and the characters that
 * could break out of the `url("...")` token are CSS-escaped, so the browser requests the same URL as the
 * login pages do.
 *
 * @param imageURL - Image URL entered by the user.
 * @param activeLayout - Name of the active layout.
 * @returns A `url("...")` CSS value, or `none` when the URL is empty, not allowed or not supported by the layout.
 */
export const resolveCssBackgroundImage = (imageURL?: string, activeLayout?: string): string => {
    if (!isBackgroundImageSupportedLayout(activeLayout) || !isValidBackgroundImageURL(imageURL)) {
        return "none";
    }

    const escapedURL: string = imageURL.trim().replace(
        CSS_STRING_UNSAFE_CHARACTERS,
        (character: string): string => "\\" + character.charCodeAt(0).toString(16) + " "
    );

    return `url("${ escapedURL }")`;
};
