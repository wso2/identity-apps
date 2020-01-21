/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
  * Model of the request parameters that sent to get a list of identity providers
  */
export interface IdentityProvidersRequestParameters {
    limit?: number;
    offset?: number;
    filter?: string;
    sortOrder?: string;
    sortBy?: string;
    attributes?: string;
}

/**
 * Model of the response returned by the `/identity-providers` endpoint
 */
export interface IdentityProvidersList {
    totalResults: number;
    startIndex: number;
    count: number;
    links: IdentityProvidersListLink[];
    identityProviders: IdentityProvidersListItem[];

}

export interface IdentityProvidersListLink {
    href: string;
    rel: string;
}

/**
 * Model of the Identity Provider list item
 */
export interface IdentityProvidersListItem {
    id: string;
    name: string;
    description: string;
    isEnabled: boolean;
    image: string;
    self: string;
}
