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

import axios from "axios";
import { getCodeChallenge, getCodeVerifier, getEmailHash, getJWKForTheIdToken, isValidIdToken } from "./crypto";
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
} from "./session";
import {
    ACCESS_TOKEN,
    AUTHORIZATION_CODE,
    OIDC_SCOPE,
    PKCE_CODE_VERIFIER,
    REQUEST_PARAMS,
    SERVICE_RESOURCES,
    SESSION_STATE,
    AUTH_REQUIRED,
    SIGNED_IN
} from "../constants";
import { STORAGE } from "../constants/storage";
import { SessionData, SignInResponse } from "../models";
import { AuthenticatedUserInterface } from "../models/authenticated-user";
import { ConfigInterface } from "../models/client";
import { AccountSwitchRequestParams } from "../models/oidc-request-params";
import { TokenRequestHeader, TokenResponseInterface } from "../models/token-response";

/**
 * Checks whether authorization code is present.
 *
 * @returns {boolean} true if authorization code is present.
 */
export function hasAuthorizationCode(storage: STORAGE.sessionStorage): boolean;
export function hasAuthorizationCode(storage: STORAGE, session: SessionData): boolean;
export function hasAuthorizationCode(storage: STORAGE.sessionStorage, session?: SessionData): boolean {
    return !!getAuthorizationCode(storage, session);
}

/**
 * Resolves the authorization code.
 * If response mode is `form_post` authorization code is taken from the session storage.
 * And if the response mode is not defined or set to `query`, the code will be extracted from
 * the URL params.
 *
 * @returns {string} Resolved authorization code.
 */
