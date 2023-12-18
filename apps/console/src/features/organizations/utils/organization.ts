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

import { SessionStorageUtils } from "@wso2is/core/utils";
import { organizationConfigs } from "../../../extensions";
import { store } from "../../core/store";
import { OrganizationManagementConstants, OrganizationType } from "../constants";
import { BreadcrumbList, GenericOrganization } from "../models";

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
    public static isSuperOrganization(organization: GenericOrganization): boolean {
        return !organization || organization.id === OrganizationManagementConstants.SUPER_ORGANIZATION_ID;
    }

    /**
     * Get the type of the current organization.
     *
     * @returns The type of the current organization.
     */
    public static getOrganizationType(): OrganizationType{
        return store.getState().organization?.organizationType;
    }

    /**
     * Handles the organization switch in the legacy mode.
     * @param breadcrumbList - Breadcrumb list
     * @param organization - Organization to switch to.
     */
    public static handleLegacyOrganizationSwitch(
        breadcrumbList: BreadcrumbList,
        organization: GenericOrganization
    ): void {

        let newOrgPath: string = "";

        if (
            breadcrumbList && breadcrumbList.length > 0 &&
            OrganizationUtils.isSuperOrganization(breadcrumbList[ 0 ]) &&
            breadcrumbList[ 1 ]?.id === organization.id &&
            organizationConfigs.showSwitcherInTenants
        ) {
            newOrgPath = "/t/" + organization.name + "/" + window[ "AppUtils" ].getConfig().appBase;
        } else if (OrganizationUtils.isSuperOrganization(organization)) {
            newOrgPath = `/${ window[ "AppUtils" ].getConfig().appBase }`;
        } else {
            newOrgPath = "/o/" + organization.id + "/" + window[ "AppUtils" ].getConfig().appBase;
        }

        // Clear the callback url of the previous organization.
        SessionStorageUtils.clearItemFromSessionStorage("auth_callback_url_console");

        // Redirect the user to the newly selected organization path.
        window.location.replace(newOrgPath);
    }
}
