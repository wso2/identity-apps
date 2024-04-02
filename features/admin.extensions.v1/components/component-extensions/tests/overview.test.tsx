/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { render } from "@testing-library/react";
import React from "react";
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
    const mockStore: any= configureStore();
    const store: any = mockStore({ 
        application: {
            ...MockOidc
        }
    });

    test.skip("Test proper rendering of Overview Component", () => {
        render(
            <Provider store={ store }>
                { /*<HelpPanelOverview
                    application={ MockApplication() }
                    applicationType={ "Single Page Application" }
                    data-testid="overview"
                />*/ }
            </Provider>
        );
    });
});
