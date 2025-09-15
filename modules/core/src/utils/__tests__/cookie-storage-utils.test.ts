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

import { CookieStorageUtils } from "../storage-utils";

describe("CookieStorageUtils", (): void => {
    beforeEach(() => {
        Object.defineProperty(document, "cookie", {
            value: "",
            writable: true
        });
    });

    describe("setItem", (): void => {
        it("should set a cookie using a cookie string", (): void => {
            CookieStorageUtils.setItem("test=value; path=/;");

            expect(document.cookie).toBe("test=value; path=/;");
        });
    });

    describe("getItem", (): void => {
        it("should return the value of an existing cookie", (): void => {
            document.cookie = "username=JohnDoe; path=/;";

            const value: string = CookieStorageUtils.getItem("username");

            expect(value).toBe("JohnDoe");
        });

        it("should return undefined for a non-existing cookie", (): void => {
            const value: string = CookieStorageUtils.getItem("nonexistent");

            expect(value).toBeUndefined();
        });
    });

    describe("setCookie", (): void => {
        it("should set a cookie with default expiration of 30 days", (): void => {
            const mockDate: Date = new Date();

            jest.useFakeTimers().setSystemTime(mockDate);

            CookieStorageUtils.setCookie("test", "value");

            const expectedDate: string = new Date(mockDate.getTime() + 30 * 24 * 60 * 60 * 1000).toUTCString();

            expect(document.cookie).toBe(`test=value; expires=${expectedDate}; path=/`);
        });

        it("should set a cookie with a custom expiration duration", (): void => {
            const mockDate: Date = new Date();

            jest.useFakeTimers().setSystemTime(mockDate);

            CookieStorageUtils.setCookie("test", "value", { days: 1, hours: 2 });

            const expectedDate: string = new Date(
                mockDate.getTime() + (1 * 24 * 60 * 60 + 2 * 60 * 60) * 1000
            ).toUTCString();

            expect(document.cookie).toBe(`test=value; expires=${expectedDate}; path=/`);
        });

        it("should set a cookie with a specific domain", (): void => {
            const minutes: number = 15;
            const domain: string = ".example.com";
            const name: string = "test";
            const value: string = "value";

            CookieStorageUtils.setCookie(name, value, { minutes }, domain);

            const expires: string = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
            const expectedCookie: string = `${name}=${value}; expires=${expires}; domain=${domain}; path=/`;

            expect(document.cookie).toBe(expectedCookie);
        });

        it("should set a cookie with HttpOnly and Secure options", (): void => {
            const name: string = "test";
            const value: string = "value";
            const options: {
                httpOnly: boolean;
                secure: boolean;
            } = {
                httpOnly: true,
                secure: true
            };

            CookieStorageUtils.setCookie(name, value, { days: 1 }, undefined, options);

            const expires: string = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString();
            const expectedCookie: string = `${name}=${value}; expires=${expires}; HttpOnly; Secure; path=/`;

            expect(document.cookie).toBe(expectedCookie);
        });
    });
});
