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
import { getSessionParameter, removeSessionParameter, setSessionParameter } from "./session";
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
    TENANT,
    TOKEN_ENDPOINT,
    USERNAME
} from "../constants";
import { ConfigInterface } from "../models/client";
import { STORAGE } from "../constants/storage";
import { SessionData } from "..";

/**
 * Checks whether openid configuration initiated.
 *
 * @returns {boolean}
 */
export const isOPConfigInitiated = (storage: STORAGE, session: SessionData): boolean => {
    if (storage === STORAGE.sessionStorage) {
        return (
            getSessionParameter(OP_CONFIG_INITIATED, storage, session) &&
            getSessionParameter(OP_CONFIG_INITIATED, storage, session) === "true"
        );
    } else {
        return session.get(OP_CONFIG_INITIATED) && session.get(OP_CONFIG_INITIATED) === "true";
    }
};

/**
 * Set OAuth2 authorize endpoint.
 *
 * @param {string} authorizationEndpoint
 */
export const setAuthorizeEndpoint = (authorizationEndpoint: string, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(AUTHORIZATION_ENDPOINT, authorizationEndpoint, storage, session);
    } else {
        session.set(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
    }
};

/**
 * Set OAuth2 token endpoint.
 *
 * @param {string} tokenEndpoint
 */
export const setTokenEndpoint = (tokenEndpoint: string, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(TOKEN_ENDPOINT, tokenEndpoint, storage, session);
    } else {
        session.set(TOKEN_ENDPOINT, tokenEndpoint);
    }
};

/**
 * Set OIDC end session endpoint.
 *
 * @param {string} endSessionEndpoint
 */
export const setEndSessionEndpoint = (endSessionEndpoint: string, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(END_SESSION_ENDPOINT, endSessionEndpoint, storage, session);
    } else {
        session.set(END_SESSION_ENDPOINT, endSessionEndpoint);
    }
};

/**
 * Set JWKS URI.
 *
 * @param jwksEndpoint
 */
export const setJwksUri = (jwksEndpoint, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(JWKS_ENDPOINT, jwksEndpoint, storage, session);
    } else {
        session.set(JWKS_ENDPOINT, jwksEndpoint);
    }
};

/**
 * Set OAuth2 revoke token endpoint.
 *
 * @param {string} revokeTokenEndpoint
 */
export const setRevokeTokenEndpoint = (revokeTokenEndpoint: string, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(REVOKE_TOKEN_ENDPOINT, revokeTokenEndpoint, storage, session);
    } else {
        session.set(REVOKE_TOKEN_ENDPOINT, revokeTokenEndpoint);
    }
};

/**
 * Set openid configuration initiated.
 */
export const setOPConfigInitiated = (storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(OP_CONFIG_INITIATED, "true", storage, session);
    } else {
        session.set(OP_CONFIG_INITIATED, "true");
    }
};

/**
 * Set callback URL.
 */
export const setCallbackURL = (url: string, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(CALLBACK_URL, url, storage, session);
    } else {
        session.set(CALLBACK_URL, url);
    }
};

/**
 * Set OIDC Session IFrame URL.
 */
export const setOIDCSessionIFrameURL = (url: string, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(OIDC_SESSION_IFRAME_ENDPOINT, url, storage, session);
    } else {
        session.set(OIDC_SESSION_IFRAME_ENDPOINT, url);
    }
};

/**
 * Set tenant name.
 */
export const setTenant = (tenant: string, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(TENANT, tenant, storage, session);
    } else {
        session.set(TENANT, tenant);
    }
};

/**
 * Set id_token issuer.
 *
 * @param issuer id_token issuer.
 */
export const setIssuer = (issuer, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(ISSUER, issuer, storage, session);
    } else {
        session.set(ISSUER, issuer);
    }
};

/**
 * Set Client ID.
 *
 * @param {string} clientID - Client ID of the application.
 */
