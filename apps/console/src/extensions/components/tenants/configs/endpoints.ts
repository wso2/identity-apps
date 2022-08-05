/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Config } from "../../../../features/core/configs";
import { TenantResourceEndpointsInterface } from "../models";

/**
 * Get the resource endpoints for the Tenant related features.
 *
 * @return {TenantResourceEndpointsInterface}
 */
export const getTenantResourceEndpoints = (): TenantResourceEndpointsInterface => {
    return {
        tenantAssociationApi: Config.getDeploymentConfig().serverOrigin + "/api/asgardeo/v1/tenant/me",
        tenantManagementApi: Config.getDeploymentConfig().serverOrigin + "/api/asgardeo/v1/tenant"
    };
};
