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

import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import GoogleQuickStart from "../quick-start";

jest.mock("@wso2is/access-control/src/hooks/use-required-scopes", () => ({
    useRequiredScopes: (_scopes: string[]) => true
}));

describe("Google connection quick start works as expected", () => {
    it.skip("uses the reusable application selection modal in the first step in the guide", () => {
        render(<GoogleQuickStart
            data-testid="google-quick-start"
        />);

        fireEvent.click(screen.getByTestId("google-quick-start-select-application-link"));
        expect(screen.getByTestId("google-idp-quick-start-application-selection-modal")).toBeInTheDocument();
    });
});
