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
import { getSessionParameter, removeSessionParameter, setSessionParameter } from "./session-storage";
import {
    AUTHORIZATION_ENDPOINT,
    CALLBACK_URL,
    CLIENT_ID,
    END_SESSION_ENDPOINT,
    ISSUER,
    JWKS_ENDPOINT,
    OIDC_SESSION_IFRAME_ENDPOINT,
    OP_CONFIG_INITIATED,
    REVOKE_TOKEN_ENDPOINT,
    SERVICE_RESOURCES,
    Storage,
    TENANT,
    TOKEN_ENDPOINT,
    USERNAME
} from "../constants";
import { ConfigInterface } from "../models/client";

/**
 * Checks whether openid configuration initiated.
 *
 * @returns {boolean}
 */
export const isOPConfigInitiated = (requestParams: ConfigInterface): boolean => {
    if (requestParams.storage === Storage.SessionStorage) {
        return (
            getSessionParameter(OP_CONFIG_INITIATED, requestParams) &&
            getSessionParameter(OP_CONFIG_INITIATED, requestParams) === "true"
        );
    } else {
        return (
            requestParams.session.get(OP_CONFIG_INITIATED) && requestParams.session.get(OP_CONFIG_INITIATED) === "true"
        );
    }
};

/**
 * Set OAuth2 authorize endpoint.
 *
 * @param {string} authorizationEndpoint
 */
export const setAuthorizeEndpoint = (authorizationEndpoint: string, requestParams: ConfigInterface): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(AUTHORIZATION_ENDPOINT, authorizationEndpoint, requestParams);
    } else {
        requestParams.session.set(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
    }
};

/**
 * Set OAuth2 token endpoint.
 *
 * @param {string} tokenEndpoint
 */
export const setTokenEndpoint = (tokenEndpoint: string, requestParams): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(TOKEN_ENDPOINT, tokenEndpoint, requestParams);
    } else {
        requestParams.session.set(TOKEN_ENDPOINT, tokenEndpoint);
    }
};

/**
 * Set OIDC end session endpoint.
 *
 * @param {string} endSessionEndpoint
 */
export const setEndSessionEndpoint = (endSessionEndpoint: string, requestParams): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(END_SESSION_ENDPOINT, endSessionEndpoint, requestParams);
    } else {
        requestParams.session.set(END_SESSION_ENDPOINT, endSessionEndpoint);
    }
};

/**
 * Set JWKS URI.
 *
 * @param jwksEndpoint
 */
export const setJwksUri = (jwksEndpoint, requestParams: ConfigInterface): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(JWKS_ENDPOINT, jwksEndpoint, requestParams);
    } else {
        requestParams.session.set(JWKS_ENDPOINT, jwksEndpoint);
    }
};

/**
 * Set OAuth2 revoke token endpoint.
 *
 * @param {string} revokeTokenEndpoint
 */
export const setRevokeTokenEndpoint = (revokeTokenEndpoint: string, requestParams: ConfigInterface): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(REVOKE_TOKEN_ENDPOINT, revokeTokenEndpoint, requestParams);
    } else {
        requestParams.session.set(REVOKE_TOKEN_ENDPOINT, revokeTokenEndpoint);
    }
};

/**
 * Set openid configuration initiated.
 */
export const setOPConfigInitiated = (requestParams: ConfigInterface): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(OP_CONFIG_INITIATED, "true", requestParams);
    } else {
        requestParams.session.set(OP_CONFIG_INITIATED, "true");
    }
};

/**
 * Set callback URL.
 */
export const setCallbackURL = (url: string, requestParams: ConfigInterface): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(CALLBACK_URL, url, requestParams);
    } else {
        requestParams.session.set(CALLBACK_URL, url);
    }
};

/**
 * Set OIDC Session IFrame URL.
 */
export const setOIDCSessionIFrameURL = (url: string, requestParams: ConfigInterface): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(OIDC_SESSION_IFRAME_ENDPOINT, url, requestParams);
    } else {
        requestParams.session.set(OIDC_SESSION_IFRAME_ENDPOINT, url);
    }
};

/**
 * Set id_token issuer.
 *
 * @param issuer id_token issuer.
 */
