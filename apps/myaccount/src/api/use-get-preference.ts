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

import {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    useRequest
} from "../hooks/use-request";
import {
    HttpMethods,
    PreferenceConnectorResponse,
    PreferenceRequest
} from "../models";
import { store } from "../store";

/**
 * Hook to get account recovery preferences.
 *
 * @param data - Connector & property details.
 * @returns Preference GET hook.
 */
export const useGetPreference = <Data = PreferenceConnectorResponse[], Error = RequestErrorInterface>(
    data: PreferenceRequest[]
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState()?.config?.endpoints?.preference
    };

    const { data: preferenceData, isLoading, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data: preferenceData,
        error,
        isLoading,
        isValidating,
        mutate
    };
};
