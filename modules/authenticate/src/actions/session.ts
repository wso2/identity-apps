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
import {
    ACCESS_TOKEN,
    ACCESS_TOKEN_EXPIRE_IN,
    ACCESS_TOKEN_ISSUED_AT,
    DISPLAY_NAME,
    EMAIL,
    ID_TOKEN,
    REFRESH_TOKEN,
    SERVICE_RESOURCES,
    USERNAME
} from "../constants";
import { createEmptySession, SessionInterface } from "../models/session";
import { getJWKForTheIdToken, verifyIdToken } from "./crypto";

/**
 * Get OAuth2 token request header.
 *
 * @param {string} clientHost app host.
 * @returns {{headers: {Accept: string; "Access-Control-Allow-Origin": string; "Content-Type": string}}}
 */
export const getTokenRequestHeaders = (clientHost: string) => {
    return {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": clientHost,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
};

/**
 * Initialize authenticated user session.
 *
 * @param {SessionInterface} data
 */
export const initAuthenticatedSession = (data: SessionInterface) => {
    sessionStorage.setItem(DISPLAY_NAME, data.display_name);
    sessionStorage.setItem(EMAIL, data.email);
    sessionStorage.setItem(USERNAME, data.username);
    sessionStorage.setItem(ACCESS_TOKEN, data.access_token);
    sessionStorage.setItem(REFRESH_TOKEN, data.refresh_token);
    sessionStorage.setItem(ID_TOKEN, data.id_token);
    sessionStorage.setItem(ACCESS_TOKEN_EXPIRE_IN, data.expires_in);
    sessionStorage.setItem(ACCESS_TOKEN_ISSUED_AT, data.issued_at);
};

/**
 * Set parameter to session storage.
 *
 * @param {string} key
 * @param {string} value
 */
export const setSessionParameter = (key: string, value: string) => {
    return sessionStorage.setItem(key, value);
};

/**
 * Get parameter from session storage.
 *
 * @param {string} key
 * @returns {string | null}
 */
export const getSessionParameter = (key: string) => {
    return sessionStorage.getItem(key);
};

/**
 * Get access token.
 *
 * @param {string} clientID app identification.
 * @param {string} clientHost app host.
 * @returns {string | null}
 */
export const getAccessToken = (clientID: string, clientHost: string) => {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN);
    const expiresIn = sessionStorage.getItem(ACCESS_TOKEN_EXPIRE_IN);
    const issuedAt = sessionStorage.getItem(ACCESS_TOKEN_ISSUED_AT);

    if (!accessToken || accessToken.length === 0 || !expiresIn || expiresIn.length === 0 || !issuedAt
        || issuedAt.length === 0) {
        throw new Error("Invalid user session.");
    }

    const validityPeriod = (parseInt(issuedAt, 10) + parseInt(expiresIn, 10)) - Math.floor(Date.now() / 1000);

    if (validityPeriod <= 300) {
        refreshSession(sessionStorage.getItem(REFRESH_TOKEN), clientID, clientHost)
            .then(() => {
                    return sessionStorage.getItem(ACCESS_TOKEN);
                }
            )
            .catch((e) => {
                resetAuthenticatedSession();
                throw e;
            }
        );
    }
    return sessionStorage.getItem(ACCESS_TOKEN);
};

/**
 * Get all session parameters.
 *
 * @returns {{}}
 */
export const getAllSessionParameters = () => {
    const session = {};

    session[`${DISPLAY_NAME}`] = sessionStorage.getItem(DISPLAY_NAME);
    session[`${EMAIL}`] = sessionStorage.getItem(EMAIL);
    session[`${USERNAME}`] = sessionStorage.getItem(USERNAME);
    session[`${ACCESS_TOKEN}`] = sessionStorage.getItem(ACCESS_TOKEN);
    session[`${REFRESH_TOKEN}`] = sessionStorage.getItem(REFRESH_TOKEN);
    session[`${ID_TOKEN}`] = sessionStorage.getItem(ID_TOKEN);
    session[`${ACCESS_TOKEN_EXPIRE_IN}`] = sessionStorage.getItem(ACCESS_TOKEN_EXPIRE_IN);
    session[`${ACCESS_TOKEN_ISSUED_AT}`] = sessionStorage.getItem(ACCESS_TOKEN_ISSUED_AT);

    return session;
};

