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

import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import isEmpty from "lodash-es/isEmpty";
import { AppConstants } from "../constants";
import { AuthStateInterface } from "../models";

/**
 * Resolves the user's display name.
 *
 * @param {AuthStateInterface} state - auth state.
 * @return {string} - Resolved display name.
 */
export const resolveUserDisplayName = (state: AuthStateInterface): string => {

    if (state.profileInfo.displayName) {
        return state.profileInfo.displayName;
    } else if (state.profileInfo.name.givenName || state.profileInfo.name.familyName) {
        const givenName = isEmpty(state.profileInfo.name.givenName) ? "" : state.profileInfo.name.givenName + " ";
        const familyName = isEmpty(state.profileInfo.name.familyName) ? "" : state.profileInfo.name.familyName;

        return givenName + familyName;
    } else if (state.profileInfo.userName) {
        return getUserNameWithoutDomain(state.profileInfo.userName);
    } else if (state.displayName) {
        return state.displayName;
    } else if (state.username) {
        return getUserNameWithoutDomain(state.username);
    }

    return null;
};

/**
 * Resolves the user's profile name.
 *
 * @param {AuthStateInterface} state - auth state.
 * @param isProfileInfoLoading - SCIM user profile loader status.
 * @return {string} - Resolved profile name.
 */
export const resolveUserProfileName = (state: AuthStateInterface, isProfileInfoLoading: boolean): string => {

    if (state.profileInfo.name.givenName || state.profileInfo.name.familyName) {
        const givenName = isEmpty(state.profileInfo.name.givenName) ? "" : state.profileInfo.name.givenName + " ";
        const familyName = isEmpty(state.profileInfo.name.familyName) ? "" : state.profileInfo.name.familyName;

        return givenName + familyName;
    } else if (!isProfileInfoLoading) {
        return resolveUserDisplayName(state);
    }

    return null;
};

/**
 * Same username can exist in two different user stores. This function
 * will resolve the username so that the `PRIMARY` user store users will
 * have just the username and the other user store users will have their
 * corresponding user store prefixed to their username.
 *
 * @param {string} username - Username of the user.
 * @param {string} userStoreDomain - User store domain of the user.
 * @return {string}
 */
export const resolveUsername = (username: string, userStoreDomain: string): string => {
    // check if the user store is `PRIMARY`.
    if (userStoreDomain === AppConstants.PRIMARY_USER_STORE_IDENTIFIER) {
        return username;
    }

    return `${userStoreDomain}/${username}`;
};

/**
 * Resolves the user's username when the user store is embedded
 * in it. `PRIMARY` user store users will have just the username
 * and the other user store users will have their corresponding
 * user store prefixed to their username.
 *
 * @param {string} username - Username of the user with user store embedded.
 * @return {string}
 */
export const resolveUserStoreEmbeddedUsername = (username: string): string => {
    const parts = username.split("/");

    if (parts.length === 1) {
        return username;
    }

    // check if the user store is `PRIMARY`.
    if (parts[0] === AppConstants.PRIMARY_USER_STORE_IDENTIFIER) {
        return parts[1];
    }

    return username;
};

/**
 * Resolves the user's userstore from the username
 *
 * @param {string} username - Username of the user with user store embedded.
 * @return {string}
 */
export const resolveUserstore= (username: string): string => {
    // Userstore is index 0 and index 1 is username
    const USERSTORE = 0;
    const parts = username?.split("/");

    return parts[USERSTORE];
};
