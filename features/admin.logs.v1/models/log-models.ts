/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Interface for diagnostic logs API request
 */
export interface InterfaceLogsRequest {
    limit: number,
    filter: string,
    nextToken?: string,
    previousToken?: string,
    startTime?: string,
    endTime?: string,
    logType?: number //TODO : question mark is not needed here.
}

/**
 * Interface for diagnostic logs API response
 */
export interface InterfaceLogsResponse {
    logs: InterfaceLogEntry[];
    nextToken: string;
    previousToken: string;
}

/**
 * Interface for a diagnostic log entry
 */
export interface InterfaceLogEntry {
    id: string;
    recordedAt: string;
    requestId: string;
    componentId?: string;
    initiatorId?: string;
    initiatorType?: string;
    targetId?: string;
    targetType?: string;
    actionId?: string;
    action?: string;
    data?: any; // TODO: define proper types
    flowId?: string;
    input?: any; // TODO: define proper types
    resultStatus? : string;
    resultMessage? : string;
    configurations? : any; // TODO: define proper types
}

/**
 * Interface for log filtering
 */
export interface InterfaceLogsFilter {
    property: string;
    value: string;
}

/**
 * enum for admin tab index.
 */
export enum TabIndex {
    DIAGNOSTIC_LOGS = 0,
    AUDIT_LOGS = 1,
}

/**
 * enum for result status of a log entry.
 */
export enum ResultStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}
