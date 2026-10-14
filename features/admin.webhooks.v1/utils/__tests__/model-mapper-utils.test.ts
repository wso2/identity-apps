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

import { WebhookChannelConfigInterface } from "../../models/event-profile";
import { ChildOrgSubscriptionPolicy } from "../../models/shared-access";
import {
    WebhookChannelFormValueInterface,
    WebhookChannelSubscriptionInterface,
    WebhookConfigFormPropertyInterface
} from "../../models/webhooks";
import {
    getSubscribedChannels,
    mapFormDataToChannelUris,
    mapFormDataToSubscribedChannels,
    mapSubscribedChannelsToFormData
} from "../model-mapper-utils";

const CHANNEL_CONFIGS: WebhookChannelConfigInterface[] = [
    {
        channelUri: "https://schemas.identity.wso2.org/events/login",
        description: "Login success or failed",
        key: "Logins",
        name: "Logins"
    },
    {
        channelUri: "https://schemas.identity.wso2.org/events/token",
        description: "Access token issued or revoked",
        key: "Tokens",
        name: "Tokens"
    }
];

const channelValue = (
    overrides: Partial<WebhookChannelFormValueInterface> = {}
): WebhookChannelFormValueInterface => ({
    organizations: [],
    subscribed: true,
    subscriptionPolicy: ChildOrgSubscriptionPolicy.NONE,
    ...overrides
});

const formData = (
    channels: Record<string, WebhookChannelFormValueInterface>
): WebhookConfigFormPropertyInterface => ({
    channels,
    endpoint: "https://example.com/webhook",
    id: "webhook-1",
    name: "Sample Webhook",
    secret: ""
});

describe("mapSubscribedChannelsToFormData", () => {
    it("marks every configured channel unsubscribed with the NONE default when creating", () => {
        const result: Record<string, WebhookChannelFormValueInterface> =
            mapSubscribedChannelsToFormData(CHANNEL_CONFIGS);

        expect(Object.keys(result)).toEqual([ "Logins", "Tokens" ]);
        expect(result.Logins.subscribed).toBe(false);
        expect(result.Logins.subscriptionPolicy).toBe(ChildOrgSubscriptionPolicy.NONE);
    });

    it("carries the stored policy and channel id onto the subscribed channel", () => {
        const stored: WebhookChannelSubscriptionInterface[] = [
            {
                channelId: "channel-1",
                channelUri: "https://schemas.identity.wso2.org/events/login",
                childOrgSubscription: { subscriptionPolicy: ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY }
            }
        ];

        const result: Record<string, WebhookChannelFormValueInterface> =
            mapSubscribedChannelsToFormData(CHANNEL_CONFIGS, stored);

        expect(result.Logins.subscribed).toBe(true);
        expect(result.Logins.channelId).toBe("channel-1");
        expect(result.Logins.subscriptionPolicy).toBe(ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY);
        // The API never returns the organizations, so the form must start empty and not dirty.
        expect(result.Logins.organizations).toEqual([]);
        expect(result.Tokens.subscribed).toBe(false);
    });
});

describe("mapFormDataToSubscribedChannels", () => {
    it("omits unsubscribed channels so they are unsubscribed by the wholesale replace", () => {
        const result: WebhookChannelSubscriptionInterface[] = mapFormDataToSubscribedChannels(
            formData({
                Logins: channelValue(),
                Tokens: channelValue({ subscribed: false })
            }),
            CHANNEL_CONFIGS
        );

        expect(result).toHaveLength(1);
        expect(result[0].channelUri).toBe("https://schemas.identity.wso2.org/events/login");
    });

    it("sends NONE explicitly for a channel the user never expanded", () => {
        const result: WebhookChannelSubscriptionInterface[] = mapFormDataToSubscribedChannels(
            formData({ Logins: channelValue(), Tokens: channelValue({ subscribed: false }) }),
            CHANNEL_CONFIGS
        );

        expect(result[0].childOrgSubscription).toEqual({
            subscriptionPolicy: ChildOrgSubscriptionPolicy.NONE
        });
    });

    it("sends organizations even when the selection was not touched, since the server does not preserve it", () => {
        const result: WebhookChannelSubscriptionInterface[] = mapFormDataToSubscribedChannels(
            formData({
                Logins: channelValue({
                    channelId: "channel-1",
                    organizations: [ "org-a" ],
                    subscriptionPolicy: ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY
                }),
                Tokens: channelValue({ subscribed: false })
            }),
            CHANNEL_CONFIGS
        );

        expect(result[0].childOrgSubscription.subscriptionPolicy)
            .toBe(ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY);
        expect(result[0].childOrgSubscription.organizations).toEqual([ { orgId: "org-a" } ]);
    });

    it("sends organizations once the user has changed the selection", () => {
        const result: WebhookChannelSubscriptionInterface[] = mapFormDataToSubscribedChannels(
            formData({
                Logins: channelValue({
                    organizations: [ "org-a", "org-b" ],
                    subscriptionPolicy: ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY
                }),
                Tokens: channelValue({ subscribed: false })
            }),
            CHANNEL_CONFIGS
        );

        expect(result[0].childOrgSubscription.organizations).toEqual([
            { orgId: "org-a" },
            { orgId: "org-b" }
        ]);
    });

    it("never sends organizations under a policy other than SELECTED_ORGS_ONLY", () => {
        const result: WebhookChannelSubscriptionInterface[] = mapFormDataToSubscribedChannels(
            formData({
                Logins: channelValue({
                    organizations: [ "org-a" ],
                    subscriptionPolicy: ChildOrgSubscriptionPolicy.ALL_EXISTING_AND_FUTURE_ORGS
                }),
                Tokens: channelValue({ subscribed: false })
            }),
            CHANNEL_CONFIGS
        );

        expect(result[0].childOrgSubscription).toEqual({
            subscriptionPolicy: ChildOrgSubscriptionPolicy.ALL_EXISTING_AND_FUTURE_ORGS
        });
    });
});

describe("mapFormDataToChannelUris", () => {
    it("returns only the URIs of subscribed channels", () => {
        const result: string[] = mapFormDataToChannelUris(
            formData({
                Logins: channelValue({ subscribed: true }),
                Tokens: channelValue({ subscribed: false })
            }),
            CHANNEL_CONFIGS
        );

        expect(result).toEqual([ "https://schemas.identity.wso2.org/events/login" ]);
    });

    it("drops the organization policy, which v1 cannot express", () => {
        const result: string[] = mapFormDataToChannelUris(
            formData({
                Logins: channelValue({
                    organizations: [ "org-1", "org-2" ],
                    subscribed: true,
                    subscriptionPolicy: ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY
                })
            }),
            CHANNEL_CONFIGS
        );

        expect(result).toEqual([ "https://schemas.identity.wso2.org/events/login" ]);
    });

    it("returns an empty array when nothing is subscribed", () => {
        expect(mapFormDataToChannelUris(formData({}), CHANNEL_CONFIGS)).toEqual([]);
    });
});

describe("getSubscribedChannels", () => {
    const channel: WebhookChannelSubscriptionInterface = {
        channelUri: "https://schemas.identity.wso2.org/events/login"
    };

    it("reads the v2 subscribedChannels field", () => {
        expect(getSubscribedChannels({ subscribedChannels: [ channel ] } as never)).toEqual([ channel ]);
    });

    it("falls back to the v1 channelsSubscribed field", () => {
        expect(getSubscribedChannels({ channelsSubscribed: [ channel ] } as never)).toEqual([ channel ]);
    });

    it("returns undefined when the webhook is absent", () => {
        expect(getSubscribedChannels(undefined)).toBeUndefined();
    });
});
