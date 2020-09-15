/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getCodeChallenge, getCodeVerifier, getJWKForTheIdToken, isValidIdToken } from "./crypto";
import {
    getAuthorizeEndpoint,
    getIssuer,
    getJwksUri,
    getRevokeTokenEndpoint,
    getTokenEndpoint,
    initOPConfiguration,
    isValidOPConfig,
    resetOPConfiguration
} from "./op-config";
import {
    endAuthenticatedSession,
    getSessionParameter,
    initUserSession,
    removeSessionParameter,
    setSessionParameter
} from "./session-storage";
import {
    ACCESS_TOKEN,
    AUTHORIZATION_CODE,
    AUTH_REQUIRED,
    CLIENT_ID_TAG,
    CLIENT_SECRET_TAG,
    DISPLAY_NAME,
    EMAIL,
    OIDC_SCOPE,
    PKCE_CODE_VERIFIER,
    REQUEST_PARAMS,
    SCOPE,
    SCOPE_TAG,
    SERVICE_RESOURCES,
    SESSION_STATE,
    SIGNED_IN,
    TOKEN_ENDPOINT,
    TOKEN_TAG,
    USERNAME,
    USERNAME_TAG
} from "../constants";
import { Storage } from "../constants/storage";
import {
    ConfigInterface,
    CustomGrantRequestParams,
    SignInResponse,
    UserInfo,
    WebWorkerConfigInterface,
    isWebWorkerConfig
} from "../models";
import { AuthenticatedUserInterface } from "../models/authenticated-user";
import { TokenRequestHeader, TokenResponseInterface } from "../models/token-response";

/**
 * Checks whether authorization code is present.
 *
 * @returns {boolean} true if authorization code is present.
 */
export function hasAuthorizationCode(requestParams: ConfigInterface | WebWorkerConfigInterface): boolean {
    return !!getAuthorizationCode(requestParams);
}

/**
 * Resolves the authorization code.
 * If response mode is `form_post` authorization code is taken from the session storage.
 * And if the response mode is not defined or set to `query`, the code will be extracted from
 * the URL params.
 *
 * @returns {string} Resolved authorization code.
 */
export function getAuthorizationCode(requestParams?: ConfigInterface | WebWorkerConfigInterface): string {
    if (!requestParams || !isWebWorkerConfig(requestParams)) {
        if (new URL(window.location.href).searchParams.get(AUTHORIZATION_CODE)) {
            return new URL(window.location.href).searchParams.get(AUTHORIZATION_CODE);
        }

        if (window.sessionStorage.getItem(AUTHORIZATION_CODE)) {
            return window.sessionStorage.getItem(AUTHORIZATION_CODE);
        }
    } else {
        if (requestParams.session.get(AUTHORIZATION_CODE)) {
            return requestParams.session.get(AUTHORIZATION_CODE);
        }
    }

    return null;
}

/**
 * Get token request headers.
 *
 * @param {string} clientHost
 * @returns {{headers: {Accept: string; "Access-Control-Allow-Origin": string; "Content-Type": string}}}
 */
export const getTokenRequestHeaders = (clientHost: string): TokenRequestHeader => {
    return {
        Accept: "application/json",
        "Access-Control-Allow-Origin": clientHost,
        "Content-Type": "application/x-www-form-urlencoded"
    };
};

/**
 * Send authorization request.
 *
 * @param {ConfigInterface | WebWorkerConfigInterface} requestParams
 * request parameters required for authorization request.
 */
