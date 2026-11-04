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
import {
    fetchAvailableGroupUsers,
    GetUsersListFunction
} from "../../../../../../features/admin.groups.v1/utils/group-user-pagination";

const PAGE_SIZE: number = 20;
const USERSTORE: string = "PRIMARY";
const GROUP_NAME: string = "Internal/engineering";

const createUser = (id: string, isGroupMember: boolean): UserBasicInterface => ({
    groups: isGroupMember ? [ { $ref: "group-ref", display: GROUP_NAME, value: "group-id" } ] : [],
    id,
    userName: id
});

describe("fetchAvailableGroupUsers", () => {

    it("fetches the next page when all users on the first page are already group members", async () => {
        const firstPage: UserBasicInterface[] = Array.from(
            { length: PAGE_SIZE },
            (_, index) => createUser(`assigned-${index}`, true)
        );
        const secondPage: UserBasicInterface[] = Array.from(
            { length: PAGE_SIZE },
            (_, index) => createUser(`available-${index}`, false)
        );
        const getUsersListMock = jest.fn();
        const getUsersList: GetUsersListFunction = getUsersListMock as GetUsersListFunction;

        getUsersListMock
            .mockResolvedValueOnce({ Resources: firstPage, totalResults: PAGE_SIZE * 2 })
            .mockResolvedValueOnce({ Resources: secondPage, totalResults: PAGE_SIZE * 2 });

        const result = await fetchAvailableGroupUsers({
            filter: null,
            getUsersList,
            groupDisplayName: GROUP_NAME,
            isCancelled: () => false,
            pageSize: PAGE_SIZE,
            userstore: USERSTORE
        });

        expect(getUsersListMock).toHaveBeenCalledTimes(2);
        expect(getUsersListMock).toHaveBeenNthCalledWith(1, PAGE_SIZE, 0, null, null, USERSTORE, null);
        expect(getUsersListMock).toHaveBeenNthCalledWith(2, PAGE_SIZE, PAGE_SIZE, null, null, USERSTORE, null);
        expect(result).toEqual(secondPage);
    });

    it("continues pagination when LDAP reports totalResults for only the current page", async () => {
        const firstPage: UserBasicInterface[] = Array.from(
            { length: PAGE_SIZE },
            (_, index) => createUser(`assigned-${index}`, true)
        );
        const secondPage: UserBasicInterface[] = [
            createUser("available-ldap-user", false)
        ];
        const getUsersListMock = jest.fn();
        const getUsersList: GetUsersListFunction = getUsersListMock as GetUsersListFunction;

        // LDAP can report totalResults=pageSize for each full page even when more users exist.
        getUsersListMock
            .mockResolvedValueOnce({ Resources: firstPage, totalResults: PAGE_SIZE })
            .mockResolvedValueOnce({ Resources: secondPage, totalResults: PAGE_SIZE })
            // A short page is not conclusive for every user store; an empty page confirms exhaustion.
            .mockResolvedValueOnce({ Resources: [] });

        const result = await fetchAvailableGroupUsers({
            filter: null,
            getUsersList,
            groupDisplayName: GROUP_NAME,
            isCancelled: () => false,
            pageSize: PAGE_SIZE,
            userstore: USERSTORE
        });

        expect(getUsersListMock).toHaveBeenCalledTimes(3);
        expect(getUsersListMock).toHaveBeenNthCalledWith(2, PAGE_SIZE, PAGE_SIZE, null, null, USERSTORE, null);
        expect(result).toEqual(secondPage);
    });

    it("handles user stores that omit totalResults and stops after a short final page", async () => {
        const firstPage: UserBasicInterface[] = Array.from(
            { length: PAGE_SIZE },
            (_, index) => createUser(`assigned-${index}`, true)
        );
        const finalPage: UserBasicInterface[] = [
            createUser("available-1", false),
            createUser("available-2", false)
        ];
        const getUsersListMock = jest.fn();
        const getUsersList: GetUsersListFunction = getUsersListMock as GetUsersListFunction;

        getUsersListMock
            .mockResolvedValueOnce({ Resources: firstPage })
            .mockResolvedValueOnce({ Resources: finalPage })
            // The helper requests one more page to confirm that the list is exhausted.
            .mockResolvedValueOnce({ Resources: [] });

        const result = await fetchAvailableGroupUsers({
            filter: null,
            getUsersList,
            groupDisplayName: GROUP_NAME,
            isCancelled: () => false,
            pageSize: PAGE_SIZE,
            userstore: USERSTORE
        });

        expect(getUsersListMock).toHaveBeenCalledTimes(3);
        expect(result).toEqual(finalPage);
    });


    it("continues pagination after a non-empty partial page", async () => {
        const partialPage: UserBasicInterface[] = [
            createUser("assigned-partial-1", true),
            createUser("assigned-partial-2", true),
            createUser("assigned-partial-3", true)
        ];
        const secondPage: UserBasicInterface[] = Array.from(
            { length: PAGE_SIZE },
            (_, index) => createUser(`available-after-partial-${index}`, false)
        );
        const getUsersListMock = jest.fn();
        const getUsersList: GetUsersListFunction = getUsersListMock as GetUsersListFunction;

        getUsersListMock
            .mockResolvedValueOnce({ Resources: partialPage })
            .mockResolvedValueOnce({ Resources: secondPage });

        const result = await fetchAvailableGroupUsers({
            filter: null,
            getUsersList,
            groupDisplayName: GROUP_NAME,
            isCancelled: () => false,
            pageSize: PAGE_SIZE,
            userstore: USERSTORE
        });

        expect(getUsersListMock).toHaveBeenCalledTimes(2);
        expect(getUsersListMock).toHaveBeenNthCalledWith(2, PAGE_SIZE, partialPage.length, null, null, USERSTORE, null);
        expect(result).toEqual(secondPage);
    });

    it("stops when a page contains no new user IDs", async () => {
        const repeatedPage: UserBasicInterface[] = Array.from(
            { length: PAGE_SIZE },
            (_, index) => createUser(`assigned-${index}`, true)
        );
        const getUsersListMock = jest.fn();
        const getUsersList: GetUsersListFunction = getUsersListMock as GetUsersListFunction;

        getUsersListMock
            .mockResolvedValueOnce({ Resources: repeatedPage, totalResults: PAGE_SIZE * 3 })
            .mockResolvedValueOnce({ Resources: repeatedPage, totalResults: PAGE_SIZE * 3 });

        const result = await fetchAvailableGroupUsers({
            filter: null,
            getUsersList,
            groupDisplayName: GROUP_NAME,
            isCancelled: () => false,
            pageSize: PAGE_SIZE,
            userstore: USERSTORE
        });

        expect(getUsersListMock).toHaveBeenCalledTimes(2);
        expect(result).toEqual([]);
    });

    it("does not return stale users when the request is cancelled", async () => {
        const getUsersListMock = jest.fn().mockResolvedValue({
            Resources: [ createUser("available-1", false) ],
            totalResults: 1
        });
        const getUsersList: GetUsersListFunction = getUsersListMock as GetUsersListFunction;

        const result = await fetchAvailableGroupUsers({
            filter: null,
            getUsersList,
            groupDisplayName: GROUP_NAME,
            isCancelled: () => true,
            pageSize: PAGE_SIZE,
            userstore: USERSTORE
        });

        expect(result).toBeNull();
    });

    it("loads available users in separate batches and preserves the pagination cursor", async () => {
        const firstPage: UserBasicInterface[] = Array.from(
            { length: PAGE_SIZE },
            (_, index) => createUser(`user-${index}`, index < 5)
        );
        const secondPage: UserBasicInterface[] = Array.from(
            { length: PAGE_SIZE },
            (_, index) => createUser(`user-${PAGE_SIZE + index}`, false)
        );
        const getUsersListMock = jest.fn()
            .mockResolvedValueOnce({ Resources: firstPage })
            .mockResolvedValueOnce({ Resources: secondPage });
        const getUsersList: GetUsersListFunction = getUsersListMock as GetUsersListFunction;

        const firstBatch = await fetchAvailableGroupUsersPage({
            filter: null,
            getUsersList,
            groupDisplayName: GROUP_NAME,
            isCancelled: () => false,
            pageSize: PAGE_SIZE,
            userstore: USERSTORE
        });

        expect(firstBatch?.users).toHaveLength(15);
        expect(firstBatch?.hasMore).toBe(true);
        expect(firstBatch?.nextStartIndex).toBe(PAGE_SIZE);

        const secondBatch = await fetchAvailableGroupUsersPage({
            filter: null,
            getUsersList,
            groupDisplayName: GROUP_NAME,
            isCancelled: () => false,
            pageSize: PAGE_SIZE,
            seenUserIds: firstBatch?.seenUserIds,
            startIndex: firstBatch?.nextStartIndex,
            userstore: USERSTORE
        });

        expect(getUsersListMock).toHaveBeenNthCalledWith(2, PAGE_SIZE, PAGE_SIZE, null, null, USERSTORE, null);
        expect(secondBatch?.users).toHaveLength(PAGE_SIZE);
        expect(secondBatch?.users[0].id).toBe(`user-${PAGE_SIZE}`);
        expect(secondBatch?.hasMore).toBe(true);
    });

});
