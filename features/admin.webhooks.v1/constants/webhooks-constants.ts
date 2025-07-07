/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { WebhookEventProfileInterface } from "../models/webhooks";

/**
 * Webhooks constants.
 */
export class WebhooksConstants {
    public static readonly ACTIVATE: string = "activate";
    public static readonly DEACTIVATE: string = "deactivate";
    public static readonly ACTIVE_STATUS: string = "ACTIVE";
    public static readonly INACTIVE_STATUS: string = "INACTIVE";

    public static readonly DEFAULT_EVENT_PROFILE: WebhookEventProfileInterface = {
        name: "WSO2",
        uri: "https://schemas.identity.wso2.org"
    };

    public static readonly WEBHOOK_NAME_REGEX: RegExp = /^[a-zA-Z0-9-_][a-zA-Z0-9-_ ]*[a-zA-Z0-9-_]$/;
    public static readonly WEBHOOK_SECRET_REGEX: RegExp = /^[ -~]+$/;

    public static readonly ERROR_MESSAGES: { [key: string]: string } = {
        CREATE_WEBHOOK_INVALID_STATUS_CODE: "Failed to create webhook. Unexpected response status.",
        DELETE_WEBHOOK_INVALID_STATUS_CODE: "Failed to delete webhook. Unexpected response status.",
        FETCH_EVENT_PROFILE_INVALID_STATUS_CODE: "Failed to fetch event profile. Unexpected response status.",
        FETCH_WEBHOOKS_INVALID_STATUS_CODE: "Failed to fetch webhooks. Unexpected response status.",
        FETCH_WEBHOOK_INVALID_STATUS_CODE: "Failed to fetch webhook. Unexpected response status.",
        RETRY_WEBHOOK_INVALID_STATUS_CODE: "Failed to resend requests. Unexpected response status.",
        UPDATE_WEBHOOK_INVALID_STATUS_CODE: "Failed to update webhook. Unexpected response status.",
        UPDATE_WEBHOOK_STATUS_INVALID_STATUS_CODE: "Failed to update webhook status. Unexpected response status."
    };
}
