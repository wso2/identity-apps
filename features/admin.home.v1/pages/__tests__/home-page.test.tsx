/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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
import { fullPermissions } from "./__mocks__/getting-started-permissions";
import HomePage from "../home-page";
import "@testing-library/jest-dom";

describe("Test if the Getting Started page is working as expected", () => {

    // Skipping until the snapshot issue is sorted out.
    it.skip("<HomePage /> matches snapshot", () => {
        const { container } = render(<HomePage />, {
            allowedScopes: fullPermissions
        });

        expect(container).toMatchSnapshot();
    });

    it.skip("<HomePage /> renders without exploding", () => {
        render(<HomePage />, {
            allowedScopes: fullPermissions
        });

        expect(screen.getByTestId("getting-started-page-layout")).toBeInTheDocument();
    });

    it.skip("<HomePage /> renders loaders properly", async () => {
        render(<HomePage />, {
            allowedScopes: fullPermissions
        });

        expect(screen.getByTestId(
            "dynamic-application-context-card-navigate-to-application-list-button"
        )).toBeInTheDocument();

        expect(screen.getByTestId("getting-started-page-layout")).toBeInTheDocument();
        expect(screen.getByTestId("getting-started-page-add-user-button")).toHaveClass("ui loading");
        expect(screen.getByTestId("develop-getting-started-page-add-social-login")).toBeInTheDocument();
        expect(screen.getByTestId("develop-getting-started-page-view-docs")).toBeInTheDocument();
    });
});
