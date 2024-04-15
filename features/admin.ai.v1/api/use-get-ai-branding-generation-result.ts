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
import useAIBrandingPreference from "features/admin.ai.v1/hooks/use-ai-branding-preference";
import { useEffect, useState } from "react";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import { store } from "../../admin.core.v1/store";
import { OrganizationType } from "../../admin.organizations.v1/constants/organization-constants";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";
import { BrandingGenerationResultAPIResponseInterface } from "../models/branding-preferences";

export const useGetAIBrandingGenerationResult = (
    operationId: string,
    brandingGenerationCompleted: boolean
): RequestResultInterface<BrandingGenerationResultAPIResponseInterface, RequestErrorInterface> => {

    const { organizationType } = useGetCurrentOrganizationType();

    // const { brandingGenerationCompleted } = useAIBrandingPreference();

    const [ isLoading, setIsLoading ] = useState(true);

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        // url: organizationType === OrganizationType.SUBORGANIZATION
        //     ? `${store.getState().config.endpoints.brandingPreferenceSubOrg}/status/${operationId}`
        //     : `${store.getState().config.endpoints.brandingPreference}/status/${operationId}`

        url: `http://localhost:8080/t/cryd1/api/server/v1/branding-preference/result/${operationId}`
    };

    const { data, error, isValidating, mutate } =
    useRequest<BrandingGenerationResultAPIResponseInterface, RequestErrorInterface>(brandingGenerationCompleted ? requestConfig : null, {
        shouldRetryOnError: false
    });

    useEffect(() => {
        if (brandingGenerationCompleted) {
            // If brandingGenerationCompleted is true, re-fetch the data
            mutate();
        }
    }, [ brandingGenerationCompleted ]);

    console.log("data (hook)", data);
    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetAIBrandingGenerationResult;
