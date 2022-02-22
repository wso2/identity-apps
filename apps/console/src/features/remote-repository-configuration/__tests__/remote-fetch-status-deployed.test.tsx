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

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import MockConfigDetailsRequestResponse from "./__mocks__/mock.config-detail";
import MockConfigListRequestResponse from "./__mocks__/mock.config-list";
import MockConfigTriggerResponse from "./__mocks__/mock.config-trigger-response";
import * as api from "../api/remote-repo-config";
import { RemoteFetchStatus } from "../components";

/* eslint-disable */

/**
 * This will test the remote configuration status view.
 * TODO: Enable once https://github.com/wso2/product-is/issues/10393 is fixed.
 */
describe("UTC-2.0 - [Remote Fetch Configuration] - Deployed Configuration Status", () => {
    const mockStore = configureStore();
    const store = mockStore({});

    // Mock api call to get remote config list
    const configList = jest.spyOn(api, "getRemoteRepoConfigList");
    configList.mockImplementation(() => {
        return Promise.resolve(MockConfigListRequestResponse);
    });

    // Mock api call to get remote config detail
    const configDetail = jest.spyOn(api, "getRemoteRepoConfig");
    configDetail.mockImplementation(() => {
        return Promise.resolve(MockConfigDetailsRequestResponse);
    });

    // Mock api call to trigger remote config
    const configTrigger = jest.spyOn(api, "triggerConfigDeployment");
    configTrigger.mockImplementation(() => {
        return Promise.resolve(MockConfigTriggerResponse);
    });

    test("UTC-2.1 - Test proper rendering of Remote Fetch Configuration Status", async () => {
        render(
            <Provider store={ store }>
                <RemoteFetchStatus data-componentid="remote-fetch-details" />
            </Provider>
        );
        await waitFor(() => expect(configList).toHaveBeenCalledTimes(1));
        expect(screen.getByTestId("remote-fetch-details-status")).toBeInTheDocument();
    });

    test("UTC-2.2 - Test trigger configuration button click event", async () => {
        render(
            <Provider store={ store }>
                <RemoteFetchStatus data-componentid="remote-fetch-details" />
            </Provider>
        );
        await waitFor(() => expect(configList).toHaveBeenCalledTimes(4));
        await waitFor(() => expect(configDetail).toHaveBeenCalledTimes(4));
        fireEvent.click(screen.getByTestId("remote-fetch-details-trigger-config"));
        await waitFor(() => expect(configTrigger).toHaveBeenCalledTimes(1));
    });
    
});
