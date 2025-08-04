/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import {
    GovernanceCategoryForOrgsInterface,
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorUtils
} from "@wso2is/admin.server-configurations.v1";
import { AppThemeConfigInterface, FeatureAccessConfigInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";
import { MultitenantConstants } from "./multitenant-constants";

/**
 * Class containing app constants.
 */
export class AppConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Get the admin view base path.
     *
     * @returns The admin view base path.
     */
    public static getAdminViewBasePath(): string {
        return window["AppUtils"]?.getConfig()?.adminApp.basePath;
    }

    /**
     * Get the admin view home path.
     *
     * @returns The admin view home path.
     */
    public static getAdminViewHomePath(): string {
        return window["AppUtils"]?.getConfig()?.adminApp.path;
    }

    /**
     * Get the full screen view base path.
     *
     * @returns The full screen view base path.
     */
    public static getFullScreenViewBasePath(): string {
        return this.getMainViewBasePath() + "/fullscreen";
    }

    /**
     * Get the default layout base path.
     *
     * @returns The default layout base path.
     */
    public static getDefaultLayoutBasePath(): string {
        return `${this.getMainViewBasePath()}/root`;
    }

    /**
     * Get the developer view base path.
     *
     * @returns The developer view base path.
     */
    public static getDeveloperViewBasePath(): string {
        return window["AppUtils"]?.getConfig()?.developerApp.basePath;
    }

    /**
     * Get the developer view home path.
     *
     * @returns The developer view home path.
     */
    public static getDeveloperViewHomePath(): string {
        return window["AppUtils"]?.getConfig()?.developerApp.path;
    }

    /**
     * Get the main view base path.
     * If `this.getTenantQualifiedAppBasePath()` returns with just "/",
     * return empty string.
     *
     * @returns The main view base path.
     */
    public static getMainViewBasePath(): string {
        return this.getTenantQualifiedAppBasePath() !== "/"
            ? this.getTenantQualifiedAppBasePath()
            : "";
    }

    /**
     * Get tenant qualified app base name. ex: `t/<BASENAME>`
     *
     * @returns The tenant qualified app base name.
     */
    public static getTenantQualifiedAppBasename(): string {
        return window["AppUtils"]?.getConfig()?.appBaseWithTenant;
    }

    /**
     * Get tenant qualified app base path. ex: `/t/<BASENAME>`
     *
     * @returns The tenant qualified app base path.
     */
    public static getTenantQualifiedAppBasePath(): string {
        return "/" + StringUtils.removeSlashesFromPath(this.getTenantQualifiedAppBasename());
    }

    /**
     * Get app base name. ex: `<BASENAME>`
     *
     * @returns The app base name.
     */
    public static getAppBasename(): string {
        return window["AppUtils"]?.getConfig()?.appBase;
    }

    /**
     * Get tenant qualified app base path. ex: `/<BASENAME>`
     *
     * @returns The tenant qualified app base path.
     */
    public static getAppBasePath(): string {
        return "/" + StringUtils.removeSlashesFromPath(this.getAppBasename());
    }

    /**
     * Get the app home path.
     *
     * @returns The app home path.
     */
    public static getAppHomePath(): string {
        return window["AppUtils"]?.getConfig()?.routes.home;
    }

    /**
     * Get the app login path.
     *
     * @returns The app login path.
     */
    public static getAppLoginPath(): string {
        return window[ "AppUtils" ]?.getConfig()?.routes.login;
    }

    /**
     * Get the app login path.
     *
     * @returns The app login path.
     */
    public static getAppLogoutPath(): string {
        return window[ "AppUtils" ]?.getConfig()?.routes.logout;
    }

    /**
     * Get the app Client ID.
     *
     * @returns The app Client ID.
     */
    public static getClientID(): string {
        return window["AppUtils"]?.getConfig()?.clientID;
    }

    /**
     * Get app theme configs.
     *
     * @returns App theme configs.
     */
    public static getAppTheme(): AppThemeConfigInterface {
        return window["AppUtils"]?.getConfig()?.ui?.theme;
    }

    /**
     * Get the feature configuration of the administrators feature.
     *
     * @returns Feature access config for the administrators feature.
     */
    public static getAdministratorsFeatureConfig(): FeatureAccessConfigInterface {
        return window["AppUtils"]?.getConfig()?.ui?.features?.administrators;
    }

    /**
     * Get the My Account path.
     *
     * @returns The My Account path.
     */
    public static getMyAccountPath(): string {

        return window[ "AppUtils" ]?.getConfig()?.accountApp.path;
    }

    /**
     * Get the tenant path. ex: `/t/wso2.com`.
     *
     * @returns The tenant path.
     */
    public static getTenantPath(): string {
        return window["AppUtils"]?.getConfig()?.tenantPath;
    }

    /**
     * Get the tenant. ex: `abc.com`.
     *
     * @returns The tenant domain
     */
    public static getTenant(): string {
        return window["AppUtils"]?.getConfig()?.tenant;
    }

    /**
     * Get the super tenant. ex: `carbon.super`.
     *
     * @returns The super tenant domain.
     */
    public static getSuperTenant(): string {
        return window["AppUtils"]?.getConfig()?.superTenant || MultitenantConstants.SUPER_TENANT_DISPLAY_NAME;
    }

    /**
     * Get the client origin. ex: `https://localhost:9443`.
     *
     * @returns The client origin.
     */
    public static getClientOrigin(): string {
        return window["AppUtils"]?.getConfig()?.clientOrigin;
    }

    /**
     * Get the client origin with tenant. ex: `https://localhost:9443/t/wso2.comn`.
     *
     * @returns The client origin with tenant.
     */
    public static getClientOriginWithTenant(): string {
        return window["AppUtils"]?.getConfig()?.clientOriginWithTenant;
    }

    /**
     * URL param for email template add state.
     * NOTE: Not needed if the same component is not used for edit and add,
     */
    public static readonly EMAIL_TEMPLATE_ADD_URL_PARAM: string = "add-template";

    /**
     * Get all the app paths as a map.
     *
     * @returns All the app paths as a map.
     */
    public static getPaths(): Map<string, string> {
        const paths: Map<string, string> = new Map<string, string>([
            [ "GETTING_STARTED", `${ AppConstants.getDeveloperViewBasePath() }/getting-started` ],
            [ "ADMIN_OVERVIEW", `${ AppConstants.getAdminViewBasePath() }/overview` ],
            [ "ADMIN_ADVISORY_BANNER", `${ AppConstants.getAdminViewBasePath() }/admin-advisory` ],
            [ "ADMIN_ADVISORY_BANNER_EDIT", `${ AppConstants.getAdminViewBasePath() }/server/admin-advisory` ],
            [
                "ANALYTICS",
                `${AppConstants.getAdminViewBasePath()}/analytics/:categoryId/:connectorId`
            ],
            [ "API_RESOURCES", `${ AppConstants.getDeveloperViewBasePath() }/api-resources` ],
            [ "API_RESOURCES_CATEGORY", `${ AppConstants.getDeveloperViewBasePath() }/api-resources/:categoryId` ],
            [ "API_RESOURCE_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/api-resources/:categoryId/:id` ],
            [ "APPLICATIONS", `${ AppConstants.getDeveloperViewBasePath() }/applications` ],
            [ "APPLICATION_TEMPLATES", `${ AppConstants.getDeveloperViewBasePath() }/applications/templates` ],
            [ "APPLICATION_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/applications/:id` ],
            [ "APPLICATIONS_SETTINGS", `${ AppConstants.getDeveloperViewBasePath() }/applications-settings` ],
            [ "APPLICATION_ROLES", `${ AppConstants.getAdminViewBasePath() }/application-roles` ],
            [ "APPLICATION_ROLES_EDIT",
                `${ AppConstants.getAdminViewBasePath() }/application-roles/:applicationId/:roleId` ],
            [ "APPLICATION_ROLES_SUB", `${ AppConstants.getAdminViewBasePath() }/roles/application-roles` ],
            [ "APPLICATION_ROLES_EDIT_SUB",
                `${ AppConstants.getAdminViewBasePath() }/roles/application-roles/:applicationId/:roleId` ],
            [
                "APPLICATION_SIGN_IN_METHOD_EDIT",
                `${ AppConstants.getDeveloperViewBasePath() }/applications/:id:tabName`
            ],
            [ "APPROVALS", `${ AppConstants.getAdminViewBasePath() }/approvals` ],
            [ "APPROVAL_WORKFLOWS",`${ AppConstants.getAdminViewBasePath() }/workflows` ],
            [ "APPROVAL_WORKFLOW_CREATE",`${ AppConstants.getAdminViewBasePath() }/create-workflow` ],
            [ "APPROVAL_WORKFLOW_EDIT",`${ AppConstants.getAdminViewBasePath() }/workflows/:id` ],
            [ "APPROVAL_WORKFLOW_ASSOCIATIONS",`${ AppConstants.getAdminViewBasePath() }/workflow-associations` ],
            [ "APPROVAL_WORKFLOW_ASSOCIATION_CREATE",
                `${ AppConstants.getAdminViewBasePath() }/create-workflow-associations` ],
            [ "APPROVAL_WORKFLOW_ASSOCIATIONS_EDIT",
                `${ AppConstants.getAdminViewBasePath() }/workflow-associations/:id` ],
            [ "BRANDING", `${ AppConstants.getDeveloperViewBasePath() }/branding` ],
            [ "CERTIFICATES", `${ AppConstants.getAdminViewBasePath() }/certificates` ],
            [ "CLAIM_DIALECTS", `${ AppConstants.getAdminViewBasePath() }/attributes-and-mappings` ],
            [ "CLAIM_VERIFICATION_SETTINGS",
                `${ AppConstants.getAdminViewBasePath() }/attribute-verification-settings`
            ],
            [ "CONNECTIONS", `${ AppConstants.getDeveloperViewBasePath() }/connections` ],
            [ "CONNECTION_TEMPLATES", `${ AppConstants.getDeveloperViewBasePath() }/connections/templates` ],
            [ "CONNECTION_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/connections/:id` ],
            [ "CUSTOMIZE", `${ AppConstants.getMainViewBasePath() }/customize` ],
            [ "DEVELOPER_OVERVIEW", `${ AppConstants.getDeveloperViewBasePath() }/overview` ],
            [
                "ASSIGN_ORGANIZATION_DISCOVERY_DOMAINS",
                `${AppConstants.getAdminViewBasePath()}/email-domain-assign`
            ],
            [ "ORGANIZATION_DISCOVERY_DOMAINS", `${AppConstants.getAdminViewBasePath()}/email-domain-discovery` ],
            [ "UPDATE_ORGANIZATION_DISCOVERY_DOMAINS", `${AppConstants.getAdminViewBasePath()}/email-domain-edit/:id` ],
            [ "EMAIL_PROVIDER", `${ AppConstants.getDeveloperViewBasePath() }/email-provider` ],
            [ "NOTIFICATION_CHANNELS", `${ AppConstants.getDeveloperViewBasePath() }/notification-channels` ],
            [ "EMAIL_AND_SMS", `${ AppConstants.getDeveloperViewBasePath() }/email-and-sms` ],
            [ "EMAIL_MANAGEMENT", `${ AppConstants.getDeveloperViewBasePath() }/email-management` ],
            [ "SMS_PROVIDER", `${ AppConstants.getDeveloperViewBasePath() }/sms-provider` ],
            [ "SMS_MANAGEMENT", `${ AppConstants.getDeveloperViewBasePath() }/sms-management` ],
            [ "PUSH_PROVIDER", `${ AppConstants.getDeveloperViewBasePath() }/push-provider` ],
            [ "FLOWS", `${ AppConstants.getDeveloperViewBasePath() }/flows` ],
            [ "EMAIL_TEMPLATE_TYPES", `${ AppConstants.getAdminViewBasePath() }/email-templates` ],
            [ "EMAIL_TEMPLATES", `${ AppConstants.getAdminViewBasePath() }/email-templates/:templateTypeId` ],
            [
                "EMAIL_TEMPLATE",
                `${ AppConstants.getAdminViewBasePath() }/email-templates/:templateTypeId/:templateId`
            ],
            [
                "EMAIL_TEMPLATE_ADD",
                `${ AppConstants.getAdminViewBasePath() }/email-templates/:templateTypeId/${
                    AppConstants.EMAIL_TEMPLATE_ADD_URL_PARAM }`
            ],
            [ "EXTERNAL_DIALECT_EDIT", `${ AppConstants.getAdminViewBasePath() }/edit-attribute-mappings/:id` ],
            [ "REGISTRATION_FLOW_BUILDER", `${ AppConstants.getMainViewBasePath() }/edit-self-registration-flow` ],
            [ "GROUPS", `${ AppConstants.getAdminViewBasePath() }/groups` ],
            [ "GROUP_EDIT", `${ AppConstants.getAdminViewBasePath() }/groups/:id` ],
            [ "IDP", `${ AppConstants.getDeveloperViewBasePath() }/connections` ],
            [ "IDP_TEMPLATES", `${ AppConstants.getDeveloperViewBasePath() }/connections/templates` ],
            [ "IDP_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/connections/:id` ],
            [ "AUTH_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/authenticators/:id` ],
            [ "IDVP", `${ AppConstants.getDeveloperViewBasePath() }/identity-verification-providers` ],
            [ "IDVP_TEMPLATES",
                `${ AppConstants.getDeveloperViewBasePath() }/identity-verification-providers/templates`
            ],
            [ "IDVP_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/identity-verification-providers/:id` ],
            [ "EVENT_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/event-edit` ],
            [ "LOCAL_CLAIMS", `${ AppConstants.getAdminViewBasePath() }/attributes` ],
            [ "LOCAL_CLAIMS_EDIT", `${ AppConstants.getAdminViewBasePath() }/edit-attributes/:id` ],
            [ "LOGIN", window["AppUtils"]?.getConfig()?.routes.login ],
            [ "LOGIN_AND_REGISTRATION", `${ AppConstants.getDeveloperViewBasePath() }/login-and-registration` ],
            [ "ACTIONS", `${ AppConstants.getDeveloperViewBasePath() }/actions` ],
            [ "WEBHOOKS", `${ AppConstants.getDeveloperViewBasePath() }/webhooks` ],
            [ "WEBHOOK_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/webhooks/:id` ],
            [ "SCIM_MAPPING", `${ AppConstants.getAdminViewBasePath() }/attribute-mappings/scim` ],
            [ "LOGOUT", window["AppUtils"]?.getConfig()?.routes.logout ],
            [ "OIDC_SCOPES", `${ AppConstants.getAdminViewBasePath() }/oidc-scopes` ],
            [ "OIDC_SCOPES_EDIT", `${ AppConstants.getAdminViewBasePath() }/oidc-scopes/:id` ],
            [ "PAGE_NOT_FOUND", `${ AppConstants.getMainViewBasePath() }/404` ],
            [ "PRIVACY", `${ AppConstants.getMainViewBasePath() }/privacy` ],
            [ "REMOTE_REPO_CONFIG", `${ AppConstants.getAdminViewBasePath() }/remote-repository-config` ],
            [ "ROLES", `${ AppConstants.getAdminViewBasePath() }/roles` ],
            [ "ROLE_CREATE", `${ AppConstants.getAdminViewBasePath() }/create-role` ],
            [ "ROLE_EDIT", `${ AppConstants.getAdminViewBasePath() }/roles/:id` ],
            [ "ROOT", "/" ],
            [ "GOVERNANCE_CONNECTORS", `${AppConstants.getAdminViewBasePath()}/governance-connectors/:id` ],
            [ "MULTI_ATTRIBUTE_LOGIN", `${AppConstants.getAdminViewBasePath()}/multi-attribute-login` ],
            [ "UNAUTHORIZED", `${AppConstants.getMainViewBasePath()}/unauthorized` ],
            [ "USERS", `${AppConstants.getAdminViewBasePath()}/users` ],
            [ "USER_EDIT", `${AppConstants.getAdminViewBasePath()}/users/:id` ],
            [ "USERSTORES", `${AppConstants.getAdminViewBasePath()}/user-stores` ],
            [ "USERSTORES_EDIT", `${AppConstants.getAdminViewBasePath()}/edit-user-store/:id` ],
            [ "USERSTORE_TEMPLATES", `${AppConstants.getAdminViewBasePath()}/userstore-templates` ],
            [ "STORING_DATA_DISABLED", `${AppConstants.getMainViewBasePath()}/storing_data_disabled` ],
            [ "GOVERNANCE_CONNECTOR", `${AppConstants.getAdminViewBasePath()}/connector/:id` ],
            [
                "GOVERNANCE_CONNECTOR_EDIT",
                `${AppConstants.getAdminViewBasePath()}/connector/:categoryId/:connectorId`
            ],
            [
                "USERNAME_RECOVERY_CONNECTOR_EDIT",
                `${AppConstants.getAdminViewBasePath()}/connector/:type/:categoryId/:connectorId`
            ],
            [ "SECRETS", `${AppConstants.getDeveloperViewBasePath()}/secrets` ],
            [ "SECRET_EDIT", `${AppConstants.getDeveloperViewBasePath()}/secrets/:type/:name` ],
            [ "SERVER_CONFIG_CATEGORY", `${AppConstants.getAdminViewBasePath()}/login-and-registration/:id` ],
            [
                "ATTRIBUTE_MAPPINGS",
                `${AppConstants.getAdminViewBasePath()}/attribute-mappings/:type/:customAttributeMappingID?`
            ],
            [ "CREATE_TENANT", `${AppConstants.getAppBasePath()}/create-tenant` ],
            [ "ORGANIZATIONS", `${AppConstants.getAdminViewBasePath()}/organizations` ],
            [ "ORGANIZATION_UPDATE", `${AppConstants.getAdminViewBasePath()}/organizations/:id` ],
            [ "ORGANIZATION_ROLES", `${AppConstants.getAdminViewBasePath()}/roles/organization-roles` ],
            [ "ORGANIZATION_ROLE_UPDATE", `${AppConstants.getAdminViewBasePath()}/roles/organization-roles/:id` ],
            [ "ADMINISTRATORS", `${AppConstants.getAdminViewBasePath()}/administrators` ],
            [ "ADMINISTRATOR_EDIT", `${AppConstants.getAdminViewBasePath()}/administrators/:id` ],
            [ "ADMINISTRATOR_SETTINGS", `${AppConstants.getAdminViewBasePath()}/administrator-settings-edit` ],
            [ "VALIDATION_CONFIG", `${AppConstants.getAdminViewBasePath()}/validation-configuration` ],
            [ "VALIDATION_CONFIG_EDIT", `${AppConstants.getAdminViewBasePath()}/edit-validation-configuration` ],
            [ "ACCOUNT_LOGIN", `${AppConstants.getAdminViewBasePath()}/account-login` ],
            [ "USERNAME_VALIDATION_EDIT", `${AppConstants.getAdminViewBasePath()}/edit-username-validation` ],
            [ "ALTERNATIVE_LOGIN_IDENTIFIER_EDIT",
                `${AppConstants.getAdminViewBasePath()}/edit-alternative-login-identifier` ],
            [ "INSIGHTS", `${AppConstants.getAdminViewBasePath()}/insights` ],
            [ "REMOTE_LOGGING", `${AppConstants.getAdminViewBasePath()}/server/logs` ],
            [ "LOGS", `${ AppConstants.getAdminViewBasePath() }/logs` ],
            [ "LOG_SETTINGS", `${ AppConstants.getAdminViewBasePath() }/log-settings` ],
            [ "LOG_SETTINGS_AUDIT", `${ AppConstants.getAdminViewBasePath() }/log-settings/audit` ],
            [ "LOG_SETTINGS_DIAGNOSTICS", `${ AppConstants.getAdminViewBasePath() }/log-settings/diagnostics` ],
            [ "SESSION_MANAGEMENT",
                `${AppConstants.getAdminViewBasePath()}/login-and-registration/session-management` ],
            [ "SAML2_CONFIGURATION",
                `${AppConstants.getAdminViewBasePath()}/login-and-registration/saml2-configuration` ],
            [ "CONSOLE_SETTINGS", `${AppConstants.getAdminViewBasePath()}/settings` ],
            [ "CONSOLE_ADMINISTRATORS_EDIT", `${AppConstants.getAdminViewBasePath()}/settings/administrators/:id` ],
            [ "CONSOLE_ROLES_EDIT", `${AppConstants.getAdminViewBasePath()}/settings/roles/:id` ],
            [ "WSFED_CONFIGURATION",
                `${AppConstants.getAdminViewBasePath()}/login-and-registration/wsfed-configuration` ],
            [ "INTERNAL_NOTIFICATION_SENDING",
                `${AppConstants.getAdminViewBasePath()}/login-and-registration/internal-notification-sending` ],
            [ "ACCOUNT_DISABLE",
                `${AppConstants.getAdminViewBasePath()}/login-and-registration/account-disable` ],
            [ "OUTBOUND_PROVISIONING_SETTINGS",
                `${AppConstants.getAdminViewBasePath()}/outbound-provisioning-settings` ],
            [ "IMPERSONATION", `${AppConstants.getAdminViewBasePath()}/login-and-registration/impersonation` ],
            [ "ACTIONS",
                `${AppConstants.getAdminViewBasePath()}/actions` ],
            [ "WEBHOOKS",
                `${AppConstants.getAdminViewBasePath()}/webhooks` ],
            [ "PRE_ISSUE_ACCESS_TOKEN_EDIT",
                `${AppConstants.getAdminViewBasePath()}/actions/pre-issue-access-token` ],
            [ "PRE_UPDATE_PASSWORD_EDIT",
                `${AppConstants.getAdminViewBasePath()}/actions/pre-update-password` ],
            [ "PRE_UPDATE_PROFILE_EDIT",
                `${AppConstants.getAdminViewBasePath()}/actions/pre-update-profile` ],
            [ "TENANTS", `${AppConstants.getDefaultLayoutBasePath()}/organizations` ],
            [ "EDIT_TENANT", `${AppConstants.getDefaultLayoutBasePath()}/organizations/:id` ],
            [ "SYSTEM_SETTINGS", `${AppConstants.getDefaultLayoutBasePath()}/organizations/system-settings` ],
            [ "POLICY_ADMINISTRATION", `${AppConstants.getAdminViewBasePath()}/policy-administration` ],
            [ "EDIT_POLICY", `${AppConstants.getAdminViewBasePath()}/policy-administration/edit-policy/:id` ],
            [ "MCP_SERVERS", `${ AppConstants.getDeveloperViewBasePath() }/mcp-servers` ],
            [ "MCP_SERVER_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/mcp-servers/:id` ],
            [ "PASSWORD_RECOVERY_FLOW_BUILDER",
                `${ AppConstants.getDeveloperViewBasePath() }/edit-password-recovery-flow` ],
            [ "INVITE_USER_PASSWORD_SETUP_FLOW_BUILDER",
                `${ AppConstants.getDeveloperViewBasePath() }/edit-invite-user-registration-flow` ],
            [ "AGENTS", `${AppConstants.getAdminViewBasePath()}/agents` ],
            [ "AGENT_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/agents/:id` ]
        ]);

        return paths;
    }

    /**
     * Filter governance connectors for the side panel for a sub organization.

     * @param governanceConnectorCategories - List of governance connector categories to evaluate.
     *
     * @returns Filtered governance connector categories.
     */
    public static filterGoverananceConnectors(
        governanceConnectorCategories: GovernanceConnectorCategoryInterface[]
    ) : GovernanceConnectorCategoryInterface[] {
        const showGovernanceConnectorsIdOfSuborgs: string[] = [];

        GovernanceConnectorUtils.SHOW_GOVERNANCE_CONNECTORS_FOR_SUBORGS
            .forEach((connector: GovernanceCategoryForOrgsInterface) => {
                showGovernanceConnectorsIdOfSuborgs.push(connector.id);
            });

        for (let index: number = governanceConnectorCategories.length-1; index >=0 ; index--) {

            const connector: GovernanceConnectorCategoryInterface = governanceConnectorCategories[index];

            if(!showGovernanceConnectorsIdOfSuborgs.includes(connector.id)) {
                governanceConnectorCategories.splice(index,1);
            }
        }

        return governanceConnectorCategories;
    }

    /**
     * Name of the app config file for the admin portal.
     */
    public static readonly APP_CONFIG_FILE_NAME: string = "app.config.json";

    /**
     * Error given by server when the user has denied consent.
     */
    public static readonly USER_DENIED_CONSENT_SERVER_ERROR: string = "User denied the consent";

    /**
     * Set of login errors to be used as search params to toggle unauthorized page appearance.
     */
    public static readonly LOGIN_ERRORS: Map<string, string> = new Map<string, string>([
        [ "NO_LOGIN_PERMISSION", "no_login_permission" ],
        [ "ACCESS_DENIED", "access_denied" ],
        [ "USER_DENIED_CONSENT", "consent_denied" ]
    ]);

    /**
     * Route ids that are enabled in an organization.
     */
    public static readonly ORGANIZATION_ENABLED_ROUTES: string[] = [
        "gettingStarted",
        "identityProviders",
        "users",
        "organizations",
        "groups",
        "roles",
        "userRoles",
        "applications",
        "emailTemplates",
        "smsTemplates",
        "governanceConnectors",
        "branding",
        "consoleSettings",
        "apiResources"
    ];

    /**
     * Organization-management-related route ids
     */
    public static readonly ORGANIZATION_ROUTES: string[] = [
        "organizations",
        "organization-roles",
        "organization-edit"
    ];

    /**
     * Route ids that are enabled in only for an organizations (Not allowed in root organization).
     */
    public static readonly ORGANIZATION_ONLY_ROUTES: string[] = [
        "roles",
        ...(this.getAdministratorsFeatureConfig()?.enabled ? [ "consoleSettings" ] : [])
    ];

    /**
     * Route ids that are enabled in only for super admins.
     */
    public static readonly SUPER_ADMIN_ONLY_ROUTES: string[] = [
        "admin-session-advisory-banner-edit",
        "remote-logging",
        "server"
    ];

    /**
     * Route id of the console settings page.
     */
    public static readonly CONSOLE_SETTINGS_ROUTE: string = "consoleSettings";

    /**
     * Route id of the console settings page.
     */
    public static readonly AGENTS_ROUTE: string = "agents";

    /**
     * Name of the root node
     */
    public static readonly PERMISSIONS_ROOT_NODE: string = "All Permissions";

    /**
     * Default status of the My Account portal.
     */
    public static readonly DEFAULT_MY_ACCOUNT_STATUS: boolean = true;
}
