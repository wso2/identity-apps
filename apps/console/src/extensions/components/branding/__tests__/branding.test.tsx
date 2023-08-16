/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { render, screen, waitFor } from "@unit-testing";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fullPermissions } from "./__mocks__/branding-permissions";
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
