/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpClientInstance, HttpRequestConfig } from "@asgardeo/auth-react";
import { AxiosError, AxiosResponse } from "axios";
import { HttpMethods } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Generate push authenticator QR code URL for the authenticated user
 */
export const initPushAuthenticatorQRCode = (): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.push + "/discovery-data"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            // return Promise.reject(error)
            return Promise.resolve({
                data: {
                    "deviceId": "18fa4228-d136-4b6d-a951-9e934efb6f21",
                    "username": "batman",
                    "host": "https://localhost:9443",
                    "tenantDomain": "carbon.super",
                    "tenantPath": "/t/carbon.super",
                    "challenge": "bfd5e5cf-47e2-4214-9994-f9217ef5b344"
                }
            }
            );
            // return Promise.reject(error);
        });
};

export const getPushEnabledDevices = () => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.push + "/devices"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            // return Promise.reject(error)
            return Promise.resolve({
                data:
                [
                    {
                        "deviceId": "385eb085-d575-455e-bb7a-192bfa1555d0",
                        "name": "My Device",
                        "model": "iPhone 16",
                        "provider": "FCM"
                    }

                ]

            }
            );
            // return Promise.reject(error);
        });

};

export const checkIfPushEnabled = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        resolve(false);
    });
};

/**
 * This API is used to delete the configured push authenticator of the authenticated user.
 */
export const deletePushAuthenticator = (): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.totp
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Refresh push authenticator secret key of the authenticated user
 */
export const refreshPushAuthenticatorCode = (): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.totp
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            } else {
                return Promise.resolve(response);
            }
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * View TOTP QR code for the authenticated user
 */
export const viewPushAuthenticatorSetupCode = (): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.push
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
