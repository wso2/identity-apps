/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Config } from "../../../../../features/core";
import { MarketingConsentEndpointsInterface } from "../models";

/**
 * Get the resource endpoints for the marketing consent feature.
 *
 * @returns the endpoints for the marketing consent feature.
 */
export const getMarketingConsentEndpoints = (): MarketingConsentEndpointsInterface => {
    return {
        addConsentEndpoint: Config.getDeploymentConfig().serverHost + "/api/asgardeo-marketing/v1/consent/me",
        getConsentEndpoint: Config.getDeploymentConfig().serverHost + "/api/asgardeo-marketing/v1/consent/me"
    };
};
