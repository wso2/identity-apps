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
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { ApplicationTemplateMetadataInterface } from "@wso2is/admin.application-templates.v1/models/templates";

/**
 * Fetch application template metadata for onboarding without the exclusion list
 * applied by the shared `useGetApplicationTemplateMetadata` hook.
 *
 * The shared hook excludes generic templates (mobile-application, single-page-application, etc.)
 * from the metadata API. For onboarding, we want to fetch guide content for ALL templates
 * so that the success step can show API-fetched integration guides regardless of template type.
 * If the server doesn't have metadata for a given template, the request returns an error
 * and the UI gracefully falls back to the OIDC configuration display.
 *
 * @param templateId - The application template ID
 * @param shouldFetch - Whether to actually make the request
 * @returns SWR request result with template metadata
 */
const useGetTemplateGuide = (
    templateId: string,
    shouldFetch: boolean = true
): RequestResultInterface<ApplicationTemplateMetadataInterface, RequestErrorInterface> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store?.getState()?.config?.endpoints?.applicationTemplateMetadata?.replace("{{id}}", templateId)
    };

    const { data, error, isLoading, isValidating, mutate } =
        useRequest<ApplicationTemplateMetadataInterface, RequestErrorInterface>(
            shouldFetch ? requestConfig : null
        );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetTemplateGuide;
