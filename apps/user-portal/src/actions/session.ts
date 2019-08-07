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

import {SessionInterface} from "../models/session";
import {
    ACCESS_TOKEN,
    ACCESS_TOKEN_EXPIRE_IN,
    ACCESS_TOKEN_ISSUED_AT,
    DISPLAY_NAME,
    EMAIL,
    ID_TOKEN,
    REFRESH_TOKEN,
    USERNAME
} from "../helpers/constants";
import {refreshSession} from "./login";

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
 * @returns {string | null}
 */
export const getAccessToken = () => {

    let access_token = sessionStorage.getItem(ACCESS_TOKEN);
    let expires_in = sessionStorage.getItem(ACCESS_TOKEN_EXPIRE_IN);
    let issued_at = sessionStorage.getItem(ACCESS_TOKEN_ISSUED_AT);

    if (!access_token || access_token.length == 0 || !expires_in || expires_in.length == 0 || !issued_at
        || issued_at.length == 0) {
        throw new Error("Invalid user session.");
    }

    let validityPeriod = (parseInt(issued_at) + parseInt(expires_in)) - Math.floor(Date.now() / 1000);
    if (validityPeriod <= 300) {
        refreshSession(sessionStorage.getItem(REFRESH_TOKEN))
            .then(() => {
                    return sessionStorage.getItem(ACCESS_TOKEN);
                }
            )
            .catch(e => {
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
 * @returns {boolean}
 */
export const isValidSession = () => {

    try {
        getAccessToken();
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
