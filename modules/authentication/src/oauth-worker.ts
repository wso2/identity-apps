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

import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import {
    getAuthenticatedUser as getAuthenticatedUserUtil,
    getTokenRequestHeaders as getTokenRequestHeadersUtil,
    handleSignIn,
    handleSignOut,
    initOPConfiguration as initOPConfigurationUtil,
    initUserSession as initUserSessionUtil,
    sendRefreshTokenRequest as sendRefreshTokenRequestUtil,
    sendRevokeTokenRequest as sendRevokeTokenRequestUtil,
    validateIdToken as validateIdTokenUtil
} from "./actions";
import {
    ACCESS_TOKEN,
    AUTHORIZATION_ENDPOINT,
    CLIENT_ID_TAG,
    CLIENT_SECRET_TAG,
    DISPLAY_NAME,
    EMAIL,
    OIDC_SCOPE,
    OIDC_SESSION_IFRAME_ENDPOINT,
    SCOPE_TAG,
    SIGNED_IN,
    STORAGE,
    TOKEN_ENDPOINT,
    TOKEN_TAG,
    USERNAME,
    USERNAME_TAG,
    AUTHORIZATION_CODE
} from "./constants";
import {
    CustomGrantRequestParams,
    OAuthWorkerInterface,
    OAuthWorkerSingletonInterface,
    SessionData,
    SignInResponse,
    TokenResponseInterface,
    UserInfo,
    WebWorkerConfigInterface
} from "./models";

