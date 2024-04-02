/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient, HttpClientInstance, HttpError, HttpResponse } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosRequestConfig } from "axios";
import { store } from "../store";

/**
 * Proptypes for bulk data.
 */
interface BulkDataPropsInterface {
    Operations?: any,
    failOnErrors?: number,
    schemas?: string[]
}

/**
 * Proptypes for bulk response.
 */
interface BulkResponseInterface {
    schemas?: string[];
    Operations?: BulkResponseOperationInterface[]
}

/**
 * Proptypes for bulk response operation.
 */
interface BulkResponseOperationInterface {
    method?: string;
    bulkId?: string;
    response?: string;
    location?: string;
    status: {
        code: number;
    }
}

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Update bulks of resources
 *
 * @param data - data request payload
 * @returns a promise containing the response.
 */
export const updateResources = (data: BulkDataPropsInterface): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.bulk
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            const bulkResponse: BulkResponseInterface | undefined = response?.data;
            let isSuccessful: boolean = true;

            if (bulkResponse?.schemas?.includes("urn:ietf:params:scim:api:messages:2.0:BulkResponse")) {
                // Show an error if any of the operations returned an error.
                bulkResponse?.Operations?.some((operation: BulkResponseOperationInterface) => {
                    const statusCode: number = operation?.status?.code;

                    if (statusCode !== 200 && statusCode !== 201 && statusCode !== 204) {
                        isSuccessful = false;

                        return false;
                    }
                });
            }

            if (!isSuccessful) {
                return Promise.reject(response);
            }

            return Promise.resolve(response);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};
