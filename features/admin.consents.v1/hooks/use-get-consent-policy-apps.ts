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
    RequestErrorInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { useMemo } from "react";
import { KeyedMutator } from "swr";

interface ApplicationInterface {
    id: string;
}

interface UseGetConsentPolicyAppsReturnInterface {
    data: string[];
    error: AxiosError<RequestErrorInterface> | undefined;
    isLoading: boolean;
    isValidating: boolean;
    mutate: KeyedMutator<AxiosResponse<ApplicationInterface[]>>;
}

/**
 * Hook to get the application IDs assigned to a consent purpose.
 *
 * @param purposeId - The purpose UUID.
 * @param shouldFetch - Whether to trigger the request. Defaults to `true`.
 * @returns SWR response with `data` as an array of application ID strings.
 */
const useGetConsentPolicyApps = (
    purposeId: string,
    shouldFetch: boolean = true
): UseGetConsentPolicyAppsReturnInterface => {
    const requestConfig: RequestConfigInterface = useMemo(
        (): RequestConfigInterface => ({
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: `${store.getState().config.endpoints.consentPolicyApps}/${purposeId}/applications`
        }),
        [ purposeId ]
    );

    const { data, error, isLoading, isValidating, mutate } = useRequest<ApplicationInterface[], RequestErrorInterface>(
        shouldFetch && purposeId ? requestConfig : null
    );

    const applicationIds: string[] = useMemo(
        (): string[] => {
            if (error?.response?.status === 404) {
                return [];
            }

            return data?.map((app: ApplicationInterface): string => app.id) ?? [];
        },
        [ data, error ]
    );

    return {
        data: applicationIds,
        error: error?.response?.status === 404 ? undefined : error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetConsentPolicyApps;
