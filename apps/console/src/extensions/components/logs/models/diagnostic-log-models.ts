/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
export interface InterfaceDiagnosticLogsRequest {
    limit: number,
    filter: string,
    nextToken?: string,
    previousToken?: string,
    startTime?: string,
    endTime?: string,
}

/**
 * Interface for diagnostic logs API response
 */
export interface InterfaceDiagnosticLogsResponse {
    logs: InterfaceDiagnosticLogEntry[];
    nextToken: string;
    previousToken: string;
}

/**
 * Interface for a diagnostic log entry
 */
export interface InterfaceDiagnosticLogEntry {
    id: string;
    recordedAt: string;
    requestId: string;
    flowId: string;
    componentId: string;
    input: any; // TODO: define proper types
    resultStatus: string;
    resultMessage: string;
    actionId: string;
    configurations: any; // TODO: define proper types
}

/**
 * Interface for log filtering
 */
export interface InterfaceLogsFilter {
    property: string;
    value: string;
}
