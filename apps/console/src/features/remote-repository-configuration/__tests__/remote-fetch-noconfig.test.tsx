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
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import MockEmptyAxiosResponse from "./__mocks__/mock.noconfig";
import MockSaveConfigResponse from "./__mocks__/mock.saveConfig";
import * as api from "../api/remote-repo-config";
import RemoteRepoConfig from "../pages/remote-repository-config";

/* eslint-disable */

/**
 * This will test the remote fetch configuration component with
 * no initial / saved configuration.
 * TODO: Enable once https://github.com/wso2/product-is/issues/10393 is fixed.
 */
describe("UTC-1.0 - [Remote Fetch Configuration] - Without Configuration )", () => {
    const mockStore = configureStore();
    const store = mockStore({});

    // Mock api call to get remote config list
    const addMock =jest.spyOn(api, "getRemoteRepoConfigList");
    addMock.mockImplementation(() => {
        return Promise.resolve(MockEmptyAxiosResponse);
    });
    
    // Mock api call to save remote config
    const saveMock =jest.spyOn(api, "createRemoteRepoConfig");
    saveMock.mockImplementation(() => {
        return Promise.resolve(MockSaveConfigResponse);
    });

    test("UTC-1.1 - Test proper rendering of Remote Fetch Management Component", () => {
        render(
            <Provider store={ store }>
                <RemoteRepoConfig data-testid="remote-fetch" />
            </Provider>
        );
        expect(screen.getByTestId("remote-fetch-page-layout-page-header-title")).toBeInTheDocument();
    });

    test("UTC-1.2 - Test initial form load when no configuration", () => {
        render(
            <Provider store={ store }>
                <RemoteRepoConfig data-testid="remote-fetch" />
            </Provider>
        );
        fireEvent.click(screen.getByTestId("remote-fetch-add-configuration"));
        expect(screen.getByTestId("remote-fetch-form-git-url")).toBeInTheDocument();
    });

    test("UTC-1.3 - Test cancel create save configuration event", () => {
        render(
            <Provider store={ store }>
                <RemoteRepoConfig data-testid="remote-fetch" />
            </Provider>
        );
        fireEvent.click(screen.getByTestId("remote-fetch-add-configuration"));
        fireEvent.click(screen.getByTestId("remote-fetch-cancel-configuration"));
        expect(screen.getByTestId("remote-fetch-add-configuration")).toBeInTheDocument();
    });

    test("UTC-1.4 - Test configuration save event", async () => {
        render(
            <Provider store={ store }>
                <RemoteRepoConfig data-testid="remote-fetch" />
            </Provider>
        );
        fireEvent.click(screen.getByTestId("remote-fetch-add-configuration"));
        fireEvent.change(screen.getByTestId("remote-fetch-form-git-url").querySelector("input"), {
            target: { value: "https://github.com/Thumimku/TestGit.git" } 
        });
        fireEvent.change(screen.getByTestId("remote-fetch-form-git-branch").querySelector("input"), { 
            target: { value: "SampleBranch" } 
        });
        fireEvent.change(screen.getByTestId("remote-fetch-form-git-directory").querySelector("input"), { 
            target: { value: "SampleDirectory" } 
        });
        fireEvent.click(screen.getByTestId("remote-fetch-form-connection-polling").querySelector("input"));
        fireEvent.change(screen.getByTestId("remote-fetch-form-git-username").querySelector("input"), { 
            target: { value: "SampleUser" } 
        });
        fireEvent.change(screen.getByTestId("remote-fetch-form-git-accesstoken").querySelector("input"), { 
            target: { value: "SampleAccessToken" } 
        });

        fireEvent.click(screen.getByTestId("remote-fetch-save-configuration"));
        await waitFor(() => expect(saveMock).toHaveBeenCalledTimes(1));
        saveMock.mockClear();
    });

    test("UTC-1.5 - Test configuration type polling selection", async () => {
        render(
            <Provider store={ store }>
                <RemoteRepoConfig data-testid="remote-fetch" />
            </Provider>
        );
        fireEvent.click(screen.getByTestId("remote-fetch-add-configuration"));
        fireEvent.click(screen.getByTestId("remote-fetch-form-connection-polling").querySelector("input"));
        expect(screen.getByTestId("remote-fetch-form-git-username")).toBeInTheDocument();
    });

    test("UTC-1.6 -  configuration type webhook selection", async () => {
        render(
            <Provider store={ store }>
                <RemoteRepoConfig data-testid="remote-fetch" />
            </Provider>
        );
        fireEvent.click(screen.getByTestId("remote-fetch-add-configuration"));
        fireEvent.click(screen.getByTestId("remote-fetch-form-connection-webhook").querySelector("input"));
        expect(screen.getByTestId("remote-fetch-form-git-shared-key")).toBeInTheDocument();
    });

});
