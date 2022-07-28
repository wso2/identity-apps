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

import { AuthenticatedUserInfo, useAuthContext } from "@asgardeo/auth-react";
import { getProfileSchemas } from "@wso2is/core/api";
import { AppConstants as CommonAppConstants } from "@wso2is/core/constants";
import { AuthenticateUtils } from "@wso2is/core/utils";
import { I18n } from "@wso2is/i18n";
import isEmpty from "lodash-es/isEmpty";
import { getProfileLinkedAccounts } from ".";
import { addAlert } from "./global";
import { setProfileInfoLoader, setProfileSchemaLoader } from "./loaders";
import { AuthAction, authenticateActionTypes } from "./types";
import { getProfileInfo, getUserReadOnlyStatus, switchAccount } from "../../api";
// Keep statement as this to avoid cyclic dependency. Do not import from config index.
import { SCIMConfigs } from "../../extensions/configs/scim";
import { history } from "../../helpers";
import {
    AlertLevels,
    BasicProfileInterface,
    LinkedAccountInterface,
    ProfileSchema,
    ReadOnlyUserStatus
} from "../../models";
import { getProfileCompletion, toBoolean } from "../../utils";
import { store } from "../index";

/**
 * Dispatches an action of type `SET_SIGN_IN`.
 */
export const setSignIn = (userInfo: AuthenticatedUserInfo): AuthAction => ({
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
 * Dispatches an action of type `SET_INITIALIZED`
 * @param flag
 */
export const setInitialized = (flag: boolean): AuthAction => ({
    payload: flag,
    type: authenticateActionTypes.SET_INITIALIZED
});


/**
 * Get SCIM2 schemas
 */
export const getScimSchemas = (
    profileInfo: BasicProfileInterface = null,
    isReadOnlyUser: boolean
) => (dispatch): void => {

    dispatch(setProfileSchemaLoader(true));

    getProfileSchemas(store.getState().config.endpoint?.schemas)
        .then((response: ProfileSchema[]) => {
            dispatch(setProfileSchemaLoader(false));
            dispatch(setScimSchemas(response));

            if (profileInfo) {
                dispatch(getProfileCompletion(profileInfo, response, isReadOnlyUser));
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
                                    response[SCIMConfigs.scim.customEnterpriseSchema]
                                        ?.isReadOnlyUser
                            })
                        );

                        // If the schemas in the redux store is empty, fetch the SCIM schemas from the API.
                        if (isEmpty(store.getState().authenticationInformation.profileSchemas)) {
                            isCompletionCalculated = true;
                            dispatch(
                                getScimSchemas(
                                    infoResponse,
                                    toBoolean(
                                        response[SCIMConfigs.scim.customEnterpriseSchema]?.isReadOnlyUser
                                    )
                                )
                            );
                        }

                        // If `updateProfileCompletion` flag is enabled, update the profile completion.
                        if (updateProfileCompletion && !isCompletionCalculated) {
                            try {
                                getProfileCompletion(
                                    infoResponse,
                                    store.getState().authenticationInformation.profileSchemas,
                                    toBoolean(
                                        response[SCIMConfigs.scim.customEnterpriseSchema]?.isReadOnlyUser
                                    )
                                );
                            } catch (e) {
                                dispatch(
                                    addAlert({
                                        description: I18n.instance.t("myAccount:components.profile.notifications" +
                                            ".getProfileCompletion.genericError.description"),
                                        level: AlertLevels.ERROR,
                                        message: I18n.instance.t("myAccount:components.profile.notifications" +
                                            ".getProfileCompletion.genericError.message")
                                    })
                                );
                            }
                        }

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "myAccount:components.profile.notifications.getProfileInfo.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t(
                                "myAccount:components.profile.notifications.getProfileInfo.genericError.message"
                            )
                        })
                    );
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.detail) {
                        dispatch(
                            addAlert({
                                description: I18n.instance.t(
                                    "myAccount:components.profile.notifications.getProfileInfo.error.description",
                                    { description: error.response.data.detail }
                                ),
                                level: AlertLevels.ERROR,
                                message: I18n.instance.t(
                                    "myAccount:components.profile.notifications.getProfileInfo.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "myAccount:components.profile.notifications.getProfileInfo.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t(
                                "myAccount:components.profile.notifications.getProfileInfo.genericError.message"
                            )
                        })
                    );
                })
                .finally(() => {
                    dispatch(setProfileInfoLoader(false));
                });
        })
        .catch((error) => {
            dispatch(setProfileInfoLoader(false));
            dispatch(
                addAlert({
                    description:
                        error?.description ??
                        I18n.instance.t(
                            "myAccount:components.profile.notifications.getUserReadOnlyStatus.genericError.description"
                        ),
                    level: AlertLevels.ERROR,
                    message:
                        error?.message ??
                        I18n.instance.t(
                            "myAccount:components.profile.notifications.getUserReadOnlyStatus.genericError.message"
                        )
                })
            );
        });
};

/**
 * Resolves IDP URLs when the tenant resolves. Returns
 *
 * @param {string} originalURL - Original URL.
 * @param {string} overriddenURL - Overridden URL from config.
 * @return {string}
 */
export const resolveIdpURLSAfterTenantResolves = (originalURL: string, overriddenURL: string): string => {

    const parsedOriginalURL: URL = new URL(originalURL);
    const parsedOverrideURL: URL = new URL(overriddenURL);

    // If the override URL & original URL has search params, try to moderate the URL.
    if (parsedOverrideURL.search && parsedOriginalURL.search) {
        for (const [ key, value ] of parsedOriginalURL.searchParams.entries()) {
            if (!parsedOverrideURL.searchParams.has(key)) {
                parsedOverrideURL.searchParams.append(key, value);
            }
        }

        return parsedOverrideURL.toString();
    }

    return overriddenURL + parsedOriginalURL.search;
};

/**
 * Handle user sign-out
 */
export const useSignOut = (): () => (dispatch) => void => {
    const { signOut } = useAuthContext();

    return () => (dispatch) => {
        signOut()
            .then(() => {
                AuthenticateUtils.removeAuthenticationCallbackUrl(CommonAppConstants.MY_ACCOUNT_APP);
                dispatch(setSignOut());
            }).catch(() => {
                history.push(window[ "AppUtils" ].getConfig().routes.home);
            });
    };
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
                setSignIn(AuthenticateUtils.getSignInState(response))
            );
            dispatch(getProfileInformation());
            dispatch(getProfileLinkedAccounts());
        })
        .catch((error) => {
            throw error;
        });
};
