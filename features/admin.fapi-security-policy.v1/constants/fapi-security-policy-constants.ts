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
import { FapiProfile } from "../models/fapi-security-policy";

/**
 * Constants for the FAPI Security Policy configuration feature.
 */
export class FapiSecurityPolicyConstants {

    private constructor() {}

    public static readonly PROFILE_TRANSLATION_SUFFIX_MAP: Record<FapiProfile, string> = {
        FAPI1_ADVANCED: "fapi1Advanced",
        FAPI2_SECURITY: "fapi2Security"
    };

    public static readonly FAPI_CONFIG_FETCH_ERROR_CODE: string = "FAPI-00001";
    public static readonly FAPI_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "FAPI-00002";
    public static readonly FAPI_CONFIG_UPDATE_ERROR_CODE: string = "FAPI-00003";
    public static readonly DCR_CONFIG_FETCH_ERROR_CODE: string = "FAPI-00004";
    public static readonly DCR_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "FAPI-00005";
    public static readonly DCR_CONFIG_UPDATE_ERROR_CODE: string = "FAPI-00006";

    public static ErrorMessages: {
        FAPI_CONFIG_FETCH_ERROR_CODE: IdentityAppsError;
        FAPI_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: IdentityAppsError;
        FAPI_CONFIG_UPDATE_ERROR_CODE: IdentityAppsError;
        DCR_CONFIG_FETCH_ERROR_CODE: IdentityAppsError;
        DCR_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: IdentityAppsError;
        DCR_CONFIG_UPDATE_ERROR_CODE: IdentityAppsError;
    } = {
            DCR_CONFIG_FETCH_ERROR_CODE: new IdentityAppsError(
                FapiSecurityPolicyConstants.DCR_CONFIG_FETCH_ERROR_CODE,
                "An error occurred while fetching the DCR FAPI configurations.",
                "Error while fetching the DCR FAPI configurations",
                null
            ),
            DCR_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: new IdentityAppsError(
                FapiSecurityPolicyConstants.DCR_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
                "Received an invalid status code while fetching the DCR FAPI configurations.",
                "Invalid Status Code while fetching the DCR FAPI configurations",
                null
            ),
            DCR_CONFIG_UPDATE_ERROR_CODE: new IdentityAppsError(
                FapiSecurityPolicyConstants.DCR_CONFIG_UPDATE_ERROR_CODE,
                "An error occurred while updating the DCR FAPI configurations.",
                "Error while updating the DCR FAPI configurations",
                null
            ),
            FAPI_CONFIG_FETCH_ERROR_CODE: new IdentityAppsError(
                FapiSecurityPolicyConstants.FAPI_CONFIG_FETCH_ERROR_CODE,
                "An error occurred while fetching the FAPI configurations.",
                "Error while fetching the FAPI configurations",
                null
            ),
            FAPI_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: new IdentityAppsError(
                FapiSecurityPolicyConstants.FAPI_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
                "Received an invalid status code while fetching the FAPI configurations.",
                "Invalid Status Code while fetching the FAPI configurations",
                null
            ),
            FAPI_CONFIG_UPDATE_ERROR_CODE: new IdentityAppsError(
                FapiSecurityPolicyConstants.FAPI_CONFIG_UPDATE_ERROR_CODE,
                "An error occurred while updating the FAPI configurations.",
                "Error while updating the FAPI configurations",
                null
            )
        };
}
