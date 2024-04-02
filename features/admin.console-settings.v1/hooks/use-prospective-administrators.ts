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

import { MultiValueAttributeInterface, RolesInterface } from "@wso2is/core/models";
import cloneDeep from "lodash-es/cloneDeep";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useConsoleRoles from "./use-console-roles";
import { SCIMConfigs } from "../../admin.extensions.v1/configs/scim";
import { UserBasicInterface, UserListInterface, UserRoleInterface } from "../../admin.core.v1/models/users";
import { AppState } from "../../admin.core.v1/store";
import { useUsersList } from "../../admin.users.v1/api/users";
import { UserAccountTypes } from "../../admin.users.v1/constants/user-management-constants";
import { UserManagementUtils } from "../../admin.users.v1/utils/user-management-utils";

/**
 * Props interface of {@link UseAdministrators}
 */
export interface UseProspectiveAdministratorsInterface {
    /**
     * Prospective administrators list.
     */
    prospectiveAdministrators: UserListInterface;
    /**
     * Is next page available.
     */
    isNextPageAvailable: boolean;
    /**
     * Is administrators list fetch request loading.
     */
    isAdministratorsListFetchRequestLoading: boolean;
}

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 * @typeParam TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET - Temporary resource limit offset.
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;

/**
 * Hook that handles prospective administrators.
 *
 * @param count - Item count.
 * @param startIndex - Start index.
 * @param filter - Search filter.
 * @param attributes - Attributes to be included in the response.
 * @param domain - Userstore domain.
 * @param excludedAttributes - Attributes to be excluded in the response.
 * @param shouldFetch - Should fetch.
 * @returns An object containing the context values of {@link ConsoleSettingsContext}.
 */
const useProspectiveAdministrators = (
    count: number,
    startIndex: number,
    filter: string,
    attributes: string,
    domain: string,
    excludedAttributes?: string,
    shouldFetch: boolean = true
): UseProspectiveAdministratorsInterface => {
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);

    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);

    const modifiedLimit: number = !count ? null : count + TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET;

    const {
        data: originalAdminUserList,
        isLoading: isAdministratorsListFetchRequestLoading
    } = useUsersList(
        modifiedLimit,
        startIndex + 1,
        filter === "" ? null : filter,
        attributes,
        domain,
        excludedAttributes,
        shouldFetch
    );

    const { consoleRoles } = useConsoleRoles(null, null);

    /**
     * Transform the original users list response from the API.
     *
     * @param usersList - User list from the API.
     * @returns Processed list of users.
     */
    const transformUserList = (usersList: UserListInterface): UserListInterface => {
        if (!usersList) {
            return;
        }

        const clonedUserList: UserListInterface = cloneDeep(usersList);
        const processedUserList: UserBasicInterface[] = [];

        /**
         * Checks whether administrator role is present in the user.
         */
        const isAdminUser = (user: UserBasicInterface): boolean => {
            return user?.roles?.some((userRole: UserRoleInterface) => {
                return consoleRoles?.Resources?.some((consoleRole: RolesInterface) => {
                    return consoleRole.id === userRole.value;
                });
            });
        };

        const isOwner = (user: UserBasicInterface): boolean => {
            return user[SCIMConfigs.scim.enterpriseSchema]?.userAccountType === UserAccountTypes.OWNER;
        };

        clonedUserList.Resources = clonedUserList?.Resources?.map((resource: UserBasicInterface) => {
            // Filter out users belong to groups named "Administrator"
            if (isAdminUser(resource)) {
                return null;
            }

            if (isOwner(resource) && UserManagementUtils.isAuthenticatedUser(authenticatedUser, resource?.userName)) {
                processedUserList[0] = resource;

                return null;
            } else {
                if (UserManagementUtils.isAuthenticatedUser(authenticatedUser, resource?.userName)) {
                    processedUserList[0] = resource;

                    return null;
                }
                if (isOwner(resource)) {
                    processedUserList[1] = resource;

                    return null;
                }
            }

            let email: string | null = null;

            if (resource?.emails instanceof Array) {
                const emailElement: string | MultiValueAttributeInterface = resource?.emails[0];

                if (typeof emailElement === "string") {
                    email = emailElement;
                } else {
                    email = emailElement?.value;
                }
            }

            resource.emails = [ email ];

            return resource;
        });

        /**
         * Returns a moderated users list.
         *
         * @remarks There is no proper way to count the total entries in the userstore with LDAP.
         *  So as a workaround, when
         * fetching users, we request an extra entry to figure out if there is a next page.
         * TODO: Remove this function and other related variables once there is a proper fix for LDAP pagination.
         * @see {@link https://github.com/wso2/product-is/issues/7320}
         *
         * @param list - Users list retrieved from the API.
         * @param requestedLimit - Requested item limit.
         * @param popCount - Tempt count used which will be removed after figuring out if
         *  next page is available.
         * @returns moderated users list with proper pagination.
         */
        const moderateUsersList = (
            list: UserListInterface,
            requestedLimit: number,
            popCount: number = 1
        ): UserListInterface => {
            const moderated: UserListInterface = list;

            if (moderated.Resources?.length === requestedLimit) {
                moderated.Resources?.splice(-1, popCount);
                setIsNextPageAvailable(true);
            } else {
                setIsNextPageAvailable(false);
            }

            return moderated;
        };

        clonedUserList.Resources = processedUserList
            .concat(clonedUserList.Resources)
            .filter((user: UserBasicInterface) => user != null);

        return moderateUsersList(clonedUserList, modifiedLimit, TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET);
    };

    const prospectiveAdministrators: UserListInterface = useMemo(() => {
        return transformUserList(originalAdminUserList);
    }, [ originalAdminUserList ]);

    return {
        isAdministratorsListFetchRequestLoading,
        isNextPageAvailable,
        prospectiveAdministrators: prospectiveAdministrators
    };
};

export default useProspectiveAdministrators;
