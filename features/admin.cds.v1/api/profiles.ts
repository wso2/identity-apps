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

import axios from "axios";
import { ProfilesListResponse } from "../models/profiles";

export interface FetchProfilesParams {
    filter?: string;
    page_size?: number;
    cursor?: string | null;
    attributes?: string[];   // backend expects "attributes"
}

export const fetchCDSProfiles = async (
    params: FetchProfilesParams = {}
): Promise<ProfilesListResponse> => {

    const res = await axios.get("https://localhost:8900/t/carbon.super/cds/api/v1/profiles", {
        params: {
            ...(params.filter ? { filter: params.filter } : {}),
            ...(params.page_size ? { page_size: params.page_size } : {}),
            ...(params.cursor ? { cursor: params.cursor } : {}),
            ...(params.attributes?.length
                ? { attributes: params.attributes.join(",") }
                : {})
        }
    });

    return res.data;
};

export const fetchCDSProfileDetails = async (profileId: string) => {
    try {
        const response = await axios.get("https://localhost:8900/t/carbon.super/cds/api/v1/profiles/"+profileId);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user details for ${profileId}:`, error);
        return null;
    }
};

export const deleteCDSProfile = async (profileId: string): Promise<void> => {
    await axios.delete("https://localhost:8900/t/carbon.super/cds/api/v1/profiles/"+profileId);
};
