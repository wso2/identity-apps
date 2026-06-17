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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

const getPurposeAppsUrl = (purposeId: string): string =>
    `${store.getState().config.endpoints.consentPolicyApps}/${purposeId}/applications`;

const getPurposeAppUrl = (purposeId: string, applicationId: string): string =>
    `${getPurposeAppsUrl(purposeId)}/${applicationId}`;

const JSON_HEADERS: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json"
};

export interface ApplicationObject {
    id: string;
}

/**
 * Fetches the application IDs assigned to a consent purpose.
 *
 * @param purposeId - The purpose UUID.
 * @returns Array of application IDs, or empty array if the purpose has no assignments.
 */
export const getConsentPolicyApps = (purposeId: string): Promise<string[]> => {
    const requestConfig: AxiosRequestConfig = {
        headers: JSON_HEADERS,
        method: HttpMethods.GET,
        url: getPurposeAppsUrl(purposeId)
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse): string[] =>
            (response.data as ApplicationObject[]).map((app: ApplicationObject): string => app.id)
        )
        .catch((error: AxiosError): string[] => {
            if (error?.response?.status === 404) {
                return [];
            }
            throw error;
        });
};

/**
 * Saves the application assignments for a consent purpose.
 * Diffs against current state: adds new apps and removes de-selected ones.
 *
 * @param purposeId - The purpose UUID.
 * @param newIds - The full desired set of application IDs.
 */
export const saveConsentPolicyApps = (purposeId: string, newIds: string[]): Promise<void> => {
    return getConsentPolicyApps(purposeId)
        .then((currentIds: string[]): Promise<void> => {
            const currentSet: Set<string> = new Set<string>(currentIds);
            const newSet: Set<string> = new Set<string>(newIds);

            const toAdd: string[] = newIds.filter((id: string): boolean => !currentSet.has(id));
            const toRemove: string[] = currentIds.filter((id: string): boolean => !newSet.has(id));

            const addRequests: Promise<void>[] = toAdd.map((id: string): Promise<void> => {
                const config: AxiosRequestConfig = {
                    data: { id } as ApplicationObject,
                    headers: JSON_HEADERS,
                    method: HttpMethods.POST,
                    url: getPurposeAppsUrl(purposeId)
                };

                return httpClient(config).then((): void => undefined);
            });

            const removeRequests: Promise<void>[] = toRemove.map((id: string): Promise<void> => {
                const config: AxiosRequestConfig = {
                    headers: JSON_HEADERS,
                    method: HttpMethods.DELETE,
                    url: getPurposeAppUrl(purposeId, id)
                };

                return httpClient(config).then((): void => undefined);
            });

            return Promise.all([ ...addRequests, ...removeRequests ]).then((): void => undefined);
        });
};

/**
 * Removes all application assignments for a consent purpose.
 *
 * @param purposeId - The purpose UUID.
 */
export const deleteConsentPolicyApps = (purposeId: string): Promise<void> => {
    return getConsentPolicyApps(purposeId)
        .then((currentIds: string[]): Promise<void> => {
            const removeRequests: Promise<void>[] = currentIds.map((id: string): Promise<void> => {
                const config: AxiosRequestConfig = {
                    headers: JSON_HEADERS,
                    method: HttpMethods.DELETE,
                    url: getPurposeAppUrl(purposeId, id)
                };

                return httpClient(config).then((): void => undefined);
            });

            return Promise.all(removeRequests).then((): void => undefined);
        });
};
