/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { render, screen, waitFor } from "@unit-testing";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fullPermissions } from "./__mocks__/getting-started-permissions";
import GettingStartedPage from "../getting-started";

describe("Test if the Getting Started page is working as expected", () => {

    it("<GettingStartedPage /> matches snapshot", () => {
        const { container } = render(<GettingStartedPage />, {
            allowedScopes: fullPermissions
        });

        expect(container).toMatchSnapshot();
    });

    it("<GettingStartedPage /> renders without exploding", () => {
        render(<GettingStartedPage />, {
            allowedScopes: fullPermissions
        });

        expect(screen.getByTestId("getting-started-page-layout")).toBeInTheDocument();
    });

    it("<GettingStartedPage /> renders loaders properly", async () => {
        render(<GettingStartedPage />, {
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
