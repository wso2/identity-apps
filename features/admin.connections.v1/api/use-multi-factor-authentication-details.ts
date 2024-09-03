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

import { store } from "@wso2is/admin.core.v1";
import useRequest, {
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosRequestConfig } from "axios";
import {
    MultiFactorAuthenticatorInterface
} from "../models/authenticators";

/**
 * Hook to get multi factor authenticator details.
 *
 * @param id - Authenticator id.
 *
 * @returns Response as a promise.
 */
const useMultiFactorAuthenticatorDetails = <
    Data = MultiFactorAuthenticatorInterface,
    Error = RequestErrorInterface>(
        id: string
    ): RequestResultInterface<Data, Error> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.multiFactorAuthenticators }/connectors/${ id }`
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export default useMultiFactorAuthenticatorDetails;
