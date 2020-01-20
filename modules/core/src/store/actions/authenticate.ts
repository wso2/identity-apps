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
    OIDCRequestParamsInterface,
    OPConfigurationUtil,
    SignInUtil,
    SignOutUtil
} from "@wso2is/authentication";
import { AxiosHttpClient, AxiosHttpClientInstance } from "@wso2is/http";
import { CommonServiceResourcesEndpoints } from "../../configs";
import { ContextUtils } from "../../utils";
import {
    setSignOutRequestLoadingStatus,
    setTokenRequestLoadingStatus,
    setTokenRevokeRequestLoadingStatus
} from "./loaders";
import { getProfileInformation } from "./profile";
import {
    AuthenticateActionTypes,
    ResetAuthenticationActionInterface,
    SetSignInActionInterface,
    SetSignOutActionInterface
} from "./types";

/**
 * Get a http client instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient: AxiosHttpClientInstance = AxiosHttpClient.getInstance();

/**
 * Redux action to set sign in.
 *
 * @return {SetSignInActionInterface} An action of type `SET_SIGN_IN`
 */
export const setSignIn = (): SetSignInActionInterface => ({
    type: AuthenticateActionTypes.SET_SIGN_IN
});

/**
 * Redux action to set sign out.
 *
 * @return {SetSignOutActionInterface} An action of type `SET_SIGN_OUT`
 */
export const setSignOut = (): SetSignOutActionInterface => ({
    type: AuthenticateActionTypes.SET_SIGN_OUT
});

/**
 * Redux action to reset authentication.
 *
 * @return {ResetAuthenticationActionInterface} An action of type `RESET_AUTHENTICATION`
 */
export const resetAuthentication = (): ResetAuthenticationActionInterface => ({
    type: AuthenticateActionTypes.RESET_AUTHENTICATION
});

/**
 * Redux action to handle user sign in.
 *
 * @param {string} clientID - Client ID.
 * @param {string} clientHost - Client Host URL.
 * @param {string} redirectURI - URL to be redirected once sign in is successful.
 * @param {string[]} scopes - Required scopes array.
 * @param {boolean} consentDenied - Flag to determine if the consent has been given to the application.
 * @return {(dispatch) => void}
 */
export const handleSignIn = (clientID: string,
                             clientHost: string,
                             redirectURI: string,
                             scopes: string[],
                             consentDenied: boolean = false) => (dispatch) => {

    const serverHost: string = ContextUtils.getRuntimeConfig().serverHost;

    const sendSignInRequest = () => {

        const tokenRequestParams: OIDCRequestParamsInterface = {
            clientHost,
            clientId: clientID,
            clientSecret: null,
            enablePKCE: true,
            redirectUri: redirectURI,
            scope: scopes
        };

        if (consentDenied) {
            tokenRequestParams.prompt = "login";
        }

        if (SignInUtil.hasAuthorizationCode()) {

            dispatch(setTokenRequestLoadingStatus(true));

            SignInUtil.sendTokenRequest(tokenRequestParams)
                .then((response) => {
                    AuthenticateSessionUtil.initUserSession(
                        response,
                        SignInUtil.getAuthenticatedUser(response.idToken)
                    );
                    dispatch(setSignIn());
                    dispatch(getProfileInformation());
                })
                .catch((error) => {
                    throw error;
                })
                .finally(() => {
                    dispatch(setTokenRequestLoadingStatus(false));
                });
        } else {
            SignInUtil.sendAuthorizationRequest(tokenRequestParams);
        }
    };

    if (AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.ACCESS_TOKEN)) {
        dispatch(setSignIn());
        dispatch(getProfileInformation());
    } else {
        OPConfigurationUtil.initOPConfiguration(CommonServiceResourcesEndpoints(serverHost).wellKnown, false)
            .then(() => {
                sendSignInRequest();
            })
            .catch(() => {
                OPConfigurationUtil.setAuthorizeEndpoint(CommonServiceResourcesEndpoints(serverHost).authorize);
                OPConfigurationUtil.setTokenEndpoint(CommonServiceResourcesEndpoints(serverHost).token);
                OPConfigurationUtil.setRevokeTokenEndpoint(CommonServiceResourcesEndpoints(serverHost).revoke);
                OPConfigurationUtil.setEndSessionEndpoint(CommonServiceResourcesEndpoints(serverHost).logout);
                OPConfigurationUtil.setJwksUri(CommonServiceResourcesEndpoints(serverHost).jwks);
                OPConfigurationUtil.setOPConfigInitiated();

                sendSignInRequest();
            });
    }
};

/**
 * Redux action to handle user sign-out.
 *
 * @param {string} callbackURL - Login callback URL.
 * @return {(dispatch) => void}
 */
export const handleSignOut = (callbackURL: string) => (dispatch) => {

    dispatch(setSignOutRequestLoadingStatus(true));

    SignOutUtil.sendSignOutRequest(callbackURL)
        .then(() => {
            dispatch(setSignOut());
            AuthenticateSessionUtil.endAuthenticatedSession();
            OPConfigurationUtil.resetOPConfiguration();
        })
        .catch((error) => {
            // TODO: show error page
        })
        .finally(() => {
            dispatch(setSignOutRequestLoadingStatus(false));
        });
};

/**
 * Redux action to end the authenticated user session.
 * This will clear the session related information and sign out from the session.
 *
 * @param {() => void} onSuccess - Callback to be fired on successful session end.
 * @param {(error: Error) => void} onError - Callback to be fired on session end error.
 */
export const endUserSession = (onSuccess: () => void, onError: (error: Error) => void) => (dispatch) => {

    dispatch(setTokenRevokeRequestLoadingStatus(true));

    SignInUtil.sendRevokeTokenRequest(
        JSON.parse(AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.REQUEST_PARAMS)),
        AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.ACCESS_TOKEN)
    )
        .then(() => {
            // Clear out the session info.
            AuthenticateSessionUtil.endAuthenticatedSession();
            OPConfigurationUtil.resetOPConfiguration();

            // Fire the on success callback.
            onSuccess();
        })
        .catch((error) => {
            // Fire the on error callback.
            onError(error);
        })
        .finally(() => {
            dispatch(setTokenRevokeRequestLoadingStatus(false));
        });
};
