/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { LinkInterface } from "@wso2is/core/models";

export interface AppComponentProps {
    onAgentManagementEnableStatusChange: (status: boolean) => void
}

/**
 * Organization model interfaces.
 */
export interface OrganizationAttributesInterface {
    key: string;
    value: string;
}

export interface OrganizationResponseInterface {
    id: string;
    name: string;
    description: string;
    status: string;
    created: string;
    lastModified: string;
    type: string;
    domain: string;
    parent: {
        id: string;
        ref: string;
    };
    attributes: OrganizationAttributesInterface[];
}

export type OrganizationRoleInterface = RolesInterface;

export type OrganizationRoleListItemInterface = Omit<OrganizationRoleInterface, "users" | "permissions" | "groups">;

export type OrganizationRoleListResponseInterface = {
    totalResults: number;
    itemsPerPage: number;
    nextCursor: string;
    previousCursor: string;
    Resources: Array<OrganizationRoleListItemInterface>;
};

/**
 * Application model interfaces.
 */
export enum ApplicationAccessTypes {
    READ = "READ",
    WRITE = "WRITE"
}

export enum ApplicationInboundTypes {
    CLIENTID = "Client ID",
    ISSUER = "Issuer"
}

export interface AdvancedConfigurationsInterface {
    saas?: boolean;
    discoverableByEndUsers?: boolean;
    certificate?: CertificateInterface;
    skipLoginConsent?: boolean;
    skipLogoutConsent?: boolean;
    returnAuthenticatedIdpList?: boolean;
    enableAuthorization?: boolean;
    fragment?: boolean;
    additionalSpProperties?: additionalSpProperty[]
}

export interface ApplicationBasicInterface {
    access?: ApplicationAccessTypes;
    id?: string;
    name: string;
    description?: string;
    applicationVersion?: string;
    accessUrl?: string;
    clientId?: string;
    issuer?: string;
    templateId?: string;
    isManagementApp?: boolean;
    advancedConfigurations?: AdvancedConfigurationsInterface;
}

export interface ApplicationListItemInterface extends ApplicationBasicInterface {
    image?: string;
    self?: string;
}

export interface ApplicationListInterface {
    /**
     * Number of results that match the listing operation.
     */
    totalResults?: number;
    /**
     * Index of the first element of the page, which will be equal to offset + 1.
     */
    startIndex?: number;
    /**
     * Number of elements in the returned page.
     */
    count?: number;
    /**
     * Set of applications.
     */
    applications?: ApplicationListItemInterface[];
    /**
     * Useful links for pagination.
     */
    links?: LinkInterface[];
}

export interface ApplicationTemplateListItemInterface {
    id: string;
    name: string;
    description?: string;
    image?: string;
    authenticationProtocol?: string;
    isManagementApp?: boolean;
    templateGroup?: string;
    templateId?: string;
    types?: any[];
    category?: string;
    displayOrder?: number;
    self?: string;
    subTemplates?: ApplicationTemplateListItemInterface[];
    subTemplatesSectionTitle?: string;
    previewOnly?: boolean;
}

/**
 * Captures name and id of the user store.
 */
export interface SimpleUserStoreListItemInterface {
    id?: string;
    name: string;
}

export enum CertificateTypeInterface {
    NONE ="None",
    JWKS = "JWKS",
    PEM = "PEM"
}

export interface additionalSpProperty {
    name: string;
    value: string;
    displayName?: string;
}

export interface CertificateInterface {
    value?: string;
    type?: CertificateTypeInterface; // TODO  Check for upload option.
}

/**
 * Interface to contain Role meta information
 */
export interface RolesMetaInterface {
    created: string;
    location: string;
    lastModified: string;
}

/**
 * Interface to contain groups information of the role
 */
export interface RoleGroupsInterface {
    display: string;
    value: string;
    $ref: string;
}

/**
 * Interface to contain Role member information
 */
export interface RolesMemberInterface {
    display: string;
    value: string;
    orgId: string;
    orgName: string;
    $ref: string;
}

/**
 * Interface to contain top level role information
 */
export interface RolesInterface {
    displayName: string;
    id: string;
    meta: RolesMetaInterface;
    groups?: RoleGroupsInterface[];
    users?: RolesMemberInterface[];
    permissions: string[];
}

/**
 * Interface to contain roles listing
 */
export interface RoleListInterface {
    totalResults?: number;
    startIndex?: number;
    itemsPerPage?: number;
    Resources?: RolesInterface[];
    schemas: string;
}

/**
 * Enum representing the status of an operation.
 */
export enum OperationStatus {
    FAILED = "FAILED",
    SUCCESS = "SUCCESS",
    IDLE = "IDLE",
    IN_PROGRESS = "IN_PROGRESS",
    PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED",
}

/**
 * Interface for the share application status summary.
 */
export interface OperationStatusSummary {
    successCount: number;
    failedCount: number;
    partiallyCompletedCount: number
}

/**
 * Interface representing the response of a unit operation's status.
 */
export interface AsyncOperationStatusUnitResponse {
    unitOperationId: string;
    operationId: string;
    residentResourceId: string;
    targetOrgId: string;
    targetOrgName: string;
    status: OperationStatus;
    statusMessage: string;
    createdTime: string;
}

/**
 * Interface representing the response of an asynchronous operation's status.
 */
export interface AsyncOperationStatusResponse {
    operationId: string;
    correlationId: string;
    operationType: string;
    subjectType: string;
    subjectId: string;
    initiatedOrgId: string;
    initiatedUserId: string;
    status: OperationStatus;
    policy: string;
    createdTime: string;
    modifiedTime: string;
    unitOperationDetail: {
        ref: string;
        summary: {
            success: number;
            failed: number;
            partiallyCompleted: number;
        }
    }
}

/**
 * Interface representing a link related to the operation status.
 */
export interface AsyncOperationStatusLinkInterface {
    href: string;
    rel: string;
}

/**
 * Interface representing a list of unit operation responses with links.
 */
export interface AsyncOperationStatusUnitListInterface {
    links: AsyncOperationStatusLinkInterface[];
    unitOperations: AsyncOperationStatusUnitResponse[];
}

/**
 * Interface representing a list of operation responses with links.
 */
export interface AsyncOperationStatusListInterface {
    links: AsyncOperationStatusLinkInterface[];
    operations: AsyncOperationStatusResponse[];
}
