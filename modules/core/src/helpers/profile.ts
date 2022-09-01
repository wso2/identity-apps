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

import isEmpty from "lodash-es/isEmpty";
import { UserstoreConstants } from "../constants";
import { AuthReducerStateInterface, MultiValueAttributeInterface, ProfileInfoInterface } from "../models";

/**
 * Resolves the user's display name.
 *
 * @param {ProfileInfoInterface} profileInfo - profile information.
 * @param {AuthReducerStateInterface} authState - Contains basic profile info extracted from the ID token.
 * @param {string} fallback - Fallback value.
 * @return {string} - Resolved display name.
 */
export const resolveUserDisplayName = (profileInfo: ProfileInfoInterface,
                                       authState?: AuthReducerStateInterface,
                                       fallback: string = null): string => {

    if (profileInfo["displayName"]) {
        return profileInfo["displayName"];
    } else if (profileInfo.name && (profileInfo.name.givenName || profileInfo.name.familyName)) {
        const givenName = isEmpty(profileInfo.name.givenName) ? "" : profileInfo.name.givenName + " ";
        const familyName = isEmpty(profileInfo.name.familyName) ? "" : profileInfo.name.familyName;
        return givenName + familyName;
    } else if (profileInfo.userName) {
        return getUserNameWithoutDomain(profileInfo.userName);
    } else if (authState && authState.displayName) {
        return authState.displayName;
    } else if (authState && authState.username) {
        return getUserNameWithoutDomain(authState.username);
    }

    return fallback;
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
export const resolveUsername = (username: string, userStoreDomain: string) => {

    // check if the user store is `PRIMARY`.
    if (userStoreDomain === UserstoreConstants.PRIMARY_USER_STORE) {
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
export const resolveUserStoreEmbeddedUsername = (username: string) => {

    const parts = username.split("/");

    if (parts.length === 1) {
        return username;
    }

    // check if the user store is `PRIMARY`.
    if (parts[0] === UserstoreConstants.PRIMARY_USER_STORE) {
        return parts[1];
    }

    return username;
};

/**
 * Get the user's emails as a string array.
 *
 * @param {(string | MultiValueAttributeInterface)[]} emails - User emails.
 * @return {string[]} Emails as a string array.
 */
export const resolveUserEmails = (emails: (string | MultiValueAttributeInterface)[]): string[] => {
    if (!emails || !Array.isArray(emails) || emails.length < 1) {
        return [];
    }

    return emails.map((email: (string | MultiValueAttributeInterface)): string => {
        if (typeof email !== "string" && email?.value) {
            return email.value;
        }

        return email as string;
    });
};

/**
 * This function returns the username without the user store domain prefix.
 *
 * @param {string} userNameWithDomain - Username of the user with the userStore domain.
 * @return {string} User name without domain.
 */
export const getUserNameWithoutDomain = (userNameWithDomain: string): string => {

    if (userNameWithDomain.indexOf("/") > -1) {
        const fragments = userNameWithDomain.split("/");
        if (fragments?.length > 1) {
            return fragments[1];
        }
    }
    return userNameWithDomain;
};

/**
 * Get the user's userstore as a string.
 *
 * @param {string} username - Username.
 * @return {string} Userstore as a string.
 */
export const resolveUserstore = (username: string): string => {

    const userNameSegments = username.split("/");

    if (userNameSegments.length > 1) {
        return userNameSegments[0];
    } else {
        return UserstoreConstants.PRIMARY_USER_STORE;
    }
};
