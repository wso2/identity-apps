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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { ImageUtils, URLUtils } from "@wso2is/core/utils";
import { ExtensionTemplateConstants } from "../constants/templates";
import { ResourceTypes } from "../models/templates";

/**
 * Utility class for Extension Templates related operations.
 */
export class ExtensionTemplateManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * Util to resolve template resource path.
     *
     * @param path - Resource path.
     * @param resourceType - Extension template type.
     * @returns The absolute path to the resource location.
     */
    public static resolveExtensionTemplateResourcePath(path: string, resourceType: ResourceTypes): string {
        if (typeof path !== "string") {
            return path;
        }

        const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";
        const clientOrigin: string = AppConstants.getClientOrigin();

        if (path?.includes(ExtensionTemplateConstants.CONSOLE_BASE_URL_PLACEHOLDER)) {
            return path.replace(
                ExtensionTemplateConstants.CONSOLE_BASE_URL_PLACEHOLDER,
                `${clientOrigin}${basename}`
            );
        }

        if (URLUtils.isHttpsOrHttpUrl(path) && ImageUtils.isValidImageExtension(path)) {
            return path;
        }

        if (URLUtils.isDataUrl(path)) {
            return path;
        }

        if (AppConstants.getClientOrigin()) {

            if (path?.includes(clientOrigin)) {

                return path;
            }

            return AppConstants.getClientOrigin() + basename + `/resources/${resourceType}s/` + path;
        }
    }
}
