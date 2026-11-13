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

import { describe, expect, it, vi } from "vitest";
import { BasicRoleInterface, RolesV2Interface, RolesV2ResponseInterface } from "../../models/roles";
import {
    addRoleToSelection,
    fetchAllRolePages,
    removeDeletedRolesFromSelection
} from "../application-roles-utils";

const createRoles = (count: number, offset: number = 0): BasicRoleInterface[] =>
    Array.from({ length: count }, (_: unknown, index: number) => ({
        id: `role-${ offset + index + 1 }`,
        name: `ui-role-${ offset + index + 1 }`
    }));

const toListingRoles = (roles: BasicRoleInterface[]): RolesV2Interface[] =>
    roles.map((role: BasicRoleInterface) => ({ displayName: role.name, id: role.id }) as RolesV2Interface);

const getIds = (roles: { id: string }[]): string[] => roles.map((role: { id: string }) => role.id);

/**
 * Serve a roles listing the way the server pages it: `count` roles from the 1 based `startIndex`.
 */
const createPagedListing = (
    allRoles: RolesV2Interface[],
    options: { maxPageSize?: number; reportTotal?: boolean } = {}
): ((startIndex: number, count: number) => Promise<RolesV2ResponseInterface>) =>
    (startIndex: number, count: number): Promise<RolesV2ResponseInterface> => {
        const pageSize: number = Math.min(count, options.maxPageSize ?? count);

        return Promise.resolve({
            Resources: allRoles.slice(startIndex - 1, startIndex - 1 + pageSize),
            totalResults: options.reportTotal === false ? undefined : allRoles.length
        });
    };

describe("fetchAllRolePages", () => {
    const allRoles: RolesV2Interface[] = toListingRoles(createRoles(250));

    it("collects the roles of every page", async () => {
        const fetchPage: ReturnType<typeof createPagedListing> = vi.fn(createPagedListing(allRoles));

        const roles: RolesV2Interface[] = await fetchAllRolePages(fetchPage, 100);

        expect(getIds(roles)).toEqual(getIds(allRoles));
        expect(vi.mocked(fetchPage).mock.calls).toEqual([ [ 1, 100 ], [ 101, 100 ], [ 201, 100 ] ]);
    });

    it("continues from the last returned role when the server returns smaller pages", async () => {
        const fetchPage: ReturnType<typeof createPagedListing> = vi.fn(
            createPagedListing(allRoles, { maxPageSize: 15 })
        );

        const roles: RolesV2Interface[] = await fetchAllRolePages(fetchPage, 100);

        expect(roles).toHaveLength(250);
        expect(vi.mocked(fetchPage).mock.calls[1]).toEqual([ 16, 100 ]);
    });

    it("stops at a short page when the server does not report the total", async () => {
        const fetchPage: ReturnType<typeof createPagedListing> = vi.fn(
            createPagedListing(allRoles, { reportTotal: false })
        );

        const roles: RolesV2Interface[] = await fetchAllRolePages(fetchPage, 100);

        expect(roles).toHaveLength(250);
        expect(fetchPage).toHaveBeenCalledTimes(3);
    });

    it("stops when a page brings no new roles", async () => {
        const firstPage: RolesV2ResponseInterface = {
            Resources: allRoles.slice(0, 15),
            totalResults: allRoles.length
        };
        const fetchPage: (startIndex: number, count: number) => Promise<RolesV2ResponseInterface> =
            vi.fn(() => Promise.resolve(firstPage));

        const roles: RolesV2Interface[] = await fetchAllRolePages(fetchPage, 100);

        expect(roles).toHaveLength(15);
        expect(fetchPage).toHaveBeenCalledTimes(2);
    });

    it("returns no roles for an empty listing", async () => {
        const roles: RolesV2Interface[] = await fetchAllRolePages(createPagedListing([]), 100);

        expect(roles).toEqual([]);
    });

    it("rejects when a page cannot be fetched", async () => {
        const fetchPage: (startIndex: number, count: number) => Promise<RolesV2ResponseInterface> = vi.fn()
            .mockResolvedValueOnce({ Resources: allRoles.slice(0, 100), totalResults: allRoles.length })
            .mockRejectedValueOnce(new Error("Server error"));

        await expect(fetchAllRolePages(fetchPage, 100)).rejects.toThrow("Server error");
    });
});

describe("addRoleToSelection", () => {
    it("appends a role that is not selected yet", () => {
        const selectedRoles: BasicRoleInterface[] = createRoles(16);

        expect(getIds(addRoleToSelection(selectedRoles, { id: "role-17", name: "ui-role-17" })))
            .toEqual([ ...getIds(selectedRoles), "role-17" ]);
    });

    it("does not duplicate a role that is already selected", () => {
        const selectedRoles: BasicRoleInterface[] = createRoles(3);

        expect(addRoleToSelection(selectedRoles, { id: "role-2" })).toBe(selectedRoles);
    });

    it("handles an undefined selection and a role without an id", () => {
        expect(addRoleToSelection(undefined, { id: "role-1" })).toEqual([ { id: "role-1" } ]);
        expect(addRoleToSelection(createRoles(2), undefined)).toHaveLength(2);
        expect(addRoleToSelection(createRoles(2), { id: undefined, name: "no-id" })).toHaveLength(2);
    });
});

describe("removeDeletedRolesFromSelection", () => {
    it("keeps every selected role that still exists", () => {
        const selectedRoles: BasicRoleInterface[] = createRoles(16);

        expect(removeDeletedRolesFromSelection(selectedRoles, createRoles(17))).toEqual(selectedRoles);
    });

    it("drops selected roles that no longer exist", () => {
        expect(getIds(removeDeletedRolesFromSelection(createRoles(3), createRoles(2, 1))))
            .toEqual([ "role-2", "role-3" ]);
    });

    it("handles an undefined selection", () => {
        expect(removeDeletedRolesFromSelection(undefined, createRoles(2))).toEqual([]);
    });
});
