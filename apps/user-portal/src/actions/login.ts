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
import { LoginEntity, LoginStatusEntity } from "../models/login";

export const isValidLogin = async (loginInfo: LoginEntity): Promise<object> => {
    const authUrl: string = ServiceResources.login;
    const loginStatus: LoginStatusEntity = {
        errorDiscription: "",
        errorMessage: "",
        valid: false
    };

    if (loginInfo.username === "") {
        loginStatus.errorMessage = "We're sorry we couldn't get you logged in";
        loginStatus.errorDiscription = "Username cannot be empty";
    } else if (loginInfo.password === "") {
        loginStatus.errorMessage = "We're sorry we couldn't get you logged in";
        loginStatus.errorDiscription = "Password cannot be empty";
    } else {
        const payload: object = {
            password: loginInfo.password,
            username: loginInfo.username
        };

        await axios.post(authUrl, payload)
            .then((response) => {
                if (response.status === 200 && response.data.status === 200) {
                    loginStatus.valid = true;
                    loginStatus.errorMessage = "";
                    loginStatus.errorMessage = "";
                } else if (response.status === 200 && response.data.status === 401) {
                    loginStatus.errorMessage = "We're sorry we couldn't get you logged in";
                    loginStatus.errorDiscription = "Invalid login or password, please type again";
                }
            })
            .catch((error) => {
                log.error(error);
            });
    }

    return loginStatus;
};

export const isLoggedIn = () => {
    return false;
};
