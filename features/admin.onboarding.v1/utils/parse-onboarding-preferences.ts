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
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Key used inside the userPreferences JSON string.
 */
const ONBOARDING_SHOW_KEY: string = "onboarding.show";

/**
 * Parses the userPreferences JSON string to extract the onboarding.show value.
 * The userPreferences claim stores data as a stringified JSON object
 * e.g. "\{'onboarding.show': true\}".
 *
 * @param userPreferences - The raw userPreferences string from SCIM2.
 * @returns True if the wizard should be shown, false otherwise.
 */
export const parseOnboardingShowFromPreferences = (
    userPreferences: string | undefined
): boolean => {
    if (!userPreferences) {
        return true;
    }

    try {
        const normalized: string = userPreferences.replace(/'/g, "\"");
        const parsed: Record<string, unknown> = JSON.parse(normalized);

        return parsed?.[ONBOARDING_SHOW_KEY] !== false;
    } catch (_error: unknown) {
        return true;
    }
};
