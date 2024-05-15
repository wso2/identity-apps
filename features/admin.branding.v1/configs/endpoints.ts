/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppConfigs } from "../../admin.core.v1/configs";
import { BrandingPreferenceResourceEndpointsInterface } from "../models/endpoints";

/**
 * Get the resource endpoints for the Branding Preferences feature.
 *
 * @param serverHost - Server Host.
 * @returns The resource endpoints for the Branding Preference feature.
 */
export const getBrandingResourceEndpoints =
    (serverHostWithOrgPath: string): BrandingPreferenceResourceEndpointsInterface => {
        const subOrgPath: string = AppConfigs.getAppUtils()?.getConfig()?.serverOrigin +
            AppConfigs.getAppUtils()?.getOrganizationPath();

        return {
            brandingPreference: `${ serverHostWithOrgPath }/api/server/v1/branding-preference`,
            brandingPreferenceSubOrg: `${ subOrgPath }/api/server/v1/branding-preference`,
            brandingTextPreference: `${ serverHostWithOrgPath }/api/server/v1/branding-preference/text`,
            brandingTextPreferenceSubOrg: `${ subOrgPath}/api/server/v1/branding-preference/text`
        };
    };
