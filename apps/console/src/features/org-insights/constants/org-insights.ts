/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DurationDropdownOption, DurationOption } from "../models/insights";

export class OrgInsightsConstants {
    public static readonly QUERY_ORG_INSIGHTS_ERROR: string = "An error occurred while retrieving " +
    "the insights";

    public static readonly DURATION_OPTIONS: DurationDropdownOption[] = [
        {
            key: DurationOption.LAST_07_DAYS,
            text: "console:manage.features.insights.durationOption",
            value: DurationOption.LAST_07_DAYS
        },
        {
            key: DurationOption.LAST_14_DAYS,
            text: "console:manage.features.insights.durationOption",
            value: DurationOption.LAST_14_DAYS
        },
        {
            key: DurationOption.LAST_30_DAYS,
            text: "console:manage.features.insights.durationOption",
            value: DurationOption.LAST_30_DAYS
        }
    ]

    public static readonly GRID_COLOR: string = "#ccc";

    public static readonly CURRENT_PERIOD_GRAPH_COLOR: string = "green";

    public static readonly FAILED_LOGIN_GRAPH_COLOR: string = "red";

    public static readonly FILTER_VALUE_INPUT_MAX_LENGTH: number = 50;
}
