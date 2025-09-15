/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

export class SessionManagementConstants {

    private constructor() { }

    public static readonly IDLE_SESSION_TIMEOUT_PATH: string = "/idleSessionTimeoutPeriod";
    public static readonly REMEMBER_ME_PERIOD_PATH: string = "/rememberMePeriod";
    public static readonly REPLACE_OPERATION: string = "REPLACE";
    public static readonly REMOVE_OPERATION: string = "REMOVE";

    public static readonly SESSION_MANAGEMENT_CONFIG_FETCH_ERROR_CODE: string = "SMC-00001";
    public static readonly SESSION_MANAGEMENT_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "SMC-00002";
    public static readonly SESSION_MANAGEMENT_CONFIG_UPDATE_ERROR_CODE: string = "SMC-00003";

    public static readonly SESSION_MANAGEMENT_CONFIG_FIELD_MIN_LENGTH: number = 0;
    public static readonly SESSION_MANAGEMENT_CONFIG_FIELD_MAX_LENGTH: number = 100;

    public static ErrorMessages: {
        SESSION_MANAGEMENT_CONFIG_FETCH_ERROR_CODE: IdentityAppsError;
        SESSION_MANAGEMENT_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: IdentityAppsError;
        SESSION_MANAGEMENT_CONFIG_UPDATE_ERROR_CODE: IdentityAppsError;
    } = {
            SESSION_MANAGEMENT_CONFIG_FETCH_ERROR_CODE: new IdentityAppsError(
                SessionManagementConstants.SESSION_MANAGEMENT_CONFIG_FETCH_ERROR_CODE,
                "An error occurred while fetching the session management configurations.",
                "Error while fetching the session management configurations",
                null
            ),
            SESSION_MANAGEMENT_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: new IdentityAppsError(
                SessionManagementConstants.SESSION_MANAGEMENT_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
                "Received an invalid status code while fetching the session management configurations.",
                "Invalid Status Code while fetching the session management configurations",
                null
            ),
            SESSION_MANAGEMENT_CONFIG_UPDATE_ERROR_CODE: new IdentityAppsError(
                SessionManagementConstants.SESSION_MANAGEMENT_CONFIG_UPDATE_ERROR_CODE,
                "An error occurred while updating the session management configurations.",
                "Error while updating the session management configurations",
                null
            )
        };
}
