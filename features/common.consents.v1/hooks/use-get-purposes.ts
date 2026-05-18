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
import { mapPurposeSummaryToListItem } from "../api/consents";
import { ConsentListItemInterface, PurposeListResponseDTOInterface } from "../models/consents";

interface UseGetPurposesParamsInterface {
    after?: string;
    before?: string;
    filter?: string;
    limit: number;
}

/**
 * Hook to get the list of purposes via SWR.
 *
 * @param params - Pagination parameters. Pass `null` to skip the request.
 * @returns SWR result with the mapped consent list and links.
 */
export const useGetPurposes = (
    params: UseGetPurposesParamsInterface | null
): RequestResultInterface<PurposeListResponseDTOInterface, RequestErrorInterface> & {
    mappedData: ConsentListItemInterface[] | undefined;
} => {
    const requestConfig: RequestConfigInterface | null = params
        ? {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            params: {
                ...(params.after ? { after: params.after } : {}),
                ...(params.before ? { before: params.before } : {}),
                ...(params.filter ? { filter: params.filter } : {}),
                limit: params.limit
            },
            url: store.getState().config.endpoints.consentMgtPurposes
        }
        : null;

    const requestResult: RequestResultInterface<PurposeListResponseDTOInterface, RequestErrorInterface> =
        useRequest<PurposeListResponseDTOInterface, RequestErrorInterface>(requestConfig);

    const mappedData: ConsentListItemInterface[] | undefined = requestResult.data?.Purposes
        ?.map(mapPurposeSummaryToListItem);

    return {
        ...requestResult,
        mappedData
    };
};
