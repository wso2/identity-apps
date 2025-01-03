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

import { StringUtils } from "../string-utils";

describe("Test isEqualCaseInsensitive function", () => {

    test("Should return true for case-insensitive comparison of `test` and `test`",
        () => {
            expect(StringUtils.isEqualCaseInsensitive("test", "test")).toBe(true);
        }
    );

    test("Should return true for case-insensitive comparison of `TEST` and `test`",
        () => {
            expect(StringUtils.isEqualCaseInsensitive("TEST", "test")).toBe(true);
        }
    );

    test("Should return true for case-insensitive comparison of `test` and `Test`",
        () => {
            expect(StringUtils.isEqualCaseInsensitive("test", "Test")).toBe(true);
        }
    );

    test("Should return false for case-insensitive comparison of `test` and `test1`",
        () => {
            expect(StringUtils.isEqualCaseInsensitive("test", "Test")).toBe(true);
        }
    );
});
