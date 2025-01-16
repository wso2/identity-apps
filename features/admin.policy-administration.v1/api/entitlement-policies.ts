/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
    HttpClientInstance, HttpError, HttpRequestConfig, HttpResponse
} from "@asgardeo/auth-react";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { PolicyInterface, PublishPolicyDataInterface } from "../models/policies";


/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Function to create a new policy.
 *
 * @param policyData - The policy data to be created.
 * @returns A promise containing the response.
 */
export const createPolicy = (
    policyData: PolicyInterface
): Promise<AxiosResponse<PolicyInterface>> => {

    const requestConfig: HttpRequestConfig = {
        data: policyData,
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.entitlementPoliciesApi
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to create the policy."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Update an existing policy with new data.
 *
 * @param policyData - The policy data to be updated (payload).
 * @returns A promise containing the updated policy data.
 */
export const updatePolicy = (
    policyData: Partial<PolicyInterface>
): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        data: policyData,
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.entitlementPoliciesApi
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Failed to update policy: " + policyData.policyId)
                );
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Deletes a policy when the relevant policy ID is passed in.
 *
 * @param policyId - ID of the policy to be deleted.
 * @returns A promise containing the response.
 */
export const deletePolicy = (policyId: string): Promise<AxiosResponse> => {

    const requestConfig: HttpRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.entitlementPoliciesApi}/${policyId}`
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200 && response.status !== 204) {
                return Promise.reject(new Error("Failed to delete the policy."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Function to publish (create) a policy using the given request data.
 *
 * @param requestData - The data needed to publish the policy.
 * @returns A promise containing the response or an error.
 */
export const publishPolicy = (
    requestData: PublishPolicyDataInterface
): Promise<AxiosResponse<any>> => {

    const requestConfig: HttpRequestConfig = {
        data: requestData,
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.entitlementPolicyPublishApi
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to publish the policy."));
            }

            return Promise.resolve(response.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

