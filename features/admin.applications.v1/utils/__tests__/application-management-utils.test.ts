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

import { ApplicationManagementUtils } from "../application-management-utils";

describe("ApplicationManagementUtils", () => {
    describe("normalizeCallbackUrlsFromRegExp", () => {
        it("should normalize valid URLs wrapped in regexp", () => {
            const input: string = "regexp=(https://example.com|https://is.docs.wso2.com/en/7.0.0/(.*))";
            const result: string = ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(input);

            expect(result).toBe("https://example.com,https://is.docs.wso2.com/en/7.0.0/(.*)");
        });

        it("should return original string for non-regexp patterns", () => {
            const input: string = "https://example.com";
            const result: string = ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(input);

            expect(result).toBe("https://example.com");
        });
    });
});
