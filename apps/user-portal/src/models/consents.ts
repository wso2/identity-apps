/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

export interface ConsentInterface {
    consentReceiptID: string;
    language: string;
    piiPrincipalId: string;
    spDescription: string;
    spDisplayName: string;
    state: ConsentState;
    tenantDomain: string;
}

export interface ConsentReceiptInterface {
    version: string;
    collectionMethod: string;
    services: ServiceInterface[];
}

interface ServiceInterface {
    service: string;
    serviceDisplayName: string;
    serviceDescription: string;
    tenantDomain: string;
    purposes: PurposeInterface[];
}

interface PurposeInterface {
    purpose: string;
    piiCategory: PIICategory[];
}

interface PIICategory {
    piiCategoryName: string;
    piiCategoryId: number;
    piiCategoryDisplayName: string;
}

export enum ConsentState {
    ACTIVE = "ACTIVE",
    REVOKED = "REVOKED"
}
