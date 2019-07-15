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

import axios from "axios";
import log from "log";
import { ServiceResources } from "../configs/app";
import { Messages } from "../configs/text";
import { createEmptyLoginStatus, LoginEntity } from "../models/login";

export const isValidLogin = async (loginInfo: LoginEntity): Promise<object> => {
    const authUrl: string = ServiceResources.login;
    const loginStatus = createEmptyLoginStatus();

    if (loginInfo.username === "") {
        loginStatus.errorMessage = Messages.errors.login.loginFailed;
        loginStatus.errorDiscription = Messages.errors.login.emptyUsername;
    } else if (loginInfo.password === "") {
        loginStatus.errorMessage = Messages.errors.login.loginFailed;
        loginStatus.errorDiscription = Messages.errors.login.emptyPassword;
    } else {
        const header = {
            auth: {
                password: loginInfo.password,
                username: loginInfo.username
            },
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:9000",
                "Content-Type": "application/scim+json"
            }
        };
        sessionStorage.setItem("loginPassword", loginInfo.password);
        sessionStorage.setItem("loginUsername", loginInfo.username);

        await axios.get(authUrl, header)
            .then((endpointResponse) => {
                if (endpointResponse.status === 200) {
                    loginStatus.valid = true;
                    loginStatus.displayName = endpointResponse.data.name.givenName || "";
                    loginStatus.emails = endpointResponse.data.emails || [];
                    loginStatus.errorMessage = "";
                    loginStatus.errorMessage = "";
                    loginStatus.username = endpointResponse.data.userName || "";
                }
            })
            .catch((error) => {
                log.error(error);
            });
    }

    return loginStatus;
};

export const isLoggedIn = () => {
    if (sessionStorage.getItem("isAuth") === "false") {
        return false;
    } else {
        return true;
    }
};
