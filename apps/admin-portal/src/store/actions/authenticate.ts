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

import {
    AuthenticateSessionUtil,
    AuthenticateTokenKeys,
    OIDCRequestParamsInterface,
    OPConfigurationUtil,
    SignInUtil,
    SignOutUtil
} from "@wso2is/authentication";
import _ from "lodash";
import { getProfileInfo, getProfileSchemas } from "../../api";
import { GlobalConfig, i18n, ServiceResourcesEndpoint } from "../../configs";
import * as TokenConstants from "../../constants";
import { history } from "../../helpers";
import { AlertLevels, ProfileSchema } from "../../models";
import { store } from "../index";
import { addAlert } from "./global";
import { setProfileInfoLoader, setProfileSchemaLoader } from "./loaders";
import { authenticateActionTypes, AuthAction } from "./types";

/**
 * Dispatches an action of type `SET_SIGN_IN`.
 */
export const setSignIn = (): AuthAction => ({
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
export const getScimSchemas = () => (dispatch): void => {
    dispatch(setProfileSchemaLoader(true));
    getProfileSchemas()
        .then((response: ProfileSchema[]) => {
            dispatch(setProfileSchemaLoader(false));
            dispatch(setScimSchemas(response));
        });
};

/**
 *  Gets profile information by making an API call
 */
export const getProfileInformation = () => (dispatch): void => {

    dispatch(setProfileInfoLoader(true));

    // Get the profile info
    getProfileInfo()
        .then((infoResponse) => {
            if (infoResponse.responseStatus === 200) {
                dispatch(
                    setProfileInfo({
                        ...infoResponse
                    })
                );

                // If the schemas in the redux store is empty, fetch the SCIM schemas from the API.
                if (_.isEmpty(store.getState().authenticationInformation.profileSchemas)) {
                    dispatch(getScimSchemas());
                }

                return;
            }

            dispatch(
                addAlert({
                    description: i18n.t(
                        "views:components.profile.notifications.getProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: i18n.t(
                        "views:components.profile.notifications.getProfileInfo.genericError.message"
                    )
                })
            );
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.detail) {
                dispatch(
                    addAlert({
                        description: i18n.t(
                            "views:components.profile.notifications.getProfileInfo.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: i18n.t(
                            "views:components.profile.notifications.getProfileInfo.error.message"
                        )
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: i18n.t(
                        "views:components.profile.notifications.getProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: i18n.t(
                        "views:components.profile.notifications.getProfileInfo.genericError.message"
                    )
                })
            );
        })
        .finally(() => {
            dispatch(setProfileInfoLoader(false));
        });
};


/**
 * Handle user sign-out
 */
export const handleSignOut = () => (dispatch): void => {
    if (sessionStorage.length === 0) {
        history.push(GlobalConfig.appLoginPath);
    } else {
        SignOutUtil.sendSignOutRequest(GlobalConfig.loginCallbackUrl, () => {
                dispatch(setSignOut());
                AuthenticateSessionUtil.endAuthenticatedSession();
                OPConfigurationUtil.resetOPConfiguration();
            }).catch(() => {
                history.push(GlobalConfig.appLoginPath);
            });
    }
};

/**
 * Handle user sign-in
 */
export const handleSignIn = (consentDenied = false) => (dispatch): void => {
    const requestParams: OIDCRequestParamsInterface = {
        clientHost: GlobalConfig.clientHost,
        clientId: GlobalConfig.clientID,
        clientSecret: null,
        enablePKCE: true,
        redirectUri: GlobalConfig.loginCallbackUrl,
        scope: [TokenConstants.LOGIN_SCOPE, TokenConstants.INTERNAL_IDENTITY_MGT.INTERNAL_IDENTITY_MGT_VIEW,
            TokenConstants.INTERNAL_IDENTITY_MGT.INTERNAL_IDENTITY_MGT_UPDATE,
            TokenConstants.INTERNAL_IDENTITY_MGT.INTERNAL_IDENTITY_MGT_DELETE,
            TokenConstants.INTERNAL_IDENTITY_MGT.INTERNAL_IDENTITY_MGT_CREATE,
            TokenConstants.INTERNAL_USER_MGT.INTERNAL_USER_MGT_VIEW,
            TokenConstants.INTERNAL_USER_MGT.INTERNAL_USER_MGT_UPDATE,
            TokenConstants.INTERNAL_USER_MGT.INTERNAL_USER_MGT_DELETE,
            TokenConstants.INTERNAL_USER_MGT.INTERNAL_USER_MGT_LIST,
            TokenConstants.INTERNAL_USER_MGT.INTERNAL_USER_MGT_CREATE,
            TokenConstants.INTERNAL_ROLE_MGT.INTERNAL_ROLE_MGT_VIEW,
            TokenConstants.INTERNAL_ROLE_MGT.INTERNAL_ROLE_MGT_UPDATE,
            TokenConstants.INTERNAL_ROLE_MGT.INTERNAL_ROLE_MGT_DELETE,
            TokenConstants.INTERNAL_ROLE_MGT.INTERNAL_ROLE_MGT_LIST,
            TokenConstants.INTERNAL_ROLE_MGT.INTERNAL_ROLE_MGT_CREATE,
            TokenConstants.INTERNAL_USER_MGT.INTERNAL_USER_MGT_CREATE,
            TokenConstants.INTERNAL_APP_MGT.INTERNAL_APP_MGT_CREATE,
            TokenConstants.INTERNAL_APP_MGT.INTERNAL_APP_MGT_DELETE,
            TokenConstants.INTERNAL_APP_MGT.INTERNAL_APP_MGT_VIEW,
            TokenConstants.INTERNAL_APP_MGT.INTERNAL_APP_MGT_UPDATE,
            TokenConstants.INTERNAL_IDP.INTERNAL_IDP_CREATE,
            TokenConstants.INTERNAL_IDP.INTERNAL_IDP_VIEW,
            TokenConstants.INTERNAL_IDP.INTERNAL_IDP_DELETE,
            TokenConstants.INTERNAL_IDP.INTERNAL_IDP_UPDATE
        ],
        serverOrigin: GlobalConfig.serverOrigin,
        tenant: GlobalConfig.tenant
    };

    const sendSignInRequest = (): void => {
        if (consentDenied) {
            requestParams.prompt = "login";
        }

        if (SignInUtil.hasAuthorizationCode()) {
            SignInUtil.sendTokenRequest(requestParams)
                .then((response) => {
                    AuthenticateSessionUtil.initUserSession(
                        response,
                        SignInUtil.getAuthenticatedUser(response.idToken)
                    );
                    dispatch(setSignIn());
                    dispatch(getProfileInformation());
                })
                .catch((error) => {
                    if (error.response.status === 400) {
                        SignInUtil.sendAuthorizationRequest(requestParams);
                    }

                    throw error;
                });
        } else {
            SignInUtil.sendAuthorizationRequest(requestParams);
        }
    };

    if (AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.ACCESS_TOKEN)) {
        if (OPConfigurationUtil.isValidOPConfig(requestParams.tenant)) {
            AuthenticateSessionUtil.endAuthenticatedSession();
            OPConfigurationUtil.resetOPConfiguration();
            handleSignOut();
        }

        dispatch(setSignIn());
        dispatch(getProfileInformation());
    } else {
        OPConfigurationUtil.initOPConfiguration(ServiceResourcesEndpoint.wellKnown, false)
            .then(() => {
                sendSignInRequest();
            })
            .catch(() => {
                OPConfigurationUtil.setAuthorizeEndpoint(ServiceResourcesEndpoint.authorize);
                OPConfigurationUtil.setTokenEndpoint(ServiceResourcesEndpoint.token);
                OPConfigurationUtil.setRevokeTokenEndpoint(ServiceResourcesEndpoint.revoke);
                OPConfigurationUtil.setEndSessionEndpoint(ServiceResourcesEndpoint.logout);
                OPConfigurationUtil.setJwksUri(ServiceResourcesEndpoint.jwks);
                OPConfigurationUtil.setIssuer(ServiceResourcesEndpoint.issuer);
                OPConfigurationUtil.setOPConfigInitiated();

                sendSignInRequest();
            });
    }
};

/**
 * Update sessionStorage with location history path
 *
 * @param {string} location - history path.
 */
export const updateAuthenticationCallbackUrl = (location): void => {
    window.sessionStorage.setItem("auth_callback_url", location);
};
