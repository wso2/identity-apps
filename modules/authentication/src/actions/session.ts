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

import { Semaphore } from "await-semaphore";
import {
    ACCESS_TOKEN,
    ACCESS_TOKEN_EXPIRE_IN,
    ACCESS_TOKEN_ISSUED_AT,
    DISPLAY_NAME,
    EMAIL,
    ID_TOKEN,
    REFRESH_TOKEN,
    REQUEST_PARAMS,
    SCOPE,
    TOKEN_TYPE,
    USERNAME
} from "../constants";
import { AuthenticatedUserInterface } from "../models/authenticated-user";
import { SessionInterface } from "../models/session";
import { TokenResponseInterface } from "../models/token-response";
import { getAuthenticatedUser, sendRefreshTokenRequest } from "./sign-in";

/**
 * Semaphore used for synchronizing the refresh token requests.
 */
const semaphore = new Semaphore(1);

/**
 * Initialize authenticated user session.
 *
 * @param {TokenResponseInterface} tokenResponse.
 * @param authenticatedUser authenticated user.
 */
export const initUserSession = (tokenResponse: TokenResponseInterface,
                                authenticatedUser: AuthenticatedUserInterface) => {
    endAuthenticatedSession();
    sessionStorage.setItem(ACCESS_TOKEN, tokenResponse.accessToken);
    sessionStorage.setItem(ACCESS_TOKEN_EXPIRE_IN, tokenResponse.expiresIn);
    sessionStorage.setItem(ACCESS_TOKEN_ISSUED_AT, (Date.now() / 1000).toString());
    sessionStorage.setItem(DISPLAY_NAME, authenticatedUser.displayName);
    sessionStorage.setItem(EMAIL, authenticatedUser.email);
    sessionStorage.setItem(ID_TOKEN, tokenResponse.idToken);
    sessionStorage.setItem(SCOPE, tokenResponse.scope);
    sessionStorage.setItem(REFRESH_TOKEN, tokenResponse.refreshToken);
    sessionStorage.setItem(TOKEN_TYPE, tokenResponse.tokenType);
    sessionStorage.setItem(USERNAME, authenticatedUser.username);
};

/**
 * End authenticated user session.
 */
export const endAuthenticatedSession = () => {
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(ACCESS_TOKEN_EXPIRE_IN);
    sessionStorage.removeItem(ACCESS_TOKEN_ISSUED_AT);
    sessionStorage.removeItem(DISPLAY_NAME);
    sessionStorage.removeItem(EMAIL);
    sessionStorage.removeItem(ID_TOKEN);
    sessionStorage.removeItem(REFRESH_TOKEN);
    sessionStorage.removeItem(SCOPE);
    sessionStorage.removeItem(TOKEN_TYPE);
    sessionStorage.removeItem(USERNAME);
};

/**
 * Get the user session object.
 *
 * @returns {SessionInterface} session object.
 */
export const getAllSessionParameters = (): SessionInterface => {
    return {
        accessToken: sessionStorage.getItem(ACCESS_TOKEN),
        displayName: sessionStorage.getItem(DISPLAY_NAME),
        email: sessionStorage.getItem(EMAIL),
        expiresIn: sessionStorage.getItem(ACCESS_TOKEN_ISSUED_AT),
        idToken: sessionStorage.getItem(ID_TOKEN),
        refreshToken: sessionStorage.getItem(REFRESH_TOKEN),
        scope: sessionStorage.getItem(SCOPE),
        tokenType: sessionStorage.getItem(TOKEN_TYPE),
        username: sessionStorage.getItem(USERNAME)
    };
};

/**
 * Set parameter to session storage.
 *
 * @param {string} key.
 * @param value value.
 */
export const setSessionParameter = (key: string, value: string) => {
    sessionStorage.setItem(key, value);
};

/**
 * Get parameter from session storage.
 *
 * @param {string} key.
 * @returns {string | null} parameter value or null.
 */
export const getSessionParameter = (key: string) => {
    return sessionStorage.getItem(key);
};

/**
 * Remove parameter from session storage.
 *
 * @param {string} key.
 */
export const removeSessionParameter = (key: string) => {
    sessionStorage.removeItem(key);
};

/**
 * Get access token.
 *
 * @returns {Promise<string>} access token.
 */
export const getAccessToken = (): Promise<string> => {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN);
    const expiresIn = sessionStorage.getItem(ACCESS_TOKEN_EXPIRE_IN);
    const issuedAt = sessionStorage.getItem(ACCESS_TOKEN_ISSUED_AT);

    if (!accessToken || accessToken.trim().length === 0 || !expiresIn || expiresIn.length === 0 || !issuedAt
        || issuedAt.length === 0) {
        endAuthenticatedSession();

        return Promise.reject(new Error("Invalid user session."));
    }

    function getValidityPeriod() {
        const currentExpiresIn = sessionStorage.getItem(ACCESS_TOKEN_EXPIRE_IN);
        const currentIssuedAt = sessionStorage.getItem(ACCESS_TOKEN_ISSUED_AT);

        return (parseInt(currentIssuedAt, 10) + parseInt(currentExpiresIn, 10)) - Math.floor(Date.now() / 1000);
    }

    let validityPeriod = getValidityPeriod();

    if (validityPeriod <= 300) {

        return semaphore.use(() => {
            validityPeriod = getValidityPeriod();
            if (validityPeriod <= 300) {
                const requestParams = JSON.parse(getSessionParameter(REQUEST_PARAMS));
                return sendRefreshTokenRequest(requestParams, getSessionParameter(REFRESH_TOKEN))
                    .then((tokenResponse) => {
                        const authenticatedUser = getAuthenticatedUser(tokenResponse.idToken);
                        initUserSession(tokenResponse, authenticatedUser);
                        return Promise.resolve(tokenResponse.accessToken);
                    }).catch((error) => {
                        return Promise.reject(error);
                    });
            } else {
                return Promise.resolve(sessionStorage.getItem(ACCESS_TOKEN));
            }
        });
    } else {
        return Promise.resolve(accessToken);
    }
};
