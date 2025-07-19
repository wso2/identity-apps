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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { OrganizationListInterface } from "@wso2is/admin.organizations.v1/models";
import { HttpMethods } from "@wso2is/core/models";

/**
 * Hook to get the list of organizations which the application is shared to.
 *
 * @param applicationId - ID of the application.
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetApplicationShare = <
    Data = OrganizationListInterface,
    Error = RequestErrorInterface>(
        applicationId: string,
        shouldFetch: boolean,
        recursive: boolean = true,
        filter: string,
        excludedAttributes?: string,
        limit?: number,
        before?: string,
        after?: string,
        attributes?: string
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            after,
            attributes,
            before,
            excludedAttributes,
            filter,
            limit,
            recursive
        },
        url: `${store.getState().config.endpoints.applications}/${applicationId}/share`
    };

    const {
        data,
        error,
        isValidating,
        isLoading,
        mutate
    } = useRequest<Data, Error>(shouldFetch ? requestConfig : null, {
        shouldRetryOnError: false
    });

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetApplicationShare;
