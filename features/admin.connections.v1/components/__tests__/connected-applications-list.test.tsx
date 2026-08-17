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

import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import ConnectedApplicationsList from "../connected-applications-list";

afterEach(cleanup);

describe("Connected applications list", () => {
    it("renders the loader while connected applications are loading", () => {
        render(<ConnectedApplicationsList applications={ [] } isLoading={ true } />);

        expect(screen.getByTestId("content-loader")).toBeDefined();
        expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });

    it("renders an ordered empty list when there are no connected applications", () => {
        render(<ConnectedApplicationsList applications={ [] } isLoading={ false } />);

        expect(screen.getByRole("list").classList.contains("ordered")).toBe(true);
        expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });

    it("renders one connected application as an ordered list item", () => {
        render(<ConnectedApplicationsList
            applications={ [ "Sales Portal" ] }
            isLoading={ false }
        />);

        expect(screen.getByRole("list").classList.contains("ordered")).toBe(true);
        expect(screen.getAllByRole("listitem")).toHaveLength(1);
        expect(screen.getByRole("listitem").textContent).toBe("Sales Portal");
    });

    it("renders multiple connected applications as ordered list items", () => {
        render(<ConnectedApplicationsList
            applications={ [ "Sales Portal", "Support Portal", "Partner Portal" ] }
            isLoading={ false }
        />);

        expect(screen.getByRole("list").classList.contains("ordered")).toBe(true);
        expect(screen.getAllByRole("listitem")).toHaveLength(3);
        expect(screen.getAllByRole("listitem").map((item: HTMLElement) => item.textContent)).toEqual([
            "Sales Portal", "Support Portal", "Partner Portal"
        ]);
    });
});
