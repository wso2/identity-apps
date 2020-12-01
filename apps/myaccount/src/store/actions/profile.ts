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

import { I18n } from "@wso2is/i18n";
import { addAlert } from "./global";
import { ProfileActionTypes, ProfileBaseActionWithCommonPayload, ToggleSCIMEnabledAction } from "./types/profile";
import { getAssociations } from "../../api";
import { AlertLevels, LinkedAccountInterface, ProfileCompletion } from "../../models";

/**
 * Dispatches an action of type `SET_PROFILE_COMPLETION`.
 */
export const setProfileCompletion = (completion: ProfileCompletion): ProfileBaseActionWithCommonPayload => ({
    payload: completion,
    type: ProfileActionTypes.SET_PROFILE_COMPLETION
});

/**
 * Dispatches an action of type `SET_PROFILE_LINKED_ACCOUNTS`.
 */
export const setProfileLinkedAccounts = (accounts: LinkedAccountInterface[]): ProfileBaseActionWithCommonPayload => ({
    payload: accounts,
    type: ProfileActionTypes.SET_PROFILE_LINKED_ACCOUNTS
});

/**
 * Action to handle if SCIM is enabled.
 *
 * @returns An action of type `TOGGLE_SCIM_ENABLED`
 */
export const toggleSCIMEnabled = (isEnabled: boolean): ToggleSCIMEnabledAction => ({
    payload: isEnabled,
    type: ProfileActionTypes.TOGGLE_SCIM_ENABLED
});

/**
 * Action to fetch the linked accounts and set the response in redux state.
 * @return {(dispatch) => void}
 */
export const getProfileLinkedAccounts = () => (dispatch): void => {

    getAssociations()
        .then((linkedAccountsResponse) => {
            dispatch(setProfileLinkedAccounts(linkedAccountsResponse));
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.detail) {
                dispatch(
                    addAlert({
                        description: I18n.instance.t(
                            "myAccount:components.linkedAccounts.notifications.getAssociations." +
                            "error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t(
                            "myAccount:components.linkedAccounts.notifications.getAssociations." +
                            "error.message"
                        )
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: I18n.instance.t(
                        "myAccount:components.linkedAccounts.notifications.getAssociations." +
                        "genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t(
                        "myAccount:components.linkedAccounts.notifications.getAssociations." +
                        "genericError.message"
                    )
                })
            );
        });
};
