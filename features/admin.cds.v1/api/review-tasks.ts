/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods, HttpErrorResponseDataInterface } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { ResolveReviewTaskPayload } from "../models/review-tasks";

const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * POST /identity-resolution/review-tasks/`{taskId}`/resolve
 *
 * Approving unifies the two profiles and cancels any other pending task that referenced
 * either of them; rejecting records the pair so the same match is not proposed again unless
 * the evidence materially improves. Neither is only a status change, which is why this is a
 * POST to the task rather than a PATCH of its status.
 */
export const resolveReviewTask = (
    taskId: string,
    payload: ResolveReviewTaskPayload
): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        data: payload,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.cdsReviewTasks }/${ taskId }/resolve`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 204) {
                return Promise.reject(new Error("Failed to resolve the review task."));
            }

            return Promise.resolve();
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            return Promise.reject(error);
        });
};
