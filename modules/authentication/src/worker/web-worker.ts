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

import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import {
    ACCESS_TOKEN,
    AUTHORIZATION_CODE,
    AUTHORIZATION_ENDPOINT,
    DISPLAY_NAME,
    EMAIL,
    OIDC_SESSION_IFRAME_ENDPOINT,
    PKCE_CODE_VERIFIER,
    SCOPE,
    SESSION_STATE,
    SIGNED_IN,
    USERNAME
} from "../constants";
import { AxiosHttpClient, AxiosHttpClientInstance } from "../http-client";
import {
    CustomGrantRequestParams,
    ServiceResourcesType,
    SessionData,
    SignInResponse,
    UserInfo,
    WebWorkerClientConfigInterface,
    WebWorkerConfigInterface,
    WebWorkerInterface,
    WebWorkerSingletonInterface
} from "../models";
import {
    customGrant as customGrantUtil,
    endAuthenticatedSession,
    getServiceEndpoints as getServiceEndpointsUtil,
    getUserInfo as getUserInfoUtil,
    handleSignIn,
    handleSignOut,
    resetOPConfiguration,
    sendRefreshTokenRequest as sendRefreshTokenRequestUtil,
    sendRevokeTokenRequest as sendRevokeTokenRequestUtil
} from "../utils";

