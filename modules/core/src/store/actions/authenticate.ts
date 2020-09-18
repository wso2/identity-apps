/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AUTHORIZATION_ENDPOINT, IdentityClient, OIDC_SESSION_IFRAME_ENDPOINT, Storage } from "@wso2is/authentication";
import { setSignOutRequestLoadingStatus, setTokenRevokeRequestLoadingStatus } from "./loaders";
import { getProfileInformation } from "./profile";
import {
    CommonAuthenticateActionTypes,
    ResetAuthenticationActionInterface,
    SetInitializedActionInterface,
    SetSignInActionInterface,
    SetSignOutActionInterface
} from "./types";
import { TokenConstants } from "../../constants";
import { AuthenticatedUserInterface } from "../../models";

/**
 * Redux action to set sign in.
 *
 * @return {SetSignInActionInterface} An action of type `SET_SIGN_IN`
 */
export const setSignIn = (userInfo: AuthenticatedUserInterface): SetSignInActionInterface => ({
    payload: userInfo,
    type: CommonAuthenticateActionTypes.SET_SIGN_IN
});

/**
 * Redux action to set sign out.
 *
 * @return {SetSignOutActionInterface} An action of type `SET_SIGN_OUT`
 */
export const setSignOut = (): SetSignOutActionInterface => ({
    type: CommonAuthenticateActionTypes.SET_SIGN_OUT
});

/**
 * Redux action to set initialized.
 *
 * @return {SetSignOutActionInterface} An action of type `SET_INITIALIZED`.
 */
export const setInitialized = (flag: boolean): SetInitializedActionInterface => ({
    payload: flag,
    type: CommonAuthenticateActionTypes.SET_INITIALIZED
});

/**
 * Redux action to reset authentication.
 *
 * @return {ResetAuthenticationActionInterface} An action of type `RESET_AUTHENTICATION`
 */
export const resetAuthentication = (): ResetAuthenticationActionInterface => ({
    type: CommonAuthenticateActionTypes.RESET_AUTHENTICATION
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
export const handleSignIn = () => (dispatch) => {
    const oAuth = IdentityClient.getInstance();
    oAuth
        .initialize({
            baseUrls: [window["AppUtils"].getConfig().serverOrigin],
            clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
            clientID: window["AppUtils"].getConfig().clientID,
            enablePKCE: true,
            responseMode: process.env.NODE_ENV === "production" ? "form_post" : null,
            scope: [TokenConstants.SYSTEM_SCOPE],
            serverOrigin: window["AppUtils"].getConfig().serverOriginWithTenant,
            signInRedirectURL: window["AppUtils"].getConfig().loginCallbackURL,
            signOutRedirectURL: window["AppUtils"].getConfig().loginCallbackURL,
            storage: Storage.WebWorker
        })
        .then(() => {
            oAuth
                .signIn()
                .then((response) => {
                    dispatch(
                        setSignIn({
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            display_name: response.displayName,
                            email: response.email,
                            scope: response.allowedScopes,
                            username: response.username
                        })
                    );
                    sessionStorage.setItem(AUTHORIZATION_ENDPOINT, response.authorizationEndpoint);
                    sessionStorage.setItem(OIDC_SESSION_IFRAME_ENDPOINT, response.oidcSessionIframe);
                    dispatch(getProfileInformation());
                })
                .catch((error) => {
                    throw error;
                });
        })
        .catch((error) => {
            throw error;
        });
};

/**
 * Redux action to handle user sign-out.
 *
 * @param {string} callbackURL - Login callback URL.
 * @return {(dispatch) => void}
 */
export const handleSignOut = () => (dispatch) => {
    dispatch(setSignOutRequestLoadingStatus(true));

    const oAuth = IdentityClient.getInstance();
    oAuth
        .signOut()
        .then(() => {
            dispatch(setSignOut());
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const oAuth = IdentityClient.getInstance();
    oAuth
        .endUserSession()
        .then(() => {
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
