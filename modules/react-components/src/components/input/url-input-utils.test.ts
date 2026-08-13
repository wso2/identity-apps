/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import {
    combineRegexCallbackUrls,
    isMixedRegexInput,
    isSingleRegexValue,
    splitURLState
} from "./url-input-utils";

describe("url-input-utils", () => {
    describe("isSingleRegexValue", () => {
        it("returns true for a single wrapped regex", () => {
            expect(isSingleRegexValue("regexp=(https://(a|b)/cb)")).toBe(true);
        });

        it("returns false for empty, plain URLs and empty regex wrappers", () => {
            expect(isSingleRegexValue("")).toBe(false);
            expect(isSingleRegexValue("https://example.com/cb")).toBe(false);
            expect(isSingleRegexValue("regexp=()")).toBe(false);
        });

        it("returns false when a regex is mixed with a comma list", () => {
            expect(isSingleRegexValue("regexp=(https://a.example.com/cb),https://b.example.com/cb")).toBe(false);
        });
    });

    describe("splitURLState", () => {
        it("returns an empty array for an empty value", () => {
            expect(splitURLState("")).toEqual([]);
        });

        it("keeps a single complex regex (with commas inside) as one chip", () => {
            const value: string = "regexp=(https://(127.0.0.1|localhost)(:.[0-9]{0,4})?/cb)";

            expect(splitURLState(value)).toEqual([ value ]);
        });

        it("splits a comma-separated list of plain URLs", () => {
            expect(splitURLState("https://a.example.com/cb,https://b.example.com/cb"))
                .toEqual([ "https://a.example.com/cb", "https://b.example.com/cb" ]);
        });
    });

    describe("isMixedRegexInput", () => {
        it("flags a regex followed by a comma-separated URL", () => {
            expect(isMixedRegexInput("regexp=(https://a.example.com/cb),https://b.example.com/cb")).toBe(true);
        });

        it("flags a URL followed by a regex", () => {
            expect(isMixedRegexInput("https://a.example.com/cb,regexp=(https://b.example.com/cb)")).toBe(true);
        });

        it("does not flag a lone regex, a plain URL, or a pure comma list", () => {
            expect(isMixedRegexInput("regexp=(https://a.example.com/cb|https://b.example.com/cb)")).toBe(false);
            expect(isMixedRegexInput("https://a.example.com/cb")).toBe(false);
            expect(isMixedRegexInput("https://a.example.com/cb,https://b.example.com/cb")).toBe(false);
        });
    });

    describe("combineRegexCallbackUrls", () => {
        it("merges a comma list of URLs and an added URL into one regex", () => {
            const existing: string = "https://a.example.com/cb,https://b.example.com/cb";

            expect(combineRegexCallbackUrls(existing, "https://c.example.com/cb"))
                .toBe("regexp=(https://a.example.com/cb|https://b.example.com/cb|https://c.example.com/cb)");
        });

        it("expands an all-URL regex and appends the added URL", () => {
            const existing: string = "regexp=(https://a.example.com/cb|https://b.example.com/cb)";

            expect(combineRegexCallbackUrls(existing, "https://c.example.com/cb"))
                .toBe("regexp=(https://a.example.com/cb|https://b.example.com/cb|https://c.example.com/cb)");
        });

        it("keeps a complex (non-all-URL) regex opaque when merging", () => {
            const existing: string = "regexp=(https://combine.example.com/cb|internal-host/cb)";

            expect(combineRegexCallbackUrls(existing, "https://added.example.com/cb"))
                .toBe("regexp=(https://combine.example.com/cb|internal-host/cb|https://added.example.com/cb)");
        });

        it("does not emit a blank alternative when the existing state is empty", () => {
            expect(combineRegexCallbackUrls("", "regexp=(https://a.example.com/cb|https://b.example.com/cb)"))
                .toBe("regexp=(https://a.example.com/cb|https://b.example.com/cb)");
            expect(combineRegexCallbackUrls("", "https://a.example.com/cb"))
                .toBe("regexp=(https://a.example.com/cb)");
        });

        it("de-duplicates shared alternatives across two regexes", () => {
            expect(combineRegexCallbackUrls(
                "regexp=(https://d1.example.com/cb|https://d2.example.com/cb)",
                "regexp=(https://d2.example.com/cb|https://d3.example.com/cb)"
            )).toBe("regexp=(https://d1.example.com/cb|https://d2.example.com/cb|https://d3.example.com/cb)");
        });
    });
});
