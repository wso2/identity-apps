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

/**
 * Interface for individual event metadata.
 */
export interface EventMetadataInterface {
    /**
     * Name of the event.
     */
    eventName: string;
    /**
     * Description of the event.
     */
    eventDescription: string;
    /**
     * URI of the event.
     */
    eventUri: string;
}

/**
 * Interface for event channel metadata.
 */
export interface EventChannelMetadataInterface {
    /**
     * Name of the channel.
     */
    name: string;
    /**
     * Description of the channel.
     */
    description: string;
    /**
     * URI of the channel.
     */
    uri: string;
    /**
     * List of events in this channel.
     */
    events: EventMetadataInterface[];
}

/**
 * Interface for event profile metadata response (used for profile details API).
 */
export interface EventProfileMetadataApiResponseInterface {
    /**
     * Name of the event profile.
     */
    profile: string;
    /**
     * URI of the event profile.
     */
    uri: string;
    /**
     * List of available channels in this profile.
     */
    channels: EventChannelMetadataInterface[];
}

/**
 * Interface for event profile reference (used in webhook payloads/responses).
 */
export interface EventProfileReferenceInterface {
    /**
     * Name of the event profile.
     */
    name: string;
    /**
     * URI of the event profile.
     */
    uri: string;
}

/**
 * Interface for webhook channel configuration derived from event profile.
 */
export interface WebhookChannelConfigInterface {
    /**
     * Name of the channel.
     */
    name: string;
    /**
     * Description of the channel.
     */
    description: string;
    /**
     * URI of the channel.
     */
    channelUri: string;
    /**
     * Unique key for the channel.
     */
    key: string;
}

/**
 * Interface for event profile list item in metadata response.
 */
export interface EventProfileListItemInterface {
    /**
     * Name of the event profile.
     */
    name: string;
    /**
     * URI of the event profile.
     */
    uri: string;
    /**
     * Self link for the event profile.
     */
    self: string;
}

/**
 * Interface for adapter information in metadata response.
 */
export interface AdapterMetadataInterface {
    /**
     * Name of the adapter (e.g., "httppublisher", "websubhub").
     */
    name: string;
    /**
     * Type of the adapter (e.g., "Publisher", "PublisherSubscriber").
     */
    type: string;
}

/**
 * Interface for webhooks metadata API response.
 */
export interface WebhooksMetadataApiResponseInterface {
    /**
     * List of available event profiles.
     */
    profiles: EventProfileListItemInterface[];
    /**
     * Active adapter information.
     */
    adapter: AdapterMetadataInterface;
}
