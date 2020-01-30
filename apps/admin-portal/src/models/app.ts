/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 *  Main application interface.
 */
export interface Application {

    id: string;
    name: string;
    description: string;
    imageUrl: string;
    accessUrl: string;
    claimConfiguration: ClaimConfiguration;
    advanceConfiguration: AdvanceConfiguration;
}

/**
 *  Captures the basic details in the applications.
 */
export interface ApplicationBasic {

    id?: string;
    name: string;
    description?: string;
    imageUrl?: string;
    accessUrl?: string;
    self?: string;
}

export interface Link {
    href: string;
    rel: string;
}

/**
 *  Captures application list properties.
 */
export interface ApplicationList {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    applications?: ApplicationBasic[];
    links?: Link[];
}

export interface AppClaim {
    id?: string;
    uri: string;
    displayname?: string;
}

interface ClaimMapping {
    applicationClaim: string;
    localClaim: AppClaim;
}

interface Subject {
    claim: AppClaim[];
    includeUserDomain: boolean;
    includeTenantDomain: boolean;
    useMappedLocalSubject: boolean;
}

interface Role {
    claim: AppClaim[];
    includeUserDomain: boolean;
}

interface RoleMapping {
    localRole: string;
    applicationRole: string;
}

interface RoleConfig {
    mappings: RoleMapping[];
    includeUserDomain: boolean;
    claim: AppClaim;
}

interface RequestedClaimConfiguration {
    claim: AppClaim;
    mandatory: boolean;
}

interface SubjectConfig {
    claim?: AppClaim;
    includeUserDomain?: boolean;
    includeTenantDomain?: boolean;
    useMappedLocalSubject?: boolean;
}

/**
 *  Captures main claim features.
 */
export interface ClaimConfiguration {
    dialect: string;
    claimMapping: ClaimMapping[];
    requestedClaims: RequestedClaimConfiguration[];
    subject: SubjectConfig;
    role: RoleConfig;
}

export interface Certificate {
    value?: string;
    type?: string; // TODO  Add in the ENUM types
}

/**
 *  Captures application related configuration.
 */
export interface AdvanceConfiguration {
    saas?: boolean;
    discoverableByEndUsers?: boolean;
    certificate?: Certificate;
    skipConsent?: boolean; // TODO  Add consent for logout
    returnAuthenticatedIdpList?: boolean;
    enableAuthorization?: boolean;
}
