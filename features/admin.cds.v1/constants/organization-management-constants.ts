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

/**
 * Scopes of the organization management endpoints of CDS.
 */
export const OrganizationManagementScopes: {
    ORGANIZATION_UPDATE: string;
    ORGANIZATION_VIEW: string;
    PROFILE_SCHEMA_SHARE: string;
    UNIFICATION_RULE_SHARE: string;
} = {
    ORGANIZATION_UPDATE: "internal_cds_organization_update",
    ORGANIZATION_VIEW: "internal_cds_organization_view",
    PROFILE_SCHEMA_SHARE: "internal_cds_profile_schema_share",
    UNIFICATION_RULE_SHARE: "internal_cds_unification_rule_share"
};

/**
 * Key of organization management in the `disabledFeatures` of the `customerDataService` feature config.
 */
export const ORGANIZATION_MANAGEMENT_FEATURE_ID: string = "customerDataService.organizationManagement";