export const setIssuer = (issuer, requestParams: ConfigInterface): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(ISSUER, issuer, requestParams);
    } else {
        requestParams.session.set(ISSUER, issuer);
    }
};

/**
 * Set Client ID.
 *
 * @param {string} clientID - Client ID of the application.
 */
export const setClientID = (requestParams: ConfigInterface): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        setSessionParameter(CLIENT_ID, requestParams.clientID, requestParams);
    } else {
        requestParams.session.set(CLIENT_ID, requestParams.clientID);
    }
};

/**
 * Initialize openid provider configuration.
 *
 * @param {string} wellKnownEndpoint openid provider configuration.
 * @param {boolean} forceInit whether to initialize the configuration again.
 * @returns {Promise<any>} promise.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const initOPConfiguration = (requestParams: ConfigInterface, forceInit: boolean): Promise<any> => {
    if (!forceInit && isValidOPConfig(requestParams)) {
        return Promise.resolve();
    }

    const serverHost = requestParams.serverOrigin;

    return axios
        .get(serverHost + SERVICE_RESOURCES.wellKnown)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(
                        "Failed to load OpenID provider configuration from: " + serverHost + SERVICE_RESOURCES.wellKnown
                    )
                );
            }

            setAuthorizeEndpoint(response.data.authorization_endpoint, requestParams);
            setTokenEndpoint(response.data.token_endpoint, requestParams);
            setEndSessionEndpoint(response.data.end_session_endpoint, requestParams);
            setJwksUri(response.data.jwks_uri, requestParams);
            setRevokeTokenEndpoint(
                response.data.token_endpoint.substring(0, response.data.token_endpoint.lastIndexOf("token")) + "revoke",
                requestParams
            );
            setIssuer(response.data.issuer, requestParams);
            setClientID(requestParams);
            setOIDCSessionIFrameURL(response.data.check_session_iframe, requestParams);
            setCallbackURL(requestParams.callbackURL, requestParams);
            setOPConfigInitiated(requestParams);
            return Promise.resolve(
                "Initialized OpenID Provider configuration from: " + serverHost + SERVICE_RESOURCES.wellKnown
            );
        })
        .catch(() => {
            setAuthorizeEndpoint(
                requestParams.serverOrigin + requestParams.endpoints.authorize ?? SERVICE_RESOURCES.authorize,
                requestParams
            );
            setTokenEndpoint(
                requestParams.serverOrigin + requestParams.endpoints.token ?? SERVICE_RESOURCES.token,
                requestParams
            );
            setRevokeTokenEndpoint(
                requestParams.serverOrigin + requestParams.endpoints.revoke ?? SERVICE_RESOURCES.revoke,
                requestParams
            );
            setEndSessionEndpoint(
                requestParams.serverOrigin + requestParams.endpoints.logout ?? SERVICE_RESOURCES.logout,
                requestParams
            );
            setJwksUri(serverHost + requestParams.endpoints.jwks ?? SERVICE_RESOURCES.jwks, requestParams);
            setIssuer(
                requestParams.serverOrigin + requestParams.endpoints.token ?? SERVICE_RESOURCES.token,
                requestParams
            );
            setClientID(requestParams);
            setOIDCSessionIFrameURL(
                requestParams.serverOrigin + requestParams.endpoints.oidcSessionIFrame ??
                SERVICE_RESOURCES.oidcSessionIFrame,
                requestParams
            );
            setCallbackURL(requestParams.callbackURL, requestParams);
            setOPConfigInitiated(requestParams);

            return Promise.resolve(
                new Error(
                    "Initialized OpenID Provider configuration from default configuration." +
                    "Because failed to access wellknown endpoint: " +
                    serverHost +
                    SERVICE_RESOURCES.wellKnown
                )
            );
        });
};

/**
 * Reset openid provider configuration.
 */
export const resetOPConfiguration = (requestParams: ConfigInterface): void => {
    if (requestParams.storage === Storage.SessionStorage) {
        removeSessionParameter(AUTHORIZATION_ENDPOINT, requestParams);
        removeSessionParameter(TOKEN_ENDPOINT, requestParams);
        removeSessionParameter(END_SESSION_ENDPOINT, requestParams);
        removeSessionParameter(JWKS_ENDPOINT, requestParams);
        removeSessionParameter(REVOKE_TOKEN_ENDPOINT, requestParams);
        removeSessionParameter(OP_CONFIG_INITIATED, requestParams);
        removeSessionParameter(ISSUER, requestParams);
        removeSessionParameter(CLIENT_ID, requestParams);
        removeSessionParameter(TENANT, requestParams);
        removeSessionParameter(CALLBACK_URL, requestParams);
    } else {
        requestParams.session.clear();
    }
};

