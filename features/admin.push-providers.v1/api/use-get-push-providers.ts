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
import { AcceptHeaderValues, ContentTypeHeaderValues, HttpMethods } from "@wso2is/core/models";
import { PushProviderAPIResponseInterface } from "../models/push-providers";

/**
 * Hook to fetch the push provider list from the API.
 *
 * @returns List of push providers.
 */
const useGetPushProvidersList = <Data = PushProviderAPIResponseInterface[], Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data,Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": ContentTypeHeaderValues.APP_JSON
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.pushProviders
    };
    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetPushProvidersList;
