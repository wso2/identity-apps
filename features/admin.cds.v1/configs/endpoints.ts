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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { store } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { CustomerDataServiceEndpointsInterface } from "../models/endpoints";

/**
 * Get the resource endpoints for Customer Data Service (CDS) related operations.
 *
 * @returns Customer Data Service resource endpoints.
 */

export const getCustomerDataServiceEndpoints = (
    serverOrigin: string
): CustomerDataServiceEndpointsInterface => {
    const cdsHost: string = "https://ec2-13-62-94-132.eu-north-1.compute.amazonaws.com:8900";
    const tenantPath: string = AppConstants.getTenantPath();
    const orgId: string = store.getState().organization.organization.id;
    const organizationType: OrganizationType = store.getState().organization.organizationType;
    const isParentOrg: boolean =
        organizationType === OrganizationType.SUPER_ORGANIZATION ||
        organizationType === OrganizationType.FIRST_LEVEL_ORGANIZATION;

    const contextPath: string = isParentOrg ? tenantPath : `/o/${orgId}`;

    // eslint-disable-next-line no-console
    console.log("[CDS] orgType:", organizationType, "| isParentOrg:", isParentOrg, "| contextPath:", contextPath);

    return {
        cdsConfig: `${cdsHost}${contextPath}/cds/api/v1/config`,
        cdsProfileSchema: `${cdsHost}${contextPath}/cds/api/v1/profile-schema`,
        cdsProfiles: `${cdsHost}${contextPath}/cds/api/v1/profiles`,
        cdsUnificationRules: `${cdsHost}/o/dace5440-fb83-4021-b232-48a7e1143ee6/cds/api/v1/unification-rules`
    };
};
