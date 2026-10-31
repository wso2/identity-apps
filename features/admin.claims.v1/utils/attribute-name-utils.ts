/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { ClaimManagementConstants } from "../constants";

/**
 * Checks whether a local attribute name has an allowed format and length.
 *
 * @param name - Attribute name without the dialect prefix.
 * @returns True when the name can be used in a local attribute URI.
 */
export const isValidLocalAttributeName: (name: string) => boolean = (name: string): boolean => {
    return ClaimManagementConstants.LOCAL_ATTRIBUTE_NAME_REGEX.test(name)
        && name.length <= ClaimManagementConstants.LOCAL_ATTRIBUTE_NAME_MAX_LENGTH;
};

/**
 * Checks whether a local attribute name falls under the reserved identity claim prefix.
 *
 * @param name - Attribute name without the dialect prefix.
 * @returns True when the name starts with the identity claim prefix.
 */
export const isReservedLocalAttributeName: (name: string) => boolean = (name: string): boolean => {
    return name.startsWith(ClaimManagementConstants.IDENTITY_CLAIM_NAME_PREFIX);
};
