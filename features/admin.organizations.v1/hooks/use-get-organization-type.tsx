/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppState } from "@wso2is/admin.core.v1";
import { useSelector } from "react-redux";
import { OrganizationType } from "../constants";

/**
 * Interface for the useGetCurrentOrganizationType hook.
 */
interface UseGetOrganizationTypeInterface {
    /**
     * Type of the organization.
     */
    organizationType: OrganizationType;
    /**
     * Checks if the organization is the super organization.
     * @returns True if the organization is a super organization.
     */
    isSuperOrganization: () => boolean;
    /**
     * Checks if the organization is a first level organization.
     * @returns True if the organization is a first level organization.
     */
    isFirstLevelOrganization: () => boolean;
    /**
     * Checks if the organization is a sub organization.
     * @returns True if the organization is a sub organization.
     */
    isSubOrganization: () => boolean;
}

/**
 * Hook to get the type of the organization.
 *
 * @returns An object containing the organization type and helper methods.
 */
export const useGetCurrentOrganizationType = (): UseGetOrganizationTypeInterface => {
    const orgType: OrganizationType = useSelector(
        (state: AppState) => state.organization.organizationType
    );

    /**
     * Checks if the organization is the super organization.
     *
     * @returns True if the organization is a super organization.
     */
    const isSuperOrganization = (): boolean => {
        return orgType === OrganizationType.SUPER_ORGANIZATION;
    };

    /**
     * Checks if the organization is a first level organization.
     *
     * @returns True if the organization is a first level organization.
     */
    const isFirstLevelOrganization = (): boolean => {
        return orgType === OrganizationType.FIRST_LEVEL_ORGANIZATION;
    };

    /**
     * Checks if the organization is a sub organization.
     *
     * @returns True if the organization is a sub organization.
     */
    const isSubOrganization = (): boolean => {
        return orgType === OrganizationType.SUBORGANIZATION;
    };

    return {
        isFirstLevelOrganization,
        isSubOrganization,
        isSuperOrganization,
        organizationType: orgType
    };
};
