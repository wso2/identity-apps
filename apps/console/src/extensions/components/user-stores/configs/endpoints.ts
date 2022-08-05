/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { OutboundUserStoreResourceEndpointsInterface } from "../models";
import { Config } from "../../../../features/core";

/**
 * Get the resource endpoints for the outbound User Store Management feature.
 *
 * @return {OutboundUserStoreResourceEndpointsInterface} - Outbound user store endpoints
 */
export const getOutboundUserStoreResourceEndpoints = (): OutboundUserStoreResourceEndpointsInterface => {
    return {
        connection: `${ Config.getDeploymentConfig().serverOrigin }/api/onprem-userstore/v1/connection`,
        token: `${ Config.getDeploymentConfig().serverOrigin }/api/onprem-userstore/v1/token`
    };
};