export function sendAuthorizationRequest(
    requestParams: ConfigInterface | WebWorkerConfigInterface
): Promise<SignInResponse | never> {
    const authorizeEndpoint = getAuthorizeEndpoint(requestParams);

    if (!authorizeEndpoint || authorizeEndpoint.trim().length === 0) {
        return Promise.reject(new Error("Invalid authorize endpoint found."));
    }

    let authorizeRequest = authorizeEndpoint + "?response_type=code&client_id=" + requestParams.clientID;

    let scope = OIDC_SCOPE;

    if (requestParams.scope && requestParams.scope.length > 0) {
        if (!requestParams.scope.includes(OIDC_SCOPE)) {
            requestParams.scope.push(OIDC_SCOPE);
        }
        scope = requestParams.scope.join(" ");
    }

    authorizeRequest += "&scope=" + scope;
    authorizeRequest += "&redirect_uri=" + requestParams.callbackURL;

    if (requestParams.responseMode) {
        authorizeRequest += "&response_mode=" + requestParams.responseMode;
    }

    if (requestParams.enablePKCE) {
        const codeVerifier = getCodeVerifier();
        const codeChallenge = getCodeChallenge(codeVerifier);
        setSessionParameter(PKCE_CODE_VERIFIER, codeVerifier, requestParams);
        authorizeRequest += "&code_challenge_method=S256&code_challenge=" + codeChallenge;
    }

    if (requestParams.prompt) {
        authorizeRequest += "&prompt=" + requestParams.prompt;
    }

    if (requestParams.storage === Storage.WebWorker) {
        return Promise.resolve({
            code: authorizeRequest,
            pkce: getSessionParameter(PKCE_CODE_VERIFIER, requestParams),
            type: AUTH_REQUIRED
        });
    } else {
        document.location.href = authorizeRequest;
    }

    return;
}

/**
 * Validate id_token.
 *
 * @param {string} clientID client ID.
 * @param {string} idToken id_token received from the IdP.
 * @returns {Promise<boolean>} whether token is valid.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function validateIdToken(
    idToken: string,
    requestParams: ConfigInterface | WebWorkerConfigInterface
): Promise<any> {
    const jwksEndpoint = getJwksUri(requestParams);

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

            let issuer = getIssuer(requestParams);

            if (!issuer || issuer.trim().length === 0) {
                issuer = requestParams.serverOrigin + SERVICE_RESOURCES.token;
            }

            return Promise.resolve(
                isValidIdToken(idToken, jwk, requestParams.clientID, issuer, getAuthenticatedUser(idToken).username)
            );
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

/**
 * Send token request.
 *
 * @param {ConfigInterface | WebWorkerConfigInterface} requestParams request parameters required for token request.
 * @returns {Promise<TokenResponseInterface>} token response data or error.
 */
