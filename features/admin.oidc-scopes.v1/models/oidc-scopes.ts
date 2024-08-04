/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { ExtendedExternalClaimInterface } from "@wso2is/admin.applications.v1/components/settings";

/**
 *  OIDC Scopes list model.
 */
export interface OIDCScopesListInterface {
    /**
     * Name of the scope.
     */
    name?: string;
    /**
     * Display name of the scope.
     */
    displayName?: string;
    /**
     * List of claims belong to the scope.
     */
    claims?: string[];
    /**
     * Description of the scope
     */
    description?: string;
}

export interface OIDCScopesClaimsListInterface {
    /**
     * Name of the scope.
     */
    name?: string;
    /**
     * Display name of the scope.
     */
    displayName?: string;
    /**
     * List of claims belong to the scope.
     */
    claims?: ExtendedExternalClaimInterface[];
    /**
     * Description of the scope
     */
    description?: string;
    /**
     * Scope selected or not
     */
    selected?: boolean;
}
