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
    AUTHORIZATION_ENDPOINT,
    IdentityClient,
    OIDC_SESSION_IFRAME_ENDPOINT,
    ServiceResourcesType,
    Storage,
    TOKEN_ENDPOINT
} from "@wso2is/authentication";
import { TokenConstants } from "@wso2is/core/constants";
import { I18n } from "@wso2is/i18n";
import _ from "lodash";
import { getProfileLinkedAccounts } from ".";
import { addAlert } from "./global";
import { setProfileInfoLoader, setProfileSchemaLoader } from "./loaders";
import { AuthAction, authenticateActionTypes } from "./types";
import {
    getProfileInfo,
    getProfileSchemas,
    getUserReadOnlyStatus,
    switchAccount
}from "../../api";
import { history } from "../../helpers";
import {
    AlertLevels,
    AuthenticatedUserInterface,
    BasicProfileInterface,
    LinkedAccountInterface,
    ProfileSchema,
    ReadOnlyUserStatus
} from "../../models";
import {
    getProfileCompletion,
    onHttpRequestError,
    onHttpRequestFinish,
    onHttpRequestStart,
    onHttpRequestSuccess
} from "../../utils";
import { store } from "../index";

/**
 * Dispatches an action of type `SET_SIGN_IN`.
 */
export const setSignIn = (userInfo: AuthenticatedUserInterface): AuthAction => ({
    payload: userInfo,
    type: authenticateActionTypes.SET_SIGN_IN
});

/**
 * Dispatches an action of type `SET_SIGN_OUT`.
 */
export const setSignOut = (): AuthAction => ({
    type: authenticateActionTypes.SET_SIGN_OUT
});

/**
 * Dispatches an action of type `RESET_AUTHENTICATION`.
 */
export const resetAuthentication = (): AuthAction => ({
    type: authenticateActionTypes.RESET_AUTHENTICATION
});

/**
 * Dispatches an action of type `SET_PROFILE_INFO`.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const setProfileInfo = (details: any): AuthAction => ({
    payload: details,
    type: authenticateActionTypes.SET_PROFILE_INFO
});

/**
 * Dispatches an action of type `SET_SCHEMAS`
 * @param schemas
 */
export const setScimSchemas = (schemas: ProfileSchema[]): AuthAction => ({
    payload: schemas,
    type: authenticateActionTypes.SET_SCHEMAS
});

/**
 * Get SCIM2 schemas
 */
export const getScimSchemas = (profileInfo: BasicProfileInterface = null) => (dispatch): void => {
    dispatch(setProfileSchemaLoader(true));

    getProfileSchemas()
        .then((response: ProfileSchema[]) => {
            dispatch(setProfileSchemaLoader(false));
            dispatch(setScimSchemas(response));

            if (profileInfo) {
                dispatch(getProfileCompletion(profileInfo, response));
            }
        })
        .catch(() => {
            // TODO: show error page
        });
};

/**
 *  Gets profile information by making an API call
 */