export function getAuthorizationCode(storage: STORAGE.sessionStorage): string;
export function getAuthorizationCode(storage: STORAGE, session: SessionData): string;
export function getAuthorizationCode(storage: STORAGE, session?: SessionData): string {
    if (storage === STORAGE.sessionStorage) {
        if (new URL(window.location.href).searchParams.get(AUTHORIZATION_CODE)) {
            return new URL(window.location.href).searchParams.get(AUTHORIZATION_CODE);
        }

        if (window.sessionStorage.getItem(AUTHORIZATION_CODE)) {
            return window.sessionStorage.getItem(AUTHORIZATION_CODE);
        }
    } else {
        if (session.get(AUTHORIZATION_CODE)) {
            return session.get(AUTHORIZATION_CODE);
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
 * @param {ConfigInterface} requestParams request parameters required for authorization request.
 */
export function sendAuthorizationRequest(
    requestParams: ConfigInterface,
    storage: STORAGE.sessionStorage
): Promise<never>;
export function sendAuthorizationRequest(
    requestParams: ConfigInterface,
    storage: STORAGE,
    session: SessionData
): Promise<SignInResponse>;
export function sendAuthorizationRequest(
    requestParams: ConfigInterface,
    storage: STORAGE,
    session?: SessionData
): Promise<SignInResponse | never> {
    const authorizeEndpoint = getAuthorizeEndpoint(storage, session);

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
        setSessionParameter(PKCE_CODE_VERIFIER, codeVerifier, storage, session);
        authorizeRequest += "&code_challenge_method=S256&code_challenge=" + codeChallenge;
    }

    if (requestParams.prompt) {
        authorizeRequest += "&prompt=" + requestParams.prompt;
    }

    if (storage === STORAGE.webWorker) {
        return Promise.resolve({
            code: authorizeRequest,
            pkce: getSessionParameter(PKCE_CODE_VERIFIER, storage, session),
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
    clientID: string,
    idToken: string,
    serverOrigin: string,
    storage: STORAGE.sessionStorage
): Promise<any>;
export function validateIdToken(
    clientID: string,
    idToken: string,
    serverOrigin: string,
    storage: STORAGE,
    session: SessionData
): Promise<any>;
export function validateIdToken(
    clientID: string,
    idToken: string,
    serverOrigin: string,
    storage: STORAGE,
    session?: SessionData
): Promise<any> {
    const jwksEndpoint = getJwksUri(storage, session);

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

            let issuer = getIssuer(storage, session);

            if (!issuer || issuer.trim().length === 0) {
                issuer = serverOrigin + SERVICE_RESOURCES.token;
            }

            return Promise.resolve(
                isValidIdToken(idToken, jwk, clientID, issuer, getAuthenticatedUser(idToken).username)
            );
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

/**
 * Send token request.
 *
 * @param {ConfigInterface} requestParams request parameters required for token request.
 * @returns {Promise<TokenResponseInterface>} token response data or error.
 */
export function sendTokenRequest(
    requestParams: ConfigInterface,
    storage: STORAGE.sessionStorage
): Promise<TokenResponseInterface>;
export function sendTokenRequest(
    requestParams: ConfigInterface,
    storage: STORAGE,
    session: SessionData
): Promise<TokenResponseInterface>;
export function sendTokenRequest(
    requestParams: ConfigInterface,
    storage: STORAGE,
    session?: SessionData
): Promise<TokenResponseInterface> {
    const tokenEndpoint = getTokenEndpoint(storage, session);

    if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
        return Promise.reject(new Error("Invalid token endpoint found."));
    }

    // Extract session state and set to the sessionStorage
    const sessionState =
        storage === STORAGE.webWorker
            ? session.get(SESSION_STATE)
            : new URL(window.location.href).searchParams.get(SESSION_STATE);
    if (sessionState !== null && sessionState.length > 0) {
        setSessionParameter(SESSION_STATE, sessionState, storage, session);
    }

    const body = [];
    body.push(`client_id=${requestParams.clientID}`);

    if (requestParams.clientSecret && requestParams.clientSecret.trim().length > 0) {
        body.push(`client_secret=${requestParams.clientSecret}`);
    }

    const code =
        storage === STORAGE.webWorker ? session.get(AUTHORIZATION_CODE) : getAuthorizationCode(storage, session);
    body.push(`code=${code}`);

    if (storage === STORAGE.sessionStorage && window.sessionStorage.getItem(AUTHORIZATION_CODE)) {
        window.sessionStorage.removeItem(AUTHORIZATION_CODE);
    }

    if (storage === STORAGE.webWorker && session.get(AUTHORIZATION_CODE)) {
        session.delete(AUTHORIZATION_CODE);
    }

    body.push("grant_type=authorization_code");
    body.push(`redirect_uri=${requestParams.callbackURL}`);

    if (requestParams.enablePKCE) {
        body.push(`code_verifier=${getSessionParameter(PKCE_CODE_VERIFIER, storage, session)}`);
        removeSessionParameter(PKCE_CODE_VERIFIER, storage, session);
    }

    return axios
        .post(tokenEndpoint, body.join("&"), { headers: getTokenRequestHeaders(requestParams.clientHost) })
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Invalid status code received in the token response: " + response.status)
                );
            }
            return validateIdToken(
                requestParams.clientID,
                response.data.id_token,
                requestParams.serverOrigin,
                storage,
                session
            ).then((valid) => {
                if (valid) {
                    setSessionParameter(REQUEST_PARAMS, JSON.stringify(requestParams), storage, session);

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

                return Promise.reject(new Error("Invalid id_token in the token response: " + response.data.id_token));
            });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

/**
 * Send refresh token request.
 *
 * @param {ConfigInterface} requestParams request parameters required for token request.
 * @param {string} refreshToken
 * @returns {Promise<TokenResponseInterface>} refresh token response data or error.
 */
export function sendRefreshTokenRequest(
    requestParams: ConfigInterface,
    refreshToken: string,
    storage: STORAGE.sessionStorage
): Promise<any>;
export function sendRefreshTokenRequest(
    requestParams: ConfigInterface,
    refreshToken: string,
    storage: STORAGE,
    session: SessionData
): Promise<any>;
export function sendRefreshTokenRequest(
    requestParams: ConfigInterface,
    refreshToken: string,
    storage: STORAGE,
    session?: SessionData
): Promise<any> {
    const tokenEndpoint = getTokenEndpoint(storage, session);

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
            return validateIdToken(
                requestParams.clientID,
                response.data.id_token,
                requestParams.serverOrigin,
                storage,
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

                    initUserSession(response.data, getAuthenticatedUser(response.data.idToken), storage, session);

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
 * @param {ConfigInterface} requestParams request parameters required for revoke token request.
 * @param {string} accessToken access token
 * @returns {any}
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function sendRevokeTokenRequest(
    requestParams: ConfigInterface,
    accessToken: string,
    storage: STORAGE.sessionStorage
): Promise<any>;
export function sendRevokeTokenRequest(
    requestParams: ConfigInterface,
    accessToken: string,
    storage: STORAGE,
    session: SessionData
): Promise<any>;
export function sendRevokeTokenRequest(
    requestParams: ConfigInterface,
    accessToken: string,
    storage: STORAGE,
    session?: SessionData
): Promise<any> {
    const revokeTokenEndpoint = getRevokeTokenEndpoint(storage, session);

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
 * Get user image from gravatar.com.
 *
 * @param emailAddress email address received authenticated user.
 * @returns {string} gravatar image path.
 */
export const getGravatar = (emailAddress: string): string => {
    return "https://www.gravatar.com/avatar/" + getEmailHash(emailAddress) + "?d=404";
};

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
 * Send account switch request.
 *
 * @param {AccountSwitchRequestParams} requestParams request parameters required for the account switch request.
 * @param {string} clientHost client host.
 * @returns {Promise<TokenResponseInterface>} token response data or error.
 */
export function sendAccountSwitchRequest(
    requestParams: AccountSwitchRequestParams,
    storage: STORAGE.sessionStorage
): Promise<any>;
export function sendAccountSwitchRequest(
    requestParams: AccountSwitchRequestParams,
    storage: STORAGE,
    session: SessionData
): Promise<any>;
export function sendAccountSwitchRequest(
    requestParams: AccountSwitchRequestParams,
    storage: STORAGE,
    session?: SessionData
): Promise<any> {
    const tokenEndpoint = getTokenEndpoint(storage, session);

    if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
        return Promise.reject(new Error("Invalid token endpoint found."));
    }

    let scope = OIDC_SCOPE;

    if (requestParams.scope && requestParams.scope.length > 0) {
        if (!requestParams.scope.includes(OIDC_SCOPE)) {
            requestParams.scope.push(OIDC_SCOPE);
        }
        scope = requestParams.scope.join(" ");
    }

    const body = [];
    body.push("grant_type=account_switch");
    body.push(`username=${requestParams.username}`);
    body.push(`userstore-domain=${requestParams["userstore-domain"]}`);
    body.push(`tenant-domain=${requestParams["tenant-domain"]}`);
    body.push(`token=${getSessionParameter(ACCESS_TOKEN, storage, session)}`);
    body.push(`scope=${scope}`);
    body.push(`client_id=${requestParams.client_id}`);

    return axios
        .post(tokenEndpoint, body.join("&"), { headers: getTokenRequestHeaders(requestParams.clientHost) })
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Invalid status code received in the token response: " + response.status)
                );
            }

            return validateIdToken(
                requestParams.client_id,
                response.data.id_token,
                requestParams.serverOrigin,
                storage,
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
 * Execute user sign in request
 *
 * @param {object} requestParams
 * @param {function} callback
 * @returns {Promise<any>} sign out request status
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function sendSignInRequest(
    requestParams: ConfigInterface,
    storage: STORAGE.sessionStorage
): Promise<SignInResponse>;
export function sendSignInRequest(
    requestParams: ConfigInterface,
    storage: STORAGE,
    session: SessionData
): Promise<SignInResponse>;
export function sendSignInRequest(
    requestParams: ConfigInterface,
    storage: STORAGE,
    session?: SessionData
): Promise<SignInResponse> {
    if (hasAuthorizationCode(storage, session)) {
        return sendTokenRequest(requestParams, storage, session)
            .then((response) => {
                initUserSession(response, getAuthenticatedUser(response.idToken), storage, session);
                return Promise.resolve({
                    type: SIGNED_IN
                } as SignInResponse);
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    return sendAuthorizationRequest(requestParams, storage, session);
                }

                return Promise.reject(error);
            });
    } else {
        return sendAuthorizationRequest(requestParams, storage, session);
    }
}

export function handleSignIn(requestParams: ConfigInterface, storage: STORAGE.sessionStorage): Promise<any>;
export function handleSignIn(requestParams: ConfigInterface, storage: STORAGE, session: SessionData): Promise<any>;
export function handleSignIn(requestParams: ConfigInterface, storage: STORAGE, session?: SessionData): Promise<any> {
    if (getSessionParameter(ACCESS_TOKEN, storage, session)) {
        if (!isValidOPConfig(requestParams.clientID, storage, session)) {
            endAuthenticatedSession(storage, session);
            resetOPConfiguration(storage, session);
            // TODO: Better to have a callback to clear this on the app side.
            removeSessionParameter("auth_callback_url", storage, session);

            return initOPConfiguration(requestParams, true, storage, session)
                .then(() => {
                    return sendSignInRequest(requestParams, storage, session);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }

        return Promise.resolve("Sign In successful!");
    } else {
        return initOPConfiguration(requestParams, false, storage, session)
            .then(() => {
                return sendSignInRequest(requestParams, storage, session);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }
}
