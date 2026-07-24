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

// @vitest-environment jsdom

import React, { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { URLInput } from "./url-input";

const renderURLInput = (urlState: string): string => {
    const element: ReactElement = (
        <URLInput
            data-componentid="url-input"
            duplicateURLErrorMessage="This value is already added"
            labelName="Authorized redirect URLs"
            validationErrorMsg="Please enter a valid URI"
            urlState={ urlState }
            setURLState={ () => { /* no-op */ } }
            handleAddAllowedOrigin={ () => { /* no-op */ } }
            allowedOrigins={ [] }
        />
    );

    return renderToStaticMarkup(element);
};

/**
 * Extracts the callback chip values from rendered markup using their `data-componentid`
 * (`url-input-<value>`), excluding the input's own container and the per-chip action buttons.
 *
 * @param html - The rendered markup.
 * @returns The distinct chip values, one per rendered chip.
 */
const chipValues = (html: string): string[] => {
    const container: HTMLDivElement = document.createElement("div");

    container.innerHTML = html;

    const ids: string[] = Array.from(container.querySelectorAll("[data-componentid]"))
        .map((element: Element): string => element.getAttribute("data-componentid") ?? "")
        .filter((id: string): boolean =>
            id.startsWith("url-input-")
            && id !== "url-input-add-button"
            && !id.endsWith("-delete-button")
            && !id.endsWith("-allow-button"));

    return Array.from(new Set(ids)).map((id: string): string => id.replace(/^url-input-/, ""));
};

describe("URLInput", () => {
    it("renders a single complex regex callback as one chip, verbatim", () => {
        const value: string = "regexp=(https://(127.0.0.1|localhost)(:.[0-9]{0,4})?/cb)";
        const html: string = renderURLInput(value);

        expect(chipValues(html)).toEqual([ value ]);
    });

    it("renders a comma-separated list as separate chips", () => {
        const html: string = renderURLInput("https://a.example.com/cb,https://b.example.com/cb");
        const chips: string[] = chipValues(html);

        expect(chips).toHaveLength(2);
        expect(chips).toContain("https://a.example.com/cb");
        expect(chips).toContain("https://b.example.com/cb");
    });

    it("renders without chips for an empty state", () => {
        expect(chipValues(renderURLInput(""))).toHaveLength(0);
    });
});
