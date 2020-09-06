/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 *
 */

/**
 * Utility class for image related operations.
 */
export class ImageUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Checks if the passed in string is has a valid image extension.
     *
     * @param {string} str - String to evaluate
     *
     * @return {boolean} True if the string has a valid image extension.
     */
    public static isValidImageExtension(str: string): boolean {
        const pattern = new RegExp(/\.(jpeg|jpg|gif|png|svg)$/);

        return !!str.match(pattern);
    }

    /**
     * Checks if a URL points to a valid image.
     *
     * @param {string} url - Image URL.
     * @param {(isValid: boolean) => void} callback - Reports image validity. 
     */
    public static isValidImageURL(url: string, callback: (isValid: boolean) => void): void {
        const image = new Image();

        image.onload = () => callback(true);
        image.onerror = () => callback(false);

        image.src = url;
    }
}
