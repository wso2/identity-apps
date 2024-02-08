/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AuthenticatedUserInfo, BasicUserInfo } from "@asgardeo/auth-react";
import { AuthenticateUtils } from "@wso2is/core/utils";
import { I18n } from "@wso2is/i18n";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import { AnyAction, Dispatch } from "redux";
import { getProfileLinkedAccounts } from ".";
import { addAlert } from "./global";
import { setProfileInfoLoader, setProfileSchemaLoader } from "./loaders";
import { AuthAction, authenticateActionTypes } from "./types";
import { getProfileInfo, getProfileSchemas, getUserReadOnlyStatus, switchAccount } from "../../api";
// Keep statement as this to avoid cyclic dependency. Do not import from config index.
import { SCIMConfigs } from "../../extensions/configs/scim";
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
export const setProfileInfo = (details: BasicProfileInterface): AuthAction => ({
    payload: details,
    type: authenticateActionTypes.SET_PROFILE_INFO
});

/**
 * Dispatches an action of type `SET_SCHEMAS`
 * @param schemas - SCIM2 schemas
 */
export const setScimSchemas = (schemas: ProfileSchema[]): AuthAction => ({
    payload: schemas,
    type: authenticateActionTypes.SET_SCHEMAS
});

/**
 * Dispatches an action of type `SET_INITIALIZED`
 * @param flag - Flag to indicate if the app is initialized
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
) => (dispatch: Dispatch<AnyAction>): void => {

    dispatch(setProfileSchemaLoader(true));

    getProfileSchemas()
        .then((response: ProfileSchema[]) => {
            dispatch(setProfileSchemaLoader(false));
            dispatch(setScimSchemas(response));

            if (profileInfo) {
                dispatch(getProfileCompletion(profileInfo, response, isReadOnlyUser) as unknown as AnyAction);
            }
        })
        .catch(() => {
            // TODO: show error page
        });
};

/**
 *  Gets profile information by making an API call
 */
export const getProfileInformation = (
    updateProfileCompletion: boolean = false
) => (dispatch: Dispatch<AnyAction>): void => {
    let isCompletionCalculated: boolean = false;

    dispatch(setProfileInfoLoader(true));

    getUserReadOnlyStatus()
        .then((response: ReadOnlyUserStatus) => {
            // Get the profile info
            getProfileInfo()
                .then((infoResponse: BasicProfileInterface) => {
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
                                ) as unknown as AnyAction
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
                .catch((error: AxiosError) => {
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
        .catch((error: AxiosError & { description: string }) => {
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
 * @param originalURL - Original URL.
 * @param overriddenURL - Overridden URL from config.
 *
 * @returns Resolved URL.
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
 * Handles account switching.
 *
 * @param account - Info about the the account to switch to.
 *
 * @returns A function that accepts dispatch as an argument.
 */
export const handleAccountSwitching = (account: LinkedAccountInterface) => (dispatch: Dispatch<AnyAction>): void => {
    switchAccount(account)
        .then((response: BasicUserInfo) => {
            dispatch(
                setSignIn(AuthenticateUtils.getSignInState(response))
            );
            dispatch(getProfileInformation() as unknown as AnyAction);
            dispatch(getProfileLinkedAccounts() as unknown as AnyAction);
        })
        .catch((error: AxiosError) => {
            throw error;
        });
};
