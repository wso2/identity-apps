/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "../constants/app-constants";

/**
 * Resolves the full URL for an image by combining the external store URL and the image path.
 *
 * @example
 * // returns "https://is-marketplace.com/images/google.png"
 * resolveConnectionImagePath("https://is-marketplace.com", "/images/google.png");
 *
 * @example
 * // returns "https://CLIENT_ORIGIN/BASENAME/resources/connections/images/google.png"
 * resolveConnectionImagePath("", "/images/google.png");
 *
 * @param externalStoreUrl - The base URL of the external store where images are hosted.
 * @param path - The specific path of the image within the external store.
 *
 * @returns The full URL of the image.
 */
const resolveConnectionImagePath = (externalStoreUrl: string, path: string): string => {
    // If an external connection store URL base path is configured, use it.
    if (externalStoreUrl) {
        return `${externalStoreUrl}/${path}`;
    }

    if (AppConstants.getClientOrigin()) {
        const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";

        if (path?.includes(AppConstants.getClientOrigin())) {
            return path;
        }

        return AppConstants.getClientOrigin() + basename + "/resources/connections/" + path;
    }
};

export default resolveConnectionImagePath;