export function sendTokenRequest(
    requestParams: ConfigInterface | WebWorkerConfigInterface | WebWorkerConfigInterface | WebWorkerConfigInterface
): Promise<TokenResponseInterface> {
    const tokenEndpoint = getTokenEndpoint(requestParams);

    if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
        return Promise.reject(new Error("Invalid token endpoint found."));
    }

    // Extract session state and set to the sessionStorage
    const sessionState = isWebWorkerConfig(requestParams)
        ? requestParams.session.get(SESSION_STATE)
        : new URL(window.location.href).searchParams.get(SESSION_STATE);
    if (sessionState !== null && sessionState.length > 0) {
        setSessionParameter(SESSION_STATE, sessionState, requestParams);
    }

    const body = [];
    body.push(`client_id=${requestParams.clientID}`);

    if (requestParams.clientSecret && requestParams.clientSecret.trim().length > 0) {
        body.push(`client_secret=${requestParams.clientSecret}`);
    }

    const code = isWebWorkerConfig(requestParams)
        ? requestParams.session.get(AUTHORIZATION_CODE)
        : getAuthorizationCode(requestParams);
    body.push(`code=${code}`);

    if (requestParams.storage === Storage.SessionStorage && window.sessionStorage.getItem(AUTHORIZATION_CODE)) {
        window.sessionStorage.removeItem(AUTHORIZATION_CODE);
    }

    if (isWebWorkerConfig(requestParams) && requestParams.session.get(AUTHORIZATION_CODE)) {
        requestParams.session.delete(AUTHORIZATION_CODE);
    }

    body.push("grant_type=authorization_code");
    body.push(`redirect_uri=${requestParams.callbackURL}`);

    if (requestParams.enablePKCE) {
        body.push(`code_verifier=${getSessionParameter(PKCE_CODE_VERIFIER, requestParams)}`);
        removeSessionParameter(PKCE_CODE_VERIFIER, requestParams);
    }

    return axios
        .post(tokenEndpoint, body.join("&"), { headers: getTokenRequestHeaders(requestParams.clientHost) })
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Invalid status code received in the token response: " + response.status)
                );
            }
            return validateIdToken(response.data.id_token, requestParams)
                .then((valid) => {
                    if (valid) {
                        setSessionParameter(REQUEST_PARAMS, JSON.stringify(requestParams), requestParams);

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
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

/**
 * Send refresh token request.
 *
 * @param {ConfigInterface | WebWorkerConfigInterface} requestParams request parameters required for token request.
 * @param {string} refreshToken
 * @returns {Promise<TokenResponseInterface>} refresh token response data or error.
 */
export function sendRefreshTokenRequest(
    requestParams: ConfigInterface | WebWorkerConfigInterface,
    refreshToken: string
): Promise<any> {
    const tokenEndpoint = getTokenEndpoint(requestParams);

    if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
        return Promise.reject("Invalid token endpoint found.");
    }

    const body = [];
    body.push(`client_id=${requestParams.clientID}`);
    body.push(`refresh_token=${refreshToken}`);
    body.push("grant_type=refresh_token");

    return axios
        .post(tokenEndpoint, body.join("&"), { headers: getTokenRequestHeaders(requestParams.clientHost) })
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Invalid status code received in the refresh token response: " + response.status)
                );
            }
            return validateIdToken(response.data.id_token, requestParams).then((valid) => {
                if (valid) {
                    const tokenResponse: TokenResponseInterface = {
                        accessToken: response.data.access_token,
                        expiresIn: response.data.expires_in,
                        idToken: response.data.id_token,
                        refreshToken: response.data.refresh_token,
                        scope: response.data.scope,
                        tokenType: response.data.token_type
                    };

                    initUserSession(response.data, getAuthenticatedUser(response.data.idToken), requestParams);

                    return Promise.resolve(tokenResponse);
                }

                return Promise.reject(new Error("Invalid id_token in the token response: " + response.data.id_token));
            });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

/**
 * Send revoke token request.
 *
 * @param {ConfigInterface | WebWorkerConfigInterface} requestParams
 * request parameters required for revoke token request.
 * @param {string} accessToken access token
 * @returns {any}
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function sendRevokeTokenRequest(
    requestParams: ConfigInterface | WebWorkerConfigInterface,
    accessToken: string
): Promise<any> {
    const revokeTokenEndpoint = getRevokeTokenEndpoint(requestParams);

    if (!revokeTokenEndpoint || revokeTokenEndpoint.trim().length === 0) {
        return Promise.reject("Invalid revoke token endpoint found.");
    }

    const body = [];
    body.push(`client_id=${requestParams.clientID}`);
    body.push(`token=${accessToken}`);
    body.push("token_type_hint=access_token");

    return axios
        .post(revokeTokenEndpoint, body.join("&"), {
            headers: getTokenRequestHeaders(requestParams.clientHost),
            withCredentials: true
        })
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Invalid status code received in the revoke token response: " + response.status)
                );
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

/**
 * Get authenticated user from the id_token.
 *
 * @param idToken id_token received from the IdP.
 * @returns {AuthenticatedUserInterface} authenticated user.
 */
export const getAuthenticatedUser = (idToken: string): AuthenticatedUserInterface => {
    const payload = JSON.parse(atob(idToken.split(".")[1]));
    const emailAddress = payload.email ? payload.email : null;

    return {
        displayName: payload.preferred_username ? payload.preferred_username : payload.sub,
        email: emailAddress,
        username: payload.sub
    };
};

/**
 * Execute user sign in request
 *
 * @param {object} requestParams
 * @param {function} callback
 * @returns {Promise<any>} sign out request status
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function sendSignInRequest(requestParams: ConfigInterface | WebWorkerConfigInterface): Promise<SignInResponse> {
    if (hasAuthorizationCode(requestParams)) {
        return sendTokenRequest(requestParams)
            .then((response) => {
                initUserSession(response, getAuthenticatedUser(response.idToken), requestParams);
                return Promise.resolve({
                    type: SIGNED_IN
                } as SignInResponse);
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    return sendAuthorizationRequest(requestParams);
                }

                return Promise.reject(error);
            });
    } else {
        return sendAuthorizationRequest(requestParams);
    }
}

export function handleSignIn(requestParams: ConfigInterface | WebWorkerConfigInterface): Promise<any> {
    if (getSessionParameter(ACCESS_TOKEN, requestParams)) {
        if (!isValidOPConfig(requestParams)) {
            endAuthenticatedSession(requestParams);
            resetOPConfiguration(requestParams);
            // TODO: Better to have a callback to clear this on the app side.
            removeSessionParameter("auth_callback_url", requestParams);

            return initOPConfiguration(requestParams, true)
                .then(() => {
                    return sendSignInRequest(requestParams);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }

        return Promise.resolve("Sign In successful!");
    } else {
        return initOPConfiguration(requestParams, false)
            .then(() => {
                return sendSignInRequest(requestParams);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }
}
/**
 * Replaces template tags with actual values.
 *
 * @param {string} text Input string.
 * @param {string} scope Scope.
 *
 * @returns String with template tags replaced with actual values.
 */
const replaceTemplateTags = (
    text: string,
    authConfig: ConfigInterface | WebWorkerConfigInterface | WebWorkerConfigInterface | WebWorkerConfigInterface
): string => {
    let scope = OIDC_SCOPE;

    if (authConfig.scope && authConfig.scope.length > 0) {
        if (!authConfig.scope.includes(OIDC_SCOPE)) {
            authConfig.scope.push(OIDC_SCOPE);
        }
        scope = authConfig.scope.join(" ");
    }

    return text
        .replace(TOKEN_TAG, getSessionParameter(ACCESS_TOKEN, authConfig))
        .replace(USERNAME_TAG, getSessionParameter(USERNAME, authConfig))
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
export const customGrant = (
    requestParams: CustomGrantRequestParams,
    authConfig: ConfigInterface | WebWorkerConfigInterface | WebWorkerConfigInterface | WebWorkerConfigInterface
): Promise<SignInResponse | boolean | AxiosResponse> => {
    if (
        !getSessionParameter(TOKEN_ENDPOINT, authConfig) ||
        getSessionParameter(TOKEN_ENDPOINT, authConfig).trim().length === 0
    ) {
        return Promise.reject(new Error("Invalid token endpoint found."));
    }

    let data: string = "";

    Object.entries(requestParams.data).map(([key, value], index: number) => {
        const newValue = replaceTemplateTags(value as string, authConfig);
        data += `${key}=${newValue}${index !== Object.entries(requestParams.data).length - 1 ? "&" : ""}`;
    });

    const requestConfig: AxiosRequestConfig = {
        data: data,
        headers: {
            ...getTokenRequestHeaders(authConfig.clientHost)
        },
        method: "POST",
        url: getSessionParameter(TOKEN_ENDPOINT, authConfig)
    };

    if (requestParams.attachToken) {
        requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: `Bearer ${getSessionParameter(ACCESS_TOKEN, authConfig)}`
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
                    return validateIdToken(response.data.id_token, authConfig).then((valid) => {
                        if (valid) {
                            const tokenResponse: TokenResponseInterface = {
                                accessToken: response.data.access_token,
                                expiresIn: response.data.expires_in,
                                idToken: response.data.id_token,
                                refreshToken: response.data.refresh_token,
                                scope: response.data.scope,
                                tokenType: response.data.token_type
                            };

                            initUserSession(tokenResponse, getAuthenticatedUser(tokenResponse.idToken), authConfig);

                            if (requestParams.returnResponse) {
                                return Promise.resolve({
                                    data: getUserInfo(authConfig),
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
export const getUserInfo = (config: ConfigInterface | WebWorkerConfigInterface): UserInfo => {
    return {
        allowedScopes: getSessionParameter(SCOPE, config),
        displayName: getSessionParameter(DISPLAY_NAME, config),
        email: getSessionParameter(EMAIL, config),
        username: getSessionParameter(USERNAME, config)
    };
};
