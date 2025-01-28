/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { SharedUserStoreUtils } from "@wso2is/admin.core.v1/utils/user-store-utils";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { UserManagementConstants } from "../constants/user-management-constants";

/**
 * Retrieves the username validation pattern from the primary user store.
 *
 * @remarks
 * This function fetches the username regular expression from the primary user store
 * and ensures that it starts with `^` and ends with `$` to match the entire string.
 *
 * @returns A promise that resolves to the validated username regular expression.
 * @throws Will reject the promise with an empty string if an error occurs.
 */
const getUsertoreUsernameValidationPattern = async (): Promise<string> => {
    try {
        let regex: string = await SharedUserStoreUtils.getUserStoreRegEx(
            userstoresConfig.primaryUserstoreName, UserManagementConstants.USERNAME_JAVA_REGEX);

        if (!regex.startsWith("^")) {
            regex = "^" + regex;
        }
        if (!regex.endsWith("$")) {
            regex = regex + "$";
        }

        return regex;
    } catch (error) {
        return Promise.reject("");
    }
};

export default getUsertoreUsernameValidationPattern;
