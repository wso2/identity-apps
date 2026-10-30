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

import { CimdClientIdUrlError, validateCimdClientIdUrl } from "../validate-cimd-client-id-url";

const PREFIX: string = "https://example.com/";

describe("validateCimdClientIdUrl", () => {
    it("accepts an https Client Identifier URL", () => {
        expect(validateCimdClientIdUrl("https://chatgpt.com/oauth/W_Ve4wNLhWLI/client.json")).toBeNull();
    });

    it.each([ "", "not a url", "http://example.com/client.json", "ftp://example.com/client.json" ])(
        "rejects %j as invalid", (url: string) => {
            expect(validateCimdClientIdUrl(url)).toBe(CimdClientIdUrlError.INVALID);
        });

    it("accepts 255 bytes and rejects 256", () => {
        expect(validateCimdClientIdUrl(PREFIX + "a".repeat(255 - PREFIX.length))).toBeNull();
        expect(validateCimdClientIdUrl(PREFIX + "a".repeat(256 - PREFIX.length))).toBe(CimdClientIdUrlError.TOO_LONG);
    });

    it("counts bytes, not characters", () => {
        // 200 two-byte characters: 220 characters but 420 bytes.
        expect(validateCimdClientIdUrl(PREFIX + "é".repeat(200))).toBe(CimdClientIdUrlError.TOO_LONG);
    });
});
