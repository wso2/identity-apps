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

import cloneDeep from "lodash-es/cloneDeep";
import { BrandingPreferenceAPIResponseInterface } from "@wso2is/common.branding.v1/models";
import { CustomTextPreferenceAPIResponseInterface } from "../models/custom-text-preference";

/**
 * Utility class for Branding Preference migrations related operations.
 */
class BrandingPreferenceMigrationClient {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() {}

    /**
     * Migrate the theme preference from v1 - v2.
     *
     * @remarks
     * Migrations:
     *     - The `theme` object inside the `preference` doc was introduced later
     *       `colors` & `images` objects were moved inside the respective theme.
     *
     * @param original - Original preference of the user.
     * @param additions - New additions.
     * @returns Migrated branding preference.
     */
    public static migrateCustomTextPreference = (
        original: CustomTextPreferenceAPIResponseInterface,
        brandingPreference: BrandingPreferenceAPIResponseInterface
    ): CustomTextPreferenceAPIResponseInterface => {
        const migratedCustomTextPreference: CustomTextPreferenceAPIResponseInterface = cloneDeep(original);

        // v3 - v4 Migrations!
        if (migratedCustomTextPreference?.preference?.text) {
            if (brandingPreference?.preference?.organizationDetails?.copyrightText) {
                if (migratedCustomTextPreference?.preference?.text["copyright"]) {
                    migratedCustomTextPreference.preference.text[
                        "copyright"
                    ] = brandingPreference.preference.organizationDetails.copyrightText;
                }
            }

            if (brandingPreference?.preference?.organizationDetails?.siteTitle) {
                if (migratedCustomTextPreference?.preference?.text["site.title"]) {
                    migratedCustomTextPreference.preference.text[
                        "site.title"
                    ] = brandingPreference.preference.organizationDetails.siteTitle;
                }
            }
        }

        return migratedCustomTextPreference;
    };
}

export default BrandingPreferenceMigrationClient;
