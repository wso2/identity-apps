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
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PredefinedLayouts } from "../../models/branding-preferences";
import {
    isBackgroundImageSupportedLayout,
    isValidBackgroundImageURL,
    resolveCssBackgroundImage
} from "../resolve-css-background-image";

const IMAGE_URL: string = "https://cdn.example.com/images/login-background.png";

describe("resolve-css-background-image", () => {
    describe("isBackgroundImageSupportedLayout", () => {
        it.each([
            PredefinedLayouts.CENTERED,
            PredefinedLayouts.LEFT_ALIGNED,
            PredefinedLayouts.RIGHT_ALIGNED,
            PredefinedLayouts.CUSTOM,
            undefined
        ])("supports the %s layout", (layout: string) => {
            expect(isBackgroundImageSupportedLayout(layout)).toBe(true);
        });

        it.each([
            PredefinedLayouts.LEFT_IMAGE,
            PredefinedLayouts.RIGHT_IMAGE
        ])("doesn't support the %s layout", (layout: string) => {
            expect(isBackgroundImageSupportedLayout(layout)).toBe(false);
        });
    });

    describe("isValidBackgroundImageURL", () => {
        it.each([
            IMAGE_URL,
            "http://cdn.example.com/bg.png",
            "HTTPS://CDN.EXAMPLE.COM/BG.PNG",
            `  ${ IMAGE_URL }  `
        ])("accepts %s", (url: string) => {
            expect(isValidBackgroundImageURL(url)).toBe(true);
        });

        it.each([
            undefined,
            "",
            "   ",
            "javascript:alert(1)",
            "javascript:alert(\"http://example.com\")",
            "data:image/png;base64,iVBORw0KGgo=",
            "ftp://cdn.example.com/bg.png",
            "/images/bg.png",
            "cdn.example.com/bg.png",
            "http:cdn.example.com/bg.png",
            "https://"
        ])("rejects %s", (url: string) => {
            expect(isValidBackgroundImageURL(url)).toBe(false);
        });
    });

    describe("resolveCssBackgroundImage", () => {
        it("returns the URL as a CSS url() value", () => {
            expect(resolveCssBackgroundImage(IMAGE_URL, PredefinedLayouts.CENTERED))
                .toBe(`url("${ IMAGE_URL }")`);
        });

        it("trims the URL", () => {
            expect(resolveCssBackgroundImage(`  ${ IMAGE_URL }\n`)).toBe(`url("${ IMAGE_URL }")`);
        });

        it.each([
            undefined,
            "",
            "   ",
            "javascript:alert(1)",
            "data:image/png;base64,iVBORw0KGgo=",
            "ftp://cdn.example.com/bg.png"
        ])("returns none for %s", (url: string) => {
            expect(resolveCssBackgroundImage(url, PredefinedLayouts.CENTERED)).toBe("none");
        });

        it.each([
            PredefinedLayouts.LEFT_IMAGE,
            PredefinedLayouts.RIGHT_IMAGE
        ])("returns none for the %s layout", (layout: string) => {
            expect(resolveCssBackgroundImage(IMAGE_URL, layout)).toBe("none");
        });

        it("keeps the characters that are safe inside a quoted CSS string", () => {
            const url: string = "https://cdn.example.com/bg(1).png?sig=a'b&x=1 2";

            expect(resolveCssBackgroundImage(url)).toBe(`url("${ url }")`);
        });

        it("escapes the characters that could break out of the url() value", () => {
            expect(resolveCssBackgroundImage("https://cdn.example.com/bg.png\");}body{display:none}/*"))
                .toBe("url(\"https://cdn.example.com/bg.png\\22 );}body{display:none}/*\")");
            expect(resolveCssBackgroundImage("https://cdn.example.com/a\\b.png"))
                .toBe("url(\"https://cdn.example.com/a\\5c b.png\")");
            expect(resolveCssBackgroundImage("https://cdn.example.com/</style><script>.png"))
                .toBe("url(\"https://cdn.example.com/\\3c /style\\3e \\3c script\\3e .png\")");
            expect(resolveCssBackgroundImage("https://cdn.example.com/a\u0007b.png"))
                .toBe("url(\"https://cdn.example.com/a\\7 b.png\")");
        });
    });
});