export const getProfileInformation = (updateProfileCompletion = false) => (dispatch): void => {
    let isCompletionCalculated = false;

    dispatch(setProfileInfoLoader(true));

    getUserReadOnlyStatus()
        .then((response: ReadOnlyUserStatus) => {
            // Get the profile info
            getProfileInfo()
                .then((infoResponse) => {
                    if (infoResponse.responseStatus === 200) {
                        dispatch(
                            setProfileInfo({
                                ...infoResponse,
                                isReadOnly:
                                    response["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"]
                                        ?.isReadOnlyUser
                            })
                        );

                        // If the schemas in the redux store is empty, fetch the SCIM schemas from the API.
                        if (_.isEmpty(store.getState().authenticationInformation.profileSchemas)) {
                            isCompletionCalculated = true;
                            dispatch(getScimSchemas(infoResponse));
                        }

                        // If `updateProfileCompletion` flag is enabled, update the profile completion.
                        if (updateProfileCompletion && !isCompletionCalculated) {
                            getProfileCompletion(
                                infoResponse,
                                store.getState().authenticationInformation.profileSchemas
                            );
                        }

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "views:components.profile.notifications.getProfileInfo.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t(
                                "views:components.profile.notifications.getProfileInfo.genericError.message"
                            )
                        })
                    );
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.detail) {
                        dispatch(
                            addAlert({
                                description: I18n.instance.t(
                                    "views:components.profile.notifications.getProfileInfo.error.description",
                                    { description: error.response.data.detail }
                                ),
                                level: AlertLevels.ERROR,
                                message: I18n.instance.t(
                                    "views:components.profile.notifications.getProfileInfo.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "views:components.profile.notifications.getProfileInfo.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t(
                                "views:components.profile.notifications.getProfileInfo.genericError.message"
                            )
                        })
                    );
                })
                .finally(() => {
                    dispatch(setProfileInfoLoader(false));
                });
        })
        .catch((error) => {
            dispatch(
                addAlert({
                    description:
                        error?.description ??
                        I18n.instance.t(
                            "userPortal:components.profile.notifications.getUserReadOnlyStatus.genericError.description"
                        ),
                    level: AlertLevels.ERROR,
                    message:
                        error?.message ??
                        I18n.instance.t(
                            "userPortal:components.profile.notifications.getUserReadOnlyStatus.genericError.message"
                        )
                })
            );
        });
};

export const initializeAuthentication = () =>(dispatch)=> {
    const auth = IdentityClient.getInstance();

    auth.on("http-request-error", onHttpRequestError);
    auth.on("http-request-finish", onHttpRequestFinish);
    auth.on("http-request-start", onHttpRequestStart);
    auth.on("http-request-success", onHttpRequestSuccess);

    auth
        .initialize({
            baseUrls: [ window[ "AppUtils" ].getConfig().serverOrigin ],
            callbackURL: window[ "AppUtils" ].getConfig().loginCallbackURL,
            clientHost: window[ "AppUtils" ].getConfig().clientOriginWithTenant,
            clientID: window[ "AppUtils" ].getConfig().clientID,
            enablePKCE: true,
            responseMode: process.env.NODE_ENV === "production" ? "form_post" : null,
            scope: [ TokenConstants.SYSTEM_SCOPE ],
            serverOrigin: window[ "AppUtils" ].getConfig().serverOriginWithTenant,
            storage: Storage.WebWorker
        });
    auth.on("sign-in", (response) => {
        dispatch(
            setSignIn({
                // eslint-disable-next-line @typescript-eslint/camelcase
                display_name: response.displayName,
                email: response.email,
                scope: response.allowedScopes,
                username: response.username
            })
        );

        auth
            .getServiceEndpoints()
            .then((response: ServiceResourcesType) => {
                sessionStorage.setItem(AUTHORIZATION_ENDPOINT, response.authorize);
                sessionStorage.setItem(OIDC_SESSION_IFRAME_ENDPOINT, response.oidcSessionIFrame);
                sessionStorage.setItem(TOKEN_ENDPOINT, response.token);
            })
            .catch((error) => {
                throw error;
            });

        dispatch(getProfileInformation());
    });
}

/**
 * Handle user sign-in
 */
export const handleSignIn = () =>{
    const auth = IdentityClient.getInstance();
    auth.signIn();
};

/**
 * Handle user sign-out
 */
export const handleSignOut = () => (dispatch) => {
    const auth = IdentityClient.getInstance();
    auth
        .signOut()
        .then(() => {
            dispatch(setSignOut());
        })
        .catch(() => {
            history.push(store?.getState()?.config?.deployment?.appLoginPath);
        });
};

/**
 * Handles account switching.
 *
 * @param {LinkedAccountInterface} account Info about the the account to switch to.
 *
 * @returns {(dispatch)=>void} A function that accepts dispatch as an argument.
 */
export const handleAccountSwitching = (account: LinkedAccountInterface) => (dispatch) => {
    switchAccount(account)
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

            dispatch(getProfileInformation());
            dispatch(getProfileLinkedAccounts());
        })
        .catch((error) => {
            throw error;
        });
};
