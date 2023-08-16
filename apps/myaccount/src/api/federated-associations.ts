/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
