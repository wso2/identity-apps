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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { IssuerConfigListResponseInterface } from "../models/presentation-definitions";

/**
 * Hook to fetch trusted issuer configurations for a specific credential.
 *
 * @param definitionId - The ID of the parent presentation definition.
 * @param credentialId - The credential query identifier; pass undefined to skip fetching.
 * @returns RequestResultInterface with the issuer config list.
 */
export const useGetIssuerConfigs = (
    definitionId: string,
    credentialId: string | undefined
): RequestResultInterface<IssuerConfigListResponseInterface, RequestErrorInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.presentationDefinitions}` +
            `/${definitionId}/credentials/${encodeURIComponent(credentialId ?? "")}/issuer-configs`
    };

    const { data, error, isLoading, isValidating, mutate } =
        useRequest<IssuerConfigListResponseInterface, RequestErrorInterface>(
            definitionId && credentialId ? requestConfig : null
        );

    return { data, error, isLoading, isValidating, mutate };
};
