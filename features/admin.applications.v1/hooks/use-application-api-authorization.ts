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

import { useRequiredScopes } from "@wso2is/access-control";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useEffect, useMemo, useState } from "react";
import useSubscribedAPIResources from "../api/use-subscribed-api-resources";
import { ApplicationManagementConstants } from "../constants/application-management";
import {
    AuthorizedAPIListItemInterface,
    AuthorizedPermissionListItemInterface
} from "../models/api-authorization";

interface UseAPIAuthorizationReturn {
    allAuthorizedScopes: AuthorizedPermissionListItemInterface[];
    allAuthorizedScopeNames: string;
    subscribedAPIResourcesListData: AuthorizedAPIListItemInterface[];
    isSubscribedAPIResourcesListLoading: boolean;
    subscribedAPIResourcesFetchRequestError: any;
    mutateSubscribedAPIResourcesList: () => void;
    bulkChangeAllAuthorizedScopes: (updatedScopes: AuthorizedPermissionListItemInterface[], removed: boolean) => void;
}

/**
 * Hook to manage API authorization logic.
 *
 * @param appId - Application ID
 * @returns API authorization state and functions
 */
export const useAPIAuthorization = (appId: string): UseAPIAuthorizationReturn => {
    const [ allAuthorizedScopes, setAllAuthorizedScopes ] = useState<AuthorizedPermissionListItemInterface[]>([]);
    const { isSubOrganization } = useGetCurrentOrganizationType();
    const requiredApplicationViewScope: string = isSubOrganization
        ? ApplicationManagementConstants.INTERNAL_ORG_APPLICATION_MGT_VIEW
        : ApplicationManagementConstants.INTERNAL_APPLICATION_MGT_VIEW;
    const hasApplicationViewPermission: boolean = useRequiredScopes([ requiredApplicationViewScope ]);

    const {
        data: subscribedAPIResourcesListData,
        isLoading: isSubscribedAPIResourcesListLoading,
        error: subscribedAPIResourcesFetchRequestError,
        mutate: mutateSubscribedAPIResourcesList
    } = useSubscribedAPIResources(appId, hasApplicationViewPermission);

    /**
     * Calculate authorized scope names from all authorized scopes.
     */
    const allAuthorizedScopeNames: string = useMemo(
        () => allAuthorizedScopes?.map((scope: AuthorizedPermissionListItemInterface) => scope.name)?.join(" ") ?? "",
        [ allAuthorizedScopes ]
    );

    /**
     * Initalize the all authorized scopes.
     */
    useEffect(() => {
        if (subscribedAPIResourcesListData?.length > 0) {
            let authorizedScopes: AuthorizedPermissionListItemInterface[] = [];

            subscribedAPIResourcesListData.forEach((subscribedAPIResource: AuthorizedAPIListItemInterface) => {
                authorizedScopes = authorizedScopes.concat(subscribedAPIResource.authorizedScopes);
            });

            setAllAuthorizedScopes(authorizedScopes);
        } else if (subscribedAPIResourcesListData?.length === 0) {
            setAllAuthorizedScopes([]);
        }
    }, [ subscribedAPIResourcesListData ]);

    /**
     * Bulk change the all authorized scopes.
     *
     * @param updatedScopes - Updated scopes.
     * @param removed - `true` if scope removed.
     *
     * @returns `void`
     */
    const bulkChangeAllAuthorizedScopes = (updatedScopes: AuthorizedPermissionListItemInterface[],
        removed: boolean): void => {

        if (removed) {
            setAllAuthorizedScopes(allAuthorizedScopes.filter(
                (scope: AuthorizedPermissionListItemInterface) => !updatedScopes.some(
                    (updatedScope: AuthorizedPermissionListItemInterface) => updatedScope.name === scope.name)));
        } else {
            const changedScopes: AuthorizedPermissionListItemInterface[]= updatedScopes.filter(
                (updatedScope: AuthorizedPermissionListItemInterface) => !allAuthorizedScopes.some(
                    (scope: AuthorizedPermissionListItemInterface) => updatedScope.name === scope.name));

            setAllAuthorizedScopes([ ...allAuthorizedScopes, ...changedScopes ]);
        }
    };

    return {
        allAuthorizedScopes,
        allAuthorizedScopeNames,
        subscribedAPIResourcesListData,
        isSubscribedAPIResourcesListLoading,
        subscribedAPIResourcesFetchRequestError,
        mutateSubscribedAPIResourcesList,
        bulkChangeAllAuthorizedScopes
    };
};

export default useAPIAuthorization;
