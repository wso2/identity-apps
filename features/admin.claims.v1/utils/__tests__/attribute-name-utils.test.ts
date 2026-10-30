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

import { isReservedLocalAttributeName, isValidLocalAttributeName } from "../attribute-name-utils";

describe("attribute-name-utils", () => {
    describe("isValidLocalAttributeName", () => {
        it.each([
            "x",
            "x_y",
            "x.y",
            "x.y.z",
            "a-b-c",
            "custom/lookupId",
            "a/b/c",
            "a.b/c-d_e",
            "a".repeat(216)
        ])("accepts %s", (name: string) => {
            expect(isValidLocalAttributeName(name)).toBe(true);
        });

        it.each([
            "",
            "/a",
            "a/",
            "a//b",
            "a b",
            "a#b",
            "a:b",
            "a".repeat(217)
        ])("rejects %s", (name: string) => {
            expect(isValidLocalAttributeName(name)).toBe(false);
        });
    });

    describe("isReservedLocalAttributeName", () => {
        it("flags names under the identity prefix", () => {
            expect(isReservedLocalAttributeName("identity/foo")).toBe(true);
            expect(isReservedLocalAttributeName("identity/a/b")).toBe(true);
        });

        it("does not flag other names", () => {
            expect(isReservedLocalAttributeName("identity")).toBe(false);
            expect(isReservedLocalAttributeName("identityx/foo")).toBe(false);
            expect(isReservedLocalAttributeName("custom/identity/foo")).toBe(false);
        });
    });
});
