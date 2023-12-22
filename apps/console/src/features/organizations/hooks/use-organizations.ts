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

import { useContext } from "react";
import { MultitenantConstants } from "../../core/constants/multitenant-constants";
import useAppSettings from "../../core/hooks/use-app-settings";
import OrganizationsContext, { OrganizationsContextProps } from "../context/organizations-context";

/**
 * Interface for the return type of the UseOrganizations hook.
 */
export interface UseOrganizationsInterface extends OrganizationsContextProps {
    /**
     * Set the organization id in the local storage.
     * @param orgId - Organization id.
     */
    setOrgIdInLocalStorage: (orgId: string) => void;
    /**
     * Set the user's organization in the local storage.
     * @param userOrg - User's organization.
     */
    /**
     * Sets the user organization in local storage.
     * @param userOrg - The user organization to set.
     */
    setUserOrgInLocalStorage: (userOrg: string) => void;
    /**
     * Retrieves the organization ID from local storage.
     */
    getOrgIdInLocalStorage: () => string;
    /**
     * Retrieves the user organization from local storage.
     */
    getUserOrgInLocalStorage: () => string;
    /**
     * Removes the organization ID from local storage.
     */
    removeOrgIdInLocalStorage: () => void;
    /**
     * Removes the user organization from local storage.
     */
    removeUserOrgInLocalStorage: () => void;
    /**
     * Transforms the tenant domain to the correct format.
     *
     * @param tenantDomain - Tenant domain.
     * @returns Transformed tenant domain.
     */
    transformTenantDomain: (tenantDomain: string) => string;
}

/**
 * Hook that provides access to the Organizations context.
 *
 * @returns An object containing the current Organizations context.
 */
const useOrganizations = (): UseOrganizationsInterface => {
    const context: OrganizationsContextProps = useContext(OrganizationsContext);

    const { getLocalStorageSetting, setLocalStorageSetting, removeLocalStorageSetting } = useAppSettings();

    if (context === undefined) {
        throw new Error("useOrganizations must be used within a OrganizationsProvider");
    }

    /**
     * Transforms the tenant domain to the correct format.
     *
     * @param tenantDomain - Tenant domain.
     * @returns Transformed tenant domain.
     */
    const transformTenantDomain = (tenantDomain: string): string => {
        // With the latest Authz framework, `carbon.super` is resolved as `Super`.
        if (tenantDomain === MultitenantConstants.SUPER_TENANT_DISPLAY_NAME) {
            return MultitenantConstants.SUPER_TENANT_DOMAIN_NAME;
        }

        return tenantDomain;
    };

    /**
     * Sets the user organization in local storage.
     * @param userOrg - The user organization to set.
     */
    const setUserOrgInLocalStorage = (userOrg: string): void => {
        setLocalStorageSetting("user-org", userOrg);
    };

    /**
     * Sets the organization ID in local storage.
     * @param orgId - The organization ID to set.
     */
    const setOrgIdInLocalStorage = (orgId: string): void => {
        setLocalStorageSetting("org-id", orgId);
    };

    /**
     * Retrieves the user organization from local storage.
     * @returns The user organization stored in local storage.
     */
    const getUserOrgInLocalStorage = (): string => {
        return getLocalStorageSetting("user-org");
    };

    /**
     * Retrieves the organization ID from local storage.
     * @returns The organization ID stored in local storage.
     */
    const getOrgIdInLocalStorage = (): string => {
        return getLocalStorageSetting("org-id");
    };

    /**
     * Removes the user organization from local storage.
     */
    const removeUserOrgInLocalStorage = (): void => {
        removeLocalStorageSetting("user-org");
    };

    /**
     * Removes the organization ID from local storage.
     */
    const removeOrgIdInLocalStorage = (): void => {
        removeLocalStorageSetting("org-id");
    };

    return {
        ...context,
        getOrgIdInLocalStorage,
        getUserOrgInLocalStorage,
        removeOrgIdInLocalStorage,
        removeUserOrgInLocalStorage,
        setOrgIdInLocalStorage,
        setUserOrgInLocalStorage,
        transformTenantDomain
    };
};

export default useOrganizations;
