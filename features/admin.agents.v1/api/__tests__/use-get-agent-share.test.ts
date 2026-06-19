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

import { renderHook } from "@testing-library/react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import useGetAgentShare from "../use-get-agent-share";

const useRequestMock: Mock = vi.hoisted(() => vi.fn());

vi.mock("@wso2is/admin.core.v1/hooks/use-resource-endpoints", () => ({
    default: () => ({
        resourceEndpoints: {
            agentSharing: "https://localhost:9443/api/server/v1/agent-sharing"
        }
    })
}));

vi.mock("@wso2is/admin.core.v1/hooks/use-request", () => ({
    default: useRequestMock
}));

describe("useGetAgentShare", () => {
    beforeEach(() => {
        useRequestMock.mockReset();
        useRequestMock.mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: false,
            isValidating: false,
            mutate: vi.fn()
        });
    });

    it("constructs the agent sharing request URL with query parameters", () => {
        renderHook(() => useGetAgentShare(
            "agent-id",
            true,
            true,
            "name co agent",
            [ "sharingMode", "roles" ],
            10,
            "before-token",
            "after-token"
        ));

        expect(useRequestMock).toHaveBeenCalledWith({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "GET",
            url: "https://localhost:9443/api/server/v1/agent-sharing/agent-id/share"
                + "?recursive=true&attributes=sharingMode%2Croles&limit=10"
                + "&before=before-token&after=after-token&filter=name+co+agent"
        }, {
            shouldRetryOnError: false
        });
    });

    it("passes a null request URL when fetching is disabled", () => {
        renderHook(() => useGetAgentShare("agent-id", false));

        expect(useRequestMock).toHaveBeenCalledWith({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "GET",
            url: null
        }, {
            shouldRetryOnError: false
        });
    });
});
