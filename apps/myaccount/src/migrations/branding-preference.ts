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

import merge from "lodash-es/merge";
import { THEMES } from "../meta";
import { BrandingPreferenceAPIResponseInterface } from "../models";

/**
 * Migrates a branding preference API response to include the default themes.
 *
 * @param preference - The branding preference API response to migrate.
 * @returns A new API response object with the default themes merged in.
 */
export const getMigratedBrandingPreference = (
    preference: BrandingPreferenceAPIResponseInterface
): BrandingPreferenceAPIResponseInterface => {
    if (!preference) {
        return preference;
    }

    return merge({ preference: { theme: THEMES } }, preference);
};
