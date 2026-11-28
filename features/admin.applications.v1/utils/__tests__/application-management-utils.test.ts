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

describe("ApplicationManagementUtils", (): void => {
    describe("normalizeCallbackUrlsFromRegExp", (): void => {
        it("should normalize valid URLs wrapped in regexp", (): void => {
            const input: string = "regexp=(https://example.com|https://is.docs.wso2.com/en/7.0.0/(.*))";
            const result: string = ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(input);

            expect(result).toBe("https://example.com,https://is.docs.wso2.com/en/7.0.0/(.*)");
        });

        it("should return original string for non-regexp patterns", (): void => {
            const input: string = "https://example.com";
            const result: string = ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(input);

            expect(result).toBe("https://example.com");
        });

        it("should normalize a regex of URLs and mobile deep links", (): void => {
            const input: string = "regexp=(https://a.example.com/cb|app://abc/authcode|app://def/authcode)";

            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(input))
                .toBe("https://a.example.com/cb,app://abc/authcode,app://def/authcode");
        });

        it("should normalize a regex of URLs without parentheses", (): void => {
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=https://a.example.com/cb|https://b.example.com/cb.*"))
                .toBe("https://a.example.com/cb,https://b.example.com/cb.*");
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp("regexp=myapp://a|myapp://b/.*"))
                .toBe("myapp://a,myapp://b/.*");
        });

        it("should keep a single regex wrapped in regexp", (): void => {
            const input: string = "regexp=(https://example.com/cb.*)";

            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(input)).toBe(input);
        });

        it("should keep a single deep link regex wrapped in regexp", (): void => {
            const input: string = "regexp=(myapp://callback/.*)";

            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(input)).toBe(input);
        });

        it("should return a complex regex unchanged", (): void => {
            const ports: string = "regexp=(https://(127.0.0.1|localhost)(:.[0-9]{0,4})?/cb)";
            const hosts: string = "regexp=(^http://(dev|test)\\.abc\\.com/playground2/oauth2client(\\.com)?$)";

            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(ports)).toBe(ports);
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(hosts)).toBe(hosts);
        });

        it("should return a regex whose parentheses are not one group unchanged", (): void => {
            const input: string = "regexp=(http|https)://app.example.com/(.*)";

            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(input)).toBe(input);
        });

        it("should return a regex in parentheses with a numbered backreference unchanged", (): void => {
            const input: string = "regexp=(https://(a+)\\.example\\.com/\\2/cb)";

            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(input)).toBe(input);
        });

        it("should wrap a single regex without parentheses in regexp=(...)", (): void => {
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=https://is.docs.wso2.com/en/7.0.0/(.*)"))
                .toBe("regexp=(https://is.docs.wso2.com/en/7.0.0/(.*))");
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=https://mchcon.clance.local\\?id=(.*)"))
                .toBe("regexp=(https://mchcon.clance.local\\?id=(.*))");
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=^https://sub3.sub2.sub1.domain.tld(.*)"))
                .toBe("regexp=(^https://sub3.sub2.sub1.domain.tld(.*))");
        });

        it("should wrap a single deep link regex without parentheses in regexp=(...)", (): void => {
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp("regexp=myapp://callback/.*"))
                .toBe("regexp=(myapp://callback/.*)");
        });

        it("should wrap a regex without parentheses that has a comma in a quantifier", (): void => {
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=https://example.com/cb[0-9]{0,4}"))
                .toBe("regexp=(https://example.com/cb[0-9]{0,4})");
        });

        it("should wrap a regex without parentheses that has | inside a group", (): void => {
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=https://app.example.com/(login|logout)"))
                .toBe("regexp=(https://app.example.com/(login|logout))");
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=https://(dev|test)\\.example\\.com/cb"))
                .toBe("regexp=(https://(dev|test)\\.example\\.com/cb)");
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=(https?:\\/\\/)?(a\\.example\\.com|b\\.example\\.com)/cb"))
                .toBe("regexp=((https?:\\/\\/)?(a\\.example\\.com|b\\.example\\.com)/cb)");
        });

        it("should wrap a regex without parentheses that has a part which is not a URL", (): void => {
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=https://a.example.com/cb|localhost"))
                .toBe("regexp=(https://a.example.com/cb|localhost)");
        });

        it("should wrap a regex without parentheses exactly as stored", (): void => {
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp("regexp=https://example.com/cb.*|"))
                .toBe("regexp=(https://example.com/cb.*|)");
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp("regexp= https://example.com/cb.*"))
                .toBe("regexp=( https://example.com/cb.*)");
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=https://app.example.com/(login | logout)"))
                .toBe("regexp=(https://app.example.com/(login | logout))");
        });

        it("should keep a regex without parentheses that has a numbered backreference unchanged", (): void => {
            const single: string = "regexp=https://(a+)\\.example\\.com/\\1/cb";
            const group: string = "regexp=https://(login|logout)\\.example\\.com/\\1/cb";
            const list: string = "regexp=https://(a+)\\.example\\.com/\\1/cb|https://b.example.com/cb";
            const escapedBackslash: string = "regexp=https://a\\.example\\.com/x\\\\1";

            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(single)).toBe(single);
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(group)).toBe(group);
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(list)).toBe(list);
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(escapedBackslash))
                .toBe(escapedBackslash);
        });

        it("should wrap a regex without parentheses that has a named backreference", (): void => {
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(
                "regexp=https://(?<sub>a+)\\.example\\.com/\\k<sub>/cb"))
                .toBe("regexp=(https://(?<sub>a+)\\.example\\.com/\\k<sub>/cb)");
        });

        it("should return an empty regexp unchanged", (): void => {
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp("regexp=")).toBe("regexp=");
            expect(ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp("regexp=  ")).toBe("regexp=  ");
        });
    });

    describe("buildCallBackUrlWithRegExp", (): void => {
        it("should return a single plain URL unchanged", (): void => {
            const input: string = "https://example.com/cb";

            expect(ApplicationManagementUtils.buildCallBackUrlWithRegExp(input)).toBe("https://example.com/cb");
        });

        it("should wrap a comma-separated list of URLs in a regexp", (): void => {
            const input: string = "https://a.example.com/cb,https://b.example.com/cb";

            expect(ApplicationManagementUtils.buildCallBackUrlWithRegExp(input))
                .toBe("regexp=(https://a.example.com/cb|https://b.example.com/cb)");
        });

        it("should persist an already-wrapped regex verbatim", (): void => {
            const input: string = "regexp=(https://(127.0.0.1|localhost)(:.[0-9]{0,4})?/cb)";

            expect(ApplicationManagementUtils.buildCallBackUrlWithRegExp(input)).toBe(input);
        });

        it("should preserve quote characters inside a wrapped regex (no stripping)", (): void => {
            const input: string = "regexp=(https://example.com/[\"'])";

            expect(ApplicationManagementUtils.buildCallBackUrlWithRegExp(input)).toBe(input);
        });

        it("should strip surrounding quote literals from a non-wrapped value", (): void => {
            const input: string = "\"https://example.com/cb\"";

            expect(ApplicationManagementUtils.buildCallBackUrlWithRegExp(input)).toBe("https://example.com/cb");
        });
    });

    describe("normalizeCallbackUrlsFromRegExp and buildCallBackUrlWithRegExp (load and save)", (): void => {
        const loadAndSave = (stored: string): string =>
            ApplicationManagementUtils.buildCallBackUrlWithRegExp(
                ApplicationManagementUtils.normalizeCallbackUrlsFromRegExp(stored));

        it("should keep the regexp= prefix of a single regex through a save", (): void => {
            expect(loadAndSave("regexp=(https://example.com/cb.*)")).toBe("regexp=(https://example.com/cb.*)");
            expect(loadAndSave("regexp=(myapp://callback/.*)")).toBe("regexp=(myapp://callback/.*)");
        });

        it("should keep a regex in parentheses unchanged through a save", (): void => {
            const urls: string = "regexp=(https://a.example.com/(.*)|https://b.example.com/(.*))";
            const complex: string = "regexp=(https://(127.0.0.1|localhost)(:.[0-9]{0,4})?/cb)";
            const notOneGroup: string = "regexp=(https://a.example.com/cb)|(https://b.example.com/cb)";

            expect(loadAndSave(urls)).toBe(urls);
            expect(loadAndSave(complex)).toBe(complex);
            expect(loadAndSave(notOneGroup)).toBe(notOneGroup);
        });

        it("should save a regex without parentheses as one regex in regexp=(...)", (): void => {
            expect(loadAndSave("regexp=https://app.example.com/(login|logout)"))
                .toBe("regexp=(https://app.example.com/(login|logout))");
            expect(loadAndSave("regexp=https://example.com/cb[0-9]{0,4}"))
                .toBe("regexp=(https://example.com/cb[0-9]{0,4})");
            expect(loadAndSave("regexp=https://a.example.com/cb|https://b.example.com/cb.*"))
                .toBe("regexp=(https://a.example.com/cb|https://b.example.com/cb.*)");
        });

        it("should keep a regex with a numbered backreference unchanged through a save", (): void => {
            const input: string = "regexp=https://(a+)\\.example\\.com/\\1/cb";

            expect(loadAndSave(input)).toBe(input);
        });
    });
});
