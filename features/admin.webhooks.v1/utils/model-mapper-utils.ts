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

import { EventProfileMetadataApiResponseInterface, WebhookChannelConfigInterface } from "../models/event-profile";
import { ChildOrgSubscriptionPolicy } from "../models/shared-access";
import {
    ChildOrgSubscriptionInterface,
    WebhookChannelFormValueInterface,
    WebhookChannelSubscriptionInterface,
    WebhookConfigFormPropertyInterface,
    WebhookResponseInterface
} from "../models/webhooks";

/**
 * Transform event profile channels to webhook channel configs format.
 *
 * @param eventProfile - The event profile metadata.
 * @returns Array of webhook channel configs.
 */
export const mapEventProfileApiToUI = (
    eventProfile: EventProfileMetadataApiResponseInterface
): WebhookChannelConfigInterface[] => {
    return eventProfile.channels.map((channel: { description: string; uri: string; name: string }) => ({
        channelUri: channel.uri,
        description: channel.description,
        key: channel.name,
        name: channel.name
    }));
};

/**
 * Build the per-channel form state from a stored webhook. Every configured channel gets an
 * entry so the form has a value to bind to; organizations are read lazily from the sub-resource.
 *
 * @param channelConfigs - Available channel configurations.
 * @param subscribedChannels - Channels stored against the webhook, if any.
 * @returns Per-channel form state keyed by channel config key.
 */
export const mapSubscribedChannelsToFormData = (
    channelConfigs: WebhookChannelConfigInterface[],
    subscribedChannels?: WebhookChannelSubscriptionInterface[]
): Record<string, WebhookChannelFormValueInterface> => {
    const channels: Record<string, WebhookChannelFormValueInterface> = {};

    channelConfigs.forEach((config: WebhookChannelConfigInterface) => {
        const stored: WebhookChannelSubscriptionInterface | undefined = subscribedChannels?.find(
            (subscription: WebhookChannelSubscriptionInterface) => subscription.channelUri === config.channelUri
        );

        channels[config.key] = {
            channelId: stored?.channelId,
            organizations: [],
            subscribed: Boolean(stored),
            subscriptionPolicy: stored?.childOrgSubscription?.subscriptionPolicy
                ?? ChildOrgSubscriptionPolicy.NONE
        };
    });

    return channels;
};

/**
 * Map the form state to the `subscribedChannels` payload. The array is replaced wholesale, so
 * a channel left out is unsubscribed and every channel included carries an explicit policy.
 *
 * @param formData - The webhook form data.
 * @param channelConfigs - Available channel configurations.
 * @returns The channels to subscribe to, with their organization fanout.
 */
export const mapFormDataToSubscribedChannels = (
    formData: WebhookConfigFormPropertyInterface,
    channelConfigs: WebhookChannelConfigInterface[]
): WebhookChannelSubscriptionInterface[] => {
    const subscribedChannels: WebhookChannelSubscriptionInterface[] = [];

    channelConfigs.forEach((config: WebhookChannelConfigInterface) => {
        const channel: WebhookChannelFormValueInterface | undefined = formData.channels?.[config.key];

        if (!channel?.subscribed) {
            return;
        }

        const subscriptionPolicy: ChildOrgSubscriptionPolicy =
            channel.subscriptionPolicy ?? ChildOrgSubscriptionPolicy.NONE;
        const childOrgSubscription: ChildOrgSubscriptionInterface = { subscriptionPolicy };

        // Always sent for SELECTED_ORGS_ONLY: the server treats a supplied channel as the
        // complete desired state and rejects the policy without a list.
        if (subscriptionPolicy === ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY) {
            childOrgSubscription.organizations = channel.organizations.map((orgId: string) => ({ orgId }));
        }

        subscribedChannels.push({
            channelUri: config.channelUri,
            childOrgSubscription
        });
    });

    return subscribedChannels;
};

/**
 * Map the form state to the v1 `channelsSubscribed` payload. v1 carries no fanout, so the
 * policy is dropped: the server ignores child organization subscriptions while it is off.
 *
 * @param formData - The webhook form data.
 * @param channelConfigs - Available channel configurations.
 * @returns The URIs of the subscribed channels.
 */
export const mapFormDataToChannelUris = (
    formData: WebhookConfigFormPropertyInterface,
    channelConfigs: WebhookChannelConfigInterface[]
): string[] => {
    const channelUris: string[] = [];

    channelConfigs.forEach((config: WebhookChannelConfigInterface) => {
        if (formData.channels?.[config.key]?.subscribed) {
            channelUris.push(config.channelUri);
        }
    });

    return channelUris;
};

/**
 * The subscribed channels of a webhook, whichever version returned it: v2 reports them as
 * `subscribedChannels` and v1 as `channelsSubscribed`, both carrying the channel URI.
 *
 * @param webhook - The stored webhook, if any.
 * @returns The subscribed channels, or undefined when the webhook has none.
 */
export const getSubscribedChannels = (
    webhook?: WebhookResponseInterface
): WebhookChannelSubscriptionInterface[] | undefined => webhook?.subscribedChannels ?? webhook?.channelsSubscribed;
