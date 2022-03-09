/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import MockConfigDetailsRequestResponse from "./__mocks__/mock.config-detail";
import MockConfigDetailsResponse from "./__mocks__/mock.config-status";
import * as api from "../api/remote-repo-config";
import { RemoteFetchDetails } from "../components/remote-fetch-details";

/* eslint-disable */

/**
 * This will test the remote fetch status detail modal.
 * TODO: Enable once https://github.com/wso2/product-is/issues/10393 is fixed.
 */
describe("UTC-3.0 - [Remote Fetch Configuration] - Configuration Status Modal", () => {
    const mockStore = configureStore();
    const store = mockStore({});

    // Mock api call to get remote config details
    const configDetails = jest.spyOn(api, "getConfigDeploymentDetails");
    configDetails.mockImplementation(() => {
        return Promise.resolve(MockConfigDetailsResponse);
    });

    test("UTC-3.1 - Test proper rendering of Remote Fetch Configuration Status modal", async () => {
        render(
            <Provider store={ store }>
                <RemoteFetchDetails
                    isOpen={ true }
                    remoteDeployment={ MockConfigDetailsRequestResponse }
                    data-componentid="remote-fetch-details"
                />
            </Provider>
        );
        await waitFor(() => expect(configDetails).toHaveBeenCalledTimes(1));
        expect(screen.getByTestId("remote-fetch-details-modal")).toBeInTheDocument();
        configDetails.mockClear();
    });
    
});
