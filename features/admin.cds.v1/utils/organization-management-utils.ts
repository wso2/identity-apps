/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { OrganizationType } from "@wso2is/admin.core.v1/constants/organization-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { useSelector } from "react-redux";
import { ORGANIZATION_MANAGEMENT_FEATURE_ID } from "../constants/organization-management-constants";

/**
 * Hook that tells whether the Console runs in a child organization.
 *
 * @returns True in a child organization.
 */
export const useIsSubOrganization = (): boolean => {
    const organizationType: OrganizationType = useSelector(
        (state: AppState) => state?.organization?.organizationType
    );

    return organizationType === OrganizationType.SUBORGANIZATION;
};

/**
 * Hook that tells whether organization management of CDS is enabled. A deployment disables it with
 * `customerDataService.organizationManagement` in the `disabledFeatures` of the `customerDataService` feature.
 *
 * @returns True when organization management is enabled.
 */
export const useIsOrganizationManagementEnabled = (): boolean => {
    const cdsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.customerDataService
    );

    return isFeatureEnabled(cdsFeatureConfig, ORGANIZATION_MANAGEMENT_FEATURE_ID);
};
