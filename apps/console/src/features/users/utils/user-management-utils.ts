/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

/**
 * Utility class for user management operations.
 */
export class UserManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Resolves the username of the given user.
     *
     * @param user - User object.
     * @returns The username of the given user as a string.
     */
    public static resolveUsername = (username: string): string => {
        if (username.split("/").length > 1) {
            username = username.split("/")[1];
        }

        return username;
    };

    /**
     * Check if a user is the authenticated user.
     *
     * @param authenticatedUser - Currently logged in user
     * @param user - User object.
     * @returns Whether the given user is the current user or not.
     */
    public static isAuthenticatedUser = (authenticatedUser: string, username: string): boolean => {
        let authenticatedUsername: string = authenticatedUser;

        if (authenticatedUsername.split("@").length > 2) {
            // If the username contains 2 @ symbols, it contains the tenant domain as well.
            authenticatedUsername = authenticatedUser.split("@").slice(0,2).join("@");
        }

        return this.resolveUsername(username) === authenticatedUsername;
    };
}
