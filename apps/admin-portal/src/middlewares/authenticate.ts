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

import {
    AuthenticateSessionUtil,
    AuthenticateTokenKeys,
    OPConfigurationUtil,
    SignInUtil,
    SignOutUtil
} from "@wso2is/authentication";
import { setSignIn, setSignOut } from "../actions";
import { ServiceResourcesEndpoint } from "../configs";
import history from "../helpers/history";

/**
 * Handle user signout
 *
 * @param {object} state - AuthContext state object.
 * @param {function} dispatch - State update `dispatch` react hook for AuthContext.
 */
export const handleSignIn = (state, dispatch) => {
    const loginSuccessRedirect = () => {
        const AuthenticationCallbackUrl = getAuthenticationCallbackUrl();
        const location = ((!AuthenticationCallbackUrl)
            || (AuthenticationCallbackUrl === APP_LOGIN_PATH)) ? APP_HOME_PATH : AuthenticationCallbackUrl;

        history.push(location);
    };

    const sendSignInRequest = () => {
        const requestParams = {
            clientHost: CLIENT_HOST,
            clientId: CLIENT_ID,
            clientSecret: null,
            enablePKCE: true,
            redirectUri: LOGIN_CALLBACK_URL,
            scope: null,
        };
        if (SignInUtil.hasAuthorizationCode()) {
            SignInUtil.sendTokenRequest(requestParams)
                .then((response) => {
                    AuthenticateSessionUtil.initUserSession(response,
                        SignInUtil.getAuthenticatedUser(response.idToken));
                    dispatch(setSignIn());
                    loginSuccessRedirect();
                }).catch((error) => {
                    throw error;
                });
        } else {
            SignInUtil.sendAuthorizationRequest(requestParams);
        }
    };

    if (AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.ACCESS_TOKEN)) {
        dispatch(setSignIn());
        loginSuccessRedirect();
    } else {
        OPConfigurationUtil.initOPConfiguration(ServiceResourcesEndpoint.wellKnown, false)
            .then(() => {
                sendSignInRequest();
            }).catch(() => {
                OPConfigurationUtil.setAuthorizeEndpoint(ServiceResourcesEndpoint.authorize);
                OPConfigurationUtil.setTokenEndpoint(ServiceResourcesEndpoint.token);
                OPConfigurationUtil.setRevokeTokenEndpoint(ServiceResourcesEndpoint.revoke);
                OPConfigurationUtil.setEndSessionEndpoint(ServiceResourcesEndpoint.logout);
                OPConfigurationUtil.setJwksUri(ServiceResourcesEndpoint.jwks);
                OPConfigurationUtil.setOPConfigInitiated();

                sendSignInRequest();
            });
    }
};

/**
 * Handle user signout
 *
 * @param {object} state - AuthContext state object.
 * @param {function} dispatch - State update `dispatch` react hook for AuthContext.
 */
export const handleSignOut = (state, dispatch) => {
    if (!state.logoutInit) {
        SignOutUtil.sendSignOutRequest(LOGIN_CALLBACK_URL).then(() => {
            dispatch(setSignOut());
            AuthenticateSessionUtil.endAuthenticatedSession();
            OPConfigurationUtil.resetOPConfiguration();
        }).catch(
            // TODO show error page.
        );
    } else {
        history.push(APP_LOGIN_PATH);
    }
};

/**
 * Update sessionStorage with location history path
 *
 * @param {string} location - history path.
 */
export const updateAuthenticationCallbackUrl = (location) => {
    window.sessionStorage.setItem("auth_callback_url", location);
};

/**
 * Get location history path from sessionStorage
 *
 * @return {string} location - history path.
 */
export const getAuthenticationCallbackUrl = () => {
    return window.sessionStorage.getItem("auth_callback_url");
};
