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

import { URLComponentsInterface } from "../../models/url-components";
import { URLUtils } from "../url-utils";

jest.mock("tldts", (): {
    getDomain: jest.Mock<
        "localhost"| "example.com" | "example.co.uk" | "example.gov.us" | "simple.host" | undefined,
        [url: string],
        any
    >;
} => ({
    getDomain: jest.fn((url: string) => {
        if (url.includes("example.com")) return "example.com";
        if (url.includes("example.co.uk")) return "example.co.uk";
        if (url.includes("localhost")) return "localhost";
        if (url.includes("example.gov.us")) return "example.gov.us";
        if (url.includes("simple.host")) return "simple.host";

        return undefined;
    })
}));

describe("URLUtils", (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    describe("isHttpUrl", (): void => {
        it("should return true for valid http URLs", (): void => {
            expect(URLUtils.isHttpUrl("http://example.com")).toBe(true);
            expect(URLUtils.isHttpUrl("http://www.example.com/path")).toBe(true);
        });

        it("should return false for https or invalid URLs", (): void => {
            expect(URLUtils.isHttpUrl("https://example.com")).toBe(false);
            expect(URLUtils.isHttpUrl("ftp://example.com")).toBe(false);
            expect(URLUtils.isHttpUrl("not a url")).toBe(false);
        });
    });

    describe("isHttpsUrl", (): void => {
        it("should return true for valid https URLs", (): void => {
            expect(URLUtils.isHttpsUrl("https://example.com")).toBe(true);
            expect(URLUtils.isHttpsUrl("https://www.example.com/path")).toBe(true);
        });

        it("should return false for http or invalid URLs", (): void => {
            expect(URLUtils.isHttpsUrl("http://example.com")).toBe(false);
            expect(URLUtils.isHttpsUrl("ftp://example.com")).toBe(false);
            expect(URLUtils.isHttpsUrl("not a url")).toBe(false);
        });
    });

    describe("isHttpsOrHttpUrl", (): void => {
        it("should return true for both http and https URLs", (): void => {
            expect(URLUtils.isHttpsOrHttpUrl("http://example.com")).toBe(true);
            expect(URLUtils.isHttpsOrHttpUrl("https://example.com")).toBe(true);
            expect(URLUtils.isHttpsOrHttpUrl("https://www.example.com/path")).toBe(true);
        });

        it("should return false for non-http/https URLs", (): void => {
            expect(URLUtils.isHttpsOrHttpUrl("ftp://example.com")).toBe(false);
            expect(URLUtils.isHttpsOrHttpUrl("not a url")).toBe(false);
        });
    });

    describe("isDataUrl", (): void => {
        it("should return true for valid data URLs", (): void => {
            // eslint-disable-next-line max-len
            expect(URLUtils.isDataUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==")).toBe(true);
        });

        it("should return false for non-data URLs", (): void => {
            expect(URLUtils.isDataUrl("http://example.com")).toBe(false);
            expect(URLUtils.isDataUrl("not a url")).toBe(false);
        });
    });

    describe("isLoopBackCall", (): void => {
        it("should return true for loopback URLs", (): void => {
            expect(URLUtils.isLoopBackCall("http://localhost")).toBe(true);
            expect(URLUtils.isLoopBackCall("http://127.0.0.1")).toBe(true);
        });

        it("should return false for non-loopback URLs", (): void => {
            expect(URLUtils.isLoopBackCall("http://example.com")).toBe(false);
            expect(URLUtils.isLoopBackCall("not a url")).toBe(false);
        });
    });

    describe("urlComponents", (): void => {
        it("should extract URL components correctly", (): void => {
            const components: URLComponentsInterface = URLUtils.urlComponents("https://example.com/path?query=value");

            expect(components).toBeTruthy();
            expect(components.protocol).toBe("https");
            expect(components.host).toBe("example.com");
            expect(components.origin).toBe("https://example.com");
            expect(components.href).toBe("https://example.com/path?query=value");
            expect(components.pathWithoutProtocol).toBe("example.com/path?query=value");
        });

        it("should return null for invalid URLs", (): void => {
            expect(URLUtils.urlComponents("not a url")).toBeNull();
        });
    });

    describe("isURLValid", (): void => {
        it("should validate URLs correctly", (): void => {
            expect(URLUtils.isURLValid("https://example.com")).toBe(true);
            expect(URLUtils.isURLValid("http://localhost")).toBe(true);
        });

        it("should return false for invalid URLs", (): void => {
            expect(URLUtils.isURLValid("not a url")).toBe(false);
        });

        it("should handle sanitization check", (): void => {
            const mockSanitizeUrl: jest.Mock<string, []> = jest.fn().mockReturnValue("about:blank");

            jest.mock("@braintree/sanitize-url", (): {
                sanitizeUrl: jest.Mock<string, []>;
            } => ({
                sanitizeUrl: mockSanitizeUrl
            }));

            expect(URLUtils.isURLValid("javascript:alert(\"XSS\")", true)).toBe(false);
        });
    });

    describe("isHTTPS", (): void => {
        it("should correctly identify HTTPS URLs", (): void => {
            expect(URLUtils.isHTTPS("https://example.com")).toBe(true);
            expect(URLUtils.isHTTPS("http://example.com")).toBe(false);
        });

        it("should handle invalid URLs", (): void => {
            expect(URLUtils.isHTTPS("not a url")).toBe(false);
        });
    });

    describe("isAValidOriginUrl", (): void => {
        it("should validate origin URLs", (): void => {
            expect(URLUtils.isAValidOriginUrl("https://example.com")).toBe(true);
            expect(URLUtils.isAValidOriginUrl("https://example.com/")).toBe(true);
        });

        it("should return false for URLs with paths or query parameters", (): void => {
            expect(URLUtils.isAValidOriginUrl("https://example.com/path")).toBe(false);
            expect(URLUtils.isAValidOriginUrl("https://example.com?query=value")).toBe(false);
        });
    });

    describe("isMobileDeepLink", (): void => {
        it("should return true for valid mobile deep links", (): void => {
            expect(URLUtils.isMobileDeepLink("myapp://open")).toBe(true);
            expect(URLUtils.isMobileDeepLink("com.example.app://path")).toBe(true);
        });
    });

    describe("getDomain", (): void => {
        it("should extract domain correctly", (): void => {
            expect(URLUtils.getDomain("https://www.example.com/path")).toBe("example.com");
            expect(URLUtils.getDomain("https://subdomain.example.co.uk")).toBe("example.co.uk");
            expect(URLUtils.getDomain("http://localhost")).toBe("localhost");
        });

        it("should handle various hostname formats", (): void => {
            expect(URLUtils.getDomain("https://app.example.gov.us")).toBe("example.gov.us");
            expect(URLUtils.getDomain("https://simple.host")).toBe("simple.host");
        });
    });
});
