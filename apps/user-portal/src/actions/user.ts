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
import { ServiceResourcesEndpoint } from "../configs/app";
import { createEmptyBasicUser } from "../models/user";

/**
 * Method to get logged in user's basic informations (Display Name, Emails, Username)
 */
export const getUserInfo = (accessToken) => {
    const userDetails = createEmptyBasicUser();
    const authUrl = ServiceResourcesEndpoint.me;
    const token = accessToken;
    const header = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/scim+json"
        }
    };

    return new Promise((resolve, reject) => {
        axios.get(authUrl, header)
            .then((endpointResponse) => {
                if (endpointResponse.status === 200) {
                    userDetails.displayName = endpointResponse.data.name.givenName || "";
                    userDetails.emails = endpointResponse.data.emails || "";
                    userDetails.username = endpointResponse.data.userName || "";
                }
                resolve(userDetails);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
