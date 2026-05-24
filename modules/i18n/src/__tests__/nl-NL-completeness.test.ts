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

import { NL_NL } from "../translations/nl-NL";

describe("nl-NL translation completeness", () => {
    const myaccount = NL_NL.resources.portals.myAccount as Record<string, unknown>;
    const commonUsers = NL_NL.resources.portals.commonUsers as Record<string, unknown>;

    it("nl-NL myaccount namespace exists and is not empty", () => {
        expect(myaccount).toBeDefined();
        expect(Object.keys(myaccount as object).length).toBeGreaterThan(0);
    });

    it("nl-NL commonUsers namespace exists and is not empty", () => {
        expect(commonUsers).toBeDefined();
        expect(Object.keys(commonUsers as object).length).toBeGreaterThan(0);
    });

});
