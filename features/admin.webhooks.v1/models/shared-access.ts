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

/**
 * Per-channel fanout policy controlling which *child* organizations of the webhook's own
 * organization receive events for that channel.
 *
 * Maps to `ChildOrgSubscription.subscriptionPolicy` in the Webhook Management API v2.
 */
export enum ChildOrgSubscriptionPolicy {
    /**
     * No organization-level fanout.
     */
    NONE = "NONE",
    /**
     * Events fanned out to every child organization, including ones created in the future.
     */
    ALL_EXISTING_AND_FUTURE_ORGS = "ALL_EXISTING_AND_FUTURE_ORGS",
    /**
     * Events delivered only to the explicitly listed organizations. Selected organizations
     * do not include their children.
     */
    SELECTED_ORGS_ONLY = "SELECTED_ORGS_ONLY"
}

/**
 * How to treat the existing fanout when a channel is narrowed from every child organization to an
 * explicit few.
 *
 * Mirrors the choice the user and application sharing forms offer on the same transition: the set
 * currently receiving events is either carried over as the starting selection, or discarded.
 */
export enum PolicySwitchApproach {
    /**
     * Start from the organizations currently receiving events for this channel.
     */
    PRESERVE = "preserve",
    /**
     * Start from an empty selection.
     */
    RESET = "reset"
}

/**
 * Tenant-level event publishing policy reported by the (unversioned) webhooks metadata API.
 *
 * Retained because the metadata endpoint is still served from v1. It is unrelated to the
 * per-channel {@link ChildOrgSubscriptionPolicy} introduced in v2.
 */
export enum EventPublishingOrgSharePolicy {
    NO_SHARING = "NO_SHARING",
    IMMEDIATE_EXISTING_AND_FUTURE_ORGS = "IMMEDIATE_EXISTING_AND_FUTURE_ORGS",
}
