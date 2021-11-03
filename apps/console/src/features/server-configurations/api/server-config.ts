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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { ServerConfigurationsInterface } from "./governance-connectors";
import { store } from "../../core";
import { ServerConfigurationsConstants } from "../constants";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieve server configurations.
 *
 * @returns {Promise<ServerConfigurationsInterface>} a promise containing the server configurations.
 */
export const getServerConfigs = () : Promise<ServerConfigurationsInterface> => {

    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.serverConfigurations
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ServerConfigurationsConstants.CONFIGS_FETCH_REQUEST_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                ServerConfigurationsConstants.CONFIGS_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });

};