export const OAuthWorker: OAuthWorkerSingletonInterface = (function(): OAuthWorkerSingletonInterface {
    /**
     * Values to be set when initializing the library.
     */
    let authConfig: WebWorkerConfigInterface;

    let allowedScope: string;

    let httpClient: AxiosInstance;

    let refreshTimer: NodeJS.Timeout;

    let instance: OAuthWorkerInterface;

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
     * Returns the allowed scopes.
     *
     * @return {string} Allowed scope.
     */
    const getScope = (): string => {
        return allowedScope;
    };

    /**
     * Queries the OpenID endpoint to get the necessary API endpoints.
     *
     * @param {boolean} forceInit Determines if a OpenID-configuration initiation should be forced.
     *
     * @returns {Promise<any>} A promise that resolves with the endpoint data.
     */
    const initOPConfiguration = (forceInit?: boolean): Promise<any> => {
        return initOPConfigurationUtil(authConfig, forceInit, STORAGE.webWorker, session);
    };

    /**
     * Sends a sign in request.
     *
     * @returns {Promise<SignInResponse>} A promise that resolves with the Sign In response.
     */
    const signIn = (): Promise<SignInResponse> => {
        return handleSignIn(authConfig, STORAGE.webWorker, session);
    };

    /**
     * Refreshes the token.
     *
     * @returns {Promise<boolean>} A promise that resolves with `true` if refreshing is successful.
     */
    const refreshAccessToken = (): Promise<boolean> => {
        return sendRefreshTokenRequestUtil(authConfig, session.get(ACCESS_TOKEN), STORAGE.webWorker, session);
    };

    /**
     * Signs out.
     *
     * @returns {Promise<boolean>} A promise that resolves with `true` if sign out is successful.
     */
    const signOut = (): Promise<string> => {
        return handleSignOut(STORAGE.webWorker, session);
    };

    /**
     * Revokes the token.
     *
     * @returns {Promise<boolean>} A promise that resolves with `true` if revoking is successful.
     */
    const revokeToken = (): Promise<boolean> => {
        return sendRevokeTokenRequestUtil(authConfig, session.get(ACCESS_TOKEN), STORAGE.webWorker, session);
    };

    /**
     * Saves the passed authorization code on the session
     *
     * @param {string} authCode The authorization code.
     */
    const setAuthCode = (authCode: string): void => {
        session.set(AUTHORIZATION_CODE, authCode);
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
            if (config.url.startsWith(baseUrl)) {
                matches = true;
            }
        });

        if (matches) {
            return httpClient(config)
                .then((response: AxiosResponse) => {
                    return Promise.resolve(response);
                })
                .catch((error: AxiosError) => {
                    if (error?.response?.status === 401) {
                        clearTimeout(refreshTimer);
                        refreshTimer = null;

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
            return httpClient(config);
        });

        if (matches) {
            return axios
                .all(httpRequests)
                .then((responses: AxiosResponse[]) => {
                    return Promise.resolve(responses);
                })
                .catch((error: AxiosError) => {
                    if (error?.response?.status === 401) {
                        clearTimeout(refreshTimer);
                        refreshTimer = null;

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

    /**
     * Replaces template tags with actual values.
     *
     * @param {string} text Input string.
     * @param {string} scope Scope.
     *
     * @returns String with template tags replaced with actual values.
     */
    const replaceTemplateTags = (text: string, scope: string): string => {
        return text
            .replace(TOKEN_TAG, session.get(ACCESS_TOKEN))
            .replace(USERNAME_TAG, session.get(USERNAME))
            .replace(SCOPE_TAG, scope)
            .replace(CLIENT_ID_TAG, authConfig.clientID)
            .replace(CLIENT_SECRET_TAG, authConfig.clientSecret);
    };

    /**
     * Allows using custom grant types.
     *
     * @param {CustomGrantRequestParams} requestParams The request parameters.
     *
     * @returns {Promise<boolean|AxiosResponse>} A promise that resolves with a boolean value or the request response
     * if the the `returnResponse` attribute in the `requestParams` object is set to `true`.
     */
    const customGrant = (
        requestParams: CustomGrantRequestParams
    ): Promise<SignInResponse | boolean | AxiosResponse> => {
        if (!session.get(TOKEN_ENDPOINT) || session.get(TOKEN_ENDPOINT).trim().length === 0) {
            return Promise.reject(new Error("Invalid token endpoint found."));
        }

        let scope = OIDC_SCOPE;

        if (authConfig.scope && authConfig.scope.length > 0) {
            if (!authConfig.scope.includes(OIDC_SCOPE)) {
                authConfig.scope.push(OIDC_SCOPE);
            }
            scope = authConfig.scope.join(" ");
        }

        let data: string = "";

        Object.entries(requestParams.data).map(([key, value], index: number) => {
            const newValue = replaceTemplateTags(value as string, scope);
            data += `${key}=${newValue}${index !== Object.entries(requestParams.data).length - 1 ? "&" : ""}`;
        });

        const requestConfig: AxiosRequestConfig = {
            data: data,
            headers: {
                ...getTokenRequestHeadersUtil(authConfig.clientHost)
            },
            method: "POST",
            url: session.get(TOKEN_ENDPOINT)
        };

        if (requestParams.attachToken) {
            requestConfig.headers = {
                ...requestConfig.headers,
                Authorization: `Bearer ${session.get(ACCESS_TOKEN)}`
            };
        }

        return axios(requestConfig)
            .then(
                (response: AxiosResponse): Promise<boolean | AxiosResponse | SignInResponse> => {
                    if (response.status !== 200) {
                        return Promise.reject(
                            new Error("Invalid status code received in the token response: " + response.status)
                        );
                    }

                    if (requestParams.returnsSession) {
                        return validateIdTokenUtil(
                            authConfig.clientID,
                            response.data.id_token,
                            authConfig.serverOrigin,
                            STORAGE.webWorker,
                            session
                        ).then((valid) => {
                            if (valid) {
                                const tokenResponse: TokenResponseInterface = {
                                    accessToken: response.data.access_token,
                                    expiresIn: response.data.expires_in,
                                    idToken: response.data.id_token,
                                    refreshToken: response.data.refresh_token,
                                    scope: response.data.scope,
                                    tokenType: response.data.token_type
                                };
                                initUserSessionUtil(
                                    tokenResponse,
                                    getAuthenticatedUserUtil(tokenResponse.idToken),
                                    STORAGE.webWorker,
                                    session
                                );

                                if (requestParams.returnResponse) {
                                    return Promise.resolve({
                                        data: getUserInfo(),
                                        type: SIGNED_IN
                                    } as SignInResponse);
                                } else {
                                    return Promise.resolve(true);
                                }
                            }

                            return Promise.reject(
                                new Error("Invalid id_token in the token response: " + response.data.id_token)
                            );
                        });
                    } else {
                        return requestParams.returnResponse ? Promise.resolve(response) : Promise.resolve(true);
                    }
                }
            )
            .catch((error: any) => {
                return Promise.reject(error);
            });
    };

    /**
     * Returns email, username, display name and allowed scopes.
     *
     * @returns {UserInfo} User information.
     */
    const getUserInfo = (): UserInfo => {
        return {
            allowedScopes: allowedScope,
            authorizationEndpoint: session.get(AUTHORIZATION_ENDPOINT),
            displayName: session.get(DISPLAY_NAME),
            email: session.get(EMAIL),
            oidcSessionIframe: session.get(OIDC_SESSION_IFRAME_ENDPOINT),
            username: session.get(USERNAME)
        };
    };

    /**
     * @constructor
     *
     * Constructor function that returns an object containing all the public methods.
     *
     * @param {ConfigInterface} config Configuration data.
     *
     * @returns {OAuthWorkerInterface} Returns the object containing
     */
    function Constructor(config: WebWorkerConfigInterface): OAuthWorkerInterface {
        authConfig = { ...config };

        httpClient = axios.create({
            withCredentials: true
        });

        httpClient.interceptors.request.use(
            (config) => {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${session.get(ACCESS_TOKEN)}`
                };

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return {
            customGrant,
            doesTokenExist,
            getScope,
            getUserInfo,
            httpRequest,
            httpRequestAll,
            initOPConfiguration,
            isSignedIn,
            refreshAccessToken,
            revokeToken,
            setAuthCode,
            signIn,
            signOut
        };
    }

    return {
        getInstance: (config: WebWorkerConfigInterface): OAuthWorkerInterface => {
            if (instance) {
                return instance;
            } else {
                instance = Constructor(config);

                return instance;
            }
        }
    };
})();
