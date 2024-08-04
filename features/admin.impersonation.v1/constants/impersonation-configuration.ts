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

import { IdentityAppsError } from "@wso2is/core/errors";

export class ImpersonationConfigConstants {

    private constructor() { }

	public static readonly IMPERSONATION_CONFIG_FETCH_ERROR_CODE: string = "IC-00001";
    public static readonly IMPERSONATION_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "IC-00002";
	public static readonly IMPERSONATION_CONFIG_UPDATE_ERROR_CODE: string = "IC-00003";
	public static readonly DEFAULT_SUBJECT_TOKEN_EXPIRY_TIME: number = 180;

	public static ErrorMessages: {
        IMPERSONATION_CONFIG_FETCH_ERROR_CODE: IdentityAppsError;
        IMPERSONATION_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: IdentityAppsError;
        IMPERSONATION_CONFIG_UPDATE_ERROR_CODE: IdentityAppsError;
    } = {
        IMPERSONATION_CONFIG_FETCH_ERROR_CODE: new IdentityAppsError(
            ImpersonationConfigConstants.IMPERSONATION_CONFIG_FETCH_ERROR_CODE,
            "An error occurred while fetching the Impersonation configurations.",
            "Error while fetching the Impersonation configurations",
            null
        ),
        IMPERSONATION_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: new IdentityAppsError(
            ImpersonationConfigConstants.IMPERSONATION_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
            "Received an invalid status code while fetching the Impersonation configurations.",
            "Invalid Status Code while fetching the Impersonation configurations",
            null
        ),
        IMPERSONATION_CONFIG_UPDATE_ERROR_CODE: new IdentityAppsError(
            ImpersonationConfigConstants.IMPERSONATION_CONFIG_UPDATE_ERROR_CODE,
            "An error occurred while updating the Impersonation configurations.",
            "Error while updating the Impersonation configurations",
            null
        )
    };
}
