/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import React from "react";
import "@testing-library/jest-dom";
import { fullPermissions } from "./__mocks__/branding-permissions";
import { render, screen, waitFor } from "../../../../test-configs/utils";
import BrandingPage from "../pages/branding";

describe("Test if the Branding page is working as expected", () => {

    it("<BrandingPage /> matches snapshot", () => {
        const { container } = render(<BrandingPage />, {
            allowedScopes: fullPermissions
        });

        expect(container).toMatchSnapshot();
    });

    it("<BrandingPage /> renders properly", async () => {
        render(<BrandingPage />, {
            allowedScopes: fullPermissions
        });

        expect(screen.getByTestId("branding-page-layout")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId("branding-preference-preview-iframe")).not.toHaveClass("loader");
        });
    });
});
