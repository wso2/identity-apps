/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Config } from "../../../../../features/core/configs";

/**
 * Data set required to generate layout html code.
 */
export const addCommonDataForTheLayout = (
    data: Record<string, string>, 
    tenantDomain: string
): Record<string, string> => {
    data["BASE_URL"] = Config.getDeploymentConfig().extensions?.layoutStoreURL
        ? (Config.getDeploymentConfig().extensions.layoutStoreURL as string)
            .replace("${tenantDomain}", tenantDomain)
        : "";
        
    return data;
};
