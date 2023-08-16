/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
// import { TryOutComponent } from "../application/try-out";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
// import MockApplication from "./__mocks__/mock.application";

/**
 * Test refactoring effort will be tracked in the following issue.
 *@see {@link https://github.com/wso2-enterprise/asgardeo-product/issues/1368}
 */
describe("Test Suite - Try Out Extension Component.", () => {
    const mockStore = configureStore()
    const store = mockStore({});

    test.skip("Test proper rendering of Try Out Page", () => {
        render(
            <Provider store={store}>
                {/*<TryOutComponent
                    application={MockApplication}
                    data-testid="try-out"
                />*/}
            </Provider>)
    });

    test.skip("Test download react sample button to be in the document", () => {
        render(
            <Provider store={store}>
                {/*<TryOutComponent
                    application={MockApplication}
                    data-testid="try-out"
                />*/}
            </Provider>
        )
        expect(screen.getByTestId("try-out-download-react-sample")).toBeInTheDocument();
    });

    test.skip("Test download config button to be in the document", () => {
        render(
            <Provider store={store}>
               {/* <TryOutComponent
                    application={MockApplication}
                    data-testid="try-out"
                />*/}
            </Provider>
        )
        expect(screen.getByTestId("try-out-download-config")).toBeInTheDocument();
    });

    test.skip("Test click event of react sample download button", () => {
        const openSpy = jest.spyOn(window, "open");
        render(
            <Provider store={store}>
                {/*<TryOutComponent
                    application={MockApplication}
                    data-testid="try-out"
                />*/}
            </Provider>
        )
        fireEvent.click(screen.getByTestId("try-out-download-react-sample"));
        expect(openSpy).toHaveBeenCalled();
    });
});
