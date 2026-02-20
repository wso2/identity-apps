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

import {
    ApplicationEditTabContentType,
    ApplicationEditTabMetadataInterface,
    ApplicationTemplateMetadataInterface
} from "@wso2is/admin.application-templates.v1/models/templates";

/**
 * Extract guide markdown content from application template metadata.
 * Finds the first tab with `contentType === "guide"` and returns its guide string.
 *
 * @param metadata - Application template metadata from the extensions API
 * @returns Guide markdown string, or undefined if not found
 */
export const resolveGuideContent = (
    metadata?: ApplicationTemplateMetadataInterface
): string | undefined => {
    if (!metadata?.edit?.tabs) {
        return undefined;
    }

    const guideTab: ApplicationEditTabMetadataInterface | undefined = metadata.edit.tabs.find(
        (tab: ApplicationEditTabMetadataInterface) =>
            tab.contentType === ApplicationEditTabContentType.GUIDE && tab.guide
    );

    return guideTab?.guide;
};
