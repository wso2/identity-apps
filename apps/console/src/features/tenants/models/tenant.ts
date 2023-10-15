/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
 * Interface to capture details of new tenant
 */
export interface NewTenantInfo {
    domain: string;
}

/**
 *  Interface of a tenant.
 */
export interface TenantInfo {
    id: string;
    domain: string;
    associationType: string;
    default: boolean;
}

/**
 * Interface for the response returned by the get associated tenants request.
 */
export interface TenantRequestResponse {
    totalResults: number;
    startIndex: number;
    count: number;
    associatedTenants: TenantInfo[];
}

export interface TriggerPropTypesInterface extends IdentifiableComponentInterface {
    currentTenant: string;
}
