/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { AuthenticationType, AuthenticationTypeDropdownOption } from "../../admin.actions.v1/models/actions";

/**
 * Constants related to the tenant management operations.
 *
 * @remarks
 * This class is not meant to be instantiated. It only provides static constants.
 *
 * @example
 * ```typescript
 * const errorMessage = TenantConstants.TENANT_ACTIVATION_UPDATE_ERROR;
 * ```
 */
export default class TenantConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    public static readonly TENANT_ACTIVATION_UPDATE_INVALID_STATUS_ERROR: string =
        "An invalid status code was received while updating the tenant activation status.";

    public static readonly TENANT_ACTIVATION_UPDATE_ERROR: string =
        "An error occurred while updating the tenant activation status.";

    public static readonly TENANT_METADATA_DELETE_ERROR: string =
        "An error occurred while deleting the tenant metadata.";

    public static readonly TENANT_METADATA_DELETE_INVALID_STATUS_ERROR: string =
        "An invalid status code was received while deleting the tenant metadata.";

    public static readonly TENANT_CREATION_INVALID_STATUS_ERROR: string =
        "An invalid status code was received while creating the tenant.";

    public static readonly TENANT_CREATION_ERROR: string = "An error occurred while creating the tenant.";

    public static readonly ADD_TENANT_FORM_ID: string = "add-tenant-form";

    public static readonly TENANT_DOMAIN_AVAILABILITY_CHECK_INVALID_STATUS_ERROR: string =
        "An invalid status code was received while checking the tenant domain availability.";

    public static readonly TENANT_DOMAIN_AVAILABILITY_CHECK_ERROR: string =
        "An error occurred while checking the tenant domain availability.";

    public static readonly TENANT_OWNER_UPDATE_INVALID_STATUS_ERROR: string =
        "An invalid status code was received while updating the tenant owner's details.";

    public static readonly TENANT_OWNER_UPDATE_ERROR: string =
        "An error occurred while updating the tenant owner's details.";

    public static readonly ADMIN_ADVISORY_BANNER_CONFIGS_INVALID_INPUT_ERROR: string = "An invalid input value " +
		"in the request.";

    public static readonly ADMIN_ADVISORY_BANNER_CONFIGS_UPDATE_REQUEST_ERROR: string = "An error occurred " +
        "while updating the admin advisory banner configurations.";

    public static readonly ORGANIZATION_NAME_REGEX: string = ".*[^a-zA-Z0-9._\\- ].*";

    public static readonly FEATURE_DICTIONARY: {
        ADD_TENANTS_FROM_DROPDOWN: string;
        HIDE_REMOTE_LOG_CONFIG_SECRETS: string;
        MAKING_TENANTS_DEFAULT: string;
        MANAGING_TENANTS_FROM_DROPDOWN: string;
        ORGANIZATIONS_QUICK_NAV_FROM_DROPDOWN: string;
        TENANT_DELETION: string;
    } = {
            ADD_TENANTS_FROM_DROPDOWN: "tenants.add.tenant.from.dropdown",
            HIDE_REMOTE_LOG_CONFIG_SECRETS: "hide.config.secrets",
            MAKING_TENANTS_DEFAULT: "tenants.make.default",
            MANAGING_TENANTS_FROM_DROPDOWN: "tenants.manage.tenants.from.dropdown",
            ORGANIZATIONS_QUICK_NAV_FROM_DROPDOWN: "tenants.organizations.quick.nav.from.dropdown",
            TENANT_DELETION: "tenants.deletion"
        };

    public static readonly AUTH_TYPES: AuthenticationTypeDropdownOption[] = [
        {
            key: AuthenticationType.NONE,
            text: "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                "basicAuthConfig.types.none.name",
            value: AuthenticationType.NONE
        },
        {
            key: AuthenticationType.BASIC,
            text: "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                "basicAuthConfig.types.basic.name",
            value: AuthenticationType.BASIC
        }
    ];
}
