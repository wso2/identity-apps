/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentityAppsError } from "@wso2is/core/errors";

export class SMSOTPConstants {

    public static readonly ERROR_IN_CREATING_SMS_NOTIFICATION_SENDER: string = "An error occurred while adding SMS " +
        "Notification Sender";

    public static readonly ERROR_IN_DELETING_SMS_NOTIFICATION_SENDER: string = "An error occurred while deleting " +
        "SMS Notification Sender";

    public static ErrorMessages: {
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS: IdentityAppsError;
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_CONNECTED_APPS: IdentityAppsError;
    } = {
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS: new IdentityAppsError(
            "NSM-65015",
            "Failed to delete SMS notification sender due to the existence of active subscriptions"
        ),
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_CONNECTED_APPS: new IdentityAppsError(
            "NSM-60008",
            "There are applications using this connection."
        )
    }
}
