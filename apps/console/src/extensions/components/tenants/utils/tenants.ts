/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TenantInfo } from "../models";

/**
 * Returns the association type of the current tenant for the logged in user
 */
export const getAssociationType = (authUserTenants: TenantInfo[], currentOrganization: string): string => {
    let associationType: string = "";

    if (authUserTenants?.length > 0) {
        const loggedinTenant: TenantInfo = authUserTenants.find((tenant: TenantInfo) => {
            return tenant.domain === currentOrganization;
        });

        if (loggedinTenant) {
            associationType = loggedinTenant.associationType;
        }
    }

    return associationType;
};
