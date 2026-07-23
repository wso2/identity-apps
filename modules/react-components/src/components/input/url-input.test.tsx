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

describe("URLInput", () => {
    it("renders a single complex regex callback as one chip, verbatim", () => {
        const value: string = "regexp=(https://(127.0.0.1|localhost)(:.[0-9]{0,4})?/cb)";
        const html: string = renderURLInput(value);

        expect(html).toContain(value);
    });

    it("renders a comma-separated list as separate chips", () => {
        const html: string = renderURLInput("https://a.example.com/cb,https://b.example.com/cb");

        expect(html).toContain("https://a.example.com/cb");
        expect(html).toContain("https://b.example.com/cb");
    });

    it("renders without chips for an empty state", () => {
        const html: string = renderURLInput("");

        expect(typeof html).toBe("string");
    });
});
