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

export class IssuerUsageScopeConfigConstants {

    private constructor() { }

    public static readonly ISSUER_USAGE_SCOPE_CONFIG_FETCH_ERROR_CODE: string = "IUSC-00001";
    public static readonly ISSUER_USAGE_SCOPE_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "IUSC-00002";
    public static readonly ISSUER_USAGE_SCOPE_CONFIG_UPDATE_ERROR_CODE: string = "IUSC-00003";
    public static readonly ISSUER_USAGE_SCOPE_ISSUER_USED_IN_ORGS_ERROR_CODE: string = "CNF-65030";

    public static ErrorMessages: {
        ISSUER_USAGE_SCOPE_CONFIG_FETCH_ERROR_CODE: IdentityAppsError;
        ISSUER_USAGE_SCOPE_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: IdentityAppsError;
        ISSUER_USAGE_SCOPE_CONFIG_UPDATE_ERROR_CODE: IdentityAppsError;
    } = {
            ISSUER_USAGE_SCOPE_CONFIG_FETCH_ERROR_CODE: new IdentityAppsError(
                IssuerUsageScopeConfigConstants.ISSUER_USAGE_SCOPE_CONFIG_FETCH_ERROR_CODE,
                "An error occurred while fetching the Issuer Usage Scope configurations.",
                "Error while fetching the Issuer Usage Scope configurations",
                null
            ),
            ISSUER_USAGE_SCOPE_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: new IdentityAppsError(
                IssuerUsageScopeConfigConstants.ISSUER_USAGE_SCOPE_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
                "Received an invalid status code while fetching the Issuer Usage Scope configurations.",
                "Invalid Status Code while fetching the Issuer Usage Scope configurations",
                null
            ),
            ISSUER_USAGE_SCOPE_CONFIG_UPDATE_ERROR_CODE: new IdentityAppsError(
                IssuerUsageScopeConfigConstants.ISSUER_USAGE_SCOPE_CONFIG_UPDATE_ERROR_CODE,
                "An error occurred while updating the Issuer Usage Scope configurations.",
                "Error while updating the Issuer Usage Scope configurations",
                null
            )
        };
}
