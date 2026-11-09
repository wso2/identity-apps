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
import { ResourceOrigin } from "../models/organization-management";
import { ProfileSchemaListingRow } from "../models/profile-attribute-listing";
import { ProfileSchemaAttribute } from "../models/profile-attributes";
import { getSharingRowFields } from "../utils/profile-attribute-utils";

type SharingRowFields = Pick<ProfileSchemaListingRow, "deletable" | "editable" | "is_shared">;

const attributeOf = (origin?: ResourceOrigin): ProfileSchemaAttribute => ({
    attribute_id: "attr-1",
    attribute_name: "traits.loyalty_tier",
    origin
} as ProfileSchemaAttribute);

describe("getSharingRowFields", () => {

    it("marks a shared attribute as shared and read-only", () => {
        expect(getSharingRowFields(attributeOf(ResourceOrigin.SHARED))).toEqual<SharingRowFields>({
            deletable: false,
            editable: false,
            is_shared: true
        });
    });

    it("keeps an owned attribute editable and not shared", () => {
        expect(getSharingRowFields(attributeOf(ResourceOrigin.OWNED))).toEqual<SharingRowFields>({
            deletable: true,
            editable: true,
            is_shared: false
        });
    });

    it("does not mark an inherited attribute as shared", () => {
        expect(getSharingRowFields(attributeOf(ResourceOrigin.INHERITED)).is_shared).toBe(false);
    });

    it("does not mark an attribute without an origin as shared", () => {
        expect(getSharingRowFields(attributeOf()).is_shared).toBe(false);
    });
});
