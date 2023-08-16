/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ReactElement } from "react";
import { BreadcrumbItem } from "../../../features/organizations/models";

export interface OrganizationConfigs {
    allowNavigationInDropdown: boolean;
    canCreateOrganization: () => boolean;
    showOrganizationDropdown: boolean;
    showSwitcherInTenants: boolean;
    superOrganizationBreadcrumb: (
        breadcrumbItem: BreadcrumbItem,
        onClick: (breadcrumbItem: BreadcrumbItem) => void
    ) => ReactElement;
    tenantSwitcher: (dropdownTrigger?: ReactElement, disable?: boolean) => ReactElement;
}