/**
 * Get OAuth2 authorize endpoint.
 *
 * @returns {string|null}
 */
export const getAuthorizeEndpoint = (requestParams: ConfigInterface): string | null => {
    if (requestParams.storage === Storage.SessionStorage) {
        return getSessionParameter(AUTHORIZATION_ENDPOINT, requestParams);
    } else {
        return requestParams.session.get(AUTHORIZATION_ENDPOINT);
    }
};

/**
 * Get OAuth2 token endpoint.
 *
 * @returns {string|null}
 */
export const getTokenEndpoint = (requestParams: ConfigInterface): string | null => {
    if (requestParams.storage === Storage.SessionStorage) {
        return getSessionParameter(TOKEN_ENDPOINT, requestParams);
    } else {
        return requestParams.session.get(TOKEN_ENDPOINT);
    }
};

/**
 * Get OAuth2 revoke token endpoint.
 *
 * @returns {string|null}
 */
export const getRevokeTokenEndpoint = (requestParams: ConfigInterface): string | null => {
    if (requestParams.storage === Storage.SessionStorage) {
        return getSessionParameter(REVOKE_TOKEN_ENDPOINT, requestParams);
    } else {
        return requestParams.session.get(REVOKE_TOKEN_ENDPOINT);
    }
};

/**
 * Get OIDC end session endpoint.
 *
 * @returns {string|null}
 */
export const getEndSessionEndpoint = (requestParams: ConfigInterface): string | null => {
    if (requestParams.storage === Storage.SessionStorage) {
        return getSessionParameter(END_SESSION_ENDPOINT, requestParams);
    } else {
        return requestParams.session.get(END_SESSION_ENDPOINT);
    }
};

/**
 * Get JWKS URI.
 *
 * @returns {string|null}
 */
export const getJwksUri = (requestParams: ConfigInterface): string | null => {
    if (requestParams.storage === Storage.SessionStorage) {
        return getSessionParameter(JWKS_ENDPOINT, requestParams);
    } else {
        return requestParams.session.get(JWKS_ENDPOINT);
    }
};

/**
 * Get authenticated user's username
 *
 * @returns {string|null}
 */
export const getUsername = (requestParams: ConfigInterface): string | null => {
    if (requestParams.storage === Storage.SessionStorage) {
        return getSessionParameter(USERNAME, requestParams);
    } else {
        return requestParams.session.get(USERNAME);
    }
};

/**
 * Get tenant name
 *
 * @returns {any}
 */
export const getTenant = (requestParams): string | null => {
    if (requestParams.storage === Storage.SessionStorage) {
        return getSessionParameter(TENANT, requestParams);
    } else {
        return requestParams.session.get(TENANT);
    }
};

/**
 * Get id_token issuer.
 *
 * @returns {any}
 */
export const getIssuer = (requestParams: ConfigInterface): string => {
    if (requestParams.storage === Storage.SessionStorage) {
        return getSessionParameter(ISSUER, requestParams);
    } else {
        return requestParams.session.get(ISSUER);
    }
};

/**
 * Get Client ID.
 *
 * @return {string}
 */
export const getClientID = (requestParams: ConfigInterface): string => {
    if (requestParams.storage === Storage.SessionStorage) {
        return getSessionParameter(CLIENT_ID, requestParams);
    } else {
        return requestParams.session.get(CLIENT_ID);
    }
};

/**
 * Checks whether openid configuration initiated is valid.
 *
 * @param {string} tenant - Tenant of the logged in user.
 * @param {string} clientID - Client ID of the application.
 * @return {boolean}
 */
export const isValidOPConfig = (requestParams: ConfigInterface): boolean => {
    return (
        isOPConfigInitiated(requestParams) &&
        !!getClientID(requestParams) &&
        getClientID(requestParams) === requestParams.clientID
    );
};
