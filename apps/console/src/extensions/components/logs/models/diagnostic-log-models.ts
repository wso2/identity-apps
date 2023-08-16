/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
