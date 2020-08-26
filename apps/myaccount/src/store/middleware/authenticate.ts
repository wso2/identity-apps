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
import { getAssociations, getProfileInfo } from "../../api";
import * as TokenConstants from "../../constants/token-constants";
import { history } from "../../helpers";
import { setProfileInfo, setSignIn, setSignOut } from "../actions";
import { store } from "../index";

/**
 * Get location history path from sessionStorage
 *
 * @return {string} location - history path.
 */
export const getAuthenticationCallbackUrl = (): string => {
    return window.sessionStorage.getItem("auth_callback_url");
};

/**
 * Handle user sign-out
 *
 * @param {object} state - AuthContext state object.
 * @param {function} dispatch - State update `dispatch` react hook for AuthContext.
 */
export const handleSignIn = (state, dispatch): void => {
    const loginSuccessRedirect = (): void => {
        const AuthenticationCallbackUrl = getAuthenticationCallbackUrl();
        const location = ((!AuthenticationCallbackUrl)
            || (AuthenticationCallbackUrl === store.getState().config.deployment.appLoginPath)) ?
            store.getState().config.deployment.appHomePath : AuthenticationCallbackUrl;

        history.push(location);
    };

    /**
     * Get profile info and associations from the API
     * to set the associations in the context.
     */
    const setProfileDetails = (): void => {
        getProfileInfo()
            .then((infoResponse) => {
                getAssociations()
                    .then((associationsResponse) => {
                        dispatch(setProfileInfo({
                            ...infoResponse,
                            associations: associationsResponse
                        }));
                    });
            });
    };

    const sendSignInRequest = (): void => {
        /*  const requestParams = {
            clientHost: store.getState().config.deployment.clientHost,
            clientId: store.getState().config.deployment.clientID,
            clientSecret: null,
            enablePKCE: true,
            redirectUri: store.getState().config.deployment.loginCallbackUrl,
            scope: [ TokenConstants.LOGIN_SCOPE, TokenConstants.HUMAN_TASK_SCOPE ],
            serverOrigin: store.getState().config.deployment.serverOrigin
        };
        if (SignInUtil.hasAuthorizationCode()) {
            SignInUtil.sendTokenRequest(requestParams)
                .then((response) => {
                    AuthenticateSessionUtil.initUserSession(response,
                        SignInUtil.getAuthenticatedUser(response.idToken));
                    dispatch(setSignIn(null));
                    setProfileDetails();
                    loginSuccessRedirect();
                }).catch((error) => {
                    throw error;
                });
        } else {
            AuthenticateSessionUtil.endAuthenticatedSession();
            OPConfigurationUtil.resetOPConfiguration();
            SignInUtil.sendAuthorizationRequest(requestParams);
        } */
    };
    /*
    if (AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.ACCESS_TOKEN)) {
        dispatch(setSignIn(null));
        setProfileDetails();
        loginSuccessRedirect();
    } else {
        OPConfigurationUtil.initOPConfiguration(store.getState().config.endpoints.wellKnown, false)
            .then(() => {
                sendSignInRequest();
            }).catch(() => {
                OPConfigurationUtil.setAuthorizeEndpoint(store.getState().config.endpoints.authorize);
                OPConfigurationUtil.setTokenEndpoint(store.getState().config.endpoints.token);
                OPConfigurationUtil.setRevokeTokenEndpoint(store.getState().config.endpoints.revoke);
                OPConfigurationUtil.setEndSessionEndpoint(store.getState().config.endpoints.logout);
                OPConfigurationUtil.setJwksUri(store.getState().config.endpoints.jwks);
                OPConfigurationUtil.setIssuer(store.getState().config.endpoints.issuer);
                OPConfigurationUtil.setOPConfigInitiated();

                sendSignInRequest();
            });
    } */
};

/**
 * Handle user sign-out
 *
 * @param {object} state - AuthContext state object.
 * @param {function} dispatch - State update `dispatch` react hook for AuthContext.
 */
export const handleSignOut = (state, dispatch): void => {
    /*  if (!state.logoutInit) {
        SignOutUtil.sendSignOutRequest(store.getState().config.deployment.loginCallbackUrl).then(() => {
            dispatch(setSignOut());
            AuthenticateSessionUtil.endAuthenticatedSession();
            OPConfigurationUtil.resetOPConfiguration();
        }).catch(
            // TODO show error page.
        );
    } else {
        history.push(store.getState().config.deployment.appLoginPath);
    } */
};
