/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import "@testing-library/jest-dom";
import buildCallBackUrlsWithRegExp from "../../utils/build-callback-urls-with-regexp";

describe("[Applications Management Feature] - buildCallBackUrlsWithRegExp", () => {

    test("Test the function with the single callback url", async () => {
        const urls: string[] = [ "https://example.com/login" ];

        const results: string[] = buildCallBackUrlsWithRegExp(urls);

        expect(results).toEqual(urls);
    });

    test("Test the function with the multiple callback url", async () => {
        const results: string[] = buildCallBackUrlsWithRegExp([
            "https://example.com/login",
            "https://app.example.com/login",
            "https://localhost:3000/sample/oidc/login"
        ]);

        expect(results).toEqual([
            "regexp=(https://example.com/login|https://app.example.com/login|https://localhost:3000/sample/oidc/login)"
        ]);
    });
});
