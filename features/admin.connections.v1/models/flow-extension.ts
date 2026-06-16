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

import {
    AccessConfigInterface
} from "@wso2is/admin.actions.v1/models/actions";

// Re-export shared sub-types from admin.actions.v1 to keep one source of truth.
export type {
    AccessConfigInterface,
    AuthenticationType,
    AuthenticationPropertiesInterface,
    ContextPathInterface
} from "@wso2is/admin.actions.v1/models/actions";

/**
 * Endpoint response shape returned by the Flow Extension API.
 * Defined locally because EndpointResponseInterface in admin.actions.v1 is not exported.
 */
export interface FlowExtensionEndpointResponseInterface {
    uri: string;
    authentication: {
        type: string;
        properties?: Record<string, string>;
    };
    allowedHeaders?: string[];
    allowedParameters?: string[];
}

/**
 * Endpoint configuration used in Flow Extension create/update requests.
 */
export interface FlowExtensionEndpointInterface {
    uri: string;
    authentication: {
        type: string;
        properties?: Record<string, string>;
    };
    allowedHeaders?: string[];
}

/**
 * Request body for creating a Flow Extension.
 */
export interface FlowExtensionCreateRequestInterface {
    name: string;
    description?: string;
    iconUrl?: string;
    endpoint: FlowExtensionEndpointInterface;
    accessConfig?: AccessConfigInterface;
}

/**
 * Request body for updating a Flow Extension (all fields optional).
 */
export interface FlowExtensionUpdateRequestInterface {
    name?: string;
    description?: string;
    iconUrl?: string;
    endpoint?: Partial<FlowExtensionEndpointInterface>;
    accessConfig?: AccessConfigInterface;
    flowTypeOverrides?: Record<string, AccessConfigInterface>;
}

/**
 * Full response for a single Flow Extension from the flow management API.
 */
export interface FlowExtensionResponseInterface {
    id: string;
    name: string;
    description?: string;
    iconUrl?: string;
    endpoint: FlowExtensionEndpointResponseInterface;
    accessConfig?: AccessConfigInterface;
    flowTypeOverrides?: Record<string, AccessConfigInterface>;
    createdAt?: string;
}

/**
 * List item response for a Flow Extension.
 */
export interface FlowExtensionBasicResponseInterface {
    id: string;
    name: string;
    description?: string;
    iconUrl?: string;
}
