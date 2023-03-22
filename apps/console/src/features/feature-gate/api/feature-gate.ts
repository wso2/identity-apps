/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../core";
import { FeatureGateInterface } from "../models/feature-gate";

/**
 * Initialize an axios Http client.
 */
const httpClient: any = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieve the list of features available for the organization.
 *
 * @param organization user store
 */
export const getFeatures = (organization: string): Promise<FeatureGateInterface | any> => {

    const requestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            organization
        },
        url: store.getState().config.endpoints.featureGate
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status == 200) {
                return Promise.resolve(response);
            } else {
                return Promise.reject("Error while retrieving the feature list of the organization");
            }
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

