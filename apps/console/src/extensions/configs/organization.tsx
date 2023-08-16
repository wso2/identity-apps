/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement } from "react";
import { OrganizationConfigs } from "./models";
import { OrganizationType } from "../../features/organizations/constants";
import { BreadcrumbItem } from "../../features/organizations/models";
import { OrganizationUtils } from "../../features/organizations/utils";
import { OrganizationSuperTrigger } from "../components/tenants/components/dropdown/organization-super-trigger";
import TenantDropdown from "../components/tenants/components/dropdown/tenant-dropdown";

export const organizationConfigs: OrganizationConfigs = {
    allowNavigationInDropdown: false,
    canCreateOrganization: (): boolean => {
        // Should be improve the logic to determine based on the subscription tier.
        return true;
    },
    showOrganizationDropdown: true,
    showSwitcherInTenants: true,
    superOrganizationBreadcrumb: (_breadcrumbItem: BreadcrumbItem, _onClick: (_breadcrumbItem: BreadcrumbItem
    ) => void) => {
        return <TenantDropdown trigger={ OrganizationSuperTrigger } contained />;
    },
    tenantSwitcher: (dropdownTrigger?: ReactElement, disable?: boolean) => {
        return (
            <TenantDropdown dropdownTrigger={ dropdownTrigger } disable={ disable } />
        );
    }
};
