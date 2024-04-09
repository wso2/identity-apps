/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { LinkInterface } from "@wso2is/core/models";

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
