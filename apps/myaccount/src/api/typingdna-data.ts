/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpError, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../store";

const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * This function is used to delete users' typing patterns in TypingDNA.
 */
export const deleteTypingPatterns = (): Promise<any> => {

    const requestConfig: HttpRequestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.typingDNAMe
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

export const isTypingDNAEnabled = (): Promise<boolean> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.typingDNAServer
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                return Promise.resolve(false);
            }

            if (response.data.enabled == true) {
                return Promise.resolve(true);
            }

            return Promise.resolve(false);
        })
        .catch(() => {
            return Promise.resolve(false);
        });
};
