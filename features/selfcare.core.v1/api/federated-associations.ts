/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpError, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { FederatedAssociation, HttpMethods } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * This function calls the federated association API endpoint and gets the list of federated associations
 */
export const getFederatedAssociations = (): Promise<FederatedAssociation[]> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.federatedAssociations
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse<FederatedAssociation[]>) => {
            if (response.status !== 200) {
                return Promise.reject("Failed to retrieve Federated Associations");
            } else {
                return Promise.resolve(response.data);
            }
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * This removes the specified federated association
 * @param id - id of the federated association
 */
export const deleteFederatedAssociation = (id: string): Promise<void> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.federatedAssociations }/${id}`
    };

    return httpClient(requestConfig)
        .then(() => {
            return Promise.resolve();
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * This removes all the federated associations
 */
export const deleteAllFederatedAssociation = (): Promise<void> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.federatedAssociations
    };

    return httpClient(requestConfig)
        .then(() => {
            return Promise.resolve();
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};
