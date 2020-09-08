/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { RenderOptions, RenderResult, render } from "@testing-library/react";
import { I18n } from "@wso2is/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { history } from "../helpers";
import { store } from "../store";

/**
 * This returns a higher order component with all the needed providers
 * @param props.children
 */
const AllTheProviders: React.FunctionComponent = ({ children }): JSX.Element => {
    return (
        <Router history={ history }>
            <div className="container-fluid">
                <I18nextProvider i18n={ I18n.instance }>
                    <Provider store={ store }>
                            { children }
                    </Provider>
                </I18nextProvider>
            </div>
        </Router>
    );
};

/**
 *  This creates a custom render method that automatically wraps the passed element
 *  with the AllTheProviders element
 * @param ui
 * @param options
 */
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, "queries">): RenderResult => {
    return render(ui, { wrapper: AllTheProviders, ...options });
};

// Exports the react testing library
export * from "@testing-library/react";

// This overrides the default render method
export { customRender as render };
