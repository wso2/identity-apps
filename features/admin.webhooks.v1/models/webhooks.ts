/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { EventProfileReferenceInterface } from "./event-profile";

/**
 * Enum for webhook status.
 */
export enum WebhookStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    PENDING_ACTIVATION = "PENDING_ACTIVATION",
    PENDING_DEACTIVATION = "PENDING_DEACTIVATION"
}

export enum ChannelStatus {
    SUBSCRIPTION_PENDING = "SUBSCRIPTION_PENDING",
    SUBSCRIPTION_ACCEPTED = "SUBSCRIPTION_ACCEPTED",
    SUBSCRIPTION_ERROR = "SUBSCRIPTION_ERROR",
    UNSUBSCRIPTION_ACCEPTED = "UNSUBSCRIPTION_ACCEPTED",
    UNSUBSCRIPTION_ERROR = "UNSUBSCRIPTION_ERROR",
}


/**
 * Interface for webhook event profile.
 */
export interface WebhookEventProfileInterface {
    /**
     * Event profile name.
     */
    name: string;
    /**
     * Event profile URI.
     */
    uri: string;
}

/**
 * Interface for webhook channel subscription with status.
 */
export interface WebhookChannelSubscriptionInterface {
    /**
     * Channel URI.
     */
    channelUri: string;
    /**
     * Subscription status.
     */
    status: ChannelStatus;
}

/**
 * Interface for webhook create request payload.
 */
export interface WebhookCreateRequestInterface {
    /**
     * Webhook endpoint URL.
     */
    endpoint: string;
    /**
     * Event profile reference.
     */
    eventProfile: EventProfileReferenceInterface;
    /**
     * Name of the webhook.
     */
    name: string;
    /**
     * List of subscribed channel URIs.
     */
    channelsSubscribed: string[];
    /**
     * Secret for webhook authentication.
     */
    secret: string;
    /**
     * Status of the webhook.
     */
    status: WebhookStatus;
}

/**
 * Interface for webhook update request payload.
 */
export interface WebhookUpdateRequestInterface {
    /**
     * Webhook endpoint URL.
     */
    endpoint: string;
    /**
     * Event profile reference.
     */
    eventProfile: EventProfileReferenceInterface;
    /**
     * Name of the webhook.
     */
    name: string;
    /**
     * List of subscribed channel URIs.
     */
    channelsSubscribed: string[];
    /**
     * Secret for webhook authentication (optional for updates).
     */
    secret?: string;
    /**
     * Status of the webhook.
     */
    status: WebhookStatus;
}

/**
 * Interface for webhook response.
 */
export interface WebhookResponseInterface {
    /**
     * Unique identifier of the webhook.
     */
    id: string;
    /**
     * Creation timestamp.
     */
    createdAt?: string;
    /**
     * Last updated timestamp.
     */
    updatedAt?: string;
    /**
     * Webhook endpoint URL.
     */
    endpoint: string;
    /**
     * Event profile reference.
     */
    eventProfile: EventProfileReferenceInterface;
    /**
     * Name of the webhook.
     */
    name: string;
    /**
     * List of subscribed channels with status.
     */
    channelsSubscribed: WebhookChannelSubscriptionInterface[];
    /**
     * Secret for webhook authentication.
     */
    secret?: string;
    /**
     * Status of the webhook.
     */
    status: WebhookStatus;
    /**
     * Adapter type (e.g., "websubhub").
     */
    adapter?: string;
}

/**
 * Interface for webhook list item (basic response from list API).
 */
export interface WebhookListItemInterface {
    /**
     * Webhook ID.
     */
    id: string;
    /**
     * Creation timestamp.
     */
    createdAt: string;
    /**
     * Updated timestamp.
     */
    updatedAt: string;
    /**
     * Webhook endpoint URL.
     */
    endpoint: string;
    /**
     * Webhook name.
     */
    name: string;
    /**
     * Webhook status.
     */
    status: WebhookStatus;
    /**
     * Self link reference.
     */
    self: string;
}

/**
 * Interface for webhook list API response.
 */
export interface WebhookListResponseInterface {
    /**
     * Array of webhooks from API.
     */
    webhooks: WebhookListItemInterface[];
}

/**
 * Interface for webhook list in UI.
 */
export interface WebhookListInterface extends WebhookListResponseInterface {
    /**
     * Total number of results.
     */
    totalResults: number;
}

/**
 * Interface for webhook configuration form properties.
 */
export interface WebhookConfigFormPropertyInterface {
    /**
     * Webhook ID (for internal use).
     */
    id: string;
    /**
     * Webhook name.
     */
    name: string;
    /**
     * Webhook endpoint URL.
     */
    endpoint: string;
    /**
     * Webhook secret.
     */
    secret: string;
    /**
     * Selected event channels/types.
     */
    channels: {
        [key: string]: boolean;
    };
}
