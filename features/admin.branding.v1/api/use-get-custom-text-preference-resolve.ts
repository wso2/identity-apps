/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { mutate as swrMutate } from "swr";
import { I18nConstants } from "../../admin.core.v1/constants/i18n-constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import { store } from "../../admin.core.v1/store";
import { OrganizationType } from "../../admin.organizations.v1/constants/organization-constants";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";
import { CustomTextPreferenceConstants } from "../constants/custom-text-preference-constants";
import { BrandingPreferenceTypes } from "../models/branding-preferences";
import {
    CustomTextPreferenceAPIResponseInterface
} from "../models/custom-text-preference";

/**
 * Hook to get the branding preference text customizations from the API.
 *
 * @param shouldFetch - Should fetch the data.
 * @param name - Resource Name.
 * @param screen - Resource Screen.
 * @param locale - Resource Locale.
 * @param type - Resource Type.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetCustomTextPreferenceResolve = <
    Data = CustomTextPreferenceAPIResponseInterface,
    Error = RequestErrorInterface>(
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

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch? requestConfig : null, {
        shouldRetryOnError: false
    });

    /**
     * This function is used to mutate the request cache of custom text preference retrieval requests
     * across all screens.
     *
     * @remarks
     *
     * If you want to mutate the request cache of a custom text preference retrieval
     * request for a specific screen, use 'mutate' instead.
     */
    const mutateMultiple = () => {
        swrMutate(
            (key: string) => {
                return typeof key === "string" && key.includes(endpointUrl);
            },
            undefined,
            { revalidate: false }
        );
    };

    if ((error?.response?.data as any)?.code
        === CustomTextPreferenceConstants.CUSTOM_TEXT_PREFERENCE_NOT_CONFIGURED_ERROR_CODE) {
        return {
            data: null,
            error,
            isLoading: !error && !data,
            isValidating,
            mutate,
            mutateMultiple
        };
    }

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate,
        mutateMultiple
    };
};

export default useGetCustomTextPreferenceResolve;
