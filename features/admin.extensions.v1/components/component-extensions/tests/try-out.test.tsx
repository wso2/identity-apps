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

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
// import { TryOutComponent } from "../application/try-out";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
// import MockApplication from "./__mocks__/mock.application";

/**
 * Test refactoring effort will be tracked in the following issue.
 *@see {@link https://github.com/wso2-enterprise/asgardeo-product/issues/1368}
 */
describe("Test Suite - Try Out Extension Component.", () => {
    const mockStore: any = configureStore();
    const store: any = mockStore({});

    test.skip("Test proper rendering of Try Out Page", () => {
        render(
            <Provider store={ store }>
                { /*<TryOutComponent
                    application={MockApplication}
                    data-testid="try-out"
                />*/ }
            </Provider>);
    });

    test.skip("Test download react sample button to be in the document", () => {
        render(
            <Provider store={ store }>
                { /*<TryOutComponent
                    application={MockApplication}
                    data-testid="try-out"
                />*/ }
            </Provider>
        );
        expect(screen.getByTestId("try-out-download-react-sample")).toBeInTheDocument();
    });

    test.skip("Test download config button to be in the document", () => {
        render(
            <Provider store={ store }>
                { /* <TryOutComponent
                    application={MockApplication}
                    data-testid="try-out"
                />*/ }
            </Provider>
        );
        expect(screen.getByTestId("try-out-download-config")).toBeInTheDocument();
    });

    test.skip("Test click event of react sample download button", () => {
        const openSpy: any = jest.spyOn(window, "open");

        render(
            <Provider store={ store }>
                { /*<TryOutComponent
                    application={MockApplication}
                    data-testid="try-out"
                />*/ }
            </Provider>
        );
        fireEvent.click(screen.getByTestId("try-out-download-react-sample"));
        expect(openSpy).toHaveBeenCalled();
    });
});
