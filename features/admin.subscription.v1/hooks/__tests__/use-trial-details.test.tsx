/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import React, { FunctionComponent, ReactElement } from "react";
import TrialContext, { TrialContextPropsInterface } from "../../contexts/trial-context";
import { useTrialDetails } from "../use-trial-details";
import "@testing-library/jest-dom";

const Probe: FunctionComponent = (): ReactElement => {
    const { tenantHasTrial, daysRemaining, isLoading } = useTrialDetails();

    return (
        <div data-componentid="use-trial-details-probe">
            <span>{ `tenantHasTrial:${ tenantHasTrial }` }</span>
            <span>{ `daysRemaining:${ daysRemaining }` }</span>
            <span>{ `isLoading:${ isLoading }` }</span>
        </div>
    );
};

describe("useTrialDetails", () => {
    it("throws when used outside a TrialProvider", () => {
        const consoleError: jest.SpyInstance = jest
            .spyOn(console, "error")
            .mockImplementation(() => undefined);

        expect(() => render(<Probe />)).toThrow(
            "useTrialDetails must be used within a TrialProvider"
        );

        consoleError.mockRestore();
    });

    it("returns the trial state provided via TrialContext", () => {
        const contextValue: TrialContextPropsInterface = {
            daysRemaining: 7,
            isLoading: false,
            tenantHasTrial: true
        };

        render(
            <TrialContext.Provider value={ contextValue }>
                <Probe />
            </TrialContext.Provider>
        );

        expect(screen.getByText("tenantHasTrial:true")).toBeInTheDocument();
        expect(screen.getByText("daysRemaining:7")).toBeInTheDocument();
        expect(screen.getByText("isLoading:false")).toBeInTheDocument();
    });
});
