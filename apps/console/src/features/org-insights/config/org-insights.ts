/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
                "console:manage.features.insights.commonFilters.userId"
            ) as ReactNode,
            value: "userId"
        }
    ];

    const filterAttributeMap: Partial<Record<ActivityType, Omit<DropdownChild,"key">[]>> = {
        [ActivityType.LOGIN]: [
            {
                text: I18n.instance.t(
                    "console:manage.features.insights.activityType.login.filters.serviceProvider"
                ) as ReactNode,
                value: "serviceProvider"
            },
            ...commonFilterAttributes,
            {
                text: I18n.instance.t(
                    "console:manage.features.insights.activityType.login.filters.userStore"
                ) as ReactNode,
                value: "userstoreDomain"
            }
        ],
        [ActivityType.REGISTRATION]: [
            {
                text: I18n.instance.t(
                    "console:manage.features.insights.activityType.registration.filters.onboardingMethod.attributeName"
                ) as ReactNode,
                value: "onboardingMethod"
            },
            ...commonFilterAttributes
        ]
    };

    return filterAttributeMap[activityType];
};
