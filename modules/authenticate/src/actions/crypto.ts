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

// tslint:disable-next-line:no-submodule-imports
import Base64 from "crypto-js/enc-base64";
// tslint:disable-next-line:no-submodule-imports
import WordArray from "crypto-js/lib-typedarrays";
// tslint:disable-next-line:no-submodule-imports
import sha256 from "crypto-js/sha256";
import { KEYUTIL, KJUR } from "jsrsasign";
import { SERVICE_RESOURCES } from "../constants";
import { JWKInterface } from "../models/crypto";

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
 * @param {CryptoJS.WordArray} value.
 * @returns {string} base 64 url encoded value.
 */
export const base64URLEncode = (value: CryptoJS.WordArray) => {
    return Base64.stringify(value)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
};

/**
 * Get the supported signing algorithms for the id_token.
 *
 * @returns {string[]} array of supported algorithms.
 */
export const getSupportedSignatureAlgorithms = () => {
    return ["RS256", "RS512", "RS384", "PS256"];
};

/**
 * Get JWK used for the id_token
 *
 * @param {string} jwtHeader header of the id_token.
 * @param {JWKInterface[]} keys jwks response.
 * @returns {any} public key.
 */
export const getJWKForTheIdToken = (jwtHeader: string, keys: JWKInterface[]) => {
    const headerJSON = JSON.parse(atob(jwtHeader));

    for (const key of keys) {
        if (headerJSON.kid === key.kid) {
            return KEYUTIL.getKey({kty: key.kty, e: key.e, n: key.n});
        }
    }

    throw new Error("Failed to find the 'kid' specified in the id_token. 'kid' found in the header : "
        + headerJSON.kid + ", Expected values: " + keys.map((key) => key.kid).join(", "));
};

/**
 * Verify id token.
 *
 * @param idToken id_token received from the IdP.
 * @param jwk public key used for signing.
 * @param {string} clientID app identification.
 * @returns {any} whether the id_token is valid.
 */
export const isValidIdToken = (idToken, jwk, clientID: string) => {
    return KJUR.jws.JWS.verifyJWT(idToken, jwk, {
        alg: getSupportedSignatureAlgorithms(),
        aud: [clientID],
        gracePeriod: 3600,
        iss: [SERVICE_RESOURCES.token]
    });
};
