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

import { parseOrganizationRoleIds } from "../organization-role-utils";

describe("parseOrganizationRoleIds", () => {
    it.each([ undefined, null, 42, [], {}, "", " ", "{", "{}", "null", "\"role-1\"" ])(
        "returns no role IDs for invalid metadata: %j",
        (value: unknown): void => {
            expect(parseOrganizationRoleIds(value)).toEqual([]);
        }
    );

    it("returns unique non-empty string IDs in their original order", () => {
        expect(parseOrganizationRoleIds("[\"role-2\",\"role-1\",\"role-2\",null,42,\"\",\" \"]"))
            .toEqual([ "role-2", "role-1" ]);
    });

    it("returns no role IDs for an empty selection", () => {
        expect(parseOrganizationRoleIds("[]")).toEqual([]);
    });
});