export const setClientID = (clientID: string, storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(CLIENT_ID, clientID, storage, session);
    } else {
        session.set(CLIENT_ID, clientID);
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
export const initOPConfiguration = (
    requestParams: ConfigInterface,
    forceInit: boolean,
    storage: STORAGE,
    session: SessionData
): Promise<any> => {
    if (!forceInit && isValidOPConfig(requestParams.clientID, storage, session)) {
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

            setAuthorizeEndpoint(response.data.authorization_endpoint, storage, session);
            setTokenEndpoint(response.data.token_endpoint, storage, session);
            setEndSessionEndpoint(response.data.end_session_endpoint, storage, session);
            setJwksUri(response.data.jwks_uri, storage, session);
            setRevokeTokenEndpoint(
                response.data.token_endpoint.substring(0, response.data.token_endpoint.lastIndexOf("token")) + "revoke",
                storage,
                session
            );
            setIssuer(response.data.issuer, storage, session);
            setClientID(requestParams.clientID, storage, session);
            setOIDCSessionIFrameURL(response.data.check_session_iframe, storage, session);
            setCallbackURL(requestParams.callbackURL, storage, session);
            setOPConfigInitiated(storage, session);
            return Promise.resolve(
                "Initialized OpenID Provider configuration from: " + serverHost + SERVICE_RESOURCES.wellKnown
            );
        })
        .catch(() => {
            setAuthorizeEndpoint(requestParams.serverOrigin + SERVICE_RESOURCES.authorize, storage, session);
            setTokenEndpoint(requestParams.serverOrigin + SERVICE_RESOURCES.token, storage, session);
            setRevokeTokenEndpoint(requestParams.serverOrigin + SERVICE_RESOURCES.revoke, storage, session);
            setEndSessionEndpoint(requestParams.serverOrigin + SERVICE_RESOURCES.logout, storage, session);
            setJwksUri(serverHost + SERVICE_RESOURCES.jwks, storage, session);
            setIssuer(requestParams.serverOrigin + SERVICE_RESOURCES.token, storage, session);
            setClientID(requestParams.clientID, storage, session);
            setOIDCSessionIFrameURL(requestParams.serverOrigin + SERVICE_RESOURCES.oidcSessionIFrame, storage, session);
            setCallbackURL(requestParams.callbackURL, storage, session);
            setOPConfigInitiated(storage, session);

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
export const resetOPConfiguration = (storage: STORAGE, session: SessionData): void => {
    if (storage === STORAGE.sessionStorage) {
        removeSessionParameter(AUTHORIZATION_ENDPOINT, storage, session);
        removeSessionParameter(TOKEN_ENDPOINT, storage, session);
        removeSessionParameter(END_SESSION_ENDPOINT, storage, session);
        removeSessionParameter(JWKS_ENDPOINT, storage, session);
        removeSessionParameter(REVOKE_TOKEN_ENDPOINT, storage, session);
        removeSessionParameter(OP_CONFIG_INITIATED, storage, session);
        removeSessionParameter(ISSUER, storage, session);
        removeSessionParameter(CLIENT_ID, storage, session);
        removeSessionParameter(TENANT, storage, session);
        removeSessionParameter(CALLBACK_URL, storage, session);
    } else {
        session.clear();
    }
};

/**
 * Get OAuth2 authorize endpoint.
 *
 * @returns {string|null}
 */
export const getAuthorizeEndpoint = (storage: STORAGE, session: SessionData): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(AUTHORIZATION_ENDPOINT, storage, session);
    } else {
        return session.get(AUTHORIZATION_ENDPOINT);
    }
};

/**
 * Get OAuth2 token endpoint.
 *
 * @returns {string|null}
 */
export const getTokenEndpoint = (storage: STORAGE, session: SessionData): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(TOKEN_ENDPOINT, storage, session);
    } else {
        return session.get(TOKEN_ENDPOINT);
    }
};

/**
 * Get OAuth2 revoke token endpoint.
 *
 * @returns {string|null}
 */
export const getRevokeTokenEndpoint = (storage: STORAGE, session: SessionData): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(REVOKE_TOKEN_ENDPOINT, storage, session);
    } else {
        return session.get(REVOKE_TOKEN_ENDPOINT);
    }
};

/**
 * Get OIDC end session endpoint.
 *
 * @returns {string|null}
 */
export const getEndSessionEndpoint = (storage: STORAGE, session: SessionData): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(END_SESSION_ENDPOINT, storage, session);
    } else {
        return session.get(END_SESSION_ENDPOINT);
    }
};

/**
 * Get JWKS URI.
 *
 * @returns {string|null}
 */
export const getJwksUri = (storage: STORAGE, session: SessionData): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(JWKS_ENDPOINT, storage, session);
    } else {
        return session.get(JWKS_ENDPOINT);
    }
};

/**
 * Get authenticated user's username
 *
 * @returns {string|null}
 */
export const getUsername = (storage: STORAGE, session: SessionData): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(USERNAME, storage, session);
    } else {
        return session.get(USERNAME);
    }
};

/**
 * Get tenant name
 *
 * @returns {any}
 */
export const getTenant = (storage: STORAGE, session: SessionData): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(TENANT, storage, session);
    } else {
        return session.get(TENANT);
    }
};

/**
 * Get id_token issuer.
 *
 * @returns {any}
 */
export const getIssuer = (storage: STORAGE, session: SessionData): string => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(ISSUER, storage, session);
    } else {
        return session.get(ISSUER);
    }
};

/**
 * Get Client ID.
 *
 * @return {string}
 */
export const getClientID = (storage: STORAGE, session: SessionData): string => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(CLIENT_ID, storage, session);
    } else {
        return session.get(CLIENT_ID);
    }
};

/**
 * Checks whether openid configuration initiated is valid.
 *
 * @param {string} tenant - Tenant of the logged in user.
 * @param {string} clientID - Client ID of the application.
 * @return {boolean}
 */
export const isValidOPConfig = (clientID: string, storage: STORAGE, session: SessionData): boolean => {
    return (
        isOPConfigInitiated(storage, session) &&
        !!getClientID(storage, session) &&
        getClientID(storage, session) === clientID
    );
};
