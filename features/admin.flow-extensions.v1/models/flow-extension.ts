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
 * Expose/modify entry in access config.
 * Same structure is used for both expose and modify entries.
 */
interface ContextPathInterface {
    path: string;
}

/**
 * Access config for Flow Extensions.
 */
export interface ClaimAccessConfigInterface {
    expose: ContextPathInterface[];
    modify: ContextPathInterface[];
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
 * Also serves as the base shape shared by update requests and responses.
 */
export interface FlowExtensionCreateRequestInterface {
    name: string;
    description?: string;
    iconUrl?: string;
    endpoint: FlowExtensionEndpointInterface;
    accessConfig?: ClaimAccessConfigInterface;
}

/**
 * Request body for updating a Flow Extension (all fields optional).
 */
export type FlowExtensionUpdateRequestInterface = Partial<Omit<FlowExtensionCreateRequestInterface, "endpoint">> & {
    endpoint?: Partial<FlowExtensionEndpointInterface>;
};

/**
 * Full response for a single Flow Extension from the flow management API.
 */
export interface FlowExtensionResponseInterface extends FlowExtensionCreateRequestInterface {
    id: string;
    createdAt?: string;
}

/**
 * List item response for a Flow Extension.
 */
export type FlowExtensionListResponseInterface = Pick<
    FlowExtensionResponseInterface,
    "id" | "name" | "description" | "iconUrl"
>;
