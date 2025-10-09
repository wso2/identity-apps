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

import { ImageUtils, URLUtils } from "@wso2is/core/utils";
import { AppConstants } from "../constants/app-constants";

/**
 * Util to load and resolve static resource paths.
 * This function handles various types of resource paths including:
 * - Absolute HTTP/HTTPS URLs with valid image extensions
 * - Data URLs
 * - External resource URLs
 * - Local resource paths relative to the application
 *
 * @param path - Resource path.
 * @param resourceType - Type of resource (e.g., 'images', 'icons', 'assets'). Defaults to 'assets'.
 * @returns Resolved resource path
 */
const loadStaticResource = (path: string): string => {
    if (typeof path !== "string") {
        return path;
    }

    // Return the path as-is if it's a valid HTTP/HTTPS URL with a valid image extension
    if (URLUtils.isHttpsOrHttpUrl(path) && ImageUtils.isValidImageExtension(path)) {
        return path;
    }

    // Return the path as-is if it's a data URL
    if (URLUtils.isDataUrl(path)) {
        return path;
    }

    if (AppConstants.getClientOrigin()) {
        const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";

        if (path?.includes(AppConstants.getClientOrigin())) {
            return path;
        }

        return `${AppConstants.getClientOrigin()}${basename}/resources/${path}`;
    }

    return path;
};

export default loadStaticResource;