/**
 * Reset authenticated session.
 */
export const resetAuthenticatedSession = () => {
    sessionStorage.removeItem(DISPLAY_NAME);
    sessionStorage.removeItem(EMAIL);
    sessionStorage.removeItem(USERNAME);
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(REFRESH_TOKEN);
    sessionStorage.removeItem(ID_TOKEN);
    sessionStorage.removeItem(ACCESS_TOKEN_EXPIRE_IN);
    sessionStorage.removeItem(ACCESS_TOKEN_ISSUED_AT);
};

/**
 * Returns whether session is valid.
 *
 * @param {string} clientID app identification.
 * @param {string} clientHost app host.
 * @returns {boolean}
 */
export const isValidSession = (clientID: string, clientHost: string) => {
    try {
        getAccessToken(clientID, clientHost);
    } catch (e) {
        return false;
    }

    return true;
};

/**
 * Set code verifier to the session storage.
 *
 * @param {string} verifier
 */
export const storeCodeVerifier = (verifier: string) => {
    sessionStorage.setItem("pkce_code_verifier", verifier);
};

/**
 * Get code verifier from the session storage.
 *
 * @returns {string | null}
 */
export const retrieveCodeVerifier = () => {
    return sessionStorage.getItem("pkce_code_verifier");
};

/**
 * Clear code verifier from the session storage.
 */
export const clearCodeVerifier = () => {
    sessionStorage.removeItem("pkce_code_verifier");
};

/**
 * Refresh session attributes.
 *
 * @param {string} refreshToken
 * @param {string} clientID app identification.
 * @param {string} clientHost app host.
 * @returns {Promise<SessionInterface | void>}
 */
export const refreshSession = (refreshToken: string, clientID, clientHost) => {
    const body = [];
    body.push(`client_id=${clientID}`);
    body.push(`refresh_token=${refreshToken}`);
    body.push("grant_type=refresh_token");

    return axios.post(SERVICE_RESOURCES.token, body.join("&"), getTokenRequestHeaders(clientHost))
        .then((refreshTokenResponse) => {
                if (refreshTokenResponse.status !== 200) {
                    throw new Error("Refresh token request failed.");
                }

                if (isIdTokenValid(refreshTokenResponse, clientID)) {
                    initAuthenticatedSession(populateSessionObject(refreshTokenResponse));
                    return;
                }
                throw new Error("Received id_token is invalid.");
            }
        )
        .catch((error) => {
            throw error;
        });
};

/**
 * Validate the id_token.
 *
 * @param tokenResponse token response.
 * @param {string} clientID app identification.
 */
export const isIdTokenValid = (tokenResponse, clientID) => {
    return axios.get(SERVICE_RESOURCES.jwks)
        .then((jwksResponse) => {
                if (jwksResponse.status !== 200) {
                    throw new Error("Failed to get a response from the JWKS endpoint - " +
                    SERVICE_RESOURCES.jwks);
                }

                return verifyIdToken(
                    tokenResponse.data.id_token,
                    getJWKForTheIdToken(tokenResponse.data.id_token.split(".")[0], jwksResponse.data.keys),
                    clientID);
            }
        )
        .catch((error) => {
            throw error;
        });
};

/**
 * Populate session object from the token response.
 *
 * @param tokenResponse token response.
 * @returns {SessionInterface} user session.
 */
export const populateSessionObject = (tokenResponse) => {
    const payload = JSON.parse(atob(tokenResponse.data.id_token.split(".")[1]));
    const session = createEmptySession();

    Object.assign(session, {
        access_token: tokenResponse.data.access_token,
        display_name: payload.preferred_username ? payload.preferred_username : payload.sub,
        email: payload.email,
        expires_in: tokenResponse.data.expires_in,
        id_token: tokenResponse.data.id_token,
        issued_at: Date.now() / 1000,
        refresh_token: tokenResponse.data.refresh_token,
        username: payload.sub,
    });

    return session;
};
