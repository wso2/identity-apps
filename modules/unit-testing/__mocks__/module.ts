/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import * as crypto from "crypto";

/**
 * Mocks of NPM Modules.
 *
 * @remarks If you had to mock a certain npm module,
 * document the reason and any references clearly in this file.
 */

/**
 * t is defined here to avoid this function being re-initiated every time `useTranslation` is called.
 * This can cause issues when t is used as a hook dependency.
 */
const t = (key: string, object: any) => {
    const placeholders: string = object ? Object.values(object).map((val: any) => val).join(".") : "";

    return key + placeholders;
};

/**
 * Suggested fix for i18next warnings
 * See also {@link https://github.com/i18next/react-i18next/issues/876}
 */
jest.mock("react-i18next", () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    Trans: ({ children }: { children: any }) => children,
    useTranslation: () => ({
        t
    })
}));

Object.defineProperty(global.self, "crypto", {
    value: {
        getRandomValues: <T extends ArrayBufferView | null>(arr: T) => {
            if (!arr) {
                return arr;
            }

            return crypto.randomBytes(arr.buffer.byteLength);
        }
    }
});
