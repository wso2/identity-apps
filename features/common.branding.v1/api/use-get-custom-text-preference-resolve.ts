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

import { I18nConstants } from "@wso2is/admin.core.v1/constants/i18n-constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants/organization-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { BrandingPreferenceTypes } from "../models/branding-preferences";
import { HttpMethods } from "@wso2is/core/models";
import { mutate as swrMutate } from "swr";
import { CustomTextPreferenceApiConstants } from "../constants/custom-text-preference-constants";
import { CustomTextPreferenceAPIResponseInterface } from "../models/custom-text-preference";

const useGetCustomTextPreferenceResolve = <
    Data = CustomTextPreferenceAPIResponseInterface,
    Error = RequestErrorInterface
>(
    shouldFetch: boolean,
    name: string,
    screen: string,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG
): RequestResultInterface<Data, Error> => {
    const { organizationType } = useGetCurrentOrganizationType();

    const endpointUrl: string = organizationType === OrganizationType.SUBORGANIZATION
        ? `${store.getState().config.endpoints.brandingTextPreferenceSubOrg}/resolve`
        : `${store.getState().config.endpoints.brandingTextPreference}/resolve`;

    const tenantDomain: string = organizationType === OrganizationType.SUBORGANIZATION
        ? store.getState()?.organization?.organization?.id
        : name;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            locale,
            name: tenantDomain,
            screen,
            type
        },
        url: endpointUrl
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null, {
        shouldRetryOnError: false
    });

    const mutateMultiple = () => {
        swrMutate(
            (key: string) => typeof key === "string" && key.includes(endpointUrl),
            undefined,
            { revalidate: false }
        );
    };

    if ((error?.response?.data as any)?.code
        === CustomTextPreferenceApiConstants.CUSTOM_TEXT_PREFERENCE_NOT_CONFIGURED_ERROR_CODE) {
        return {
            data: null,
            error,
            isLoading,
            isValidating,
            mutate,
            mutateMultiple
        };
    }

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        mutateMultiple
    };
};

export default useGetCustomTextPreferenceResolve;
