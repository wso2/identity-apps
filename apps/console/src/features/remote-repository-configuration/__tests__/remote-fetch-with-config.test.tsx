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

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import MockConfigDetailsRequestResponse from "./__mocks__/mock.config-detail";
import MockConfigListRequestResponse from "./__mocks__/mock.config-list";
import NoConfigResponse from "./__mocks__/mock.noconfig";
import * as api from "../api/remote-repo-config";
import RemoteRepoConfig from "../pages/remote-repository-config";

/* eslint-disable */

/**
 * This will test the remote fetch configuration management
 * feature with a configuration.
 * TODO: Enable once https://github.com/wso2/product-is/issues/10393 is fixed.
 */
describe("UTC-5.0 - [Remote Fetch Configuration] - With Configuration", () => {
    const mockStore = configureStore();
    const store = mockStore({});

    // Mock api call to get remote config list
    const configList = jest.spyOn(api, "getRemoteRepoConfigList");
    configList.mockImplementation(() => {
        return Promise.resolve(MockConfigListRequestResponse);
    });

    // Mock api call to get remote config
    const configDetail = jest.spyOn(api, "getRemoteRepoConfig");
    configDetail.mockImplementation(() => {
        return Promise.resolve(MockConfigDetailsRequestResponse);
    });

    // Mock api call to update remote config
    const configUpdate = jest.spyOn(api, "updateRemoteRepoConfig");
    configUpdate.mockImplementation(() => {
        return Promise.resolve(NoConfigResponse);
    });

    test("UTC-5.1 - Test proper rendering of Remote Fetch Management Component", async () => {
        await act(async () => {
            render(
                <Provider store={ store }>
                    <RemoteRepoConfig data-componentid="remote-fetch" />
                </Provider>
            );
            await waitFor(() => expect(configList).toHaveBeenCalledTimes(1));
            await waitFor(() => expect(configDetail).toHaveBeenCalledTimes(1));
            expect(screen.getByTestId("remote-fetch-form-git-url")).toBeInTheDocument();

            configList.mockClear();
            configDetail.mockClear();
            
        });
    });

    test("UTC-5.2 - Test remove configuration button click event", async () => {
        await act(async () => {
            render(
                <Provider store={ store }>
                    <RemoteRepoConfig data-componentid="remote-fetch" />
                </Provider>
            );
            await waitFor(() => expect(configList).toHaveBeenCalledTimes(1));
            await waitFor(() => expect(configDetail).toHaveBeenCalledTimes(1));
            fireEvent.click(screen.getByTestId("remote-fetch-config-state").firstChild);
            await waitFor(() => expect(configUpdate).toHaveBeenCalledTimes(1));
        });
    });

});
