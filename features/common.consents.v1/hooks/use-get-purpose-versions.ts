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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import {
    PurposeVersionListResponseDTOInterface,
    PurposeVersionSummaryDTOInterface
} from "../models/consents";

type PurposeVersionResponseType = PurposeVersionListResponseDTOInterface | PurposeVersionSummaryDTOInterface[];

/**
 * Hook to get all versions for a purpose via SWR.
 * Passing null/undefined id skips the fetch.
 *
 * @param id - ID of the purpose.
 * @returns SWR result containing purpose versions.
 */
export const useGetPurposeVersions = (
    id: string
): RequestResultInterface<PurposeVersionSummaryDTOInterface[], RequestErrorInterface> => {
    const requestConfig: RequestConfigInterface | null = id
        ? {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: `${ store.getState().config.endpoints.consentMgtPurposes }/${ id }/versions`
        }
        : null;

    const requestResult: RequestResultInterface<PurposeVersionResponseType, RequestErrorInterface> =
        useRequest<PurposeVersionResponseType, RequestErrorInterface>(requestConfig);

    const mappedData: PurposeVersionSummaryDTOInterface[] | undefined = Array.isArray(requestResult.data)
        ? requestResult.data
        : requestResult.data?.Versions;
    const mutate: RequestResultInterface<PurposeVersionSummaryDTOInterface[], RequestErrorInterface>["mutate"] =
        requestResult.mutate as unknown as
        RequestResultInterface<PurposeVersionSummaryDTOInterface[], RequestErrorInterface>["mutate"];

    return {
        data: mappedData,
        error: requestResult.error,
        isLoading: requestResult.isLoading,
        isValidating: requestResult.isValidating,
        mutate
    };
};
