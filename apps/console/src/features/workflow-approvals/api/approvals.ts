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

import { IdentityClient } from "@asgardio/oidc-js";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../../core";
import { ApprovalStatus, ApprovalTaskDetails, ApprovalTaskListItemInterface, ApprovalTaskSummary } from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient = IdentityClient.getInstance()
    .httpRequest.bind(IdentityClient.getInstance())
    .bind(IdentityClient.getInstance());

/**
 * Fetches the list of pending approvals from the list.
 *
 * @param {number} limit - Maximum number of records to return.
 * @param {number} offset - Number of records to skip for pagination
 * @param {ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED | ApprovalStatus.ALL} status -
 *     Approval task's status to filter tasks by their status.
 * @return {Promise<any>} A promise containing the response.
 */
export const fetchPendingApprovals = (
    limit: number,
    offset: number,
    status: string
): Promise<ApprovalTaskListItemInterface[]> => {
    let requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit,
            offset,
            status
        },
        url: store.getState().config.endpoints.approvals
    };

    // To fetch all the approvals from the api, the status
    // has to set to null.
    if (status === ApprovalStatus.ALL) {
        requestConfig = {
            ...requestConfig,
            params: {
                ...requestConfig.params,
                status: null
            }
        };
    }

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as ApprovalTaskListItemInterface[]);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve the pending approvals - ${ error }`);
        });
};

/**
 * Fetches approval details when the `id` is passed in.
 *
 * @param {string} id - `id` of the approval.
 * @return {Promise<any>} A promise containing the response.
 */
export const fetchPendingApprovalDetails = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.approvals + "/" + id
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as ApprovalTaskDetails);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve the pending approval details - ${ error }`);
        });
};

/**
 * Updates the approval status.
 *
 * @param {string} id - `id` of the approval.
 * @param {ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT} status - New
 *     status.
 * @return {Promise<any>} A promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const updatePendingApprovalStatus = (
    id: string,
    status: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT
): Promise<any> => {
    const requestConfig = {
        data: {
            action: status
        },
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.approvals + "/" + id + "/state"
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to update the pending approval status - ${ error }`);
        });
};
