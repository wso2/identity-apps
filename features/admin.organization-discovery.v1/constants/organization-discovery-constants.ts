/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsError } from "@wso2is/core/errors";

/**
 * Class containing Organization Domain assign constants.
 */
export class OrganizationDiscoveryConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    public static readonly ORGANIZATION_DOMAIN_ASSIGN_ERROR_CODE: string = "CON-ODA-10001";
    public static readonly ORGANIZATION_DOMAIN_ASSIGN_INVALID_STATUS_CODE_ERROR_CODE: string = "CON-ODA-10002";
    public static readonly ORGANIZATION_DOMAIN_ASSIGN_FORM_ID: string = "organization-domain-assign-form";

    /**
     * Error Messages.
     */
    public static ErrorMessages: {
        ORGANIZATION_DOMAIN_ASSIGN_ERROR: IdentityAppsError;
        ORGANIZATION_DOMAIN_ASSIGN_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
    } = {
        ORGANIZATION_DOMAIN_ASSIGN_ERROR: new IdentityAppsError(
            OrganizationDiscoveryConstants.ORGANIZATION_DOMAIN_ASSIGN_ERROR_CODE,
            "An error occurred while assigning email domains for the organization.",
            "Error while assigning domains",
            null
        ),
        ORGANIZATION_DOMAIN_ASSIGN_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
            OrganizationDiscoveryConstants.ORGANIZATION_DOMAIN_ASSIGN_INVALID_STATUS_CODE_ERROR_CODE,
            "An invalid status code was received while assigning email domains for the organization.",
            "Invalid status code while assigning domains",
            null
        )
    };

    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("ORGANIZATION_DISCOVERY_CREATE", "organizationDiscovery.create")
        .set("ORGANIZATION_DISCOVERY_UPDATE", "organizationDiscovery.update")
        .set("ORGANIZATION_DISCOVERY_DELETE", "organizationDiscovery.delete")
        .set("ORGANIZATION_DISCOVERY_READ", "organizationDiscovery.read");
}
