/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { HttpMethods } from "@wso2is/core/models";
import useRequest, { RequestConfigInterface, RequestErrorInterface, RequestResultInterface }
    from "../../admin-core-v1/hooks/use-request";
import { store } from "../../admin-core-v1/store";
import { AuthorizedAPIListItemInterface } from "../models/api-resources";

/**
 * Get the authorized APIs of the application with authorized permissions.
 *
 * @param appId - Application ID.
 *
 * @returns A promise containing the response.
 */
export const useGetAuthorizedAPIList = <Data = AuthorizedAPIListItemInterface[], Error = RequestErrorInterface>(
    applicationId: string
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.applications }/${ applicationId }/authorized-apis`
    };

    /**
     * Pass `null` if the `apiResourceId` is not available. This will prevent the request from being called.
     */
    const { data, error, isValidating, mutate } = useRequest<Data, Error>(applicationId ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

