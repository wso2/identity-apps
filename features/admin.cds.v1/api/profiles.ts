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
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";

import { ProfileModel, ProfilesListResponse } from "../models/profiles";

/**
 * Initialize an auth-aware Http client (same pattern as VC templates).
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

export interface FetchProfilesParams {
    filter?: string;
    page_size?: number;
    cursor?: string | null;
    attributes?: string[];
}

/**
 * GET /profiles (cursor pagination)
 */
export const fetchCDSProfiles = (
    params: FetchProfilesParams = {}
): Promise<ProfilesListResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            ...(params.filter ? { filter: params.filter } : {}),
            ...(params.page_size ? { page_size: params.page_size } : {}),
            ...(params.cursor ? { cursor: params.cursor } : {}),
            ...(params.attributes?.length ? { attributes: params.attributes.join(",") } : {})
        },
        url: store.getState().config.endpoints.cdsProfiles
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => Promise.resolve(response.data as ProfilesListResponse))
        .catch((error: AxiosError) => Promise.reject(error));
};

/**
 * GET /profiles/{id}
 */
export const fetchCDSProfileDetails = (profileId: string): Promise<ProfileModel> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.cdsProfiles}/${profileId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => Promise.resolve(response.data as ProfileModel))
        .catch((error: AxiosError) => Promise.reject(error));
};

/**
 * DELETE /profiles/{id}
 *
 * Note: API usually returns 204. If yours returns 200, this still resolves.
 */
export const deleteCDSProfile = (profileId: string): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.cdsProfiles}/${profileId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204 && response.status !== 200) {
                // VC-style: reject so caller can handle alerts.
                return Promise.reject(response);
            }

            return Promise.resolve();
        })
        .catch((error: AxiosError) => Promise.reject(error));
};
