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
    RequestResultInterface,
    RevalidatorInterface,
    RevalidatorOptionsInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { BareFetcher, PublicConfiguration } from "swr/dist/_internal";
import { RETRY_COUNT_LIMIT, RETRY_INTERVAL } from "../constants/approval-workflow-constants";
import { WorkflowDetails } from "../models";

/**
 * Hook to get the approval workflow details.
 *
 * @param approvalWorkflowId - Id of the approval workflow to be fetched.
 * @param shouldFetch - If true, will fetch the data.
 *
 * @returns approval workflow details.
 */
export const useGetApprovalWorkflowDetails = <Data = WorkflowDetails, Error = RequestErrorInterface>(
    approvalWorkflowId: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> & { remainingRetryCount: number } => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState()?.config?.endpoints?.workflows}/${approvalWorkflowId}`
    };

    const [ remainingRetryCount, setRemainingRetryCount ] = useState(RETRY_COUNT_LIMIT);
    const retryTimeout: MutableRefObject<number> = useRef<number | null>(null);

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null,
        {
            onErrorRetry: (
                error: AxiosError<Error>,
                _: string,
                __: Readonly<PublicConfiguration<AxiosResponse<Data>, AxiosError<Error>, BareFetcher<any>>>,
                revalidate: RevalidatorInterface,
                { retryCount }: Required<RevalidatorOptionsInterface>
            ) => {
                if (error?.response?.status !== 404) return;

                const remaining: number = RETRY_COUNT_LIMIT - retryCount;

                setRemainingRetryCount(remaining);

                if (retryCount >= RETRY_COUNT_LIMIT) {
                    if (retryTimeout.current) {
                        clearTimeout(retryTimeout.current);
                    }

                    return;
                }

                retryTimeout.current = window.setTimeout(() => {
                    revalidate({ retryCount });
                }, RETRY_INTERVAL);
            },
            shouldRetryOnError: true
        }
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (retryTimeout.current) {
                clearTimeout(retryTimeout.current);
            }
        };
    }, []);

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        remainingRetryCount
    };
};
