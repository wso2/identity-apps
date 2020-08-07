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

import { handleSignIn } from "./actions/sign-in";
import { handleSignOut } from "./actions/sign-out";
import * as AUTHENTICATION_TYPES from "./constants";
import { ConfigInterface } from "./models/client";
import { ResponseModeTypes } from "./models/oidc-request-params";

/**
 * The login scope.
 * @constant
 * @type {string}
 * @default
 */
const LOGIN_SCOPE = "internal_login";

/**
 * Human task scope.
 * @constant
 * @type {string}
 * @default
 */
const HUMAN_TASK_SCOPE = "internal_humantask_view";

/**
 * Super Tenant Identifier.
 * @constant
 * @type {string}
 * @default
 */
const DEFAULT_SUPER_TENANT = "carbon.super";

/**
 * Default configurations.
 */
const DefaultConfig = {
    authorizationType: AUTHENTICATION_TYPES.AUTHORIZATION_CODE_TYPE,
    clientSecret: null,
    consentDenied: false,
    enablePKCE: true,
    responseMode: null,
    scope: [LOGIN_SCOPE, HUMAN_TASK_SCOPE],
    tenant: DEFAULT_SUPER_TENANT
};

/**
 * IdentityClient class constructor.
 *
 * @export
 * @class IdentityClient
 * @implements {ConfigInterface} - Configuration interface.
 */
export class IdentityClient implements ConfigInterface {
    public authorizationType!: string;
    public callbackURL: string;
    public clientHost: string;
    public clientID: string;
    public clientSecret!: string;
    public consentDenied!: boolean;
    public enablePKCE!: boolean;
    public responseMode!: ResponseModeTypes;
    public scope!: string[];
    public serverOrigin: string;
    public tenant!: string;
    public tenantPath!: string;

    constructor(UserConfig: ConfigInterface) {
        const resolve = (propertyName) => {
            if (Object.prototype.hasOwnProperty.call(UserConfig, propertyName)) {
                return UserConfig[propertyName];
            }

            if (Object.prototype.hasOwnProperty.call(DefaultConfig, propertyName)) {
                return DefaultConfig[propertyName];
            }

            throw new Error(
                `"${propertyName}" is missing in your configuration. Please fill all the mandatory properties`
            );
        };

        this.authorizationType = resolve("authorizationType");
        this.callbackURL = resolve("callbackURL");
        this.clientHost = resolve("clientHost");
        this.clientID = resolve("clientID");
        this.clientSecret = resolve("clientSecret");
        this.consentDenied = resolve("consentDenied");
        this.enablePKCE = resolve("enablePKCE");
        this.responseMode = resolve("responseMode");
        this.scope = resolve("scope");
        this.serverOrigin = resolve("serverOrigin");
        this.tenant = resolve("tenant");
        this.tenantPath = resolve("tenantPath");

        Object.assign(this, UserConfig);
    }

    public getUserInfo() {
        // TODO: Implement
        return;
    }

    public validateAuthentication() {
        // TODO: Implement
        return;
    }

    public getAccessToken() {
        // TODO: Implement
        return;
    }

    /**
     * Sign-in method.
     *
     * @param {() => void} [callback] - Callback method to run on successful sign-in
     * @returns {Promise<any>} promise.
     * @memberof IdentityClient
     */
    public async signIn(): Promise<any> {
        return handleSignIn(this, AUTHENTICATION_TYPES.Storage.sessionStorage);
    }

    /**
     * Sign-out method.
     *
     * @param {() => void} [callback] - Callback method to run on successful sign-in
     * @returns {Promise<any>} promise.
     * @memberof IdentityClient
     */
    public async signOut(): Promise<any> {
        return handleSignOut(AUTHENTICATION_TYPES.Storage.sessionStorage);
    }
}
