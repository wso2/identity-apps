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

import { describe, expect, it } from "vitest";
import { AllowedOriginError, checkAllowedOrigin } from "../utils/allowed-origin-utils";

describe("checkAllowedOrigin", () => {

    it("accepts an origin and stores it as the server does", () => {
        expect(checkAllowedOrigin(" HTTPS://App.Example.COM:8443 ", [])).toEqual({
            origin: "https://app.example.com:8443"
        });
        expect(checkAllowedOrigin("http://localhost:3000", [])).toEqual({ origin: "http://localhost:3000" });
    });

    it("drops a default port, which a browser leaves out of the origin it sends", () => {
        expect(checkAllowedOrigin("https://app.example.com:443", [])).toEqual({ origin: "https://app.example.com" });
        expect(checkAllowedOrigin("http://app.example.com:80", [])).toEqual({ origin: "http://app.example.com" });
        expect(checkAllowedOrigin("http://app.example.com:443", [])).toEqual({ origin: "http://app.example.com:443" });
    });

    it("refuses an origin that differs from one in the list only by its default port", () => {
        expect(checkAllowedOrigin("https://app.example.com:443", [ "https://app.example.com" ]))
            .toEqual({ error: AllowedOriginError.DUPLICATE });
    });

    it.each([
        [ "", AllowedOriginError.EMPTY ],
        [ "   ", AllowedOriginError.EMPTY ],
        [ "*", AllowedOriginError.WILDCARD ],
        [ "https://*.example.com", AllowedOriginError.WILDCARD ],
        [ "https://app.example.com/", AllowedOriginError.TRAILING_SLASH ],
        [ "app.example.com", AllowedOriginError.INVALID ],
        [ "//app.example.com", AllowedOriginError.INVALID ],
        [ "ftp://app.example.com", AllowedOriginError.SCHEME ],
        [ "https://app.example.com/callback", AllowedOriginError.NOT_AN_ORIGIN ],
        [ "https://app.example.com?a=b", AllowedOriginError.NOT_AN_ORIGIN ],
        [ "https://app.example.com#x", AllowedOriginError.NOT_AN_ORIGIN ],
        [ "https://user:pass@app.example.com", AllowedOriginError.NOT_AN_ORIGIN ]
    ])("refuses %j", (candidate: string, error: AllowedOriginError) => {
        expect(checkAllowedOrigin(candidate, [])).toEqual({ error });
    });

    it("refuses an origin already in the list, whatever its case", () => {
        expect(checkAllowedOrigin("HTTPS://APP.EXAMPLE.COM", [ "https://app.example.com" ]))
            .toEqual({ error: AllowedOriginError.DUPLICATE });
    });

    it("refuses an origin that would make the list too long to store", () => {
        const origins: string[] = Array.from({ length: 19 }, (_: unknown, index: number) =>
            `https://app-${ String(index).padStart(2, "0") }.example.com`);

        expect(checkAllowedOrigin("https://one-more.example.com", origins))
            .toEqual({ error: AllowedOriginError.TOO_LONG });
        expect(checkAllowedOrigin("https://one-more.example.com", origins.slice(0, 10)))
            .toEqual({ origin: "https://one-more.example.com" });
    });
});
