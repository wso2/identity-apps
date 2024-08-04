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

// TODO: Need to remove this once the API resources is moved to the features.

/**
 * Interface to contain api resources list
 */
export interface APIResourceListInterface {
    totalResults: number;
    apiResources: APIResourceInterface[];
}

/**
 * Interface to contain api resource information
 */
export interface APIResourceInterface {
    id?: string;
    name?: string;
    identifier?: string;
    scopes?: ScopeInterface[];
    type?: string;
}

/**
 * Interface to contain scope information
 */
export interface ScopeInterface {
    id?: string;
    displayName?: string;
    name?: string;
    description?: string;
}

/**
 * Interface to store authorized API list item.
 */
export interface AuthorizedAPIListItemInterface {
    id: string,
    identifier: string,
    displayName: string,
    policyId: string,
    authorizedScopes: ScopeInterface[],
    type?: string;
}
