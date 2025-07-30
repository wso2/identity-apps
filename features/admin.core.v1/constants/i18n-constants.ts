/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { I18nModuleConstants } from "@wso2is/i18n";

/**
 * Class containing portal specific i18n constants.
 */
export class I18nConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() {}

    /**
     * Common namespace.
     */
    public static readonly COMMON_NAMESPACE: string = I18nModuleConstants.COMMON_NAMESPACE;

    /**
     * Console portal namespace.
     */
    public static readonly CONSOLE_PORTAL_NAMESPACE: string = I18nModuleConstants.CONSOLE_PORTAL_NAMESPACE;

    /**
     * apiResources namespace.
     */
    public static readonly EXTENSIONS_NAMESPACE: string = I18nModuleConstants.EXTENSIONS_NAMESPACE;

    /**
     * api resources namespace.
     */
    public static readonly API_RESOURCES_NAMESPACE: string = I18nModuleConstants.API_RESOURCES_NAMESPACE;

    /**
     * Applications namespace.
     */
    public static readonly APPLICATIONS_NAMESPACE: string = I18nModuleConstants.APPLICATIONS_NAMESPACE;

    /**
     * idp namespace.
     */
    public static readonly IDP_NAMESPACE: string = I18nModuleConstants.IDP_NAMESPACE;

    /**
     * userstores namespace.
     */
    public static readonly USERSTORES_NAMESPACE: string = I18nModuleConstants.USERSTORES_NAMESPACE;

    /**
     * Validation namespace.
     */
    public static readonly VALIDATION_NAMESPACE: string = I18nModuleConstants.VALIDATION_NAMESPACE;

    /**
     * JWT private key configuration namespace.
     */
    public static readonly IMPERSONATION_CONFIGURATION_NAMESPACE: string = I18nModuleConstants.IMPERSONATION_NAMESPACE;

    /**
     * transferList namespace.
     */
    public static readonly TRANSFER_LIST_NAMESPACE: string = I18nModuleConstants.TRANSFER_LIST_NAMESPACE;

    /**
     * User namespace.
     */
    public static readonly USER_NAMESPACE: string = I18nModuleConstants.USER_NAMESPACE;

    /**
     * Users namespace.
     */
    public static readonly USERS_NAMESPACE: string = I18nModuleConstants.USERS_NAMESPACE;

    /**
     * governanceConnectors namespace.
     */
    public static readonly GOVERNANCE_CONNECTORS_NAMESPACE: string =
        I18nModuleConstants.GOVERNANCE_CONNECTORS_NAMESPACE;

    /**
     * Groups namespace.
     */
    public static readonly GROUPS_NAMESPACE: string = I18nModuleConstants.GROUPS_NAMESPACE;

    /**
     * pages namespace.
     */
    public static readonly PAGES_NAMESPACE: string = I18nModuleConstants.PAGES_NAMESPACE;

    /**
     * IDVP namespace.
     */
    public static readonly IDVP_NAMESPACE: string = I18nModuleConstants.IDVP_NAMESPACE;

    /**
     * Invite namespace.
     */
    public static readonly INVITE_NAMESPACE: string = I18nModuleConstants.INVITE_NAMESPACE;

    /**
     * Parent org invitations namespace.
     */
    public static readonly PARENT_ORG_INVITATIONS_NAMESPACE: string =
        I18nModuleConstants.PARENT_ORG_INVITATIONS_NAMESPACE;

    /**
     * OIDC scopes namespace.
     */
    public static readonly OIDC_SCOPES_NAMESPACE: string = I18nModuleConstants.OIDC_SCOPES_NAMESPACE;

    /**
     * Onboarded namespace.
     */
    public static readonly ONBOARDED_NAMESPACE: string = I18nModuleConstants.ONBOARDED_NAMESPACE;

    /**
     * Organization discovery namespace.
     */
    public static readonly ORGANIZATION_DISCOVERY_NAMESPACE: string =
        I18nModuleConstants.ORGANIZATION_DISCOVERY_NAMESPACE;

    /**
     * Organizations namespace.
     */
    public static readonly ORGANIZATIONS_NAMESPACE: string = I18nModuleConstants.ORGANIZATIONS_NAMESPACE;

    /**
     * Authentication Flow namespace.
     */
    public static readonly AUTHENTICATION_FLOW_NAMESPACE: string = I18nModuleConstants.AUTHENTICATION_FLOW_NAMESPACE;

    /**
     * remoteFetch namespace.
     */
    public static readonly REMOTE_FETCH_NAMESPACE: string = I18nModuleConstants.REMOTE_FETCH_NAMESPACE;

    /**
     * Roles namespace.
     */
    public static readonly ROLES_NAMESPACE: string = I18nModuleConstants.ROLES_NAMESPACE;

    /**
     * Application Roles namespace.
     */
    public static readonly APPLICATION_ROLES_NAMESPACE: string = I18nModuleConstants.APPLICATION_ROLES_NAMESPACE;

    /**
     * Server configurations namespace.
     */
    public static readonly SERVER_CONFIGS_NAMESPACE: string = I18nModuleConstants.SERVER_CONFIGS_NAMESPACE;

    /**
     * SAML 2.0 Configuration namespace.
     */
    public static readonly SAML2_CONFIG_NAMESPACE: string = I18nModuleConstants.SAML2_CONFIG_NAMESPACE;

    /**
     * Session management namespace.
     */
    public static readonly SESSION_MANAGEMENT_NAMESPACE: string = I18nModuleConstants.SESSION_MANAGEMENT_NAMESPACE;

    /**
     * WS-Federation Configuration namespace.
     */
    public static readonly WS_FEDERATION_CONFIG_NAMESPACE: string = I18nModuleConstants.WS_FEDERATION_CONFIG_NAMESPACE;

    /**
     * insights namespace.
     */
    public static readonly INSIGHTS_NAMESPACE: string = I18nModuleConstants.INSIGHTS_NAMESPACE;

    /**
     * SMS Providers namespace.
     */
    public static readonly SMS_PROVIDERS_NAMESPACE: string = I18nModuleConstants.SMS_PROVIDERS_NAMESPACE;

    /**
     * Push Providers namespace.
     */
    public static readonly PUSH_PROVIDERS_NAMESPACE: string = I18nModuleConstants.PUSH_PROVIDERS_NAMESPACE;

    /**
     * Email Providers namespace.
     */
    public static readonly EMAIL_PROVIDERS_NAMESPACE: string = I18nModuleConstants.EMAIL_PROVIDERS_NAMESPACE;

    /**
     * SMS Templates namespace.
     */
    public static readonly SMS_TEMPLATES_NAMESPACE: string = I18nModuleConstants.SMS_TEMPLATES_NAMESPACE;

    /**
     * Claims namespace.
     */
    public static readonly CLAIMS_NAMESPACE: string = I18nModuleConstants.CLAIMS_NAMESPACE;

    /**
     * Email locale namespace.
     */
    public static readonly EMAIL_LOCALE_NAMESPACE: string = I18nModuleConstants.EMAIL_LOCALE_NAMESPACE;

    /**
     * Help Panel namespace.
     */
    public static readonly HELP_PANEL_NAMESPACE: string = I18nModuleConstants.HELP_PANEL_NAMESPACE;

    /**
     * suborganizations namespace.
     */
    public static readonly SUBORGANIZATIONS_NAMESPACE: string = I18nModuleConstants.SUBORGANIZATIONS_NAMESPACE;

    /**
     * console settings namespace.
     */
    public static readonly CONSOLE_SETTINGS_NAMESPACE: string = I18nModuleConstants.CONSOLE_SETTINGS_NAMESPACE;

    /**
     * Secrets namespace.
     */
    public static readonly SECRETS_NAMESPACE: string = I18nModuleConstants.SECRETS_NAMESPACE;

    /**
     * Branding namespace.
     */
    public static readonly BRANDING_NAMESPACE: string = I18nModuleConstants.BRANDING_NAMESPACE;

    /**
     * emailTemplates namespace.
     */
    public static readonly EMAIL_TEMPLATES_NAMESPACE: string = I18nModuleConstants.EMAIL_TEMPLATES_NAMESPACE;

    /**
     * Certificates namespace.
     */
    public static readonly CERTIFICATES_NAMESPACE: string = I18nModuleConstants.CERTIFICATES_NAMESPACE;

    /**
     * authenticationProvider namespace.
     */
    public static readonly AUTHENTICATION_PROVIDER_NAMESPACE: string =
        I18nModuleConstants.AUTHENTICATION_PROVIDER_NAMESPACE;

    /**
     * AI namespace.
     */
    public static readonly AI_NAMESPACE: string = I18nModuleConstants.AI_NAMESPACE;

    /**
     * Application Templates namespace.
     */
    public static readonly APPLICATION_TEMPLATES_NAMESPACE: string =
        I18nModuleConstants.APPLICATION_TEMPLATES_NAMESPACE;

    /**
     * Extension Templates namespace.
     */
    public static readonly TEMPLATE_CORE_NAMESPACE: string = I18nModuleConstants.TEMPLATE_CORE_NAMESPACE;

    /**
     * Actions namespace.
     */
    public static readonly ACTIONS_NAMESPACE: string = I18nModuleConstants.ACTIONS_NAMESPACE;

    /**
     * Webhooks namespace.
     */
    public static readonly WEBHOOKS_NAMESPACE: string = I18nModuleConstants.WEBHOOKS_NAMESPACE;

    /**
     * Tenants namespace.
     */
    public static readonly TENANTS_NAMESPACE: string = I18nModuleConstants.TENANTS_NAMESPACE;

    /**
     * Remote User Stores namespace.
     */
    public static readonly REMOTE_USER_STORES_NAMESPACE: string = I18nModuleConstants.REMOTE_USER_STORES_NAMESPACE;

    /**
     * Policy Administration namespace.
     */
    public static readonly POLICY_ADMINISTRATION_NAMESPACE: string =
        I18nModuleConstants.POLICY_ADMINISTRATION_NAMESPACE;

    /**
     * Rules namespace.
     */
    public static readonly RULES_NAMESPACE: string = I18nModuleConstants.RULES_NAMESPACE;

    /**
     * Custom Authentication namespace.
     */
    public static readonly CUSTOM_AUTHENTICATOR_NAMESPACE: string =
        I18nModuleConstants.CUSTOM_AUTHENTICATOR_NAMESPACE;

    /**
     * Approval Workflow namespace.
     */
    public static readonly APPROVAL_WORKFLOWS_NAMESPACE: string =
        I18nModuleConstants.APPROVAL_WORKFLOWS_NAMESPACE;

    public static readonly AGENTS_NAMESPACE: string = I18nModuleConstants.AGENTS_NAMESPACE;

    /**
     * Flows namespace.
     */
    public static readonly FLOWS_NAMESPACE: string = I18nModuleConstants.FLOWS_NAMESPACE;

    /**
     * Locations of the I18n namespaces.
     */
    public static readonly BUNDLE_NAMESPACE_DIRECTORIES: Map<string, string> = new Map<string, string>([
        [ I18nConstants.COMMON_NAMESPACE, "portals" ],
        [ I18nConstants.CONSOLE_PORTAL_NAMESPACE, "portals" ],
        [ I18nConstants.EXTENSIONS_NAMESPACE, "portals" ],
        [ I18nConstants.USERSTORES_NAMESPACE, "portals" ],
        [ I18nConstants.VALIDATION_NAMESPACE, "portals" ],
        [ I18nConstants.TRANSFER_LIST_NAMESPACE, "portals" ],
        [ I18nConstants.USER_NAMESPACE, "portals" ],
        [ I18nConstants.USERS_NAMESPACE, "portals" ],
        [ I18nConstants.PAGES_NAMESPACE, "portals" ],
        [ I18nConstants.IDVP_NAMESPACE, "portals" ],
        [ I18nConstants.INVITE_NAMESPACE, "portals" ],
        [ I18nConstants.PARENT_ORG_INVITATIONS_NAMESPACE, "portals" ],
        [ I18nConstants.OIDC_SCOPES_NAMESPACE, "portals" ],
        [ I18nConstants.ONBOARDED_NAMESPACE, "portals" ],
        [ I18nConstants.ORGANIZATION_DISCOVERY_NAMESPACE, "portals" ],
        [ I18nConstants.ORGANIZATIONS_NAMESPACE, "portals" ],
        [ I18nConstants.AUTHENTICATION_FLOW_NAMESPACE, "portals" ],
        [ I18nConstants.REMOTE_FETCH_NAMESPACE, "portals" ],
        [ I18nConstants.ROLES_NAMESPACE, "portals" ],
        [ I18nConstants.APPLICATION_ROLES_NAMESPACE, "portals" ],
        [ I18nConstants.SERVER_CONFIGS_NAMESPACE, "portals" ],
        [ I18nConstants.SAML2_CONFIG_NAMESPACE, "portals" ],
        [ I18nConstants.SESSION_MANAGEMENT_NAMESPACE, "portals" ],
        [ I18nConstants.WS_FEDERATION_CONFIG_NAMESPACE, "portals" ],
        [ I18nConstants.INSIGHTS_NAMESPACE, "portals" ],
        [ I18nConstants.SMS_PROVIDERS_NAMESPACE, "portals" ],
        [ I18nConstants.SMS_TEMPLATES_NAMESPACE, "portals" ],
        [ I18nConstants.CLAIMS_NAMESPACE, "portals" ],
        [ I18nConstants.EMAIL_LOCALE_NAMESPACE, "portals" ],
        [ I18nConstants.HELP_PANEL_NAMESPACE, "portals" ],
        [ I18nConstants.SUBORGANIZATIONS_NAMESPACE, "portals" ],
        [ I18nConstants.CONSOLE_SETTINGS_NAMESPACE, "portals" ],
        [ I18nConstants.SECRETS_NAMESPACE, "portals" ],
        [ I18nConstants.BRANDING_NAMESPACE, "portals" ],
        [ I18nConstants.EMAIL_TEMPLATES_NAMESPACE, "portals" ],
        [ I18nConstants.CERTIFICATES_NAMESPACE, "portals" ],
        [ I18nConstants.AUTHENTICATION_PROVIDER_NAMESPACE, "portals" ],
        [ I18nConstants.GOVERNANCE_CONNECTORS_NAMESPACE, "portals" ],
        [ I18nConstants.GROUPS_NAMESPACE, "portals" ],
        [ I18nConstants.APPLICATIONS_NAMESPACE, "portals" ],
        [ I18nConstants.IDP_NAMESPACE, "portals" ],
        [ I18nConstants.API_RESOURCES_NAMESPACE, "portals" ],
        [ I18nConstants.AI_NAMESPACE, "portals" ],
        [ I18nConstants.APPLICATION_TEMPLATES_NAMESPACE, "portals" ],
        [ I18nConstants.TEMPLATE_CORE_NAMESPACE, "portals" ],
        [ I18nConstants.IMPERSONATION_CONFIGURATION_NAMESPACE, "portals" ],
        [ I18nConstants.ACTIONS_NAMESPACE, "portals" ],
        [ I18nConstants.WEBHOOKS_NAMESPACE, "portals" ],
        [ I18nConstants.TENANTS_NAMESPACE, "portals" ],
        [ I18nConstants.CUSTOM_AUTHENTICATOR_NAMESPACE, "portals" ],
        [ I18nConstants.POLICY_ADMINISTRATION_NAMESPACE, "portals" ],
        [ I18nConstants.REMOTE_USER_STORES_NAMESPACE, "portals" ],
        [ I18nConstants.RULES_NAMESPACE, "portals" ],
        [ I18nConstants.PUSH_PROVIDERS_NAMESPACE, "portals" ],
        [ I18nConstants.EMAIL_PROVIDERS_NAMESPACE, "portals" ],
        [ I18nConstants.APPROVAL_WORKFLOWS_NAMESPACE, "portals" ],
        [ I18nConstants.AGENTS_NAMESPACE, "portals" ],
        [ I18nConstants.FLOWS_NAMESPACE, "portals" ]
    ]);

    /**
     * I18n init options override flag. The default options in the module will be overridden if set to true.
     */
    public static readonly INIT_OPTIONS_OVERRIDE: boolean = false;

    /**
     * If the language detector plugin should be enabled or not.
     */
    public static readonly LANG_AUTO_DETECT_ENABLED: boolean = true;

    /**
     * If the xhr backend plugin should be enabled or not.
     */
    public static readonly XHR_BACKEND_PLUGIN_ENABLED: boolean = true;

    /**
     * Default fallback language.
     */
    public static readonly DEFAULT_FALLBACK_LANGUAGE: string = I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE;
}
