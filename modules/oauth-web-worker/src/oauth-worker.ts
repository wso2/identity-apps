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
    AUTH_REQUIRED,
    CLIENT_ID_TAG,
    CLIENT_SECRET_TAG,
    OIDC_SCOPE,
    SCOPE_TAG,
    SERVICE_RESOURCES,
    SIGNED_IN,
    TOKEN_TAG,
    USERNAME_TAG
} from "./constants";
import {
    AuthenticatedUserInterface,
    ConfigInterface,
    CustomGrantRequestParams,
    OAuthWorkerInterface,
    OAuthWorkerSingletonInterface,
    ResponseModeTypes,
    SignInResponse,
    TokenRequestHeader,
    TokenResponseInterface,
    UserInfo
} from "./models";
import { getCodeChallenge, getCodeVerifier, getJWKForTheIdToken, isValidIdToken } from "./utils";

export const OAuthWorker: OAuthWorkerSingletonInterface = (function(): OAuthWorkerSingletonInterface {
    /**
     * Values to be set when initializing the library.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let authorizationType: string;
    let callbackURL: string;
    let clientHost: string;
    let clientID: string;
    let clientSecret: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let consentDenied: boolean;
    let enablePKCE: boolean;
    let prompt: string;
    let responseMode: ResponseModeTypes;
    let requestedScope: string[];
    let serverOrigin: string;
    let baseUrls: string[];

    /**
     * Set after querying the IdP for oidc endpoints.
     */
    let isOpConfigInitiated: boolean;
    let authorizeEndpoint: string;
    let tokenEndpoint: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let endSessionEndpoint: string;
    let checkSessionIframe: string;
    let jwksUri: string;
    let revokeTokenEndpoint: string;
    let issuer: string;

    let authorizationCode: string;
    let pkceCodeVerifier: string;

    /**
     * Set after successful authentication.
     */
    let token: string;
    let accessTokenExpiresIn: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let accessTokenIssuedAt: string;
    let displayName: string;
    let email: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let idToken: string;
    let refreshToken: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let tokenType: string;
    let userName: string;
    let allowedScope: string;

    let httpClient: AxiosInstance;

    let refreshTimer: NodeJS.Timeout;

    let instance: OAuthWorkerInterface;

    /**
     * @private
     *
     * Gets a new access token using the `refresh-token` grant.
     *
     * @returns {Promise<TokenResponseInterface>} Promise that resolves with the token response.
     */
    const sendRefreshTokenRequest = (): Promise<TokenResponseInterface> => {
        if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
            return Promise.reject("Invalid token endpoint found.");
        }

        const body = [];
        body.push(`client_id=${clientID}`);
        body.push(`refresh_token=${refreshToken}`);
        body.push("grant_type=refresh_token");

        return axios
            .post(tokenEndpoint, body.join("&"), { headers: getTokenRequestHeaders(clientHost) })
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(
                        new Error("Invalid status code received in the refresh token response: " + response.status)
                    );
                }

                return validateIdToken(clientID, response.data.id_token, serverOrigin).then((valid) => {
                    if (valid) {
                        const tokenResponse: TokenResponseInterface = {
                            accessToken: response.data.access_token,
                            expiresIn: response.data.expires_in,
                            idToken: response.data.id_token,
                            refreshToken: response.data.refresh_token,
                            scope: response.data.scope,
                            tokenType: response.data.token_type
                        };

                        return Promise.resolve(tokenResponse);
                    }
                    return Promise.reject(
                        new Error("Invalid id_token in the token response: " + response.data.id_token)
                    );
                });
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * @private
     *
     * Revokes the access token so that the user is effectively logged out.
     *
     * @returns {Promise<any>} A promise that resolves when signing out is successful.
     */
    const sendRevokeTokenRequest = (): Promise<any> => {
        if (!revokeTokenEndpoint || revokeTokenEndpoint.trim().length === 0) {
            return Promise.reject("Invalid revoke token endpoint found.");
        }

        const body = [];
        body.push(`client_id=${clientID}`);
        body.push(`token=${token}`);
        body.push("token_type_hint=access_token");

        return axios
            .post(revokeTokenEndpoint, body.join("&"), {
                headers: getTokenRequestHeaders(clientHost),
                withCredentials: true
            })
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(
                        new Error("Invalid status code received in the revoke token response: " + response.status)
                    );
                }

                destroyUserSession();
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * @private
     *
     * Returns the http header to be sent when requesting tokens.
     *
     * @param {string} clientHost The client host.
     *
     * @returns {TokenRequestHeader} The token request header.
     */
    const getTokenRequestHeaders = (clientHost: string): TokenRequestHeader => {
        return {
            Accept: "application/json",
            "Access-Control-Allow-Origin": clientHost,
            "Content-Type": "application/x-www-form-urlencoded"
        };
    };

    /**
     * @private
     *
     * Checks the validity of the ID token.
     *
     * @param {string} clientID The client ID.
     * @param {string} idToken The ID token.
     * @param {string} serverOrigin The server origin.
     *
     * @returns {Promise<boolean>} A promise that resolves with the validity status of the ID token.
     */
    const validateIdToken = (clientID: string, idToken: string, serverOrigin: string): Promise<boolean> => {
        const jwksEndpoint = jwksUri;

        if (!jwksEndpoint || jwksEndpoint.trim().length === 0) {
            return Promise.reject("Invalid JWKS URI found.");
        }
        return axios
            .get(jwksEndpoint)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed to load public keys from JWKS URI: " + jwksEndpoint));
                }

                const jwk = getJWKForTheIdToken(idToken.split(".")[0], response.data.keys);

                if (!issuer || issuer.trim().length === 0) {
                    issuer = serverOrigin + SERVICE_RESOURCES.token;
                }

                const validity = isValidIdToken(idToken, jwk, clientID, issuer, getAuthenticatedUser(idToken).username);

                return Promise.resolve(validity);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * @private
     *
     * Returns the authenticated user's information.
     *
     * @param {string} idToken ID token.
     *
     * @returns {AuthenticatedUserInterface} User information.
     */
    const getAuthenticatedUser = (idToken: string): AuthenticatedUserInterface => {
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        const emailAddress = payload.email ? payload.email : null;

        return {
            displayName: payload.preferred_username ? payload.preferred_username : payload.sub,
            email: emailAddress,
            username: payload.sub
        };
    };

    /**
     * @private
     *
     * Initializes user session.
     *
     * @param {TokenResponseInterface} tokenResponse The response obtained by querying the `token` endpoint.
     * @param {AuthenticatedUserInterface} authenticatedUser User information.
     */
    const initUserSession = (
        tokenResponse: TokenResponseInterface,
        authenticatedUser: AuthenticatedUserInterface
    ): void => {
        token = tokenResponse.accessToken;
        accessTokenExpiresIn = tokenResponse.expiresIn;
        accessTokenIssuedAt = (Date.now() / 1000).toString();
        displayName = authenticatedUser.displayName;
        email = authenticatedUser.email;
        idToken = tokenResponse.idToken;
        allowedScope = tokenResponse.scope;
        refreshToken = tokenResponse.refreshToken;
        tokenType = tokenResponse.tokenType;
        userName = authenticatedUser.username;

        refreshTimer = setTimeout(() => {
            refreshAccessToken()
                .then()
                .catch();
        }, (parseInt(accessTokenExpiresIn) - 10) * 1000);
    };

    /**
     * @private
     *
     * Destroys user session.
     */
    const destroyUserSession = (): void => {
        token = null;
        accessTokenExpiresIn = null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        accessTokenIssuedAt = null;
        displayName = null;
        email = null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        idToken = null;
        allowedScope = null;
        refreshToken = null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tokenType = null;
        userName = null;

        clearTimeout(refreshTimer);
        refreshTimer = null;
    };

    /**
     * @private
     *
     * Destroys OP configurations.
     */
    const destroyOPConfiguration = (): void => {
        authorizeEndpoint = null;
        tokenEndpoint = null;
        endSessionEndpoint = null;
        jwksUri = null;
        revokeTokenEndpoint = null;
        isOpConfigInitiated = false;
        issuer = null;
        callbackURL = null;
    };

    /**
     * @private
     *
     * Requests the `token` endpoint for an access token.
     *
     * @returns {Promise<TokenResponseInterface>} A promise that resolves with the token response.
     */
    const sendTokenRequest = (): Promise<TokenResponseInterface> => {
        if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
            return Promise.reject(new Error("Invalid token endpoint found."));
        }

        const body = [];
        body.push(`client_id=${clientID}`);

        if (clientSecret && clientSecret.trim().length > 0) {
            body.push(`client_secret=${clientSecret}`);
        }

        const code = authorizationCode;
        authorizationCode = null;
        body.push(`code=${code}`);

        body.push("grant_type=authorization_code");
        body.push(`redirect_uri=${callbackURL}`);

        if (enablePKCE) {
            body.push(`code_verifier=${pkceCodeVerifier}`);
            pkceCodeVerifier = null;
        }

        return axios
            .post(tokenEndpoint, body.join("&"), { headers: getTokenRequestHeaders(clientHost) })
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(
                        new Error("Invalid status code received in the token response: " + response.status)
                    );
                }
                return validateIdToken(clientID, response.data.id_token, serverOrigin).then((valid) => {
                    if (valid) {
                        const tokenResponse: TokenResponseInterface = {
                            accessToken: response.data.access_token,
                            expiresIn: response.data.expires_in,
                            idToken: response.data.id_token,
                            refreshToken: response.data.refresh_token,
                            scope: response.data.scope,
                            tokenType: response.data.token_type
                        };

                        return Promise.resolve(tokenResponse);
                    }

                    return Promise.reject(
                        new Error("Invalid id_token in the token response: " + response.data.id_token)
                    );
                });
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * @private
     *
     * Execute user sign out request
     *
     * @returns {Promise<string>} sign out request status
     */
    const sendSignOutRequest = (): Promise<string> => {
        const logoutEndpoint = endSessionEndpoint;

        if (!logoutEndpoint || logoutEndpoint.trim().length === 0) {
            return Promise.reject(new Error("No logout endpoint found in the session."));
        }

        if (!idToken || idToken.trim().length === 0) {
            return Promise.reject(new Error("Invalid id_token found in the session."));
        }

        if (!callbackURL || callbackURL.trim().length === 0) {
            return Promise.reject(new Error("No callback URL found in the session."));
        }

        const logoutURL =
            `${logoutEndpoint}?` + `id_token_hint=${idToken}` + `&post_logout_redirect_uri=${callbackURL}`;

        destroyUserSession();
        destroyOPConfiguration();

        return Promise.resolve(logoutURL);
    };

    /**
     * Sets if the OpenID configuration has been initiated or not.
     *
     * @param {boolean} status Status to set.
     */
    const setIsOpConfigInitiated = (status: boolean) => {
        isOpConfigInitiated = status;
    };

    /**
     * Returns if the user has signed in or not.
     *
     * @returns {boolean} Signed in or not.
     */
    const isSignedIn = (): boolean => {
        return !!token;
    };

    /**
     * Checks if an access token exists.
     *
     * @returns {boolean} If the access token exists or not.
     */
    const doesTokenExist = (): boolean => {
        if (token) {
            return true;
        }

        return false;
    };

    /**
     * Sets the authorization code.
     *
     * @param {string} authCode The authorization code.
     */
    const setAuthorizationCode = (authCode: string) => {
        authorizationCode = authCode;
    };

    /**
     * Queries the OpenID endpoint to get the necessary API endpoints.
     *
     * @param {boolean} forceInit Determines if a OpenID-configuration initiation should be forced.
     *
     * @returns {Promise<any>} A promise that resolves with the endpoint data.
     */
    const initOPConfiguration = (forceInit?: boolean): Promise<any> => {
        if (!forceInit && isOpConfigInitiated) {
            return Promise.resolve();
        }

        return axios
            .get(serverOrigin + SERVICE_RESOURCES.wellKnown)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(
                        new Error(
                            "Failed to load OpenID provider configuration from: " +
                                serverOrigin +
                                SERVICE_RESOURCES.wellKnown
                        )
                    );
                }

                authorizeEndpoint = response.data.authorization_endpoint;
                tokenEndpoint = response.data.token_endpoint;
                endSessionEndpoint = response.data.end_session_endpoint;
                jwksUri = response.data.jwks_uri;
                revokeTokenEndpoint =
                    response.data.token_endpoint.substring(0, response.data.token_endpoint.lastIndexOf("token")) +
                    "revoke";
                issuer = response.data.issuer;
                checkSessionIframe = response.data.check_session_iframe;
                setIsOpConfigInitiated(true);

                return Promise.resolve(
                    "Initialized OpenID Provider configuration from: " + serverOrigin + SERVICE_RESOURCES.wellKnown
                );
            })
            .catch(() => {
                authorizeEndpoint = serverOrigin + SERVICE_RESOURCES.authorize;
                tokenEndpoint = serverOrigin + SERVICE_RESOURCES.token;
                revokeTokenEndpoint = serverOrigin + SERVICE_RESOURCES.revoke;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                endSessionEndpoint = serverOrigin + SERVICE_RESOURCES.logout;
                jwksUri = serverOrigin + SERVICE_RESOURCES.jwks;
                issuer = serverOrigin + SERVICE_RESOURCES.token;
                checkSessionIframe = serverOrigin + SERVICE_RESOURCES.oidcSessionIFrame;
                setIsOpConfigInitiated(true);

                return Promise.resolve(
                    new Error(
                        "Initialized OpenID Provider configuration from default configuration." +
                            "Because failed to access wellknown endpoint: " +
                            serverOrigin +
                            SERVICE_RESOURCES.wellKnown
                    )
                );
            });
    };

    /**
     * Sets the PKCE code.
     *
     * @param {string} pkce The PKCE code.
     */
    const setPkceCodeVerifier = (pkce: string) => {
        pkceCodeVerifier = pkce;
    };

    /**
     * Generates and returns the authorization code request URL.
     *
     * @returns {string} The authorization code request URL.
     */
    const generateAuthorizationCodeRequestURL = (): string => {
        if (!authorizeEndpoint || authorizeEndpoint.trim().length === 0) {
            throw new Error("Invalid authorize endpoint found.");
        }

        let authorizeRequest = authorizeEndpoint + "?response_type=code&client_id=" + clientID;

        let scope = OIDC_SCOPE;

        if (requestedScope && requestedScope.length > 0) {
            if (!requestedScope.includes(OIDC_SCOPE)) {
                requestedScope.push(OIDC_SCOPE);
            }
            scope = requestedScope.join(" ");
        }

        authorizeRequest += "&scope=" + scope;
        authorizeRequest += "&redirect_uri=" + callbackURL;

        if (responseMode) {
            authorizeRequest += "&response_mode=" + responseMode;
        }

        if (enablePKCE) {
            const codeVerifier = getCodeVerifier();
            const codeChallenge = getCodeChallenge(codeVerifier);
            pkceCodeVerifier = codeVerifier;
            authorizeRequest += "&code_challenge_method=S256&code_challenge=" + codeChallenge;
        }

        if (prompt) {
            authorizeRequest += "&prompt=" + prompt;
        }

        return authorizeRequest;
    };

    /**
     * Sends a sign in request.
     *
     * @returns {Promise<SignInResponse>} A promise that resolves with the Sign In response.
     */
    const sendSignInRequest = (): Promise<SignInResponse> => {
        if (authorizationCode) {
            return sendTokenRequest()
                .then((response: TokenResponseInterface) => {
                    try {
                        initUserSession(response, getAuthenticatedUser(response.idToken));
                    } catch (error) {
                        throw Error(error);
                    }

                    return Promise.resolve({
                        data: {
                            allowedScopes: allowedScope,
                            authorizationEndpoint: authorizeEndpoint,
                            displayName: displayName,
                            email: email,
                            oidcSessionIframe: checkSessionIframe,
                            username: userName
                        },
                        type: SIGNED_IN
                    } as SignInResponse);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        return Promise.resolve({
                            code: generateAuthorizationCodeRequestURL(),
                            pkce: pkceCodeVerifier,
                            type: AUTH_REQUIRED
                        });
                    }

                    return Promise.reject(error);
                });
        } else {
            return Promise.resolve({
                code: generateAuthorizationCodeRequestURL(),
                pkce: pkceCodeVerifier,
                type: AUTH_REQUIRED
            });
        }
    };

    /**
     * Refreshes the token.
     *
     * @returns {Promise<boolean>} A promise that resolves with `true` if refreshing is successful.
     */
    const refreshAccessToken = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            sendRefreshTokenRequest()
                .then((response) => {
                    initUserSession(response, getAuthenticatedUser(response.idToken));
                    resolve(true);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    /**
     * Signs out.
     *
     * @returns {Promise<boolean>} A promise that resolves with `true` if sign out is successful.
     */
    const signOut = (): Promise<string> => {
        return sendSignOutRequest()
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * Revokes the token.
     *
     * @returns {Promise<boolean>} A promise that resolves with `true` if revoking is successful.
     */
    const revokeToken = (): Promise<boolean> => {
        return sendRevokeTokenRequest()
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
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
        baseUrls.forEach((baseUrl) => {
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
        baseUrls.forEach((baseUrl) => {
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
            .replace(TOKEN_TAG, token)
            .replace(USERNAME_TAG, userName)
            .replace(SCOPE_TAG, scope)
            .replace(CLIENT_ID_TAG, clientID)
            .replace(CLIENT_SECRET_TAG, clientSecret);
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
        if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
            return Promise.reject(new Error("Invalid token endpoint found."));
        }

        let scope = OIDC_SCOPE;

        if (requestedScope && requestedScope.length > 0) {
            if (!requestedScope.includes(OIDC_SCOPE)) {
                requestedScope.push(OIDC_SCOPE);
            }
            scope = requestedScope.join(" ");
        }

        let data: string = "";

        Object.entries(requestParams.data).map(([key, value], index: number) => {
            const newValue = replaceTemplateTags(value as string, scope);
            data += `${key}=${newValue}${index !== Object.entries(requestParams.data).length - 1 ? "&" : ""}`;
        });

        const requestConfig: AxiosRequestConfig = {
            data: data,
            headers: {
                ...getTokenRequestHeaders(clientHost)
            },
            method: "POST",
            url: tokenEndpoint
        };

        if (requestParams.attachToken) {
            requestConfig.headers = {
                ...requestConfig.headers,
                Authorization: `Bearer ${token}`
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
                        return validateIdToken(clientID, response.data.id_token, serverOrigin).then((valid) => {
                            if (valid) {
                                const tokenResponse: TokenResponseInterface = {
                                    accessToken: response.data.access_token,
                                    expiresIn: response.data.expires_in,
                                    idToken: response.data.id_token,
                                    refreshToken: response.data.refresh_token,
                                    scope: response.data.scope,
                                    tokenType: response.data.token_type
                                };
                                initUserSession(tokenResponse, getAuthenticatedUser(tokenResponse.idToken));

                                if (requestParams.returnResponse) {
                                    return Promise.resolve({
                                        data: {
                                            allowedScopes: allowedScope,
                                            authorizationEndpoint: authorizeEndpoint,
                                            displayName: displayName,
                                            email: email,
                                            oidcSessionIframe: checkSessionIframe,
                                            username: userName
                                        },
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
            authorizationEndpoint: authorizeEndpoint,
            displayName: displayName,
            email: email,
            oidcSessionIframe: checkSessionIframe,
            username: userName
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
    function Constructor(config: ConfigInterface): OAuthWorkerInterface {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        authorizationType = config.authorizationType;
        callbackURL = config.callbackURL;
        clientHost = config.clientHost;
        clientID = config.clientID;
        clientSecret = config.clientSecret;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        consentDenied = config.consentDenied;
        enablePKCE = config.enablePKCE;
        prompt = config.prompt;
        responseMode = config.responseMode;
        requestedScope = config.scope;
        serverOrigin = config.serverOrigin;
        baseUrls = config.baseUrls;

        httpClient = axios.create({
            withCredentials: true
        });

        httpClient.interceptors.request.use(
            (config) => {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`
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
            generateAuthorizationCodeRequestURL,
            getUserInfo,
            httpRequest,
            httpRequestAll,
            initOPConfiguration,
            isSignedIn,
            refreshAccessToken,
            revokeToken,
            sendSignInRequest,
            setAuthorizationCode,
            setIsOpConfigInitiated,
            setPkceCodeVerifier,
            signOut
        };
    }

    return {
        getInstance: (config: ConfigInterface): OAuthWorkerInterface => {
            if (instance) {
                return instance;
            } else {
                instance = Constructor(config);

                return instance;
            }
        }
    };
})();
