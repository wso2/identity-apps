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
