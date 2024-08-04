/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { getDefaultImageForIDVP } from "../configs/ui";

/**
 * Resolves the image of the IDVP.
 *
 * @param image - Input image.
 * @returns Predefined image if available. If not, return input parameter.
 */
export const resolveIDVPImage = (image: string): string | any => {

    // TODO: see if any can be removed
    if (image) {
        if (typeof image !== "string") {
            return image;
        }

        if ((URLUtils.isHttpsUrl(image) || URLUtils.isHttpUrl(image)) && ImageUtils.isValidImageExtension(image)) {
            return image;
        }

        if (URLUtils.isDataUrl(image)) {
            return image;
        }
    }

    return getDefaultImageForIDVP();
};
