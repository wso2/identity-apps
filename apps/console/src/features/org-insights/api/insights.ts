/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
