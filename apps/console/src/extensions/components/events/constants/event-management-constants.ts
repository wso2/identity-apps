/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

export class EventManagementConstants {

    private constructor() { }

	public static readonly EVENTS_FETCH_ERROR_CODE: string = "ASG-EP-60001";
    public static readonly EVENT_CONFIGURATION_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-EP-60002";
	public static readonly EVENTS_CONFIGURATION_UPDATE_ERROR_CODE: string = "ASG-EP-60003";
	public static readonly EVENT_UPDATE_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-EP-60004";
    public static readonly EVENT_UPDATE_ACTIVE_SUBS_ERROR_CODE_BE: string = "65016";
    public static readonly EVENT_UPDATE_ACTIVE_SUBS_ERROR_CODE: string 
       = `ASG-EP-${this.EVENT_UPDATE_ACTIVE_SUBS_ERROR_CODE_BE}`;

	public static ErrorMessages: {
        EVENTS_CONFIGURATION_FETCH_ERROR: IdentityAppsError;
        EVENTS_CONFIGURATION_FETCH_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
        EVENTS_CONFIGURATION_UPDATE_ERROR: IdentityAppsError;
        EVENT_CONFIGURATION_UPDATE_ACTIVE_SUBS_ERROR: IdentityAppsError;
        EVENT_CONFIGURATION_UPDATE_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
    } = {
        EVENTS_CONFIGURATION_FETCH_ERROR: new IdentityAppsError(
            EventManagementConstants.EVENTS_FETCH_ERROR_CODE,
            "An error occurred while fetching the events.",
            "Error while fetching the events",
            null
        ),
        EVENTS_CONFIGURATION_FETCH_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
            EventManagementConstants.EVENTS_FETCH_ERROR_CODE,
            "Received an invalid status code while fetching the events configuration.",
            "Invalid Status Code while fetching the events",
            null
        ),
        EVENTS_CONFIGURATION_UPDATE_ERROR: new IdentityAppsError(
            EventManagementConstants.EVENTS_CONFIGURATION_UPDATE_ERROR_CODE,
            "An error occurred while updating the events configuration.",
            "Error while updating the events configuration",
            null
        ),
        EVENT_CONFIGURATION_UPDATE_ACTIVE_SUBS_ERROR: new IdentityAppsError(
            EventManagementConstants.EVENT_UPDATE_ACTIVE_SUBS_ERROR_CODE,
            "An error occurred while updating the events configuration.",
            "Cannot disable the event type as there are active subscriptions.",
            null
        ),
        EVENT_CONFIGURATION_UPDATE_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
            EventManagementConstants.EVENT_UPDATE_INVALID_STATUS_CODE_ERROR_CODE,
            "Received an invalid status code while updating the events configuration.",
            "Invalid Status Code while updating the events configuration",
            null
        )
    };
}
