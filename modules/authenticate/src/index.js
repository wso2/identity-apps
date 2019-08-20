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
 *
 */

import * as actionCrypto from "./actions/crypto";
import * as actionOPConfiguration from "./actions/op-config";
import * as actionSession from "./actions/session";
import * as actionSignIn from "./actions/sign-in";
import * as actionSignOut from "./actions/sign-out";
import * as constantToken from "./constants/token";
import * as constantUser from "./constants/user";

/**
 * Export Utils & Keys
 */
export const AuthenticateSessionUtil = actionSession;
export const AuthenticateCryptoUtil = actionCrypto;
export const OPConfigurationUtil = actionOPConfiguration;
export const SignInUtil = actionSignIn;
export const SignOutUtil = actionSignOut;
export const AuthenticateTokenKeys = constantToken;
export const AuthenticateUserKeys = constantUser;
