/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

/**
 * Interface to capture details of new tenant
 */
export interface NewTenantInfo {
    domain: string;
}

/**
 *  Interface of a tenant.
 */
export interface TenantInfo {
    id: string;
    domain: string;
    associationType: string;
    default: boolean;
}

/**
 * Interface for the response returned by the get associated tenants request.
 */
export interface TenantRequestResponse {
    totalResults: number;
    startIndex: number;
    count: number;
    associatedTenants: TenantInfo[];
}
