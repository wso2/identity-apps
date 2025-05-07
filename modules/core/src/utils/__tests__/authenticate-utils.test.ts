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
import { TextEncoder } from "util";
import { AuthenticateUtils } from "../authenticate-utils";

describe("AuthenticateUtils", (): void => {

    beforeAll((): void => {
        // Mock TextEncoder
        if (typeof global.TextEncoder === "undefined") {
            global.TextEncoder = TextEncoder;
        }

        // // Mock window object
        // Object.defineProperty(global, "window", {
        //     value: {},
        //     writable: true
        // });

        // Object.defineProperty(global.self, "crypto", {
        //     value: {
        //         subtle: crypto.webcrypto.subtle
        //     }
        // });
    });

    describe("generateCodeVerifier", (): void => {
        it("should generate a code verifier of the correct format", (): void => {
            const codeVerifier: string = AuthenticateUtils.generateCodeVerifier();

            expect(codeVerifier).toMatch(/^[A-Za-z0-9\-_]{43,128}$/);
        });

        it("should generate a unique code verifier each time", (): void => {
            const codeVerifier1: string = AuthenticateUtils.generateCodeVerifier();
            const codeVerifier2: string = AuthenticateUtils.generateCodeVerifier();

            expect(codeVerifier1).not.toBe(codeVerifier2);
        });
    });

    describe("getCodeChallangeForTheVerifier", (): void => {
        it("should generate a valid code challenge for a given code verifier", async (): Promise<void> => {
            const codeVerifier: string = AuthenticateUtils.generateCodeVerifier();
            const codeChallenge: string = await AuthenticateUtils.getCodeChallangeForTheVerifier(codeVerifier);

            expect(codeChallenge).toMatch(/^[A-Za-z0-9\-_]{43,128}$/);
        });

        it("should generate different code challenges for different code verifiers", async (): Promise<void> => {
            const codeVerifier1: string = "test-code-verifier-1";
            const codeVerifier2: string = "test-code-verifier-2";

            const codeChallenge1: string = await AuthenticateUtils.getCodeChallangeForTheVerifier(codeVerifier1);
            const codeChallenge2: string = await AuthenticateUtils.getCodeChallangeForTheVerifier(codeVerifier2);

            expect(codeChallenge1).not.toBe(codeChallenge2);
        });
    });
});
