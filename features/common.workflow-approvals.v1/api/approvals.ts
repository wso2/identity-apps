/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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
 * @param statuses - Array of approval task statuses to filter tasks by their status.
 * @returns A promise containing the response.
 */
export const fetchPendingApprovals = (
    limit: number | null,
    offset: number | null,
    statuses: string[],
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
            offset
        },
        url: approvalsUrl
    };

    // Handle status filtering.
    if (Array.isArray(statuses) && statuses.length > 0 && !statuses.includes(ApprovalStatus.ALL)) {
        // For multiple statuses, we need to construct query parameters manually
        // since axios doesn't handle multiple same-named params.
        const statusParams: string =
                statuses.map((status: string) => `status=${encodeURIComponent(status)}`).join("&");

        const baseParamsObj: Record<string, string> = {};

        if (limit !== null) baseParamsObj.limit = limit.toString();
        if (offset !== null) baseParamsObj.offset = offset.toString();
        const baseParams: string = new URLSearchParams(baseParamsObj).toString();

        requestConfig = {
            ...requestConfig,
            url: `${approvalsUrl}?${baseParams ? baseParams + "&" : ""}${statusParams}`
        };
        delete requestConfig.params;
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
