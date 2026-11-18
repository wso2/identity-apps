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

const ALLOWED_PROTOCOLS: string[] = [ "http:", "https:" ];

/**
 * Layouts that show their side image in place of the background image.
 */
const LAYOUTS_WITHOUT_BACKGROUND_IMAGE: string[] = [ "left-image", "right-image" ];

/**
 * Characters that can terminate a CSS `url("...")` token or the enclosing style block, even after
 * WHATWG URL serialization.
 */
const CSS_URL_UNSAFE_CHARACTERS: RegExp = /["'()\\\s<>]/g;

/**
 * Checks whether the given layout supports the page background image.
 *
 * @param activeLayout - Name of the active layout.
 * @returns `true` if the layout supports the background image.
 */
export const isBackgroundImageSupportedLayout = (activeLayout?: string): boolean =>
    !LAYOUTS_WITHOUT_BACKGROUND_IMAGE.includes(activeLayout);

/**
 * Resolves an image URL into a value that can be safely used for the CSS `background-image` property.
 *
 * Only absolute `http` and `https` URLs are accepted. Characters that could break out of the
 * `url("...")` token are percent-encoded.
 *
 * @param imageURL - Image URL entered by the user.
 * @param activeLayout - Name of the active layout.
 * @returns A `url("...")` CSS value, or `none` when the URL is empty, not allowed or not supported by the layout.
 */
export const resolveCssBackgroundImage = (imageURL?: string, activeLayout?: string): string => {
    const trimmedURL: string = imageURL?.trim();

    if (!trimmedURL || !isBackgroundImageSupportedLayout(activeLayout)) {
        return "none";
    }

    let parsedURL: URL;

    try {
        parsedURL = new URL(trimmedURL);
    } catch (_error: unknown) {
        return "none";
    }

    if (!ALLOWED_PROTOCOLS.includes(parsedURL.protocol)) {
        return "none";
    }

    const encodedURL: string = parsedURL.href.replace(
        CSS_URL_UNSAFE_CHARACTERS,
        (character: string): string => "%" + character.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")
    );

    return `url("${ encodedURL }")`;
};
