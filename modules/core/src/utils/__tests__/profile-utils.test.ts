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

import { MultiValueAttributeInterface, ProfileSchemaInterface } from "../../models";
import { CryptoUtils } from "../crypto-utils";
import { ProfileUtils } from "../profile-utils";

describe("ProfileUtils", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("buildGravatarURL", () => {
        it("should build URL with default fallback", () => {
            jest.spyOn(CryptoUtils, "MD5Hash").mockReturnValue("hash123" as any);

            const url: string = ProfileUtils.buildGravatarURL("test@example.com");

            expect(CryptoUtils.MD5Hash).toHaveBeenCalledWith("test@example.com");
            expect(url).toBe("https://www.gravatar.com/avatar/hash123?d=404");
        });

        it("should include size param when provided", () => {
            jest.spyOn(CryptoUtils, "MD5Hash").mockReturnValue("hash123" as any);

            const url: string = ProfileUtils.buildGravatarURL("user@domain.com", 200);

            expect(url).toContain("s=200");
        });

        it("should include defaultImage param when provided", () => {
            jest.spyOn(CryptoUtils, "MD5Hash").mockReturnValue("hashXYZ" as any);
            const defaultImage: string = "https://example.com/avatar.png";

            const url: string = ProfileUtils.buildGravatarURL("user@domain.com", undefined, defaultImage);

            expect(url).toContain(`d=${encodeURIComponent(defaultImage)}`);
        });

        it("should omit d param when fallback is 'default'", () => {
            jest.spyOn(CryptoUtils, "MD5Hash").mockReturnValue("h" as any);

            const url: string = ProfileUtils.buildGravatarURL("a@b.com", undefined, undefined, "default");

            expect(url).not.toContain("d=");
        });

        it("should include forceDefault param when forceDefault is true", () => {
            jest.spyOn(CryptoUtils, "MD5Hash").mockReturnValue("hfd" as any);

            const url: string = ProfileUtils.buildGravatarURL(
                "f@d.com",
                undefined,
                undefined,
                undefined,
                true
            );

            expect(url).toContain("f=y");
        });
    });

    describe("flattenSchemas", () => {
        it("should return flat array for simple schemas", () => {
            const schemas: any[] = [
                { multiValued: false, name: "simple" } as any
            ];

            const result: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas(schemas as ProfileSchemaInterface[]);

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe("simple");
        });

        it("should flatten nested schemas and prepend parent name", () => {
            const schemas: ProfileSchemaInterface[] = [
                {
                    multiValued: false,
                    name: "parent",
                    schemaId: "schema1",
                    subAttributes: [
                        { multiValued: false, name: "child" } as any
                    ]
                } as any
            ];

            const result: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas(schemas);

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe("parent.child");
            expect(result[0].schemaId).toBe("schema1");
            expect(result[0].schemaUri).toBe("schema1:parent.child");
        });

        it("should include multiValued parent schema when appropriate", () => {
            const schemas: ProfileSchemaInterface[] = [
                {
                    multiValued: true,
                    name: "custom",
                    schemaId: "schema2",
                    subAttributes: [
                        { multiValued: false, name: "item" } as any
                    ]
                } as any
            ];

            const result: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas(schemas);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("custom");
            expect(result[1].name).toBe("custom.item");
        });
    });

    describe("isMultiValuedSchemaAttribute", () => {
        it("should return true for a multiValued attribute", () => {
            const schemas: any[] = [
                { multiValued: true, name: "a" } as any
            ];

            expect(ProfileUtils.isMultiValuedSchemaAttribute(schemas as ProfileSchemaInterface[], "a")).toBe(true);
        });

        it("should return false for non multiValued or missing attribute", () => {
            const schemas: any[] = [
                { multiValued: false, name: "b" } as any
            ];

            expect(ProfileUtils.isMultiValuedSchemaAttribute(schemas as ProfileSchemaInterface[], "b")).toBe(false);
            expect(ProfileUtils.isMultiValuedSchemaAttribute(schemas as ProfileSchemaInterface[], "c")).toBeFalsy();
        });
    });

    describe("isStringArray", () => {
        it("should return true for string array", () => {
            expect(ProfileUtils.isStringArray([ "x", "y" ])).toBe(true);
        });

        it("should return true for MultiValueAttributeInterface array", () => {
            const arr: MultiValueAttributeInterface[] = [
                { type: "t", value: "v" }
            ];

            expect(ProfileUtils.isStringArray(arr as any)).toBe(true);
        });
    });
});
