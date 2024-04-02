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

import { DropdownChild } from "@wso2is/forms";
import { I18n } from "@wso2is/i18n";
import { ReactNode } from "react";
import { ActivityType } from "../models/insights";

/**
 * Function to get the resource endpoints for the Org Insights feature.
 * 
 * @param serverHost - Server Host.
 * 
 * @returns The resource endpoints for the Org Insights feature.
 */
export const getInsightsResourceEndpoints = (serverHost: string): {
    getInsights: string;
} => (
    {
        getInsights: `${ serverHost }/api/asgardeo/insights/v1/user` 
    }
);

export const getFilterAttributeListByActivityType = (activityType: ActivityType): Omit<DropdownChild,"key">[] => {
    
    const commonFilterAttributes: Omit<DropdownChild,"key">[] = [
        {
            text: I18n.instance.t(
                "insights:commonFilters.userId"
            ) as ReactNode,
            value: "userId"
        }
    ];

    const filterAttributeMap: Partial<Record<ActivityType, Omit<DropdownChild,"key">[]>> = {
        [ActivityType.LOGIN]: [
            {
                text: I18n.instance.t(
                    "insights:activityType.login.filters.serviceProvider"
                ) as ReactNode,
                value: "serviceProvider"
            },
            ...commonFilterAttributes,
            {
                text: I18n.instance.t(
                    "insights:activityType.login.filters.userStore"
                ) as ReactNode,
                value: "userstoreDomain"
            },
            {
                text: I18n.instance.t(
                    "insights:activityType.login.filters.authenticator.attributeName"
                ) as ReactNode,
                value: "authenticator"
            },
            {
                text: I18n.instance.t(
                    "insights:activityType.login.filters.identityProvider"
                ) as ReactNode,
                value: "identityProvider"
            }
        ],
        [ActivityType.REGISTRATION]: [
            {
                text: I18n.instance.t(
                    "insights:activityType.registration.filters.onboardingMethod.attributeName"
                ) as ReactNode,
                value: "onboardingMethod"
            },
            ...commonFilterAttributes
        ]
    };

    return filterAttributeMap[activityType];
};
