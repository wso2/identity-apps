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

import { AlertInterface } from "./global";
import { LinkedAccountInterface, ProfileInfoInterface, ProfileSchemaInterface } from "./profile";

/**
 * Interface for the Auth reducer state.
 */
export interface AuthReducerStateInterface {
    /**
     * Display name decoded from the ID token.
     */
    displayName: string;
    /**
     * Emails decoded from the ID token.
     */
    emails: string;
    /**
     * Flag to determine if the user is authenticated.
     */
    isAuthenticated: boolean;
    /**
     * Flag to determine if login is initiated.
     */
    loginInit: boolean;
    /**
     * Flag to determine if logout is initiated.
     */
    logoutInit: boolean;
    /**
     * Username decoded from the ID token.
     */
    username: string;
}

/**
 * Interface for the Global reducer state.
 */
export interface GlobalReducerStateInterface {
    /**
     * Alert object.
     */
    alert: AlertInterface;
    /**
     * Alert system instance.
     */
    alertSystem: any;
    /**
     * Flag to determine if the global loader is visible.
     */
    isGlobalLoaderVisible: boolean;
}

/**
 * Interface for the common request loaders reducer state.
 */
export interface CommonRequestLoadersReducerStateInterface {
    isProfileInfoRequestLoading: boolean;
    isProfileSchemaRequestLoading: boolean;
    isSignOutRequestLoading: boolean;
    isTokenRequestLoading: boolean;
    isTokenRevokeRequestLoading: boolean;
}

/**
 * Interface for common profile reducer state.
 */
export interface CommonProfileReducerStateInterface {
    isSCIMEnabled: boolean;
    linkedAccounts: LinkedAccountInterface[];
    profileInfo: ProfileInfoInterface;
    profileSchemas: ProfileSchemaInterface[];
}

/**
 * Interface for common config reducer state.
 */
export interface CommonConfigReducerStateInterface<T> {
    deployment?: T;
}
