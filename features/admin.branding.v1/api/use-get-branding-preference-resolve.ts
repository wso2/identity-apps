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
import { store } from "../../admin.core.v1";
import { I18nConstants } from "../../admin.core.v1/constants/i18n-constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import { OrganizationType } from "../../admin.organizations.v1/constants/organization-constants";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";
import {
    BrandingPreferenceAPIResponseInterface,
    BrandingPreferenceTypes
} from "../models/branding-preferences";

/**
 * Hook to get the branding preference via Branding Preferences API.
 *
 * @param name - Resource Name.
 * @param type - Resource Type.
 * @param locale - Resource Locale.
 * @returns `RequestResultInterface<Data, Error>`
 */
const useGetBrandingPreferenceResolve = <Data = BrandingPreferenceAPIResponseInterface,
    Error = RequestErrorInterface>(
        name: string,
        type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG,
        locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
    ): RequestResultInterface<Data, Error> => {
    const { organizationType } = useGetCurrentOrganizationType();

    const tenantDomain: string = organizationType === OrganizationType.SUBORGANIZATION
        ? store.getState()?.organization?.organization?.id
        : name;

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            locale,
            name: tenantDomain,
            type
        },
        url: organizationType === OrganizationType.SUBORGANIZATION
            ? `${store.getState().config.endpoints.brandingPreferenceSubOrg}/resolve`
            : `${store.getState().config.endpoints.brandingPreference}/resolve`
    };

    const {
        data,
        error,
        isValidating,
        mutate
    } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export default useGetBrandingPreferenceResolve;
