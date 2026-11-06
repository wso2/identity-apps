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

import Axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { imageUrl } from "../validation";

const IMAGE_URL: string = "https://example.com/logo.png";

describe("imageUrl", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns false for an invalid URI without making a request", async () => {
        const getSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(Axios, "get");

        expect(await imageUrl("not a uri")).toBe(false);
        expect(getSpy).not.toHaveBeenCalled();
    });

    it("returns true when the response content type is an image", async () => {
        vi.spyOn(Axios, "get").mockResolvedValue({ headers: { "content-type": "image/png" } });

        expect(await imageUrl(IMAGE_URL)).toBe(true);
    });

    it("returns false when the response content type is not an image", async () => {
        vi.spyOn(Axios, "get").mockResolvedValue({ headers: { "content-type": "text/html" } });

        expect(await imageUrl(IMAGE_URL)).toBe(false);
    });

    it("returns false when the response has no content type header", async () => {
        vi.spyOn(Axios, "get").mockResolvedValue({ headers: {} });

        expect(await imageUrl(IMAGE_URL)).toBe(false);
    });

    it("returns false when the request fails", async () => {
        vi.spyOn(Axios, "get").mockRejectedValue(new Error("Network Error"));

        expect(await imageUrl(IMAGE_URL)).toBe(false);
    });
});
