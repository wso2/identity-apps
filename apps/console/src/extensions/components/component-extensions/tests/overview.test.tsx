/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
*
* This software is the property of WSO2 Inc. and its suppliers, if any.
* Dissemination of any information or reproduction of any material contained
* herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
* You may not alter or remove any copyright or other notice from copies of this content."
*/

import React from "react";
import { render, screen } from "@testing-library/react";
// import { HelpPanelOverview } from "../application/overview";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
// import MockApplication from "./__mocks__/mock.application";
import MockOidc from "./__mocks__/mock.oidcconfig";

/**
 * Test refactoring effort will be tracked in the following issue.
 *@see {@link https://github.com/wso2-enterprise/asgardeo-product/issues/1368}
 */
describe("Test Suite - Overview Extension Component.", () => {
    const mockStore = configureStore();
    const store = mockStore({ 
        application: {
            ...MockOidc
        }
    });

    test.skip("Test proper rendering of Overview Component", () => {
        render(
            <Provider store={store}>
                {/*<HelpPanelOverview
                    application={ MockApplication() }
                    applicationType={ "Single Page Application" }
                    data-testid="overview"
                />*/}
            </Provider>
        );
    });
});
