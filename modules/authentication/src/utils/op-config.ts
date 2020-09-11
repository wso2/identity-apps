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
import { ConfigInterface, ServiceResourcesType, WebWorkerConfigInterface } from "../models";

/**
 * Checks whether openid configuration initiated.
 *
 * @returns {boolean}
 */
export const isOPConfigInitiated = (requestParams: ConfigInterface | WebWorkerConfigInterface): boolean => {
    if (requestParams.storage !== Storage.WebWorker) {
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
export const setAuthorizeEndpoint = (
    authorizationEndpoint: string,
    requestParams: ConfigInterface | WebWorkerConfigInterface
): void => {
    setSessionParameter(AUTHORIZATION_ENDPOINT, authorizationEndpoint, requestParams);
};

/**
 * Set OAuth2 token endpoint.
 *
 * @param {string} tokenEndpoint
 */
export const setTokenEndpoint = (tokenEndpoint: string, requestParams): void => {
    setSessionParameter(TOKEN_ENDPOINT, tokenEndpoint, requestParams);
};

/**
 * Set OIDC end session endpoint.
 *
 * @param {string} endSessionEndpoint
 */
export const setEndSessionEndpoint = (endSessionEndpoint: string, requestParams): void => {
    setSessionParameter(END_SESSION_ENDPOINT, endSessionEndpoint, requestParams);
};

/**
 * Set JWKS URI.
 *
 * @param jwksEndpoint
 */
export const setJwksUri = (jwksEndpoint, requestParams: ConfigInterface | WebWorkerConfigInterface): void => {
    setSessionParameter(JWKS_ENDPOINT, jwksEndpoint, requestParams);
};

/**
 * Set OAuth2 revoke token endpoint.
 *
 * @param {string} revokeTokenEndpoint
 */
export const setRevokeTokenEndpoint = (
    revokeTokenEndpoint: string,
    requestParams: ConfigInterface | WebWorkerConfigInterface
): void => {
    setSessionParameter(REVOKE_TOKEN_ENDPOINT, revokeTokenEndpoint, requestParams);
};

/**
 * Set openid configuration initiated.
 */
export const setOPConfigInitiated = (requestParams: ConfigInterface | WebWorkerConfigInterface): void => {
    setSessionParameter(OP_CONFIG_INITIATED, "true", requestParams);
};

/**
 * Set callback URL.
 */
export const setCallbackURL = (url: string, requestParams: ConfigInterface | WebWorkerConfigInterface): void => {
    setSessionParameter(CALLBACK_URL, url, requestParams);
};

/**
 * Set OIDC Session IFrame URL.
 */
export const setOIDCSessionIFrameURL = (
    url: string,
    requestParams: ConfigInterface | WebWorkerConfigInterface
): void => {
    setSessionParameter(OIDC_SESSION_IFRAME_ENDPOINT, url, requestParams);
};

/**
 * Set id_token issuer.
 *
 * @param issuer id_token issuer.
 */
export const setIssuer = (issuer, requestParams: ConfigInterface | WebWorkerConfigInterface): void => {
    setSessionParameter(ISSUER, issuer, requestParams);
};

/**
 * Set Client ID.
 *
 * @param {string} clientID - Client ID of the application.
 */
export const setClientID = (requestParams: ConfigInterface | WebWorkerConfigInterface): void => {
    setSessionParameter(CLIENT_ID, requestParams.clientID, requestParams);
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
    requestParams: ConfigInterface | WebWorkerConfigInterface,
    forceInit: boolean
): Promise<any> => {
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
                requestParams.serverOrigin + (requestParams?.endpoints?.authorize || SERVICE_RESOURCES.authorize),
                requestParams
            );
            setTokenEndpoint(
                requestParams.serverOrigin + (requestParams?.endpoints?.token || SERVICE_RESOURCES.token),
                requestParams
            );
            setRevokeTokenEndpoint(
                requestParams.serverOrigin + (requestParams?.endpoints?.revoke || SERVICE_RESOURCES.revoke),
                requestParams
            );
            setEndSessionEndpoint(
                requestParams.serverOrigin + (requestParams?.endpoints?.logout || SERVICE_RESOURCES.logout),
                requestParams
            );
            setJwksUri(serverHost + (requestParams?.endpoints?.jwks || SERVICE_RESOURCES.jwks), requestParams);
            setIssuer(
                requestParams.serverOrigin + (requestParams?.endpoints?.token || SERVICE_RESOURCES.token),
                requestParams
            );
            setClientID(requestParams);
            setOIDCSessionIFrameURL(
                requestParams.serverOrigin +
                    (requestParams?.endpoints?.oidcSessionIFrame || SERVICE_RESOURCES.oidcSessionIFrame),
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
export const resetOPConfiguration = (requestParams: ConfigInterface | WebWorkerConfigInterface): void => {
    if (requestParams.storage !== Storage.WebWorker) {
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

export const getServiceEndpoints = (authConfig: ConfigInterface | WebWorkerConfigInterface): ServiceResourcesType => {
    return {
        authorize: getAuthorizeEndpoint(authConfig),
        jwks: getJwksUri(authConfig),
        logout: getEndSessionEndpoint(authConfig),
        oidcSessionIFrame: getOIDCSessionIFrameURL(authConfig),
        revoke: getRevokeTokenEndpoint(authConfig),
        token: getTokenEndpoint(authConfig),
        wellKnown: SERVICE_RESOURCES.wellKnown
    };
};

/**
 * Get OAuth2 authorize endpoint.
 *
 * @returns {string|null}
 */
export const getAuthorizeEndpoint = (requestParams: ConfigInterface | WebWorkerConfigInterface): string | null => {
    return getSessionParameter(AUTHORIZATION_ENDPOINT, requestParams);
};

/**
 * Get OAuth2 token endpoint.
 *
 * @returns {string|null}
 */
export const getTokenEndpoint = (requestParams: ConfigInterface | WebWorkerConfigInterface): string | null => {
    return getSessionParameter(TOKEN_ENDPOINT, requestParams);
};

/**
 * Get OAuth2 revoke token endpoint.
 *
 * @returns {string|null}
 */
export const getRevokeTokenEndpoint = (requestParams: ConfigInterface | WebWorkerConfigInterface): string | null => {
    return getSessionParameter(REVOKE_TOKEN_ENDPOINT, requestParams);
};

export const getOIDCSessionIFrameURL = (requestParams: ConfigInterface | WebWorkerConfigInterface): string | null => {
    return getSessionParameter(OIDC_SESSION_IFRAME_ENDPOINT, requestParams);
};

/**
 * Get OIDC end session endpoint.
 *
 * @returns {string|null}
 */
export const getEndSessionEndpoint = (requestParams: ConfigInterface | WebWorkerConfigInterface): string | null => {
    return getSessionParameter(END_SESSION_ENDPOINT, requestParams);
};

/**
 * Get JWKS URI.
 *
 * @returns {string|null}
 */
export const getJwksUri = (requestParams: ConfigInterface | WebWorkerConfigInterface): string | null => {
    return getSessionParameter(JWKS_ENDPOINT, requestParams);
};

/**
 * Get authenticated user's username
 *
 * @returns {string|null}
 */
export const getUsername = (requestParams: ConfigInterface | WebWorkerConfigInterface): string | null => {
    return getSessionParameter(USERNAME, requestParams);
};

/**
 * Get tenant name
 *
 * @returns {any}
 */
export const getTenant = (requestParams): string | null => {
    return getSessionParameter(TENANT, requestParams);
};

/**
 * Get id_token issuer.
 *
 * @returns {any}
 */
export const getIssuer = (requestParams: ConfigInterface | WebWorkerConfigInterface): string => {
    return getSessionParameter(ISSUER, requestParams);
};

/**
 * Get Client ID.
 *
 * @return {string}
 */
export const getClientID = (requestParams: ConfigInterface | WebWorkerConfigInterface): string => {
    return getSessionParameter(CLIENT_ID, requestParams);
};

/**
 * Checks whether openid configuration initiated is valid.
 *
 * @param {string} tenant - Tenant of the logged in user.
 * @param {string} clientID - Client ID of the application.
 * @return {boolean}
 */
export const isValidOPConfig = (requestParams: ConfigInterface | WebWorkerConfigInterface): boolean => {
    return (
        isOPConfigInitiated(requestParams) &&
        !!getClientID(requestParams) &&
        getClientID(requestParams) === requestParams.clientID
    );
};
