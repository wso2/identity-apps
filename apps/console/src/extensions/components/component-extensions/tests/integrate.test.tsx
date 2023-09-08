/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
// import { IntegrateAppComponent } from "../application/integrate";
import configureStore from "redux-mock-store";
// import MockApplication from "./__mocks__/mock.application";

/**
 * Test refactoring effort will be tracked in the following issue.
 *@see {@link https://github.com/wso2-enterprise/asgardeo-product/issues/1368}
 */
describe("Test Suite - Integrate Extension Component.", () => { 
    const mockStore: any = configureStore();
    const store: any = mockStore({ 
        helpPanel: {
            "activeTabIndex": 0,
            "docStructure": null,
            "docURL": null,
            "visibility": false
        }
    });

    test.skip("Test proper rendering of Integrate Component", () => {
        render(
            <Provider store={ store }>
                { /*<IntegrateAppComponent
                    application={ MockApplication }
                    applicationType={ "Single Page Application" }
                    data-testid="integrate"
                />*/ }
            </Provider>
        );
    });

    test.skip("Test react technology selection button is in document.", () => {
        render(
            <Provider store={ store }>
                { /*<IntegrateAppComponent
                    application={ MockApplication }
                    applicationType={ "Single Page Application" }
                    data-testid="integrate"
                />*/ }
            </Provider>
        );
        expect(screen.getByTestId("integrate-technology-react")).toBeInTheDocument();
    });

    test.skip("Test react technology selection button click.", () => {
        render(
            <Provider store={ store }>
                { /*<IntegrateAppComponent
                    application={ MockApplication }
                    applicationType={ "Single Page Application" }
                    data-testid="integrate"
                />*/ }
            </Provider>
        );
        // userEvent.click(screen.getByTestId("integrate-technology-react"));
        expect(screen.getByTestId("integrate-react-config")).toBeInTheDocument();
    });
});
