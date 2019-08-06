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
import {ServiceResourcesEndpoint} from "../configs/app";
import {createEmptyLoginStatus} from "../models/login";
import {
    clearCodeVerifier,
    clearLoginSession,
    getLoginSession,
    initLoginSession,
    isLoggedSession,
    retrieveCodeVerifier,
    storeCodeVerifier
} from "./session";
import {getCodeChallenge, getCodeVerifier, getJWKForTheIdToken, verifyIdToken} from "../helpers/crypto";
import {KEYUTIL, KJUR} from "jsrsasign"

export const dispatchLogin = async () => {
    const code = new URL(window.location.href).searchParams.get("code");
    const loginStatus = createEmptyLoginStatus();

    if (!code) {
        clearLoginSession();

        // Generate PKCE related parameters.
        let codeVerifier = getCodeVerifier();
        let codeChallenge = getCodeChallenge(codeVerifier);
        storeCodeVerifier(codeVerifier);

        window.location.href = ServiceResourcesEndpoint.authorize + `&code_challenge=` + codeChallenge;
    } else {
        if (!isLoggedSession()) {
            const header = {
                headers: {
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": CLIENT_HOST,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            const body = [];

            body.push(`client_id=${CLIENT_ID}`);
            body.push(`code=${code}`);
            body.push("grant_type=authorization_code");
            body.push(`redirect_uri=${LOGIN_CALLBACK_URL}`);
            body.push(`code_verifier=${retrieveCodeVerifier()}`);
            //Clear code verifier from session store.
            clearCodeVerifier();

            return new Promise((resolve, reject) => {
                axios.post(ServiceResourcesEndpoint.token, body.join("&"), header)
                    .then((endpointResponse) => {
                        if (endpointResponse.status === 200) {

                            axios.get(ServiceResourcesEndpoint.jwks).then((jwksResponse) => {
                                if (jwksResponse.status == 200) {

                                    let valid = verifyIdToken(endpointResponse.data.id_token, getJWKForTheIdToken(
                                        endpointResponse.data.id_token.split(".")[0], jwksResponse.data.keys));
                                    if(!valid) {
                                        reject(new Error("Received id_token is invalid."));
                                        return;
                                    }

                                    const payload = JSON.parse(atob(endpointResponse.data.id_token.split(".")[1]));
                                    Object.assign(loginStatus, {
                                        access_token: endpointResponse.data.access_token,
                                        authenticated_user: payload.sub,
                                        display_name: payload.preferred_username,
                                        emails: payload.email,
                                        id_token: endpointResponse.data.id_token,
                                        login_status: "valid",
                                        refresh_token: endpointResponse.data.refresh_token,
                                        username: payload.sub,
                                    });
                                    initLoginSession(loginStatus);
                                    resolve(loginStatus);
                                }
                            }).catch((error) => {
                                reject(error);
                            });
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }

    }

    return;
};

export const dispatchLogout = async () => {
    if (isLoggedSession()) {
        window.location.href = `${ServiceResourcesEndpoint.logout}?id_token_hint=${getLoginSession("id_token")}` +
            `&post_logout_redirect_uri=${LOGIN_CALLBACK_URL}`;
    }

    return;
};
