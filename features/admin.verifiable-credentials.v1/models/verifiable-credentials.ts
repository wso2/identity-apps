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
 * Interface for pagination link.
 */
export interface PaginationLink {
    rel: string;
    href: string;
}

/**
 * Interface for VC Credential Configuration (full object).
 */
export interface VCCredentialConfiguration {
    id: string;
    identifier: string;
    displayName: string;
    scope: string;
    format: string;
    type: string;
    claims: string[];
    expiresIn: number;
    offerId?: string | null;
}

/**
 * Interface for VC Credential Configuration List Item (summary view).
 */
export interface VCCredentialConfigurationListItem {
    id: string;
    identifier: string;
    displayName: string;
    scope: string;
}

/**
 * Interface for VC Credential Configuration List response.
 */
export interface VCCredentialConfigurationList {
    totalResults: number;
    links?: PaginationLink[];
    VCCredentialConfigurations: VCCredentialConfigurationListItem[];
}

/**
 * Interface for creating a new VC Credential Configuration.
 */
export interface VCCredentialConfigurationCreationModel {
    identifier: string;
    displayName?: string;
    scope: string;
    format: string;
    type: string;
    claims: string[];
    expiresIn: number;
}

/**
 * Interface for updating an existing VC Credential Configuration.
 */
export interface VCCredentialConfigurationUpdateModel {
    displayName?: string;
    scope?: string;
    format?: string;
    type?: string;
    claims?: string[];
    expiresIn?: number;
}
