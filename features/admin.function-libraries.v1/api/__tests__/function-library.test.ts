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

import { AxiosResponse } from "axios";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import {
    buildFunctionLibraryFormData,
    createFunctionLibrary,
    deleteFunctionLibrary,
    getFunctionLibrary,
    getFunctionLibraryContent,
    updateFunctionLibrary
} from "../function-library";

const httpRequestMock: Mock = vi.hoisted(() => vi.fn());

const SCRIPT_LIBRARIES_ENDPOINT: string = "https://localhost:9443/api/server/v2/script-libraries";

const storeStateMock: {
    config: {
        deployment: {
            clientHost: string;
        };
        endpoints: {
            scriptLibraries: string;
        };
    };
} = vi.hoisted(() => ({
    config: {
        deployment: {
            clientHost: "https://localhost:9001"
        },
        endpoints: {
            scriptLibraries: "https://localhost:9443/api/server/v2/script-libraries"
        }
    }
}));

vi.mock("@asgardeo/auth-react", () => ({
    AsgardeoSPAClient: {
        getInstance: vi.fn(() => ({
            httpRequest: httpRequestMock
        }))
    }
}));

vi.mock("@wso2is/admin.core.v1/store", () => ({
    store: {
        getState: () => storeStateMock
    }
}));

const readBlobAsText = (blob: Blob): Promise<string> => {
    return new Promise((resolve: (value: string) => void) => {
        const reader: FileReader = new FileReader();

        reader.onload = () => resolve(reader.result as string);
        reader.readAsText(blob);
    });
};

describe("Function library API helpers", () => {
    beforeEach(() => {
        httpRequestMock.mockReset();
    });

    describe("buildFunctionLibraryFormData", () => {
        it("includes the name, description and content as a file part for create", async () => {
            const formData: FormData = buildFunctionLibraryFormData(
                "age-based.js", "module.exports = {};", "Age utilities", true);

            expect(formData.get("name")).toBe("age-based.js");
            expect(formData.get("description")).toBe("Age utilities");

            const content: File = formData.get("content") as File;

            expect(content.name).toBe("age-based.js");
            expect(await readBlobAsText(content)).toBe("module.exports = {};");
        });

        it("can omit the name, but always sends the description", () => {
            const formData: FormData = buildFunctionLibraryFormData(
                "age-based.js", "module.exports = {};", undefined, false);

            expect(formData.has("name")).toBe(false);
            expect(formData.get("description")).toBe("");
        });
    });

    it("creates a function library with a multipart payload", async () => {
        httpRequestMock.mockResolvedValueOnce({ status: 201 } as AxiosResponse);

        await createFunctionLibrary({
            content: "module.exports = {};",
            description: "Age utilities",
            name: "age-based.js"
        });

        const requestConfig: { data: FormData; method: string; url: string } = httpRequestMock.mock.calls[0][0];

        expect(requestConfig.method).toBe("POST");
        expect(requestConfig.url).toBe(SCRIPT_LIBRARIES_ENDPOINT);
        expect(requestConfig.data).toBeInstanceOf(FormData);
        expect(requestConfig.data.get("name")).toBe("age-based.js");
    });

    it("addresses a library by its id in resource URLs", async () => {
        httpRequestMock.mockResolvedValue({ data: "", status: 200 } as AxiosResponse);

        await getFunctionLibrary("bGVnYWN5IGxpYi5qcw");
        await getFunctionLibraryContent("bGVnYWN5IGxpYi5qcw");
        await updateFunctionLibrary("bGVnYWN5IGxpYi5qcw", { content: "x", description: "", name: "legacy lib.js" });

        expect(httpRequestMock.mock.calls[0][0].url).toBe(`${ SCRIPT_LIBRARIES_ENDPOINT }/bGVnYWN5IGxpYi5qcw`);
        expect(httpRequestMock.mock.calls[1][0].url).toBe(`${ SCRIPT_LIBRARIES_ENDPOINT }/bGVnYWN5IGxpYi5qcw/content`);
        expect(httpRequestMock.mock.calls[2][0].url).toBe(`${ SCRIPT_LIBRARIES_ENDPOINT }/bGVnYWN5IGxpYi5qcw`);
        expect(httpRequestMock.mock.calls[2][0].method).toBe("PUT");
        expect((httpRequestMock.mock.calls[2][0].data.get("content") as File).name).toBe("legacy lib.js");
    });

    it("sends the name on update, so that a different name renames the library", async () => {
        const renamed: { id: string; name: string } = { id: "bmV3LW5hbWUuanM", name: "new-name.js" };

        httpRequestMock.mockResolvedValueOnce({ data: renamed, status: 200 } as AxiosResponse);

        const response: AxiosResponse = await updateFunctionLibrary("b2xkLW5hbWUuanM", {
            content: "module.exports = {};",
            description: "Renamed",
            name: "new-name.js"
        });
        const requestConfig: { data: FormData; method: string; url: string } = httpRequestMock.mock.calls[0][0];

        expect(requestConfig.method).toBe("PUT");
        expect(requestConfig.url).toBe(`${ SCRIPT_LIBRARIES_ENDPOINT }/b2xkLW5hbWUuanM`);
        expect(requestConfig.data.get("name")).toBe("new-name.js");
        expect(requestConfig.data.get("description")).toBe("Renamed");
        expect(response.data).toEqual(renamed);
    });

    it("rejects when the delete response is not 204", async () => {
        httpRequestMock.mockResolvedValueOnce({ status: 200 } as AxiosResponse);

        await expect(deleteFunctionLibrary("age-based.js")).rejects.toBeDefined();
    });
});
