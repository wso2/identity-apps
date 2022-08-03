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

import { AsgardeoSPAClient, Storage } from "@asgardeo/auth-react";
import { AxiosError, AxiosResponse } from "axios";
import { CommonServiceResourcesEndpoints } from "../configs";
import { RoleConstants } from "../constants";
import { IdentityAppsApiException } from "../exceptions";
import { HTTPRequestHeaders } from "../helpers";
import { HttpMethods, RoleListInterface } from "../models";
import { ContextUtils } from "../utils";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieve the list of groups that are currently in the system.
 * TODO: Return `response.data` rather than `response` and stop returning any.
 *
 * @param {string} domain - User store domain.
 * @return {Promise<RoleListInterface | any>}
 * @throws {IdentityAppsApiException}
 */
export const getRolesList = (domain: string, url?: string): Promise<RoleListInterface | any> => {

    const requestConfig = {
        headers: HTTPRequestHeaders(ContextUtils.getRuntimeConfig().clientHost),
        method: HttpMethods.GET,
        params: {
            domain
        },
        url: url ?? CommonServiceResourcesEndpoints(ContextUtils.getRuntimeConfig().serverHost).roles
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    RoleConstants.ROLES_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                RoleConstants.ROLES_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
