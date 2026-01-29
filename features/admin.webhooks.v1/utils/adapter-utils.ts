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

import { AdapterMetadataInterface } from "../models/event-profile";

/**
 * Enum for adapter types
 */
export enum AdapterType {
    HTTP_PUBLISHER = "httppublisher",
    WEBSUB_HUB = "websubhub"
}

/**
 * Enum for adapter category types
 */
export enum AdapterCategoryType {
    PUBLISHER = "Publisher",
    PUBLISHER_SUBSCRIBER = "PublisherSubscriber"
}

/**
 * Utility functions for working with webhook adapters.
 */
export class AdapterUtils {
    /**
     * Check if the adapter is HTTP Publisher.
     *
     * @param adapter - The adapter metadata.
     * @returns True if the adapter is HTTP Publisher.
     */
    static isHttpPublisher(adapter: AdapterMetadataInterface): boolean {
        return adapter.name === AdapterType.HTTP_PUBLISHER;
    }

    /**
     * Check if the adapter is WebSub Hub.
     *
     * @param adapter - The adapter metadata.
     * @returns True if the adapter is WebSub Hub.
     */
    static isWebSubHub(adapter: AdapterMetadataInterface): boolean {
        return adapter.name === AdapterType.WEBSUB_HUB;
    }

    /**
     * Check if the adapter is a Publisher type.
     *
     * @param adapter - The adapter metadata.
     * @returns True if the adapter is a Publisher type.
     */
    static isPublisher(adapter: AdapterMetadataInterface): boolean {
        return adapter.type === AdapterCategoryType.PUBLISHER;
    }

    /**
     * Check if the adapter is a PublisherSubscriber type.
     *
     * @param adapter - The adapter metadata.
     * @returns True if the adapter is a PublisherSubscriber type.
     */
    static isPublisherSubscriber(adapter: AdapterMetadataInterface): boolean {
        return adapter.type === AdapterCategoryType.PUBLISHER_SUBSCRIBER;
    }
}
