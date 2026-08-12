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
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
import CommonFragment from "../common-fragment";

describe("CommonFragment", (): void => {
    it("renders the decorative header placeholder without heading semantics", (): void => {
        const { container }: { container: HTMLElement } = render(
            <CommonFragment data-componentid="branding-preview-common-fragment" />,
            {
                featureConfig: {}
            }
        );
        const headerPlaceholder: Element | null = container.querySelector(".ui.header");
        const commonFragment: Element | null = container.querySelector(
            "[data-componentid='branding-preview-common-fragment']"
        );

        expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
        expect(headerPlaceholder).toBeInTheDocument();
        expect(headerPlaceholder?.tagName.toLowerCase()).toBe("div");
        expect(commonFragment).toBeInTheDocument();
    });
});
