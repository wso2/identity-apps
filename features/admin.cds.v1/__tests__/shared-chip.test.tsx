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
import { describe, expect, it } from "vitest";
import SharedChip from "../components/shared-chip";
import "@testing-library/jest-dom";

describe("SharedChip", () => {

    it("tells that a parent organization shares the item, without an organization name", () => {
        render(<SharedChip data-componentid="chip" />);

        const chip: HTMLElement = screen.getByTestId("chip");

        expect(chip).toHaveTextContent("customerDataService:sharing.shared");
        expect(chip).toHaveAttribute("aria-label", "customerDataService:sharing.sharedTooltip");
    });

    it("tells that the organization inherits the item from the root organization", () => {
        render(<SharedChip inherited data-componentid="chip" />);

        const chip: HTMLElement = screen.getByTestId("chip");

        expect(chip).toHaveTextContent("customerDataService:sharing.inherited");
        expect(chip).toHaveAttribute("aria-label", "customerDataService:sharing.inheritedTooltip");
    });
});
