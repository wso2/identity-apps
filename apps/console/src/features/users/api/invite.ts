/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Config } from "../../core/configs";
import { store } from "../../core/store";
import { UserManagementConstants } from "../constants";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance());

/**
 * Get invitation link for each user.
 *
 * @returns Promise<any> response.
 * @throws IdentityAppsApiException
 */
export const generateInviteLink = (username: string, domain: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            username: username,
            userstore: domain
        },
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: Config.resolveServerHost() + store.getState().config.endpoints.inviteLinkEndpoint
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {            
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    UserManagementConstants.INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {            
            throw new IdentityAppsApiException(
                error.response?.data?.message ?? UserManagementConstants.RESOURCE_NOT_FOUND_ERROR_MESSAGE,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
