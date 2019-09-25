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
import { ServiceResourcesEndpoint } from "../configs";
import { HttpMethods } from "../models/api";
import { ApprovalAction, ApprovalStates, ApprovalTaskDetails, ApprovalTaskSummary } from "../models/pending-approvals";

export const fetchPendingApprovals = (status) => {
    return AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            let requestConfig = {
                headers: {
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": CLIENT_HOST,
                    "Authorization": `Bearer ${ token }`,
                    "Content-Type": "application/json"
                },
                method: HttpMethods.GET,
                params: {
                    status
                },
                url: ServiceResourcesEndpoint.pendingApprovals
            };

            if (status === ApprovalStates.ALL) {
                requestConfig = {
                    ...requestConfig,
                    params: null
                };
            }
            return axios.request(requestConfig)
                .then((response) => {
                    return response.data as ApprovalTaskSummary[];
                })
                .catch((error) => {
                    throw error;
                });
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${ error }`);
        });
};

export const fetchPendingApprovalDetails = (id: string) => {
    return AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const requestConfig = {
                headers: {
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": CLIENT_HOST,
                    "Authorization": `Bearer ${ token }`,
                    "Content-Type": "application/json"
                },
                method: HttpMethods.GET,
                url: `${ ServiceResourcesEndpoint.pendingApprovals }/${ id }`
            };

            return axios.request(requestConfig)
                .then((response) => {
                    return response.data as ApprovalTaskDetails;
                })
                .catch((error) => {
                    throw error;
                });
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${ error }`);
        });
};

export const updatePendingApprovalState = (
    id: string,
    state: ApprovalStates.CLAIM | ApprovalStates.RELEASE | ApprovalStates.APPROVE | ApprovalStates.REJECT
) => {
    return AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const data: ApprovalAction = {
                action: state
            };
            const requestConfig = {
                data,
                headers: {
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": CLIENT_HOST,
                    "Authorization": `Bearer ${ token }`,
                    "Content-Type": "application/json"
                },
                method: HttpMethods.PUT,
                url: `${ ServiceResourcesEndpoint.pendingApprovals }/${ id }/state`
            };

            return axios.request(requestConfig)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    throw error;
                });
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${ error }`);
        });
};
