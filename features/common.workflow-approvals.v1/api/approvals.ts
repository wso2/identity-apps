/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
    AsgardeoSPAClient,
    HttpClientInstance,
    HttpError,
    HttpRequestConfig,
    HttpResponse } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { ApprovalStatus, ApprovalTaskDetails, ApprovalTaskListItemInterface } from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches the list of pending approvals from the list.
 *
 * @param limit - Maximum number of records to return.
 * @param offset - Number of records to skip for pagination
 * @param status - Approval task's status to filter tasks by their status.
 * @returns A promise containing the response.
 */
export const fetchPendingApprovals = (
    limit: number,
    offset: number,
    status: string,
    approvalsUrl: string
): Promise<ApprovalTaskListItemInterface[]> => {
    let requestConfig: HttpRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit,
            offset,
            status
        },
        url: approvalsUrl
    };

    console.log("received url: ", approvalsUrl);

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
        .then((response: HttpResponse) => {
            return Promise.resolve(response.data as ApprovalTaskListItemInterface[]);
        })
        .catch((error: HttpError) => {
            return Promise.reject(`Failed to retrieve the pending approvals - ${ error }`);
        });
};

/**
 * Fetches approval details when the `id` is passed in.
 *
 * @param id - `id` of the approval.
 * @returns A promise containing the response.
 */
export const fetchPendingApprovalDetails = (id: string, approvalsUrl: string): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: approvalsUrl + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            return Promise.resolve(response.data as ApprovalTaskDetails);
        })
        .catch((error: HttpError) => {
            return Promise.reject(`Failed to retrieve the pending approval details - ${ error }`);
        });
};

/**
 * Updates the approval status.
 *
 * @param id - `id` of the approval.
 * @param status - New status.
 * @returns A promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const updatePendingApprovalStatus = (
    id: string,
    status: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT,
    approvalsUrl: string
): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        data: {
            action: status
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: approvalsUrl + "/" + id + "/state"
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            return Promise.resolve(response);
        })
        .catch((error: HttpError) => {
            return Promise.reject(`Failed to update the pending approval status - ${ error }`);
        });
};
