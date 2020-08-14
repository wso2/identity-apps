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

import {
    API_CALL,
    API_CALL_ALL,
    AUTH_CODE,
    AUTH_REQUIRED,
    CUSTOM_GRANT,
    END_USER_SESSION,
    GET_SERVICE_ENDPOINTS,
    GET_USER_INFO,
    INIT,
    LOGOUT,
    REQUEST_ERROR,
    REQUEST_FINISH,
    REQUEST_START,
    REQUEST_SUCCESS,
    REVOKE_TOKEN,
    SIGNED_IN,
    SIGN_IN
} from "../constants";

export interface ResponseMessage<T> {
    success: boolean;
    error?: string;
    data?: T;
}

export interface Message<T> {
    type: MessageType;
    data?: T;
}

export interface SignInResponse {
    type: typeof SIGNED_IN | typeof AUTH_REQUIRED;
    code?: string;
    pkce?: string;
    data?: UserInfo;
}

export interface UserInfo {
    email: string;
    username: string;
    displayName: string;
    allowedScopes: string;
}

export interface AuthCode {
    code: string;
    sessionState: string;
    pkce?: string;
}

export type MessageType =
    | typeof INIT
    | typeof SIGN_IN
    | typeof AUTH_CODE
    | typeof LOGOUT
    | typeof API_CALL
    | typeof API_CALL_ALL
    | typeof CUSTOM_GRANT
    | typeof REVOKE_TOKEN
    | typeof END_USER_SESSION
    | typeof REQUEST_ERROR
    | typeof REQUEST_FINISH
    | typeof REQUEST_START
    | typeof REQUEST_SUCCESS
    | typeof GET_SERVICE_ENDPOINTS
    | typeof GET_USER_INFO;
