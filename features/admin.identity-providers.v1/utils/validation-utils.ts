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

/**
 * Check whether the provided value is a valid SHA256 hash
 *
 * @param hash - SHA256 hash to validate.
 * @returns Whether the provided value is a valid SHA256 hash or not.
 */
export const isValidSHA256 = (hash: string): boolean => {
    // Check if the length is 64 characters after removing colons
    // Check if it contains only hexadecimal characters
    const sha256Regex: RegExp = /^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){63}$/;

    return sha256Regex.test(hash);
};
