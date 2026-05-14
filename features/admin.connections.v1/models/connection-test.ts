/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { MappedClaimInterface } from "./connection";

export interface ConnectionTestStepStatusInterface {
    accountLinkingStatus?: string;
    authenticationStatus?: string;
    claimExtractionStatus?: string;
    claimMappingStatus?: string;
    connectionCreation?: string;
}

export interface ConnectionTestDiagnosticLogInterface {
    details?: unknown;
    errorCode?: unknown;
    errorDescription?: unknown;
    federatedAttribute?: unknown;
    message?: string;
    stage?: string;
    status?: string;
    timestamp?: number | string;
    [ key: string ]: unknown;
}

export interface ConnectionTestResultMetadataInterface {
    accountLinkingMessage?: string;
    accountLinkingStatus?: string;
    authenticationStatus?: string;
    claimExtractionStatus?: string;
    claimMappingStatus?: string;
    connectionCreation?: string;
    diagnostics?: ConnectionTestDiagnosticLogInterface[];
    error_code?: string;
    error_description?: string;
    error_details?: unknown;
    idToken?: string;
    mappedClaims?: MappedClaimInterface[];
    metadata?: ConnectionTestResultMetadataInterface;
    stepStatus?: ConnectionTestStepStatusInterface;
    steps?: ConnectionTestStepStatusInterface;
    [ key: string ]: unknown;
}

export interface ConnectionTestResultInterface {
    error?: unknown;
    metadata?: ConnectionTestResultMetadataInterface;
    status?: string;
    [ key: string ]: unknown;
}
