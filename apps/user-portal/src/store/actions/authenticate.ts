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

import { getProfileInfo } from "../../../src/api";
import { fireNotification } from "./globals";
import { authenticateActionTypes } from "./types";

/**
 * Dispatches an action of type `SET_SIGN_IN`.
 */
export const setSignIn = () => ({
    type: authenticateActionTypes.SET_SIGN_IN
});

/**
 * Dispatches an action of type `SET_SIGN_OUT`.
 */
export const setSignOut = () => ({
    type: authenticateActionTypes.SET_SIGN_OUT
});

/**
 * Dispatches an action of type `RESET_AUTHENTICATION`.
 */
export const resetAuthentication = () => ({
    type: authenticateActionTypes.RESET_AUTHENTICATION
});

/**
 * Dispatches an action of type `SET_PROFILE_INFO`.
 */
export const setProfileInfo = (details: any) => ({
    payload: details,
    type: authenticateActionTypes.SET_PROFILE_INFO
});

/**
 *  Gets profile information by making an API call
 */
export const getProfileInformation = () => {
    return (dispatch) => {
        getProfileInfo()
            .then((infoResponse) => {
                if (infoResponse.responseStatus === 200) {
                    dispatch(
                        setProfileInfo({
                            ...infoResponse
                        })
                    );
                } else {
                    dispatch(
                        fireNotification({
                            description:
                                "views:components.profile.notifications.getProfileInfo.genericError" + ".description",
                            message: "views:components.profile.notifications.getProfileInfo.genericError.message",
                            otherProps: {
                                negative: true
                            },
                            visible: true
                        })
                    );
                }
            })
            .catch((error) => {
                dispatch(
                    fireNotification({
                        description: error && error.data && error.data.details,
                        message: "views:components.profile.notifications.getProfileInfo.error.message",
                        otherProps: {
                            negative: true
                        },
                        visible: true
                    })
                );
            });
    };
};
