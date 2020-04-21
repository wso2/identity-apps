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

import { AlertLevels, ProfileSchema } from "../../models";
import { AuthAction, authenticateActionTypes } from "./types";
import { ConfigInterface, IdentityClient } from "@wso2is/authentication";
import { setProfileInfoLoader, setProfileSchemaLoader } from "./loaders";
import _ from "lodash";
import { addAlert } from "@wso2is/core/store";
import { getProfileInfo } from "@wso2is/core/api";
import { getProfileSchemas } from "../../api";
import { history } from "../../helpers";
import { I18n } from "@wso2is/i18n";
import { store } from "../index";
import { SYSTEM_SCOPE } from "../../constants";

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

    // Get the profile info.
    // TODO: Add the function to handle SCIM disabled error.
    getProfileInfo(null)
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
                    description: I18n.instance.t(
                        "devPortal:components.user.profile.notifications.getProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t(
                        "devPortal:components.user.profile.notifications.getProfileInfo.genericError.message"
                    )
                })
            );
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.detail) {
                dispatch(
                    addAlert({
                        description: I18n.instance.t(
                            "devPortal:components.user.profile.notifications.getProfileInfo.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t(
                            "devPortal:components.user.profile.notifications.getProfileInfo.error.message"
                        )
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: I18n.instance.t(
                        "devPortal:components.user.profile.notifications.getProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t(
                        "devPortal:components.user.profile.notifications.getProfileInfo.genericError.message"
                    )
                })
            );
        })
        .finally(() => {
            dispatch(setProfileInfoLoader(false));
        });
};

/**
 * Initialize identityManager client
 */
const identityManager = (() => {
    let instance: ConfigInterface;
 
    const createInstance = () => {
        return new IdentityClient({
            callbackURL: store.getState().config.deployment.loginCallbackUrl,
            clientHost: store.getState().config.deployment.clientHost,
            clientID: store.getState().config.deployment.clientID,
            scope: [ SYSTEM_SCOPE ],
            serverOrigin: store.getState().config.deployment.serverOrigin,
            tenant: store.getState().config.deployment.tenant,
            tenantPath: store.getState().config.deployment.tenantPath
        });
    };
 
    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance();
            }

            return instance;
        }
    };
})();

/**
 * Handle user sign-in
 */
export const handleSignIn = () => (dispatch) => {
    identityManager.getInstance().signIn(
        () => {
            dispatch(setSignIn());
            dispatch(getProfileInformation());
        })
        .catch((error) => {
            // TODO: Show error page
            throw error;
        });
};

/**
 * Handle user sign-out
 */
export const handleSignOut = () => (dispatch) => {
    identityManager.getInstance().signOut(
        () => {
            dispatch(setSignOut());
        })
        .catch(() => {
            history.push(store.getState().config.deployment.appLoginPath);
        });
};

/**
 * Update sessionStorage with location history path
 *
 * @param {string} location - history path.
 */
export const updateAuthenticationCallbackUrl = (location): void => {
    window.sessionStorage.setItem("auth_callback_url", location);
};
