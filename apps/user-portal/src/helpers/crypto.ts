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

import WordArray from "crypto-js/lib-typedarrays";
import Base64 from 'crypto-js/enc-base64';
import sha256 from "crypto-js/sha256";
import {string} from "prop-types";

/**
 * Generate code verifier.
 *
 * @returns {string}
 */
export const getCodeVerifier = () => {

    return base64URLEncode(WordArray.random(32));
};

/**
 * Derive code challenge from the code verifier.
 *
 * @param {string} verifier
 * @returns {string}
 */
export const getCodeChallenge = (verifier: string) => {

    return base64URLEncode(sha256(verifier));
};

/**
 * Get URL encoded string.
 *
 * @param {WordArray} value
 * @returns {string}
 */
export const base64URLEncode = (value: WordArray) => {

    return Base64.stringify(value)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
