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

import { AxiosError } from "axios";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

import { FetchProfilesParams, fetchCDSProfileDetails, fetchCDSProfiles } from "../api/profiles";
import { ProfileModel, ProfilesListResponse } from "../models/profiles";

/**
 * SWR Hook: GET /profiles
 *
 * @param params - Query parameters for filtering and pagination
 * @param config - SWR configuration options
 * @returns SWR response with profiles data
 */
export const useCDSProfiles = (
    params: FetchProfilesParams = {},
    config?: SWRConfiguration<ProfilesListResponse, AxiosError>
): SWRResponse<ProfilesListResponse, AxiosError> => {
    const key: ["cds-profiles", FetchProfilesParams] | null = params ? [ "cds-profiles", params ] : null;

    return useSWR<ProfilesListResponse, AxiosError>(
        key,
        () => fetchCDSProfiles(params),
        config
    );
};

/**
 * SWR Hook: GET /profiles/`{id}`
 *
 * @param profileId - Profile ID to fetch, or null to disable fetching
 * @param config - SWR configuration options
 * @returns SWR response with profile details
 */
export const useCDSProfileDetails = (
    profileId: string | null,
    config?: SWRConfiguration<ProfileModel, AxiosError>
): SWRResponse<ProfileModel, AxiosError> => {
    const key: ["cds-profile", string] | null = profileId ? [ "cds-profile", profileId ] : null;

    return useSWR<ProfileModel, AxiosError>(
        key,
        profileId ? () => fetchCDSProfileDetails(profileId) : null,
        config
    );
};
