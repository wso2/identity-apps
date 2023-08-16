/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FeatureGateEndpoints } from "../models/feature-gate";


/**
 * Get the resource endpoints for the Feature-Gate feature.
 *
 * @param serverHost - Server Host.
 * @returns The resource endpoints for the Feature Gate.
 */
export const getFeatureGateResourceEndpoints = (
    serverHostWithOrgPath: string
): FeatureGateEndpoints => {
    return {
        allFeatures: `${serverHostWithOrgPath}/api/asgardeo/feature-gate/{org-uuid}/allFeatures`,
        allowedFeatures: `${serverHostWithOrgPath}/api/asgardeo/feature-gate/{org-uuid}/allowedFeatures`
    };
};
