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

import { BasicUserInfo, useAuthContext } from "@asgardeo/auth-react";
import { TokenConstants } from "@wso2is/core/constants";
import { SessionStorageUtils } from "@wso2is/core/utils";
import useOrganizations from "./use-organizations";
import { organizationConfigs } from "../../../extensions";
import { BreadcrumbList, GenericOrganization } from "../models";
import { OrganizationUtils } from "../utils";

/**
 * Interface for the return type of the `useOrganizationSwitch` hook.
 */
export interface UseOrganizationSwitchInterface {
    /**
     * Defines if the organization switch is loading.
     */
    isOrganizationSwitchRequestLoading: boolean;
    /**
     * Switches the organization of the user.
     * @param orgId - The organization ID.
     * @returns A promise containing the basic user info.
     */
    switchOrganization: (orgId: string) => Promise<BasicUserInfo>;
    /**
     * Handles the organization switch in the legacy mode.
     * @param breadcrumbList - Breadcrumb list
     * @param organization - Organization to switch to.
     */
    switchOrganizationInLegacyMode: (breadcrumbList: BreadcrumbList, organization: GenericOrganization) => void;
}

/**
 * Hook that provides access to the branding preference context.
 * @returns An object containing the branding preference.
 */
const useOrganizationSwitch = (): UseOrganizationSwitchInterface => {
    const { requestCustomGrant } = useAuthContext();

    const { isOrganizationSwitchRequestLoading, updateOrganizationSwitchRequestLoadingState } = useOrganizations();

    /**
     * Switches the organization of the user.
     * @param orgId - The organization ID.
     * @returns A promise containing the basic user info.
     */
    const switchOrganization = async (orgId: string): Promise<BasicUserInfo> => {
        updateOrganizationSwitchRequestLoadingState(true);

        let response: BasicUserInfo = null;

        await requestCustomGrant(
            {
                attachToken: false,
                data: {
                    client_id: "{{clientID}}",
                    grant_type: "organization_switch",
                    scope: window[ "AppUtils" ].getConfig().idpConfigs?.scope.join(" ") ?? TokenConstants.SYSTEM_SCOPE,
                    switching_organization: orgId,
                    token: "{{token}}"
                },
                id: "orgSwitch",
                returnsSession: true,
                signInRequired: true
            },
            async (grantResponse: BasicUserInfo) => {
                response = grantResponse;
            }
        );

        updateOrganizationSwitchRequestLoadingState(false);

        return response;
    };

    /**
     * Handles the organization switch in the legacy mode.
     * @param breadcrumbList - Breadcrumb list
     * @param org - Organization to switch to.
     */
    const switchOrganizationInLegacyMode = (breadcrumbList: BreadcrumbList, org: GenericOrganization): void => {

        let newOrgPath: string = "";

        if (
            breadcrumbList && breadcrumbList.length > 0
            && OrganizationUtils.isSuperOrganization(breadcrumbList[0])
            && breadcrumbList[ 1 ]?.id === org.id
            && organizationConfigs.showSwitcherInTenants
        ) {
            newOrgPath = "/t/" + org.name + "/" + window[ "AppUtils" ].getConfig().appBase;
        } else if (OrganizationUtils.isSuperOrganization(org)) {
            newOrgPath = `/${ window[ "AppUtils" ].getConfig().appBase }`;
        } else {
            newOrgPath = "/o/" + org.id + "/" + window[ "AppUtils" ].getConfig().appBase;
        }

        // Clear the callback url of the previous organization.
        SessionStorageUtils.clearItemFromSessionStorage("auth_callback_url_console");

        // Redirect the user to the newly selected organization path.
        window.location.replace(newOrgPath);
    };

    return {
        isOrganizationSwitchRequestLoading,
        switchOrganization,
        switchOrganizationInLegacyMode
    };
};

export default useOrganizationSwitch;