export const WebWorker: WebWorkerSingletonInterface = (function (): WebWorkerSingletonInterface {
    /**
     * Values to be set when initializing the library.
     */
    let authConfig: WebWorkerConfigInterface;

    let httpClient: AxiosHttpClientInstance;

    let instance: WebWorkerInterface;

    const session: SessionData = new Map<string, string>();

    /**
     * Returns if the user has signed in or not.
     *
     * @returns {boolean} Signed in or not.
     */
    const isSignedIn = (): boolean => {
        return !!session.get(ACCESS_TOKEN);
    };

    /**
     * Checks if an access token exists.
     *
     * @returns {boolean} If the access token exists or not.
     */
    const doesTokenExist = (): boolean => {
        if (session.get(ACCESS_TOKEN)) {
            return true;
        }

        return false;
    };

    /**
     * Sends a sign in request.
     *
     * @returns {Promise<SignInResponse>} A promise that resolves with the Sign In response.
     */
    const signIn = (): Promise<SignInResponse> => {
        return handleSignIn(authConfig)
            .then((response) => {
                if (response.type === SIGNED_IN) {
                    return Promise.resolve({
                        data: {
                            allowedScopes: session.get(SCOPE),
                            authorizationEndpoint: session.get(AUTHORIZATION_ENDPOINT),
                            displayName: session.get(DISPLAY_NAME),
                            email: session.get(EMAIL),
                            oidcSessionIframe: session.get(OIDC_SESSION_IFRAME_ENDPOINT),
                            username: session.get(USERNAME)
                        },
                        type: response.type
                    });
                }

                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * Refreshes the token.
     *
     * @returns {Promise<boolean>} A promise that resolves with `true` if refreshing is successful.
     */
    const refreshAccessToken = (): Promise<boolean> => {
        return sendRefreshTokenRequestUtil(authConfig, session.get(ACCESS_TOKEN));
    };

    /**
     * Signs out.
     *
     * @returns {Promise<boolean>} A promise that resolves with `true` if sign out is successful.
     */
    const signOut = (): Promise<string> => {
        return handleSignOut(authConfig);
    };

    /**
     * Revokes the token.
     *
     * @returns {Promise<boolean>} A promise that resolves with `true` if revoking is successful.
     */
    const endUserSession = (): Promise<boolean> => {
        return sendRevokeTokenRequestUtil(authConfig, session.get(ACCESS_TOKEN)).then(() => {
            endAuthenticatedSession(authConfig);
            resetOPConfiguration(authConfig);

            return Promise.resolve(true);
        }).catch(error => {
            return Promise.reject(error);
        });
    };

    /**
     * Saves the passed authorization code on the session
     *
     * @param {string} authCode The authorization code.
     */
    const setAuthCode = (authCode: string, sessionState: string, pkce: string): void => {
        session.set(AUTHORIZATION_CODE, authCode);
        session.set(SESSION_STATE, sessionState);
        session.set(PKCE_CODE_VERIFIER, pkce);
    };

    /**
     * Makes api calls.
     *
     * @param {AxiosRequestConfig} config API request data.
     *
     * @returns {AxiosResponse} A promise that resolves with the response.
     */
    const httpRequest = (config: AxiosRequestConfig): Promise<AxiosResponse> => {
        let matches = false;
        authConfig.baseUrls.forEach((baseUrl) => {
            if (config?.url?.startsWith(baseUrl)) {
                matches = true;
            }
        });

        if (matches) {
            return httpClient.request(config)
                .then((response: AxiosResponse) => {
                    return Promise.resolve(response);
                })
                .catch((error: AxiosError) => {
                    if (error?.response?.status === 401) {

                        return refreshAccessToken()
                            .then(() => {
                                return httpClient(config)
                                    .then((response) => {
                                        return Promise.resolve(response);
                                    })
                                    .catch((error) => {
                                        return Promise.reject(error);
                                    });
                            })
                            .catch((error) => {
                                return Promise.reject(error);
                            });
                    }

                    return Promise.reject(error);
                });
        } else {
            return Promise.reject("The provided URL is illegal.");
        }
    };

    /**
     * Makes multiple api calls. Wraps `axios.spread`.
     *
     * @param {AxiosRequestConfig[]} config API request data.
     *
     * @returns {AxiosResponse[]} A promise that resolves with the response.
     */
    const httpRequestAll = (configs: AxiosRequestConfig[]): Promise<AxiosResponse[]> => {
        let matches = false;
        authConfig.baseUrls.forEach((baseUrl) => {
            if (configs.every((config) => config.url.startsWith(baseUrl))) {
                matches = true;
            }
        });

        const httpRequests: AxiosPromise[] = configs.map((config: AxiosRequestConfig) => {
            return httpClient.request(config);
        });

        if (matches) {
            return axios
                .all(httpRequests)
                .then((responses: AxiosResponse[]) => {
                    return Promise.resolve(responses);
                })
                .catch((error: AxiosError) => {
                    if (error?.response?.status === 401) {

                        return refreshAccessToken()
                            .then(() => {
                                return axios
                                    .all(httpRequests)
                                    .then((response) => {
                                        return Promise.resolve(response);
                                    })
                                    .catch((error) => {
                                        return Promise.reject(error);
                                    });
                            })
                            .catch((error) => {
                                return Promise.reject(error);
                            });
                    }

                    return Promise.reject(error);
                });
        } else {
            return Promise.reject("The provided URL is illegal.");
        }
    };

    const customGrant = (
        requestParams: CustomGrantRequestParams
    ): Promise<SignInResponse | boolean | AxiosResponse> => {
        return customGrantUtil(requestParams, authConfig);
    };

    const getUserInfo = (): UserInfo => {
        return getUserInfoUtil(authConfig);
    };

    const getServiceEndpoints = (): Promise<ServiceResourcesType> => {
        return Promise.resolve(getServiceEndpointsUtil(authConfig));
    }

    /**
     * @constructor
     *
     * Constructor function that returns an object containing all the public methods.
     *
     * @param {ConfigInterface} config Configuration data.
     *
     * @returns {OAuthWorkerInterface} Returns the object containing
     */
    function Constructor(config: WebWorkerClientConfigInterface): WebWorkerInterface {
        authConfig = { ...config };
        authConfig.session = session;

        httpClient = AxiosHttpClient.getInstance();

        const startCallback = (request: AxiosRequestConfig): void => {
            request.headers = {
                ...request.headers,
                Authorization: `Bearer ${ session?.get(ACCESS_TOKEN) }`
            };

            config.httpClient?.requestStartCallback && config.httpClient?.requestStartCallback();

        };

        httpClient.init(
            true,
            startCallback,
            config.httpClient?.requestSuccessCallback ?? null,
            config.httpClient?.requestErrorCallback ?? null,
            config.httpClient?.requestFinishCallback ?? null
        );

        return {
            customGrant,
            doesTokenExist,
            endUserSession,
            getServiceEndpoints,
            getUserInfo,
            httpRequest,
            httpRequestAll,
            isSignedIn,
            refreshAccessToken,
            setAuthCode,
            signIn,
            signOut
        };
    }

    return {
        getInstance: (config: WebWorkerClientConfigInterface): WebWorkerInterface => {
            if (instance) {
                return instance;
            } else {
                instance = Constructor(config);

                return instance;
            }
        }
    };
})();
