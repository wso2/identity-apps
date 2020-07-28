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

/**
 * Checks whether openid configuration initiated.
 *
 * @returns {boolean}
 */
export const isOPConfigInitiated = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): boolean => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(OP_CONFIG_INITIATED) && getSessionParameter(OP_CONFIG_INITIATED) === "true";
    } else {
        return session.get(OP_CONFIG_INITIATED) && session.get(OP_CONFIG_INITIATED) === "true";
    }
};

/**
 * Set OAuth2 authorize endpoint.
 *
 * @param {string} authorizationEndpoint
 */
export const setAuthorizeEndpoint = (
    authorizationEndpoint: string,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
    } else {
        session.set(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
    }
};

/**
 * Set OAuth2 token endpoint.
 *
 * @param {string} tokenEndpoint
 */
export const setTokenEndpoint = (
    tokenEndpoint: string,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(TOKEN_ENDPOINT, tokenEndpoint);
    } else {
        session.set(TOKEN_ENDPOINT, tokenEndpoint);
    }
};

/**
 * Set OIDC end session endpoint.
 *
 * @param {string} endSessionEndpoint
 */
export const setEndSessionEndpoint = (
    endSessionEndpoint: string,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(END_SESSION_ENDPOINT, endSessionEndpoint);
    } else {
        session.set(END_SESSION_ENDPOINT, endSessionEndpoint);
    }
};

/**
 * Set JWKS URI.
 *
 * @param jwksEndpoint
 */
export const setJwksUri = (
    jwksEndpoint,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(JWKS_ENDPOINT, jwksEndpoint);
    } else {
        session.set(JWKS_ENDPOINT, jwksEndpoint);
    }
};

/**
 * Set OAuth2 revoke token endpoint.
 *
 * @param {string} revokeTokenEndpoint
 */
export const setRevokeTokenEndpoint = (
    revokeTokenEndpoint: string,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(REVOKE_TOKEN_ENDPOINT, revokeTokenEndpoint);
    } else {
        session.set(REVOKE_TOKEN_ENDPOINT, revokeTokenEndpoint);
    }
};

/**
 * Set openid configuration initiated.
 */
export const setOPConfigInitiated = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(OP_CONFIG_INITIATED, "true");
    } else {
        session.set(OP_CONFIG_INITIATED, "true");
    }
};

/**
 * Set callback URL.
 */
export const setCallbackURL = (
    url: string,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(CALLBACK_URL, url);
    } else {
        session.set(CALLBACK_URL, url);
    }
};

/**
 * Set OIDC Session IFrame URL.
 */
export const setOIDCSessionIFrameURL = (
    url: string,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(OIDC_SESSION_IFRAME_ENDPOINT, url);
    } else {
        session.set(OIDC_SESSION_IFRAME_ENDPOINT, url);
    }
};

/**
 * Set tenant name.
 */
export const setTenant = (
    tenant: string,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(TENANT, tenant);
    } else {
        session.set(TENANT, tenant);
    }
};

/**
 * Set id_token issuer.
 *
 * @param issuer id_token issuer.
 */
export const setIssuer = (
    issuer,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(ISSUER, issuer);
    } else {
        session.set(ISSUER, issuer);
    }
};

/**
 * Set Client ID.
 *
 * @param {string} clientID - Client ID of the application.
 */
export const setClientID = (
    clientID: string,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        setSessionParameter(CLIENT_ID, clientID);
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
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
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
export const resetOPConfiguration = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): void => {
    if (storage === STORAGE.sessionStorage) {
        removeSessionParameter(AUTHORIZATION_ENDPOINT);
        removeSessionParameter(TOKEN_ENDPOINT);
        removeSessionParameter(END_SESSION_ENDPOINT);
        removeSessionParameter(JWKS_ENDPOINT);
        removeSessionParameter(REVOKE_TOKEN_ENDPOINT);
        removeSessionParameter(OP_CONFIG_INITIATED);
        removeSessionParameter(ISSUER);
        removeSessionParameter(CLIENT_ID);
        removeSessionParameter(TENANT);
        removeSessionParameter(CALLBACK_URL);
    } else {
        session.clear();
    }
};

/**
 * Get OAuth2 authorize endpoint.
 *
 * @returns {string|null}
 */
export const getAuthorizeEndpoint = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(AUTHORIZATION_ENDPOINT);
    } else {
        return session.get(AUTHORIZATION_ENDPOINT);
    }
};

/**
 * Get OAuth2 token endpoint.
 *
 * @returns {string|null}
 */
export const getTokenEndpoint = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(TOKEN_ENDPOINT);
    } else {
        return session.get(TOKEN_ENDPOINT);
    }
};

/**
 * Get OAuth2 revoke token endpoint.
 *
 * @returns {string|null}
 */
export const getRevokeTokenEndpoint = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(REVOKE_TOKEN_ENDPOINT);
    } else {
        return session.get(REVOKE_TOKEN_ENDPOINT);
    }
};

/**
 * Get OIDC end session endpoint.
 *
 * @returns {string|null}
 */
export const getEndSessionEndpoint = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(END_SESSION_ENDPOINT);
    } else {
        return session.get(END_SESSION_ENDPOINT);
    }
};

/**
 * Get JWKS URI.
 *
 * @returns {string|null}
 */
export const getJwksUri = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(JWKS_ENDPOINT);
    } else {
        return session.get(JWKS_ENDPOINT);
    }
};

/**
 * Get authenticated user's username
 *
 * @returns {string|null}
 */
export const getUsername = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(USERNAME);
    } else {
        return session.get(USERNAME);
    }
};

/**
 * Get tenant name
 *
 * @returns {any}
 */
export const getTenant = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): string | null => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(TENANT);
    } else {
        return session.get(TENANT);
    }
};

/**
 * Get id_token issuer.
 *
 * @returns {any}
 */
export const getIssuer = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): string => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(ISSUER);
    } else {
        return session.get(ISSUER);
    }
};

/**
 * Get Client ID.
 *
 * @return {string}
 */
export const getClientID = (
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): string => {
    if (storage === STORAGE.sessionStorage) {
        return getSessionParameter(CLIENT_ID);
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
export const isValidOPConfig = (
    clientID: string,
    storage: STORAGE,
    session: typeof storage extends STORAGE.sessionStorage ? null : Map<string, string>
): boolean => {
    return (
        isOPConfigInitiated(storage, session) &&
        !!getClientID(storage, session) &&
        getClientID(storage, session) === clientID
    );
};
