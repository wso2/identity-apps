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
import { HttpMethods } from "@wso2is/core/models";
import { mapPurposeDTOToConsent } from "../api/consents";
import { ConsentInterface, PurposeDTOInterface } from "../models/consents";

/**
 * Hook to get a purpose by ID via SWR.
 * Passing null/undefined id skips the fetch.
 *
 * @param id - ID of the purpose.
 * @returns SWR result with the mapped consent.
 */
export const useGetPurpose = (id: string): RequestResultInterface<ConsentInterface, RequestErrorInterface> => {
    const requestConfig: RequestConfigInterface | null = id
        ? {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: `${ store.getState().config.endpoints.consentMgtPurposes }/${ id }`
        }
        : null;

    const requestResult: RequestResultInterface<PurposeDTOInterface, RequestErrorInterface> =
        useRequest<PurposeDTOInterface, RequestErrorInterface>(requestConfig);

    const mappedData: ConsentInterface | undefined = requestResult.data
        ? mapPurposeDTOToConsent(requestResult.data)
        : undefined;
    const mutate: RequestResultInterface<ConsentInterface, RequestErrorInterface>["mutate"] =
        requestResult.mutate as unknown as RequestResultInterface<ConsentInterface, RequestErrorInterface>["mutate"];

    return {
        data: mappedData,
        error: requestResult.error,
        isLoading: requestResult.isLoading,
        isValidating: requestResult.isValidating,
        mutate
    };
};
