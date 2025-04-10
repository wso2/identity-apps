/**
 * Hook to get Workflow Model details.
 *
 * @param workflowModelId - Workflow Model ID.
 * @param shouldFetch - If true, will fetch the data.
 *
 * @returns Requested data.
 */

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    RevalidatorInterface,
    RevalidatorOptionsInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { WorkflowDetails } from "../models";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "@wso2is/admin.core.v1/store";
import { AxiosError, AxiosResponse } from "axios";
import { BareFetcher, PublicConfiguration } from "swr/dist/_internal";
import { useState } from "react";

const useGetWorkflowModelDetails = <Data = WorkflowDetails, Error = RequestErrorInterface>(
    workflowModelId: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> & { remainingRetryCount: number } => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.workflows}/${workflowModelId}`
     };

     const RETRY_INTERVAL: number = 2000;
     const RETRY_COUNT_LIMIT: number = 10;
     const [ remainingRetryCount, setRemainingRetryCount ] = useState<number>(RETRY_COUNT_LIMIT);
 
     const {
         data,
         error,
         isLoading,
         isValidating,
         mutate
     } = useRequest<Data, Error>(
         shouldFetch ? requestConfig : null,
         {
             onErrorRetry: (
                 error: AxiosError<Error>,
                 _: string,
                 __: Readonly<PublicConfiguration<AxiosResponse<Data>, AxiosError<Error>, BareFetcher<any>>>,
                 revalidate: RevalidatorInterface,
                 { retryCount }: Required<RevalidatorOptionsInterface>
             ) => {
                 if (error?.response?.status !== 404) {
                     return;
                 }
 
                 setRemainingRetryCount(RETRY_COUNT_LIMIT - retryCount);
                 if (retryCount >= RETRY_COUNT_LIMIT) {
                     return;
                 }
 
                 setTimeout(() => revalidate({ retryCount }), RETRY_INTERVAL);
             },
             shouldRetryOnError: true
         }
     );
 
     return {
         data,
         error,
         isLoading,
         isValidating,
         mutate,
         remainingRetryCount
     };

};

export default useGetWorkflowModelDetails;
