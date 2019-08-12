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

import { AuthenticateCryptoUtil, AuthenticateSessionUtil, AuthenticateTokenKeys } from "@wso2is/authenticate";
import axios from "axios";
import { ServiceResourcesEndpoint } from "../configs";

/**
 * Handle the user authentication and populate session object.
 *
 * @returns {Promise<any>}
 */
export const dispatchLogin = (): Promise<any> => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
        AuthenticateSessionUtil.resetAuthenticatedSession();

        // Generate PKCE related parameters.
        const codeVerifier = AuthenticateCryptoUtil.getCodeVerifier();
        const codeChallenge = AuthenticateCryptoUtil.getCodeChallenge(codeVerifier);
        AuthenticateSessionUtil.storeCodeVerifier(codeVerifier);

        window.location.href = ServiceResourcesEndpoint.authorize + `&code_challenge=` + codeChallenge;

        return null;
    }

    if (!AuthenticateSessionUtil.isValidSession(CLIENT_ID, CLIENT_HOST)) {
        const body = [];
        body.push(`client_id=${CLIENT_ID}`);
        body.push(`code=${code}`);
        body.push("grant_type=authorization_code");
        body.push(`redirect_uri=${LOGIN_CALLBACK_URL}`);
        body.push(`code_verifier=${AuthenticateSessionUtil.retrieveCodeVerifier()}`);

        // Clear code verifier from session store.
        AuthenticateSessionUtil.clearCodeVerifier();

        return axios.post(
            ServiceResourcesEndpoint.token,
            body.join("&"),
            AuthenticateSessionUtil.getTokenRequestHeaders(CLIENT_HOST))
            .then((tokenResponse) => {
                    if (tokenResponse.status !== 200) {
                        return Promise.reject("Token request failed.");
                    }

                    if (AuthenticateSessionUtil.isIdTokenValid(tokenResponse, CLIENT_ID)) {
                        return Promise.resolve(
                            AuthenticateSessionUtil.initAuthenticatedSession(
                                AuthenticateSessionUtil.populateSessionObject(tokenResponse)
                            )
                        );
                    }

                    return Promise.reject("Received id_token is invalid.");
                }
            )
            .catch((error) => {
                return Promise.reject(error);
            });
    }
};

/**
 * Handle user logout.
 *
 * @returns {}
 */
export const dispatchLogout = async () => {
    if (AuthenticateSessionUtil.isValidSession(CLIENT_ID, CLIENT_HOST)) {
        window.location.href = `${ServiceResourcesEndpoint.logout}?` +
            `id_token_hint=${AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.ID_TOKEN)}` +
            `&post_logout_redirect_uri=${LOGIN_CALLBACK_URL}`;
    }

    return;
};
