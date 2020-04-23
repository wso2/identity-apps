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
import { getAuthenticatedUser, sendRefreshTokenRequest } from "./sign-in";
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

/**
 * Semaphore used for synchronizing the refresh token requests.
 */
const semaphore = new Semaphore(1);

/**
 * Remove parameter from session storage.
 *
 * @param {string} key.
 */
export const removeSessionParameter = (key: string): void => {
    sessionStorage.removeItem(key);
};

/**
 * Set parameter to session storage.
 *
 * @param {string} key.
 * @param value value.
 */
export const setSessionParameter = (key: string, value: string): void => {
    sessionStorage.setItem(key, value);
};

/**
 * Get parameter from session storage.
 *
 * @param {string} key.
 * @returns {string | null} parameter value or null.
 */
export const getSessionParameter = (key: string): string|null => {
    return sessionStorage.getItem(key);
};

/**
 * End authenticated user session.
 */
export const endAuthenticatedSession = (): void => {
    removeSessionParameter(ACCESS_TOKEN);
    removeSessionParameter(ACCESS_TOKEN_EXPIRE_IN);
    removeSessionParameter(ACCESS_TOKEN_ISSUED_AT);
    removeSessionParameter(DISPLAY_NAME);
    removeSessionParameter(EMAIL);
    removeSessionParameter(ID_TOKEN);
    removeSessionParameter(REFRESH_TOKEN);
    removeSessionParameter(REQUEST_PARAMS);
    removeSessionParameter(SCOPE);
    removeSessionParameter(TOKEN_TYPE);
    removeSessionParameter(USERNAME);
};

/**
 * Initialize authenticated user session.
 *
 * @param {TokenResponseInterface} tokenResponse.
 * @param authenticatedUser authenticated user.
 */
export const initUserSession = (tokenResponse: TokenResponseInterface,
                                authenticatedUser: AuthenticatedUserInterface): void => {
    endAuthenticatedSession();
    setSessionParameter(ACCESS_TOKEN, tokenResponse.accessToken);
    setSessionParameter(ACCESS_TOKEN_EXPIRE_IN, tokenResponse.expiresIn);
    setSessionParameter(ACCESS_TOKEN_ISSUED_AT, (Date.now() / 1000).toString());
    setSessionParameter(DISPLAY_NAME, authenticatedUser.displayName);
    setSessionParameter(EMAIL, authenticatedUser.email);
    setSessionParameter(ID_TOKEN, tokenResponse.idToken);
    setSessionParameter(SCOPE, tokenResponse.scope);
    setSessionParameter(REFRESH_TOKEN, tokenResponse.refreshToken);
    setSessionParameter(TOKEN_TYPE, tokenResponse.tokenType);
    setSessionParameter(USERNAME, authenticatedUser.username);
};

/**
 * Get the user session object.
 *
 * @returns {SessionInterface} session object.
 */
export const getAllSessionParameters = (): SessionInterface => {
    return {
        accessToken: getSessionParameter(ACCESS_TOKEN),
        displayName: getSessionParameter(DISPLAY_NAME),
        email: getSessionParameter(EMAIL),
        expiresIn: getSessionParameter(ACCESS_TOKEN_ISSUED_AT),
        idToken: getSessionParameter(ID_TOKEN),
        refreshToken: getSessionParameter(REFRESH_TOKEN),
        scope: getSessionParameter(SCOPE),
        tokenType: getSessionParameter(TOKEN_TYPE),
        username: getSessionParameter(USERNAME)
    };
};

/**
 * Get access token.
 *
 * @returns {Promise<string>} access token.
 */
export const getAccessToken = (): Promise<string> => {
    const accessToken = getSessionParameter(ACCESS_TOKEN);
    const expiresIn = getSessionParameter(ACCESS_TOKEN_EXPIRE_IN);
    const issuedAt = getSessionParameter(ACCESS_TOKEN_ISSUED_AT);

    if (!accessToken || accessToken.trim().length === 0 || !expiresIn || expiresIn.length === 0 || !issuedAt
        || issuedAt.length === 0) {
        endAuthenticatedSession();

        return Promise.reject(new Error("Invalid user session."));
    }

    function getValidityPeriod(): number {
        const currentExpiresIn = getSessionParameter(ACCESS_TOKEN_EXPIRE_IN);
        const currentIssuedAt = getSessionParameter(ACCESS_TOKEN_ISSUED_AT);

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
                return Promise.resolve(getSessionParameter(ACCESS_TOKEN));
            }
        });
    } else {
        return Promise.resolve(accessToken);
    }
};
