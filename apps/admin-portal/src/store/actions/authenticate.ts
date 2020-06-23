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

import { getProfileInfo, getProfileSchemas } from "@wso2is/core/api";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, ProfileInfoInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import {
    addAlert,
    setProfileInfo,
    setProfileInfoRequestLoadingStatus,
    setProfileSchemaRequestLoadingStatus,
    setSCIMSchemas,
    setSignIn,
    setSignOut
} from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { OAuth } from "@wso2is/oauth-web-worker";
import _ from "lodash";
import { history } from "../../helpers";
import { store } from "../index";

/**
 *  Gets profile information by making an API call
 */
export const getProfileInformation = () => (dispatch): void => {

    dispatch(setProfileInfoRequestLoadingStatus(true));

    // Get the profile info.
    // TODO: Add the function to handle SCIM disabled error.
    getProfileInfo(null, store.getState().config.ui.gravatarConfig)
        .then((infoResponse: ProfileInfoInterface) => {

            if (infoResponse.responseStatus !== 200) {
                dispatch(
                    addAlert({
                        description: I18n.instance.t(
                            "adminPortal:notifications.getProfileInfo.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("adminPortal:notifications.getProfileInfo.genericError.message")
                    })
                );

                return;
            }

            dispatch(setProfileInfo<ProfileInfoInterface>(infoResponse));

            // If the schemas in the redux store is empty, fetch the SCIM schemas from the API.
            if (_.isEmpty(store.getState().profile.profileSchemas)) {
                dispatch(setProfileSchemaRequestLoadingStatus(true));

                getProfileSchemas()
                    .then((response: ProfileSchemaInterface[]) => {
                        dispatch(setSCIMSchemas<ProfileSchemaInterface[]>(response));
                    })
                    .catch((error: IdentityAppsApiException) => {

                        if (error?.response?.data?.description) {
                            dispatch(
                                addAlert<AlertInterface>({
                                    description: error.response.data.description,
                                    level: AlertLevels.ERROR,
                                    message: I18n.instance.t("adminPortal:notifications.getProfileSchema.error.message")
                                })
                            );
                        }

                        dispatch(
                            addAlert<AlertInterface>({
                                description: I18n.instance.t(
                                    "adminPortal:notifications.getProfileSchema.genericError.description"),
                                level: AlertLevels.ERROR,
                                message: I18n.instance.t(
                                    "adminPortal:notifications.getProfileSchema.genericError.message")
                            })
                        );
                    })
                    .finally(() => {
                        dispatch(setProfileSchemaRequestLoadingStatus(false));
                    });
            }

            return;
        })
        .catch((error: IdentityAppsApiException) => {
            if (error.response && error.response.data && error.response.data.detail) {
                dispatch(
                    addAlert({
                        description: I18n.instance.t(
                            "adminPortal:notifications.getProfileInfo.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t(
                            "adminPortal:notifications.getProfileInfo.error.message"
                        )
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: I18n.instance.t("adminPortal:notifications.getProfileInfo.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("adminPortal:notifications.getProfileInfo.genericError.message")
                })
            );
        })
        .finally(() => {
            dispatch(setProfileInfoRequestLoadingStatus(false));
        });
};

/**
 * Handle user sign-in
 */
export const handleSignIn = () => (dispatch) => {
    const oAuth = OAuth.getInstance();
    oAuth
        .initialize({
            baseUrls: [window["AppUtils"].getConfig().serverOrigin],
            callbackURL: window["AppUtils"].getConfig().loginCallbackURL,
            clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
            clientID: window["AppUtils"].getConfig().clientID,
            enablePKCE: true,
            scope: ["SYSTEM", "openid"],
            serverOrigin: window["AppUtils"].getConfig().serverOrigin
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
 * Handle user sign-out
 */
export const handleSignOut = () => (dispatch) => {
    const oAuth = OAuth.getInstance();
    oAuth
        .signOut()
        .then(() => {
            dispatch(setSignOut());
        })
        .catch(() => {
            history.push(store?.getState()?.config?.deployment?.appLoginPath);
        });
};
