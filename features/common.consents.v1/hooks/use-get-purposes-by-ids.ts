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

import { AsgardeoSPAClient, HttpRequestConfig } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import useSWR, { SWRResponse } from "swr";
import { mapPurposeDTOToConsent } from "../api/consents";
import { ConsentInterface, PurposeDTOInterface } from "../models/consents";

const httpClient: (config: HttpRequestConfig) => Promise<any> = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to fetch full purpose details for a given list of IDs in parallel.
 * Returns mapped ConsentInterface items including the mandatory flag.
 *
 * @param ids - Array of purpose IDs to fetch.
 * @returns SWR result with mapped consent details and loading state.
 */
export const useGetPurposesByIds = (
    ids: string[]
): { data: ConsentInterface[]; isLoading: boolean } => {
    const baseUrl: string = store.getState().config.endpoints.consentMgtPurposes;

    const { data, isLoading }: SWRResponse<ConsentInterface[]> = useSWR<ConsentInterface[]>(
        ids.length > 0 ? [ "purposes-by-ids", ...[ ...ids ].sort() ] : null,
        async (): Promise<ConsentInterface[]> => {
            const results: ConsentInterface[] = await Promise.all(
                ids.map(async (id: string): Promise<ConsentInterface> => {
                    const config: HttpRequestConfig = {
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        method: HttpMethods.GET,
                        url: `${ baseUrl }/${ id }`
                    };
                    const response: any = await httpClient(config);

                    return mapPurposeDTOToConsent(response.data as PurposeDTOInterface);
                })
            );

            return results;
        }
    );

    return { data: data ?? [], isLoading: isLoading ?? false };
};
