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
import {KEYUTIL, KJUR} from "jsrsasign"
import {string} from "prop-types";
import {ServiceResourcesEndpoint} from "../configs/app";

/**
 * Generate code verifier.
 *
 * @returns {string} code verifier.
 */
export const getCodeVerifier = () => {

    return base64URLEncode(WordArray.random(32));
};

/**
 * Derive code challenge from the code verifier.
 *
 * @param {string} verifier.
 * @returns {string} code challenge.
 */
export const getCodeChallenge = (verifier: string) => {

    return base64URLEncode(sha256(verifier));
};

/**
 * Get URL encoded string.
 *
 * @param {WordArray} value.
 * @returns {string} base 64 url encoded value.
 */
export const base64URLEncode = (value: WordArray) => {

    return Base64.stringify(value)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};

/**
 * Get the supported signing algorithms for the id_token.
 *
 * @returns {string[]} array of supported algorithms.
 */
export const getSupportedSignatureAlgorithms = () => {

    return ['RS256', 'RS512', 'RS384', 'PS256'];
};

/**
 * Get JWK used for the id_token
 *
 * @param {string} jwtHeader header of the id_token.
 * @param {Array<any>} keys jwks response.
 * @returns {any} public key.
 */
export const getJWKForTheIdToken = (jwtHeader: string, keys: Array<any>) => {

    let headerJSON = JSON.parse(atob(jwtHeader));

    for (let i = 0; i < keys.length; i++) {
        if (headerJSON.kid == keys[i].kid) {
            return KEYUTIL.getKey({kty: keys[i].kty, e: keys[i].e, n: keys[i].n});
        }
    }
    throw new Error("Failed to find the public key specified in the id_token.");
};

/**
 * Verify id token.
 *
 * @param id_token id_token received from the IdP.
 * @param jwk public key used for signing.
 * @returns {any} whether the id_token is valid.
 */
export const verifyIdToken = (id_token, jwk) => {

    return KJUR.jws.JWS.verifyJWT(id_token, jwk, {
        alg: getSupportedSignatureAlgorithms(),
        iss: [ServiceResourcesEndpoint.token],
        aud: [CLIENT_ID],
        gracePeriod: 3600
    });
};

