/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DropdownChild } from "@wso2is/forms";

/**
 * Interface for the Insights data that is passed to Charts.
 */
export interface InsightsData { 
    resourceType: ResourceType; 
    totalUsageForCurretPeriod: number; 
    usageData: Array<ChartDataPoint>; 
}

/**
 * Enum for the resource types.
 */
export enum ResourceType {
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGIN_FAILURE = "LOGIN_FAILURE",
    MONTHLY_ACTIVE_USERS = "MAU",
    USER_REGISTRATION = "USER_REGISTRATION",
}

/**
 * Interface for the request body that are passed to the getInsights API.
 */
export interface GetInsightsParamsInterface {
    startTimestamp: string;
    endTimestamp: string;
    resourceType: ResourceType;
    getCumulativeUsage: boolean;
    filter: string;
}

/**
 * Interface for the response of the getInsights API.
 */
export interface InsightsResponseInterface {
    resourceType: ResourceType;
    axes: string;
    totalUsage: number;
    usageRecords: string[]
}

/**
 * Enum for the duration options.
 */
export enum DurationOption {
    LAST_07_DAYS = 7,
    LAST_14_DAYS = 14,
    LAST_30_DAYS = 30,
}

/**
 * Interface for the duration dropdown options.
 */
export interface DurationDropdownOption {
    key: DurationOption;
    text: string;
    value: DurationOption;
}

/**
 * Interface for the usage records that are represented by data points in the chart.
 */
export interface ChartDataPoint {
    date: string;
    current: number;
    previous?: number;
}

/**
 * Interface for the insights data for the current and last periods.
 */
export interface InsightsForCurrentAndLastPeriods {
    usageRecordsForCurrentPeriod: InsightsResponseInterface;
    usageRecordsForLastPeriod: InsightsResponseInterface;
}

/**
 * Enum for the graph line types.
 */
export enum GraphLineType {
    CURRENT = "current",
    PREVIOUS = "previous",
}

export enum ActivityType {
    LOGIN = "Login",
    REGISTRATION = "Registration",
    USER_RECOVERY = "User Recovery",
}

export type FilterCondition = DropdownChild

export type FilterAttribute = FilterCondition

export enum OrgInsightsFeature {
    COMPARE_WITH_LAST_PERIOD = "compareWithLastPeriod",
    ADVANCED_INSIGHT_FILTERING = "advancedInsightFiltering",
    REGISTRATION_INSIGHTS = "registrationInsights",
}

export enum OnboardingMethodFilterValue {
    ADMIN_INITIATED = "ADMIN_INITIATED",
    USER_INVITE = "USER_INVITE",
    SELF_SIGN_UP = "SELF_SIGNUP",
}
