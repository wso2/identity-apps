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

import { EventProfileMetadataApiResponseInterface, WebhookChannelConfigInterface } from "../models/event-profile";
import { WebhookListInterface, WebhookListItemInterface } from "../models/webhooks";

/**
 * Create webhook list interface for components
 *
 * @param webhooks - Array of webhook list items.
 * @param totalResults - Total number of results, defaults to the length of the webhooks array.
 * @returns WebhookListInterface containing the webhooks and total results.
 */
export const createWebhookListInterface = (
    webhooks: WebhookListItemInterface[],
    totalResults?: number
): WebhookListInterface => ({
    totalResults: totalResults ?? webhooks.length,
    webhooks
});

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
        key: channel.name, // Use channel URI as a unique key
        name: channel.name
    }));
};
