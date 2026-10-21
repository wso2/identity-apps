/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { OrganizationType } from "@wso2is/admin.core.v1/constants/organization-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useCallback } from "react";
import { RoleManagementUtils } from "../utils/role-management-utils";

export interface UseAPIResourceAvailabilityReturnInterface {
    /**
     * Whether an API resource of the given type can be assigned to roles in the current organization.
     */
    isAPIResourceAvailable: (apiResourceType: string) => boolean;
}

/**
 * Hook to check whether API resources can be assigned to roles in the current organization.
 * Management API resources are not available to roles in sub-organizations.
 *
 * @returns Function to check the availability of an API resource type.
 */
const useAPIResourceAvailability = (): UseAPIResourceAvailabilityReturnInterface => {
    const { organizationType } = useGetCurrentOrganizationType();
    const isSubOrg: boolean = organizationType === OrganizationType.SUBORGANIZATION;

    const isAPIResourceAvailable: (apiResourceType: string) => boolean = useCallback(
        (apiResourceType: string): boolean =>
            !isSubOrg || RoleManagementUtils.isAPIResourceAllowedInOrganization(apiResourceType),
        [ isSubOrg ]
    );

    return { isAPIResourceAvailable };
};

export default useAPIResourceAvailability;
