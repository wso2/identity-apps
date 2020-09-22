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

/**
 * Interface of the OAuth2/OIDC tokens.
 */
export interface TokenResponseInterface {
    accessToken: string;
    idToken: string;
    expiresIn: string;
    scope: string;
    refreshToken: string;
    tokenType: string;
}

export interface TokenRequestHeader {
    Accept: string;
    "Access-Control-Allow-Origin": string;
    "Content-Type": string;
}

/**
 * Interface for the payload of a Decoded ID Token.
 */
export interface DecodedIdTokenPayloadInterface {
    /**
     * The audience for which this token is intended.
     */
    aud: string | string[];
    /**
     * The uid corresponding to the user who the ID token belonged to.
     */
    sub: string;
    /**
     * The issuer identifier for the issuer of the response.
     */
    iss: string;
    /**
     * The email of the user to whom the ID token belongs.
     */
    email?: string;
    /**
     * Name by which the user wishes to be referred to.
     */
    preferred_username?: string;
    /**
     * The tenant domain of the user to whom the ID token belongs.
     */
    tenant_domain?: string;
}
