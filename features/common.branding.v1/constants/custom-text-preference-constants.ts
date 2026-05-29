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

import { IdentityAppsError } from "@wso2is/core/errors";

export class CustomTextPreferenceApiConstants {
    private constructor() {}

    public static readonly DEFAULT_LOCALE: string = "en-US";
    public static readonly CUSTOM_TEXT_PREFERENCE_NOT_CONFIGURED_ERROR_CODE: string = "BPM-60006";

    public static readonly ErrorMessages: {
        CUSTOM_TEXT_PREFERENCE_DELETE_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_FETCH_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_UPDATE_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
    } = {
        CUSTOM_TEXT_PREFERENCE_DELETE_ERROR: new IdentityAppsError(
            "ASG-CON-BTPM-60008",
            "An error occurred while deleting the Text Customizations for the requested resource.",
            "Error while deleting Text Customizations",
            null
        ),
        CUSTOM_TEXT_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
            "ASG-CON-BTPM-60007",
            "Received an invalid status code while deleting the Text Customizations for the requested resource.",
            "Invalid Error Code while deleting Text Customizations",
            null
        ),
        CUSTOM_TEXT_PREFERENCE_FETCH_ERROR: new IdentityAppsError(
            "ASG-CON-BTPM-60002",
            "An error occurred while fetching the Text Customizations for the requested resource.",
            "Error while fetching Text Customizations",
            null
        ),
        CUSTOM_TEXT_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
            "ASG-CON-BTPM-60001",
            "Received an invalid status code while fetching the Text Customizations for the requested resource.",
            "Invalid Error Code while fetching Text Customizations",
            null
        ),
        CUSTOM_TEXT_PREFERENCE_UPDATE_ERROR: new IdentityAppsError(
            "ASG-CON-BTPM-60006",
            "An error occurred while updating the Text Customizations for the requested resource.",
            "Error while updating Text Customizations",
            null
        ),
        CUSTOM_TEXT_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
            "ASG-CON-BTPM-60005",
            "Received an invalid status code while updating the Text Customizations for the requested resource.",
            "Invalid Error Code while updating Text Customizations",
            null
        )
    };
}
