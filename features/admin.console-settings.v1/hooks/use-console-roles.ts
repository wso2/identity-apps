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

import { useRolesList } from "@wso2is/admin.roles.v2/api/roles";
import useConsoleSettings from "./use-console-settings";

/**
 * Props interface of {@link useConsoleRoles}
 */
export type UseConsoleRolesInterface = any;

/**
 * Hook that provides access to the Console roles.
 *
 * @param shouldFetch - Should fetch the data.
 * @param count - Number of records to fetch.
 * @param startIndex - Index of the first record to fetch.
 * @param filter - Search filter.
 * @returns An object containing the roles list.
 */
const useConsoleRoles = (
    shouldFetch: boolean = true,
    count?: number,
    startIndex?: number,
    filter?: string
): UseConsoleRolesInterface => {
    const { consoleId } = useConsoleSettings();
    const {
        data: consoleRoles,
        isLoading: isConsoleRolesFetchRequestLoading,
        error: consoleRolesFetchRequestError,
        mutate: mutateConsoleRolesFetchRequest
    } = useRolesList(
        count,
        startIndex,
        `audience.value eq ${consoleId}${ filter ? ` and ${ filter }` : "" }`,
        "users,groups,permissions,associatedApplications",
        !!consoleId || shouldFetch
    );

    return {
        consoleRoles,
        consoleRolesFetchRequestError,
        isConsoleRolesFetchRequestLoading,
        mutateConsoleRolesFetchRequest
    };
};

export default useConsoleRoles;
