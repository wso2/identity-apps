/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */


export interface Environment {
    organizationName: string;
    environmentName: string;
}

/**
 *  Interface of a environment.
 */
export interface EnvironmentInfo {
    envName: string;
    envUUID: string;
    deploymentName: string;
    deploymentUUID: string;
    b2bOrgUUID: string;
    tenantUUID: string;
    associationType: string;
    isDefault: boolean;
}

/**
 * Interface for the response returned by the get associated environments request.
 */
export interface EnvironmentRequestResponse {
    orgName: string;
    orgUUID: string;
    environments: EnvironmentInfo[];
}


