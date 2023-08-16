/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
// import { IntegrateAppComponent } from "../application/integrate";
import userEvent from "@testing-library/user-event"
import configureStore from "redux-mock-store";
// import MockApplication from "./__mocks__/mock.application";

/**
 * Test refactoring effort will be tracked in the following issue.
 *@see {@link https://github.com/wso2-enterprise/asgardeo-product/issues/1368}
 */
describe("Test Suite - Integrate Extension Component.", () => { 
    const mockStore = configureStore();
    const store = mockStore({ 
        helpPanel: {
            "activeTabIndex": 0,
            "docStructure": null,
            "docURL": null,
            "visibility": false
        }
    });

    test.skip("Test proper rendering of Integrate Component", () => {
        render(
            <Provider store={store}>
                {/*<IntegrateAppComponent
                    application={ MockApplication }
                    applicationType={ "Single Page Application" }
                    data-testid="integrate"
                />*/}
            </Provider>
        );
    });

    test.skip("Test react technology selection button is in document.", () => {
        render(
            <Provider store={store}>
                {/*<IntegrateAppComponent
                    application={ MockApplication }
                    applicationType={ "Single Page Application" }
                    data-testid="integrate"
                />*/}
            </Provider>
        );
        expect(screen.getByTestId("integrate-technology-react")).toBeInTheDocument();
    });

    test.skip("Test react technology selection button click.", () => {
        render(
            <Provider store={store}>
                {/*<IntegrateAppComponent
                    application={ MockApplication }
                    applicationType={ "Single Page Application" }
                    data-testid="integrate"
                />*/}
            </Provider>
        );
        // userEvent.click(screen.getByTestId("integrate-technology-react"));
        expect(screen.getByTestId("integrate-react-config")).toBeInTheDocument();
    });
});
