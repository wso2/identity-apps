/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { useEffect, useState } from "react";
import useGetRegistrationFlow from "../hooks/use-ai-generated-registration-flow";

/**
 * This hook is used to get the registration flow generation status.
 *
 * @returns The result of the registration flow generation status request.
 */
const useAIRegistrationFlowGenerationStatus = ():
    RequestResultInterface<any, RequestErrorInterface> =>{

    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    const { setFlowGenerationCompleted, operationId } = useGetRegistrationFlow();

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.registrationFlowAI }/status/${operationId}`
    };

    const { data, error, isValidating, mutate } =
        useRequest<any, RequestErrorInterface>(requestConfig, {
            shouldRetryOnError: false
        });

    useEffect(() => {
        const interval: ReturnType<typeof setInterval> = setInterval(() => {
            if (!isValidating && !data?.status?.generation_of_registration_flow_complete) {
                mutate();
            }
        }, 1000);

        if (data?.status?.generation_of_registration_flow_complete) {
            setIsLoading(false);
            clearInterval(interval);
            setFlowGenerationCompleted(true);
        } else {
            setIsLoading(true);
        }

        return () => clearInterval(interval);
    }, [ data, isValidating ]);

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useAIRegistrationFlowGenerationStatus;
