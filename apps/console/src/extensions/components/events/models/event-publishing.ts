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

import { IdentifiableComponentInterface } from "@wso2is/core/models";

/**
 * The event format of the API response for event config editing.
 */
export interface EventPublishingAPIResponseInterface {
    displayName?: string;
    eventName?: string;
	category? :  string;
	eventSchema?: string;
	publish?: boolean;
}

/**
 * passable data type for the event edit page checkboxes.
 */
export interface eventIconInterface {
    label: string;
    value: string;
    hint?: string;
    disabled?: boolean;
}

/**
 * Prop-types for the event config edit page component.
 */
export type EventsConfigPageInterface = IdentifiableComponentInterface
