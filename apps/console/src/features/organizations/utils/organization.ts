/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { store } from "../../core/store";
import { OrganizationManagementConstants, OrganizationType } from "../constants";
import { GenericOrganization } from "../models";

export class OrganizationUtils {
    /**
     * Private constructor to prevent object instantiation.
     */
    private constructor() { }

    /**
     * Checks if the selected organization is the Super organization.
     *
     * @param organization - Organization object.
     *
     * @returns if selected organization is the Super organization
     */
    public static isRootOrganization(organization: GenericOrganization): boolean {
        return !organization || organization.id === OrganizationManagementConstants.ROOT_ORGANIZATION_ID;
    }

    /**
     * Returns true if the current organization is the root organization.
     *
     * @returns if the current organization is the root organization.
     */
    public static isCurrentOrganizationRoot(): boolean {
        return store.getState().organization?.organization?.id
            === OrganizationManagementConstants.ROOT_ORGANIZATION_ID;
    }

    /**
     * Get the type of the current organization.
     *
     * @returns The type of the current organization.
     */
    public static getOrganizationType(): OrganizationType{
        return store.getState().organization?.organizationType;
    }
}
