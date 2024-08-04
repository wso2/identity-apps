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
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants/organization-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { HttpMethods } from "@wso2is/core/models";
import { useEffect } from "react";
import { BrandingGenerationResultAPIResponseInterface } from "../models/branding-preferences";

/**
 * Hook to get the AI branding generation result from the API.
 *
 * @param operationId - Operation ID of the branding generation process.
 * @param brandingGenerationCompleted - Flag to determine if the branding generation is completed.
 */
export const useGetAIBrandingGenerationResult = (
    operationId: string,
    brandingGenerationCompleted: boolean
): RequestResultInterface<BrandingGenerationResultAPIResponseInterface, RequestErrorInterface> => {

    const { organizationType } = useGetCurrentOrganizationType();

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: organizationType === OrganizationType.SUBORGANIZATION
            ? `${store.getState().config.endpoints.brandingPreferenceSubOrg}/result/${operationId}`
            : `${store.getState().config.endpoints.brandingPreference}/result/${operationId}`

    };

    const { data, error, isValidating, mutate } =
    useRequest<BrandingGenerationResultAPIResponseInterface, RequestErrorInterface>
    (brandingGenerationCompleted ? requestConfig : null, {
        shouldRetryOnError: false
    });

    useEffect(() => {
        if (brandingGenerationCompleted) {
            mutate();
        }
    }, [ brandingGenerationCompleted ]);

    return {
        data,
        error,
        isValidating,
        mutate
    };
};

export default useGetAIBrandingGenerationResult;
