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

import { HttpMethods } from "@wso2is/core/models";
import { useEffect, useState } from "react";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import { store } from "../../admin.core.v1/store";
import { AILoginFlowGenerationStatusAPIResponseInterface } from "../models/ai-login-flow";
import useAILoginFlow from "../hooks/use-ai-login-flow";

export const useAILoginFlowGenerationStatus = (
    operationId: string
): RequestResultInterface<AILoginFlowGenerationStatusAPIResponseInterface, RequestErrorInterface> =>{

    const [ isLoading, setIsLoading ] = useState(true);

    const { setLoginFlowGenerationCompleted } = useAILoginFlow();

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.applications}/loginflow/status/${operationId}`
    };

    const { data, error, isValidating, mutate } =
        useRequest<AILoginFlowGenerationStatusAPIResponseInterface, RequestErrorInterface>(requestConfig, {
            shouldRetryOnError: false
        });

    useEffect(() => {
        const interval: NodeJS.Timeout = setInterval(() => {
            if (!isValidating && !data?.status?.login_flow_generation_complete) {
                mutate();
            }
        }, 1000);

        if (data?.status?.login_flow_generation_complete) {
            setIsLoading(false);
            clearInterval(interval);
            setLoginFlowGenerationCompleted(true);
        } else {
            setIsLoading(true);
        }

        return () => clearInterval(interval);
    }, [ data, isValidating, mutate ]);

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};
