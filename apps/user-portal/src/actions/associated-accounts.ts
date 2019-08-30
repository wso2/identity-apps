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
import axios, { AxiosResponse } from "axios";
import log from "log";
import { ServiceResourcesEndpoint } from "../configs";

/**
 * Retrieve the user account associations of the currently authenticated user.
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
export const getAssociations = () => {
    const token = AuthenticateSessionUtil.getAccessToken(CLIENT_ID, CLIENT_HOST);
    const header = {
        headers: {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

    return axios.get(ServiceResourcesEndpoint.associations, header)
        .then((response) => {
            if (!(response.status === 200)) {
                Promise.reject(Error);
            }
            return response;
        })
        .catch((error) => {
            log.error(error);
            return Promise.reject(error);
        });
};

/**
 * Add new associate account for the currently authenticated user.
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
export const addAccountAssociation = (data: object) => {
    const token = AuthenticateSessionUtil.getAccessToken(CLIENT_ID, CLIENT_HOST);
    const header = {
        headers: {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

    return axios.post(ServiceResourcesEndpoint.associations, data, header)
        .then((response) => {
            if (!(response.status === 200)) {
                Promise.reject(Error);
            }
            return response;
        })
        .catch((error) => {
            log.error(error);
            Promise.reject(error);
            return error.response;
        });
};

/**
 * Remove a user account association for the currently authenticated user.
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
export const removeAssociation = () => {
    const token = AuthenticateSessionUtil.getAccessToken(CLIENT_ID, CLIENT_HOST);
    const header = {
        headers: {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

    return axios.delete(ServiceResourcesEndpoint.associations, {
        params: {

        }
    });
};
