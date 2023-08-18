/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
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
