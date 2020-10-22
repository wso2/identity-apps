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
import { AxiosResponse } from "axios";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import * as api from "../api/remote-repo-config";
import { RemoteFetchStatus } from "../components";

describe("Test Suite - Remote Fetch Configuration Status", () => {
    const mockStore = configureStore();
    const store = mockStore({});

    const configListRequestResponse: AxiosResponse = {
        config: {},
        data: {
            count: 1,
            remotefetchConfigurations: [
                {
                    actionListenerType:"POLLING",
                    configurationDeployerType:"SP",
                    failedDeployments:0,
                    id: "bd216d32-3d49-4e6f-a971-31045d1379f8",
                    isEnabled: true,
                    name:"ApplicationConfigurationRepository",
                    repositoryManagerType:"GIT",
                    successfulDeployments:0
                }
            ]
        },
        headers: {},
        status: 200,
        statusText: "OK"
    };

    const configTriggerResponse: AxiosResponse = {
        config: {},
        data: {
            count: 0
        },
        headers: {},
        status: 202,
        statusText: "OK"
    };

    const configDetailsRequestResponse: AxiosResponse = {
        config: {},
        data: {
            actionListenerAttributes: {
                frequency: "60"
            },
            configurationDeployerType: "SP",
            id: "bd216d32-3d49-4e6f-a971-31045d1379f8",
            isEnabled: true,
            remoteFetchName: "ApplicationConfigurationRepository",
            repositoryManagerAttributes: {
                accessToken: "sample access token",
                branch: "master",
                directory: "restDemo/",
                uri: "https://github.com/Thumimku/TestGit.git",
                username: "John"
            },
            repositoryManagerType: "GIT",
            status:{
               "count": 0
            }
        },
        headers: {},
        status: 200,
        statusText: "OK"
    };

    const configList = jest.spyOn(api, "getRemoteRepoConfigList");
    configList.mockImplementation(() => {
        return Promise.resolve(configListRequestResponse);
    });

    const configDetail = jest.spyOn(api, "getRemoteRepoConfig");
    configDetail.mockImplementation(() => {
        return Promise.resolve(configDetailsRequestResponse);
    })

    const configTrigger = jest.spyOn(api, "triggerConfigDeployment");
    configTrigger.mockImplementation(() => {
        return Promise.resolve(configTriggerResponse);
    });

    test("Test proper rendering of Remote Fetch Configuration Status", async () => {
        render(
            <Provider store={ store }>
                <RemoteFetchStatus data-testid="remote-fetch-details" />
            </Provider>
        );
        await waitFor(() => expect(configList).toHaveBeenCalledTimes(1));
        expect(screen.getByTestId("remote-fetch-details-status")).toBeInTheDocument();
    });

    test("Test trigger confirguration button click event", async () => {
        render(
            <Provider store={ store }>
                <RemoteFetchStatus data-testid="remote-fetch-details" />
            </Provider>
        );
        await waitFor(() => expect(configList).toHaveBeenCalledTimes(4));
        await waitFor(() => expect(configDetail).toHaveBeenCalledTimes(4));
        fireEvent.click(screen.getByTestId("remote-fetch-details-trigger-config"));
        await waitFor(() => expect(configTrigger).toHaveBeenCalledTimes(1));
    });
    
});
