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
 * Interface for VC Template (full object).
 */
export interface VCTemplate {
    id: string;
    identifier: string;
    displayName: string;
    description?: string;
    format: string;
    claims: string[];
    expiresIn: number;
    offerId?: string | null;
}

/**
 * Interface for VC Template List Item (summary view).
 */
export interface VCTemplateListItem {
    id: string;
    identifier: string;
    displayName: string;
}

/**
 * Interface for VC Template List response.
 */
export interface VCTemplateList {
    totalResults: number;
    links?: PaginationLink[];
    VCTemplates: VCTemplateListItem[];
}

/**
 * Interface for creating a new VC Template.
 */
export interface VCTemplateCreationModel {
    identifier: string;
    displayName?: string;
    description?: string;
    format: string;
    claims: string[];
    expiresIn: number;
}

/**
 * Interface for updating an existing VC Template.
 */
export interface VCTemplateUpdateModel {
    displayName?: string;
    description?: string;
    format?: string;
    claims?: string[];
    expiresIn?: number;
}
