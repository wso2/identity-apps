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
    AccessConfigInterface,
    EndpointResponseInterface,
    EncryptionInterface
} from "@wso2is/admin.actions.v1/models/actions";

// Re-export shared sub-types from admin.actions.v1 to keep one source of truth.
export type {
    AccessConfigInterface,
    AuthenticationType,
    AuthenticationPropertiesInterface,
    ContextPathInterface,
    EncryptionInterface,
    EndpointResponseInterface
} from "@wso2is/admin.actions.v1/models/actions";

/**
 * Endpoint configuration used in In-Flow Extension create/update requests.
 */
export interface InFlowExtensionEndpointInterface {
    uri: string;
    authentication: {
        type: string;
        properties?: Record<string, string>;
    };
    allowedHeaders?: string[];
}

/**
 * Request body for creating an In-Flow Extension.
 */
export interface InFlowExtensionCreateRequestInterface {
    name: string;
    description?: string;
    iconUrl?: string;
    endpoint: InFlowExtensionEndpointInterface;
    accessConfig?: AccessConfigInterface;
    encryption?: EncryptionInterface;
}

/**
 * Request body for updating an In-Flow Extension (all fields optional).
 */
export interface InFlowExtensionUpdateRequestInterface {
    name?: string;
    description?: string;
    iconUrl?: string;
    endpoint?: Partial<InFlowExtensionEndpointInterface>;
    accessConfig?: AccessConfigInterface;
    encryption?: EncryptionInterface;
    flowTypeOverrides?: Record<string, AccessConfigInterface>;
}

/**
 * Full response for a single In-Flow Extension from the flow management API.
 */
export interface InFlowExtensionResponseInterface {
    id: string;
    name: string;
    description?: string;
    iconUrl?: string;
    endpoint: EndpointResponseInterface;
    accessConfig?: AccessConfigInterface;
    encryption?: EncryptionInterface;
    flowTypeOverrides?: Record<string, AccessConfigInterface>;
    createdAt?: string;
}

/**
 * List item response for In-Flow Extensions.
 */
export interface InFlowExtensionBasicResponseInterface {
    id: string;
    name: string;
    description?: string;
    iconUrl?: string;
}

/**
 * Request body for checking In-Flow Extension name availability.
 */
export interface InFlowExtensionNameCheckRequestInterface {
    name: string;
    excludeId?: string;
}

/**
 * Response for In-Flow Extension name availability check.
 */
export interface InFlowExtensionNameCheckResponseInterface {
    available: boolean;
}
