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

import { AuthenticateSessionUtil } from "@wso2is/authenticate";
import axios from "axios";
import { ServiceResourcesEndpoint } from "../../../../admin-portal/src/configs";

export const getUsersList = (): Promise<any> => {
   return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const header = {
            headers: {
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        return axios.get(ServiceResourcesEndpoint.users, header)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed get users list from: "
                        + ServiceResourcesEndpoint.me));
                }
                return Promise.resolve(response);
            }).catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};
