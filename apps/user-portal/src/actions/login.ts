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
import {ServiceResourcesEndpoint} from "../configs";
import {createEmptyLoginStatus} from "../models/login";
import {
    clearCodeVerifier,
    getSessionParameter,
    initAuthenticatedSession,
    isValidSession,
    resetAuthenticatedSession,
    retrieveCodeVerifier,
    storeCodeVerifier
} from "./session";
import {getCodeChallenge, getCodeVerifier, getJWKForTheIdToken, verifyIdToken} from "../helpers/crypto";
import {KEYUTIL, KJUR} from "jsrsasign"
import {getTokenRequestHeaders} from "../helpers/http-headers";
import {createEmptySession} from "../models/session";
import {ID_TOKEN} from "../helpers/constants";

/**
 * Handle the user authentication and populate session object.
 *
 * @returns {Promise<any>}
 */
export const dispatchLogin = async () => {

    const code = new URL(window.location.href).searchParams.get("code");
    const loginStatus = createEmptyLoginStatus();

    if (!code) {
        resetAuthenticatedSession();

        // Generate PKCE related parameters.
        let codeVerifier = getCodeVerifier();
        let codeChallenge = getCodeChallenge(codeVerifier);
        storeCodeVerifier(codeVerifier);

        window.location.href = ServiceResourcesEndpoint.authorize + `&code_challenge=` + codeChallenge;
        return;
    }

    if (!isValidSession()) {

        const body = [];
        body.push(`client_id=${CLIENT_ID}`);
        body.push(`code=${code}`);
        body.push("grant_type=authorization_code");
        body.push(`redirect_uri=${LOGIN_CALLBACK_URL}`);
        body.push(`code_verifier=${retrieveCodeVerifier()}`);
        //Clear code verifier from session store.
        clearCodeVerifier();

        return axios
            .post(ServiceResourcesEndpoint.token, body.join("&"), getTokenRequestHeaders())
            .then(tokenResponse => {
                    if (tokenResponse.status !== 200) {
                        throw new Error("Token request failed.");
                    }

                    if (isIdTokenValid(tokenResponse)) {
                        initAuthenticatedSession(populateSessionObject(tokenResponse));
                        return;
                    }
                    throw new Error("Received id_token is invalid.");
                }
            )
            .catch(error => {
                    throw error;
                }
            );
    }
};

/**
 * Handle user logout.
 *
 * @returns {Promise<void>}
 */
export const dispatchLogout = async () => {

    if (isValidSession()) {
        window.location.href = `${ServiceResourcesEndpoint.logout}?id_token_hint=${getSessionParameter(ID_TOKEN)}` +
            `&post_logout_redirect_uri=${LOGIN_CALLBACK_URL}`;
    }

    return;
};

/**
 * Refresh session attributes.
 *
 * @param {string} refreshToken
 * @returns {Promise<SessionInterface | void>}
 */
export const refreshSession = (refreshToken: string) => {

    const body = [];
    body.push(`client_id=${CLIENT_ID}`);
    body.push(`refresh_token=${refreshToken}`);
    body.push("grant_type=refresh_token");

    return axios
        .post(ServiceResourcesEndpoint.token, body.join("&"), getTokenRequestHeaders())
        .then(refreshTokenResponse => {
                if (refreshTokenResponse.status !== 200) {
                    throw new Error("Refresh token request failed.");
                }

                if (isIdTokenValid(refreshTokenResponse)) {
                    initAuthenticatedSession(populateSessionObject(refreshTokenResponse));
                    return;
                }
                throw new Error("Received id_token is invalid.");
            }
        )
        .catch(error => {
                throw error;
            }
        );
};

/**
 * Validate the id_token.
 *
 * @param tokenResponse token response.
 */
export const isIdTokenValid = (tokenResponse) => {

    return axios
        .get(ServiceResourcesEndpoint.jwks)
        .then((jwksResponse) => {
                if (jwksResponse.status !== 200) {
                    throw new Error("Failed to get a response from the JWKS endpoint - " + ServiceResourcesEndpoint.jwks);
                }

                return verifyIdToken(tokenResponse.data.id_token, getJWKForTheIdToken(
                    tokenResponse.data.id_token.split(".")[0], jwksResponse.data.keys));
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
    let session = createEmptySession();
    Object.assign(session, {
        display_name: payload.preferred_username ? payload.preferred_username : payload.sub,
        email: payload.email,
        username: payload.sub,
        access_token: tokenResponse.data.access_token,
        expires_in: tokenResponse.data.expires_in,
        id_token: tokenResponse.data.id_token,
        issued_at: Date.now() / 1000,
        refresh_token: tokenResponse.data.refresh_token
    });
    return session;
};
