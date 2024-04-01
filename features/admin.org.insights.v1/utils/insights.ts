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

import orderBy from "lodash-es/orderBy";
import pull from "lodash-es/pull";
import moment from "moment";
import { FeatureConfigInterface } from "../../admin-core-v1/models";
import { store } from "../../admin-core-v1/store";
import { getInsights } from "../api/insights";
import { 
    DurationOption, 
    InsightsData, 
    InsightsResponseInterface, 
    OrgInsightsFeature, 
    ResourceType 
} from "../models/insights";

/**
 * Fetches the timestamps for the given duration.
 * 
 * @param durationOption - Duration option.
 * @param options - optional parameters
 * 
 * @returns Timestamps.
 */
export const getTimestamps = (durationOption: DurationOption, options?: {
    lastPeriod?: boolean,
    forDisplay?: boolean
}): {
    endTimestamp: string;
    startTimestamp: string;
} => {
    const startDate: Date =  new Date();
    const endDate: Date = new Date();

    if (options?.lastPeriod) {
        startDate.setDate(startDate.getDate() - 2 * durationOption + 1);
    
        endDate.setDate(endDate.getDate() - durationOption + 1);
    } else {
        startDate.setDate(startDate.getDate() - durationOption + 1);
    
        endDate.setDate(endDate.getDate() + 1);
    }

    if (options?.forDisplay) {
        endDate.setDate(endDate.getDate() - 1);
    }
    
    return {
        endTimestamp: endDate.toISOString().slice(0,10),
        startTimestamp: startDate.toISOString().slice(0,10)
    };
};

/**
 * Checks if the compare with last period feature is enabled.
 * 
 * @returns true if the feature is enabled, else false
 */
export const isCompareToLastPeriodFeatureEnabled = (): boolean => {
    const featureConfig: FeatureConfigInterface = store.getState().config?.ui?.features;

    return !featureConfig?.insights?.disabledFeatures?.includes(
        OrgInsightsFeature.COMPARE_WITH_LAST_PERIOD
    );
};

export const getAllDisabledFeaturesForInsights = (): string[] => {
    const featureConfig: FeatureConfigInterface = store.getState().config?.ui?.features;

    return featureConfig?.insights?.disabledFeatures;
};

/**
 * Converts the usage records to JSON.
 * 
 * @param usageRecords - Usage records.
 * 
 * @returns Formatted usage records.
 */
const convertUsageRecordToJSON = (usageRecords: string[]): Array<{
    date: string;
    usage: number;
}> => {
    const sortedUsageRecords: string[] = usageRecords.sort();

    const formattedUsageRecords: Array<{date: string, usage: number}> = [];
    
    for (const usageRecord of sortedUsageRecords) {
        const [ date, usage ] = usageRecord.split(",");

        formattedUsageRecords.push({ date: date.split("T")[0],usage: parseInt(usage) });
    }

    return formattedUsageRecords;
};

/**
 * Fetches the list of dates for the given duration.
 * 
 * @param duration - Duration.
 * 
 * @returns a list of dates as strings.
 */
const getDatesInRange = (duration: DurationOption): string[] => {
    const timeStamps: {
        endTimestamp: string;
        startTimestamp: string;
    } = getTimestamps(duration);

    const dates: string[] = [];

    if (timeStamps.endTimestamp && timeStamps.startTimestamp) {
        const startDate: moment.Moment = moment(timeStamps.startTimestamp);
        const endDate: moment.Moment = moment(timeStamps.endTimestamp);
    
        for (let m: moment.Moment = moment(startDate); m.isBefore(endDate); m.add(1, "days")) {
            dates.push(m.format("YYYY-MM-DD"));
        }
    }

    return dates;
};

/**
 * Fetches the insights data for the resource type for the current duration and the last period and returns in a format 
 * that the charts can understand.
 * 
 * @param duration - Duration.
 * @param resourceType - Resource type.
 * 
 * @returns A promise containing the insights data.
 */
export const getInsightsForSelectedPeriod = async (
    duration: DurationOption, resourceType: ResourceType, filterQuery?: string
): Promise<InsightsData> => {
    const usageData: Array<{date: string, current: number, previous?: number, lastPeriodDate?: string}> = [];
    const dates: string[] = getDatesInRange(duration);

    const currentPeriodInsights: InsightsResponseInterface = await getInsights(duration, resourceType, filterQuery);
    const formattedCurrentUsageRecords: Array<{date: string, usage: number}> = 
        convertUsageRecordToJSON(currentPeriodInsights.usageRecords);

    for (const formattedUsageRecord of formattedCurrentUsageRecords) {
        usageData.push({
            current: formattedUsageRecord?.usage || 0,
            date: formattedUsageRecord.date
        });

        pull(dates, formattedUsageRecord.date);
    }

    // If there are any dates that are not in the current period, add them to the usage data with 0 usage.
    for (const date of dates) {
        usageData.push({
            current: 0,
            date: date
        });
    }

    const sortedUsageData: {
        date: string;
        current: number;
        previous?: number;
    }[] = orderBy(usageData, (record: {
        date: string;
        current: number;
        previous?: number;
    }) => new Date(record.date), [ "asc" ]);

    return {
        resourceType: currentPeriodInsights.resourceType,
        totalUsageForCurretPeriod: currentPeriodInsights.totalUsage,
        usageData: sortedUsageData
    };
};

/**
 * Formats the y axis value.
 * 
 * @param value - Value.
 * 
 * @returns Formatted value.
 */
export function formatYAxisValue (value: string): string {
    const billion: number = 1000000000;
    const million: number = 1000000;
    const thousand: number = 1000;

    const number: number = parseInt(value);
    
    if (number >= billion) {
        return (number / billion).toFixed(1) + "B";
    } else if (number >= million) {
        return (number / million).toFixed(1) + "M";
    } else if (number >= thousand) {
        return (number / thousand).toFixed(1) + "K";
    }
    
    return number.toString();
}

/**
 * Formats the x axis date value to a concise format.
 * 
 * @param value - X axis label value.
 * 
 * @example
 * // returns "Apr 1"
 * formatXAxisValue(2023-04-01')
 * 
 * @returns Formatted value.
 */
export function formatXAxisValue (value: string): string {
    const date: Date = new Date(value);

    return date.toLocaleString("en-us",{ day:"numeric", month:"short" });
}

/**
 * Determines if the date should be shown in the x axis.
 * 
 * @param index - Index of the date in the x axis.
 * @param duration - Duration.
 * 
 * @returns whether the date should be shown or not in the x axis
 */
export function shouldDateBeShownInXAxis (index: number, duration: DurationOption): boolean {
    if (index === 0) {
        return true;
    }
    
    if (duration === DurationOption.LAST_07_DAYS) {
        return true;
    }
     
    if (duration === DurationOption.LAST_14_DAYS &&
        index % 2 === 0)
    {
        return true;
    }

    if (duration === DurationOption.LAST_30_DAYS &&
        index % 4 === 0)
    {
        return true;
    }
}
