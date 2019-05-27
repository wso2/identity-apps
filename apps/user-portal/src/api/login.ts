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
import { ServiceResources } from "../../configs/app";
import { LoginEntity } from "../models/login";

export const isValidLogin = async (loginInfo: LoginEntity): Promise<boolean> => {
    let authUrl: string = ServiceResources.login;
    const payload: object = {
        password: loginInfo.password,
        username: loginInfo.username
    };

    let valid: boolean = false;

    await axios.post(authUrl, payload)
        .then((response) => {
            if (response.status === 200 && response.data.valid === true) {
                valid = true;
            }
        })
        .catch((error) => {
            console.log(error);
        });

    return valid;
};
