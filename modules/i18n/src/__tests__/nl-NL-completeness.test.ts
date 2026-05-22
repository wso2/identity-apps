/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { EN_US } from "../translations/en-US";
import { NL_NL } from "../translations/nl-NL";

describe("nl-NL translation completeness", () => {
    const nlCommon = NL_NL.resources.portals.common as Record<string, unknown>;
    const enCommon = EN_US.resources.portals.common as Record<string, unknown>;

    it("nl-NL common namespace has no undefined values at top level", () => {
        Object.entries(nlCommon).forEach(([, value]) => {
            expect(value).toBeDefined();
            expect(value).not.toBeNull();
        });
    });

    it("nl-NL common namespace has the same top-level keys as en-US", () => {
        const nlKeys = Object.keys(nlCommon).sort();
        const enKeys = Object.keys(enCommon).sort();

        expect(nlKeys).toEqual(enKeys);
    });

    it("nl-NL myaccount namespace exists and is not empty", () => {
        const myaccount = NL_NL.resources.portals.myAccount;

        expect(myaccount).toBeDefined();
        expect(Object.keys(myaccount as object).length).toBeGreaterThan(0);
    });

    it("nl-NL commonUsers namespace exists and is not empty", () => {
        const commonUsers = NL_NL.resources.portals.commonUsers;

        expect(commonUsers).toBeDefined();
        expect(Object.keys(commonUsers as object).length).toBeGreaterThan(0);
    });
});
