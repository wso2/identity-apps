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

import { DurationDropdownOption, DurationOption } from "../models/insights";

export class OrgInsightsConstants {
    public static readonly QUERY_ORG_INSIGHTS_ERROR: string = "An error occurred while retrieving " +
    "the insights";

    public static readonly DURATION_OPTIONS: DurationDropdownOption[] = [
        {
            key: DurationOption.LAST_07_DAYS,
            text: "insights:durationOption",
            value: DurationOption.LAST_07_DAYS
        },
        {
            key: DurationOption.LAST_14_DAYS,
            text: "insights:durationOption",
            value: DurationOption.LAST_14_DAYS
        },
        {
            key: DurationOption.LAST_30_DAYS,
            text: "insights:durationOption",
            value: DurationOption.LAST_30_DAYS
        }
    ]

    public static readonly GRID_COLOR: string = "#ccc";

    public static readonly CURRENT_PERIOD_GRAPH_COLOR: string = "green";

    public static readonly FAILED_LOGIN_GRAPH_COLOR: string = "red";

    public static readonly FILTER_VALUE_INPUT_MAX_LENGTH: number = 50;
}
