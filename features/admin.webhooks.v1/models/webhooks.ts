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

import { EventProfileReferenceInterface } from "./event-profile";
import { ChildOrgSubscriptionPolicy } from "./shared-access";

/**
 * Enum for webhook status.
 *
 * On read, the derived aggregate of the per-channel statuses, so it may be partial while they
 * settle. Set on create, then changed through the activate and deactivate sub-resources.
 */
export enum WebhookStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    PARTIALLY_ACTIVE = "PARTIALLY_ACTIVE",
    PARTIALLY_INACTIVE = "PARTIALLY_INACTIVE"
}

export enum ChannelStatus {
    SUBSCRIPTION_PENDING = "SUBSCRIPTION_PENDING",
    SUBSCRIPTION_ACCEPTED = "SUBSCRIPTION_ACCEPTED",
    SUBSCRIPTION_ERROR = "SUBSCRIPTION_ERROR",
    UNSUBSCRIPTION_PENDING = "UNSUBSCRIPTION_PENDING",
    UNSUBSCRIPTION_ACCEPTED = "UNSUBSCRIPTION_ACCEPTED",
    UNSUBSCRIPTION_ERROR = "UNSUBSCRIPTION_ERROR"
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
 * A child organization receiving events for a channel. Requests supply `orgId` only; the
 * sub-resource returns the same objects with the name and parent resolved.
 */
export interface OrganizationReferenceInterface {
    /**
     * Organization ID. Only this organization is subscribed — its own children are not
     * included, and children created later are not added.
     */
    orgId: string;
    /**
     * Organization name. Read-only.
     */
    orgName?: string;
    /**
     * Immediate parent organization, for reconstructing the hierarchy. Read-only.
     *
     * May reference an organization absent from the same response, either because it is not
     * itself subscribed or because it falls on another page.
     */
    parentOrgId?: string;
}

/**
 * Child organization fanout configuration for a single channel.
 */
export interface ChildOrgSubscriptionInterface {
    /**
     * Fanout policy. Round-trips between request and response.
     */
    subscriptionPolicy: ChildOrgSubscriptionPolicy;
    /**
     * Explicit organizations to receive events. Accepted only under `SELECTED_ORGS_ONLY`.
     *
     * Write-only and preserved when omitted. Must be non-empty when supplied: clearing fanout is
     * expressed by setting the policy to `NONE`, never by an empty array.
     */
    organizations?: OrganizationReferenceInterface[];
    /**
     * Link to the paginated child organizations receiving events for this channel.
     *
     * Returned by the channel resource only, never by the webhook representation.
     */
    organizationsRef?: string;
}

/**
 * A subscribed channel as it appears on the webhook resource.
 *
 * Maps to `WebhookSubscription` in the Webhook Management API v2.
 */
export interface WebhookChannelSubscriptionInterface {
    /**
     * Channel URI to subscribe to.
     */
    channelUri: string;
    /**
     * Per-channel child organization fanout.
     */
    childOrgSubscription?: ChildOrgSubscriptionInterface;
    /**
     * Unique identifier of this subscribed channel, used to address the channel resource.
     * Read-only.
     */
    channelId?: string;
    /**
     * Link to this subscribed channel. Read-only.
     */
    self?: string;
    /**
     * Status of the subscription. Read-only.
     */
    status?: ChannelStatus;
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
     * Channels to subscribe to, each with its optional organization fanout. Sent to v2 only.
     */
    subscribedChannels?: WebhookChannelSubscriptionInterface[];
    /**
     * Channel URIs to subscribe to. The v1 form of `subscribedChannels`, carrying no fanout.
     */
    channelsSubscribed?: string[];
    /**
     * Secret used to sign webhook payloads.
     */
    secret?: string;
    /**
     * Desired webhook status on create.
     */
    status?: WebhookStatus;
}

/**
 * Interface for webhook update request payload.
 *
 * A full replacement: an omitted writable property is cleared, except the write-only `secret`
 * and `organizations`. `status` is accepted by v1 only.
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
     * The channels this webhook should be subscribed to. Replaced wholesale. Sent to v2 only.
     */
    subscribedChannels?: WebhookChannelSubscriptionInterface[];
    /**
     * Channel URIs to subscribe to. The v1 form of `subscribedChannels`, carrying no fanout.
     */
    channelsSubscribed?: string[];
    /**
     * Secret for webhook authentication. Omitting it preserves the stored secret.
     */
    secret?: string;
    /**
     * Desired webhook status. Accepted by v1 only.
     */
    status?: WebhookStatus;
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
     * Subscribed channels with their status and fanout policy, as returned by v2. The
     * organizations themselves are not included — follow each channel's `self` link.
     */
    subscribedChannels?: WebhookChannelSubscriptionInterface[];
    /**
     * Subscribed channels as returned by v1, carrying the URI and status but no fanout policy.
     */
    channelsSubscribed?: WebhookChannelSubscriptionInterface[];
    /**
     * Secret for webhook authentication. Never returned by the API.
     */
    secret?: string;
    /**
     * Aggregate status derived from the per-channel subscription statuses.
     */
    status: WebhookStatus;
    /**
     * Adapter type (e.g., "websubhub").
     */
    adapter?: string;
}

/**
 * Paginated list of the child organizations currently receiving events for a channel.
 *
 * Read-only, never sent back: it holds one page, so echoing it into a write would unsubscribe
 * every organization outside that page.
 */
export interface SubscribedOrganizationListInterface {
    /**
     * Channel URI this list belongs to.
     */
    channelUri: string;
    /**
     * Fanout policy configured for this channel, so the list can be read without a second call.
     */
    subscriptionPolicy: ChildOrgSubscriptionPolicy;
    /**
     * Total number of child organizations subscribed to this channel.
     */
    totalResults: number;
    /**
     * Index of the first record in this response.
     */
    startIndex: number;
    /**
     * Number of records returned in this response.
     */
    count: number;
    /**
     * The child organizations on this page, ordered parents before children.
     */
    organizations: OrganizationReferenceInterface[];
}

/**
 * Navigation link.
 */
interface WebhookLinkInterface {
    href: string;
    rel: string;
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
    /**
     * Index of the first record in this response.
     */
    startIndex?: number;
    /**
     * Number of records returned in this response.
     */
    count?: number;
    /**
     * Navigation links. Contains `next` and `previous` where applicable.
     */
    links?: WebhookLinkInterface[];
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
 * Per-channel form state.
 */
export interface WebhookChannelFormValueInterface {
    /**
     * Identifier of the stored channel subscription, when the channel is already subscribed.
     *
     * Needed to address the channel organizations sub-resource, which is the only place the
     * selected organizations can be read back from.
     */
    channelId?: string;
    /**
     * Whether the channel is subscribed.
     */
    subscribed: boolean;
    /**
     * Child organization fanout policy for this channel.
     */
    subscriptionPolicy: ChildOrgSubscriptionPolicy;
    /**
     * IDs of the explicitly selected organizations. Only meaningful under `SELECTED_ORGS_ONLY`.
     */
    organizations: string[];
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
     * Per-channel subscription state, keyed by channel config key.
     */
    channels: {
        [key: string]: WebhookChannelFormValueInterface;
    };
}
