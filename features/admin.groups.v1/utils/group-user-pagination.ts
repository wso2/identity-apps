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

import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { UserListInterface } from "@wso2is/admin.users.v1/models/user";

export type GetUsersListFunction = (
    count: number,
    startIndex: number,
    filter: string,
    attributes: string,
    domain: string,
    excludedAttributes?: string
) => Promise<UserListInterface>;

export interface FetchAvailableGroupUsersOptions {
    getUsersList: GetUsersListFunction;
    pageSize?: number;
    filter: string | null;
    userstore: string;
    groupDisplayName: string;
    isCancelled: () => boolean;
}

/**
 * Fetch users in pages until enough users that are not assigned to the group
 * are found, or the user list is exhausted.
 *
 * @returns The available users, or null when the request has been cancelled.
 */
export interface FetchAvailableGroupUsersPageOptions extends FetchAvailableGroupUsersOptions {
    startIndex?: number;
    seenUserIds?: string[];
}

export interface FetchAvailableGroupUsersPageResult {
    users: UserBasicInterface[];
    nextStartIndex: number;
    hasMore: boolean;
    seenUserIds: string[];
}

/**
 * Fetch one batch of available users while retaining the backend pagination cursor.
 * The function may read multiple backend pages when users are already group members.
 *
 * @returns A batch and cursor, or null when the request has been cancelled.
 */
export const fetchAvailableGroupUsersPage = async (
    options: FetchAvailableGroupUsersPageOptions
): Promise<FetchAvailableGroupUsersPageResult | null> => {

    const pageSize: number = options.pageSize ?? 20;
    const availableUsers: UserBasicInterface[] = [];
    const seenUserIds: Set<string> = new Set<string>(options.seenUserIds ?? []);
    let startIndex: number = options.startIndex ?? 0;
    let hasMore: boolean = true;

    while (availableUsers.length < pageSize) {
        const response: UserListInterface = await options.getUsersList(
            pageSize, startIndex, options.filter, null, options.userstore, null
        );

        if (options.isCancelled()) {
            return null;
        }

        const pageUsers: UserBasicInterface[] = response?.Resources ?? [];
        let newUsersInPage: number = 0;

        pageUsers.forEach((user: UserBasicInterface) => {
            if (!user?.id || seenUserIds.has(user.id)) {
                return;
            }

            seenUserIds.add(user.id);
            newUsersInPage++;

            const isUserAlreadyAssigned: boolean = user?.groups?.some(
                (userGroup) => userGroup.display === options.groupDisplayName
            ) ?? false;

            if (!isUserAlreadyAssigned) {
                availableUsers.push(user);
            }
        });

        startIndex += pageUsers.length;

        if (pageUsers.length === 0 || newUsersInPage === 0) {
            hasMore = false;
            break;
        }
    }

    return {
        hasMore,
        nextStartIndex: startIndex,
        seenUserIds: Array.from(seenUserIds),
        users: availableUsers
    };
};

/**
 * Fetch the first batch of available users.
 *
 * @returns The available users, or null when the request has been cancelled.
 */
export const fetchAvailableGroupUsers = async (
    options: FetchAvailableGroupUsersOptions
): Promise<UserBasicInterface[] | null> => {
    const result: FetchAvailableGroupUsersPageResult | null = await fetchAvailableGroupUsersPage(options);

    return result?.users ?? null;
};
