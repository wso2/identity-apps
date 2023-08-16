/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
