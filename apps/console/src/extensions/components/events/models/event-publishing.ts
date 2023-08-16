/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
