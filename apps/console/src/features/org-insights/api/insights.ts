/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient, HttpClientInstance, HttpResponse } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosRequestConfig } from "axios";
import { store } from "../../core";
import { OrgInsightsConstants } from "../constants/org-insights";
import { 
    DurationOption, 
    GetInsightsParamsInterface, 
    InsightsResponseInterface, 
    ResourceType 
} from "../models/insights";
import { getTimestamps } from "../utils/insights";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches the insights data for the given duration and resource type.
 * 
 * @param durationOption - Duration option.
 * @param resourceType - Resource type.
 * @param lastPeriod - Whether to fetch the insights for the last period.
 * 
 * @returns A promise containing the insights data.
 */
export async function getInsights(
    durationOption: DurationOption, 
    resourceType: ResourceType,
    filterQuery?: string,
    lastPeriod?: boolean
): Promise<InsightsResponseInterface> {

    const requestBody: GetInsightsParamsInterface = {
        ...getTimestamps(durationOption, { lastPeriod }),
        filter: filterQuery ?? "",
        getCumulativeUsage: false,
        resourceType
    };

    const requestConfig: AxiosRequestConfig = {
        data: requestBody,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.getInsights
    };

    try {
        const response: HttpResponse = await httpClient(requestConfig);

        if (response.status !== 200) {
            throw new IdentityAppsApiException(
                OrgInsightsConstants.QUERY_ORG_INSIGHTS_ERROR,
                null,
                response.status,
                response.request,
                response,
                response.config);
        }

        return await Promise.resolve(response.data);
    } catch (error) {
        throw new IdentityAppsApiException(
            OrgInsightsConstants.QUERY_ORG_INSIGHTS_ERROR,
            error.stack,
            error.code,
            error.request,
            error.response,
            error.config);
    }
}
