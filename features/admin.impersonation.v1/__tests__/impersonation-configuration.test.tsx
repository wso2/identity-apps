/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import { ImpersonationConfigurationPage }  from "../pages/impersonation-configuration";
import "@testing-library/jest-dom";

describe.skip("Impersonation Configuration", () => {

    jest.mock("@wso2is/admin.impersonation.v1/api/impersonation-configuration", () => ({
        useImpersonationConfig: () => ({
            data: {
                "enableEmailNotification":true
            },
            error: undefined,
            isLoading: false
        })
    }));

    it("<ImpersonationConfigurationPage /> matches snapshot", () => {
        const { container } = render(
            <ImpersonationConfigurationPage
                data-componentid="impersonation-configuration-page"
            />
        );

        expect(container).toMatchSnapshot();
    });

    it("renders the Impersonation Configuration component", () => {
        render(
            <ImpersonationConfigurationPage
                data-componentid="impersonation-configuration-page"
            />
        );

        const impersonationConfiguration: HTMLElement =
            screen.getByTestId("impersonation-configuration-page-form-layout");

        expect(impersonationConfiguration).toBeInTheDocument();
    });
});
