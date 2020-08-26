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
    Storage,
    TOKEN_TYPE,
    USERNAME
} from "../constants";
import {
    AuthenticatedUserInterface,
    ConfigInterface,
    SessionInterface,
    TokenResponseInterface,
    WebWorkerConfigInterface
} from "../models";

/**
 * Semaphore used for synchronizing the refresh token requests.
 */
const semaphore = new Semaphore(1);

/**
 * Remove parameter from session storage.
 *
 * @param {string} key.
 */
export function removeSessionParameter(key: string, requestParams: ConfigInterface | WebWorkerConfigInterface): void {
    switch (requestParams.storage) {
        case Storage.WebWorker:
            requestParams.session.delete(key);
            break;
        case Storage.SessionStorage:
            sessionStorage.removeItem(key);
            break;
        case Storage.LocalStorage:
            localStorage.removeItem(key);
            break;
        default:
            sessionStorage.removeItem(key);
    }
}

/**
 * Set parameter to session storage.
 *
 * @param {string} key.
 * @param value value.
 */
export function setSessionParameter(
    key: string,
    value: string,
    requestParams: ConfigInterface | WebWorkerConfigInterface
): void {
    switch (requestParams.storage) {
        case Storage.WebWorker:
            requestParams.session.set(key, value);
            break;
        case Storage.SessionStorage:
            sessionStorage.setItem(key, value);
            break;
        case Storage.LocalStorage:
            localStorage.setItem(key, value);
            break;
        default:
            sessionStorage.setItem(key, value);
    }
}

/**
 * Get parameter from session storage.
 *
 * @param {string} key.
 * @returns {string | null} parameter value or null.
 */
export function getSessionParameter(
    key: string,
    requestParams: ConfigInterface | WebWorkerConfigInterface
): string | null {
    switch (requestParams.storage) {
        case Storage.WebWorker:
            return requestParams.session.get(key);
        case Storage.SessionStorage:
            return sessionStorage.getItem(key);
        case Storage.LocalStorage:
            return localStorage.getItem(key);
        default:
            return sessionStorage.getItem(key);
    }
}

/**
 * End authenticated user session.
 */
export function endAuthenticatedSession(requestParams: ConfigInterface | WebWorkerConfigInterface): void {
    removeSessionParameter(ACCESS_TOKEN, requestParams);
    removeSessionParameter(ACCESS_TOKEN_EXPIRE_IN, requestParams);
    removeSessionParameter(ACCESS_TOKEN_ISSUED_AT, requestParams);
    removeSessionParameter(DISPLAY_NAME, requestParams);
    removeSessionParameter(EMAIL, requestParams);
    removeSessionParameter(ID_TOKEN, requestParams);
    removeSessionParameter(REFRESH_TOKEN, requestParams);
    removeSessionParameter(SCOPE, requestParams);
    removeSessionParameter(TOKEN_TYPE, requestParams);
    removeSessionParameter(USERNAME, requestParams);
}

/**
 * Initialize authenticated user session.
 *
 * @param {TokenResponseInterface} tokenResponse.
 * @param authenticatedUser authenticated user.
 */
export function initUserSession(
    tokenResponse: TokenResponseInterface,
    authenticatedUser: AuthenticatedUserInterface,
    requestParams: ConfigInterface | WebWorkerConfigInterface
): void {
    endAuthenticatedSession(requestParams);
    setSessionParameter(ACCESS_TOKEN, tokenResponse.accessToken, requestParams);
    setSessionParameter(ACCESS_TOKEN_EXPIRE_IN, tokenResponse.expiresIn, requestParams);
    setSessionParameter(ACCESS_TOKEN_ISSUED_AT, (Date.now() / 1000).toString(), requestParams);
    setSessionParameter(DISPLAY_NAME, authenticatedUser.displayName, requestParams);
    setSessionParameter(EMAIL, authenticatedUser.email, requestParams);
    setSessionParameter(ID_TOKEN, tokenResponse.idToken, requestParams);
    setSessionParameter(SCOPE, tokenResponse.scope, requestParams);
    setSessionParameter(REFRESH_TOKEN, tokenResponse.refreshToken, requestParams);
    setSessionParameter(TOKEN_TYPE, tokenResponse.tokenType, requestParams);
    setSessionParameter(USERNAME, authenticatedUser.username, requestParams);
}

/**
 * Get the user session object.
 *
 * @returns {SessionInterface} session object.
 */
export function getAllSessionParameters(requestParams: ConfigInterface | WebWorkerConfigInterface): SessionInterface {
    return {
        accessToken: getSessionParameter(ACCESS_TOKEN, requestParams),
        displayName: getSessionParameter(DISPLAY_NAME, requestParams),
        email: getSessionParameter(EMAIL, requestParams),
        expiresIn: getSessionParameter(ACCESS_TOKEN_ISSUED_AT, requestParams),
        idToken: getSessionParameter(ID_TOKEN, requestParams),
        refreshToken: getSessionParameter(REFRESH_TOKEN, requestParams),
        scope: getSessionParameter(SCOPE, requestParams),
        tokenType: getSessionParameter(TOKEN_TYPE, requestParams),
        username: getSessionParameter(USERNAME, requestParams)
    };
}

/**
 * Get access token.
 *
 * @returns {Promise<string>} access token.
 */
export function getAccessToken(requestParams: ConfigInterface | WebWorkerConfigInterface): Promise<string> {
    const accessToken = getSessionParameter(ACCESS_TOKEN, requestParams);
    const expiresIn = getSessionParameter(ACCESS_TOKEN_EXPIRE_IN, requestParams);
    const issuedAt = getSessionParameter(ACCESS_TOKEN_ISSUED_AT, requestParams);

    if (
        !accessToken ||
        accessToken.trim().length === 0 ||
        !expiresIn ||
        expiresIn.length === 0 ||
        !issuedAt ||
        issuedAt.length === 0
    ) {
        endAuthenticatedSession(requestParams);

        return Promise.reject(new Error("Invalid user session."));
    }

    function getValidityPeriod(): number {
        const currentExpiresIn = getSessionParameter(ACCESS_TOKEN_EXPIRE_IN, requestParams);
        const currentIssuedAt = getSessionParameter(ACCESS_TOKEN_ISSUED_AT, requestParams);

        return parseInt(currentIssuedAt, 10) + parseInt(currentExpiresIn, 10) - Math.floor(Date.now() / 1000);
    }

    let validityPeriod = getValidityPeriod();

    if (validityPeriod <= 300) {
        return semaphore.use(() => {
            validityPeriod = getValidityPeriod();
            if (validityPeriod <= 300) {
                const requestParameters = JSON.parse(getSessionParameter(REQUEST_PARAMS, requestParams));
                return sendRefreshTokenRequest(requestParameters, getSessionParameter(REFRESH_TOKEN, requestParams))
                    .then((tokenResponse) => {
                        const authenticatedUser = getAuthenticatedUser(tokenResponse.idToken);
                        initUserSession(tokenResponse, authenticatedUser, requestParams);
                        return Promise.resolve(tokenResponse.accessToken);
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    });
            } else {
                return Promise.resolve(getSessionParameter(ACCESS_TOKEN, requestParams));
            }
        });
    } else {
        return Promise.resolve(accessToken);
    }
}
