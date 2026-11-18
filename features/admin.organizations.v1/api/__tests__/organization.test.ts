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

import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { OrganizationInterface } from "../../models";
import { getAllOrganizations } from "../organization";

const httpRequestMock: Mock = vi.hoisted(() => vi.fn());

const ORGANIZATIONS_ENDPOINT: string = "https://localhost:9443/api/server/v1";

vi.mock("@asgardeo/auth-react", () => ({
    AsgardeoSPAClient: {
        getInstance: vi.fn(() => ({
            httpRequest: httpRequestMock
        }))
    }
}));

vi.mock("@wso2is/admin.core.v1/store", () => ({
    store: {
        getState: () => ({
            config: {
                endpoints: {
                    organizations: "https://localhost:9443/api/server/v1",
                    rootOrganization: "https://localhost:9443/api/server/v1"
                }
            }
        })
    }
}));

/**
 * Builds a page of mock organizations.
 *
 * @param ids - Organization IDs in the page.
 * @param nextCursor - Cursor for the next page, if any.
 * @returns Mock HTTP response.
 */
const buildPage = (ids: string[], nextCursor?: string): { data: unknown; status: number } => ({
    data: {
        links: nextCursor
            ? [ {
                href: `${ORGANIZATIONS_ENDPOINT}/organizations?limit=2&recursive=false&after=${nextCursor}`,
                rel: "next"
            } ]
            : [],
        organizations: ids.map((id: string) => ({ id, name: id }))
    },
    status: 200
});

describe("getAllOrganizations", () => {
    beforeEach(() => {
        httpRequestMock.mockReset();
    });

    it("returns organizations from a single page", async () => {
        httpRequestMock.mockResolvedValueOnce(buildPage([ "org-1", "org-2" ]));

        const result: OrganizationInterface[] = await getAllOrganizations(null, false);

        expect(result.map((org: OrganizationInterface) => org.id)).toEqual([ "org-1", "org-2" ]);
        expect(httpRequestMock).toHaveBeenCalledTimes(1);
    });

    it("follows next links until all pages are fetched", async () => {
        httpRequestMock
            .mockResolvedValueOnce(buildPage([ "org-1", "org-2" ], "cursor-1"))
            .mockResolvedValueOnce(buildPage([ "org-3", "org-4" ], "cursor-2"))
            .mockResolvedValueOnce(buildPage([ "org-5" ]));

        const result: OrganizationInterface[] = await getAllOrganizations(null, false, false, 2);

        expect(result.map((org: OrganizationInterface) => org.id))
            .toEqual([ "org-1", "org-2", "org-3", "org-4", "org-5" ]);
        expect(httpRequestMock).toHaveBeenCalledTimes(3);
        expect(httpRequestMock.mock.calls[0][0].params).toMatchObject({ after: undefined, limit: 2 });
        expect(httpRequestMock.mock.calls[1][0].params).toMatchObject({ after: "cursor-1", limit: 2 });
        expect(httpRequestMock.mock.calls[2][0].params).toMatchObject({ after: "cursor-2", limit: 2 });
    });

    it("stops when the server returns a cursor that was already visited", async () => {
        httpRequestMock
            .mockResolvedValueOnce(buildPage([ "org-1" ], "cursor-1"))
            .mockResolvedValueOnce(buildPage([ "org-2" ], "cursor-1"));

        const result: OrganizationInterface[] = await getAllOrganizations(null, false);

        expect(result.map((org: OrganizationInterface) => org.id)).toEqual([ "org-1", "org-2" ]);
        expect(httpRequestMock).toHaveBeenCalledTimes(2);
    });

    it("rejects when a page request fails", async () => {
        httpRequestMock
            .mockResolvedValueOnce(buildPage([ "org-1" ], "cursor-1"))
            .mockRejectedValueOnce({ response: { data: { code: "ORG-60001" } } });

        await expect(getAllOrganizations(null, false)).rejects.toEqual({ code: "ORG-60001" });
    });
});
