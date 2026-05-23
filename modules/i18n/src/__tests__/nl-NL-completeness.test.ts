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
    const myaccount = NL_NL.resources.portals.myAccount as Record<string, unknown>;
    const enMyAccount = EN_US.resources.portals.myAccount as Record<string, unknown>;
    const commonUsers = NL_NL.resources.portals.commonUsers as Record<string, unknown>;
    const enCommonUsers = EN_US.resources.portals.commonUsers as Record<string, unknown>;

    const compareKeysRecursive = (expected: unknown, actual: unknown, namespace: string): void => {
        const expectedIsObject = typeof expected === "object" && expected !== null;
        const actualIsObject = typeof actual === "object" && actual !== null;

        expect(actual).toBeDefined();
        expect(actual).not.toBeNull();

        if (Array.isArray(expected)) {
            expect(Array.isArray(actual)).toBe(true);
            expect(actual).toHaveLength(expected.length);

            expected.forEach((expectedItem, index) => {
                compareKeysRecursive(expectedItem, (actual as Array<unknown>)[index], `${namespace}[${index}]`);
            });

            return;
        }

        expect(actualIsObject).toBe(expectedIsObject);

        if (!expectedIsObject) {
            return;
        }

        Object.entries(expected as Record<string, unknown>).forEach(([key, expectedValue]) => {
            expect(Object.prototype.hasOwnProperty.call(actual as Record<string, unknown>, key)).toBe(true);
            compareKeysRecursive(expectedValue, (actual as Record<string, unknown>)[key], `${namespace}.${key}`);
        });
    };

    it("nl-NL common namespace has no undefined values at top level", () => {
        Object.entries(nlCommon).forEach(([, value]) => {
            expect(value).toBeDefined();
            expect(value).not.toBeNull();
        });
    });

    it("nl-NL common namespace matches the en-US structure recursively", () => {
        compareKeysRecursive(enCommon, nlCommon, "common");
    });

    it("nl-NL myaccount namespace exists and is not empty", () => {
        expect(myaccount).toBeDefined();
        expect(Object.keys(myaccount as object).length).toBeGreaterThan(0);
    });

    it("nl-NL commonUsers namespace exists and is not empty", () => {
        expect(commonUsers).toBeDefined();
        expect(Object.keys(commonUsers as object).length).toBeGreaterThan(0);
    });

});
