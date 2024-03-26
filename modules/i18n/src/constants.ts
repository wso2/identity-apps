/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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
 * Class containing i18n module constants.
 */
export class I18nModuleConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Name of the i18n module.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly MODULE_NAME: string = "@wso2is/i18n";

    /**
     * Common namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly COMMON_NAMESPACE: string = "common";

    /**
     * User portal namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly MY_ACCOUNT_NAMESPACE: string = "myAccount";

    /**
     * Console portal namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly CONSOLE_PORTAL_NAMESPACE: string = "console";

    /**
     * Extensions namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly EXTENSIONS_NAMESPACE: string = "extensions";

    /**
     * Default fallback language.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly DEFAULT_FALLBACK_LANGUAGE: string = "en-US";

    /**
     * Metadata file name.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly META_FILENAME: string = "meta.json";

    /**
     * pages namespace.
     */
    public static readonly PAGES_NAMESPACE: string = "pages";
  
    /**
     * Identity Verification Provider namespace.
     */
    public static readonly IDVP_NAMESPACE: string = "idvp";
  
    /**
     * Invite namespace.
     */
    public static readonly INVITE_NAMESPACE: string = "invite";

    /**
     * Parent org invitations namespace.
     */
    public static readonly PARENT_ORG_INVITATIONS_NAMESPACE: string = "parentOrgInvitations";

    /**
     * OIDC scopes namespace.
     */
    public static readonly OIDC_SCOPES_NAMESPACE: string = "oidcScopes";
  
    /**
     * Onboarded namespace.
     */
    public static readonly ONBOARDED_NAMESPACE: string = "onboarded";

    /**
     * Organization discovery namespace.
     */
    public static readonly ORGANIZATION_DISCOVERY_NAMESPACE: string = "organizationDiscovery";

    /**
     * Organizations namespace.
     */
    public static readonly ORGANIZATIONS_NAMESPACE: string = "organizations";
  
    /**
     * Authentication flow namespace.
     */
    public static readonly AUTHENTICATION_FLOW_NAMESPACE: string = "authenticationFlow";
  
    /**
     * remoteFetch namespace.
     */
    public static readonly REMOTE_FETCH_NAMESPACE: string = "remoteFetch";

    /**
     * Roles namespace.
     */
    public static readonly ROLES_NAMESPACE: string = "roles";

    /**
     * Server configurations namespace.
     */
    public static readonly SERVER_CONFIGS_NAMESPACE: string = "serverConfigs";
  
    /**
     * SAML 2.0 Configuration namespace.
     */
    public static readonly SAML2_CONFIG_NAMESPACE: string = "saml2Config";

    /**
     * Session management namespace.
     */
    public static readonly SESSION_MANAGEMENT_NAMESPACE: string = "sessionManagement";

    /**
     * WS-Federation Configuration namespace.
     */
    public static readonly WS_FEDERATION_CONFIG_NAMESPACE: string = "wsFederationConfig";
  
    /**
     * insights namespace.
     */
    public static readonly INSIGHTS_NAMESPACE: string = "insights";

    /**
     * SMS Providers namespace.
     */
    public static readonly SMS_PROVIDERS_NAMESPACE: string = "smsProviders";
  
    /**
     * Claims namespace.
     * @constant
     */
    public static readonly CLAIMS_NAMESPACE: string = "claims";

    /**
     * Email locale namespace.
     * @constant
     */
    public static readonly EMAIL_LOCALE_NAMESPACE: string = "emailLocale";
  
    /**
     * Help panel namespace.
     * @constant
     */
    public static readonly HELP_PANEL_NAMESPACE: string = "helpPanel";
  
    /**
     * Suborganizations namespace.
     * @constant
     */
    public static readonly SUBORGANIZATIONS_NAMESPACE: string = "suborganizations";
  
    /**
     * Console settings namespace.
     * @constant
     */
    public static readonly CONSOLE_SETTINGS_NAMESPACE: string = "consoleSettings";
  
    /**
     * Secrets namespace.
     * @constant
     */
    public static readonly SECRETS_NAMESPACE: string = "secrets";
  
    /**
     * Branding namespace.
     * @constant
     */
    public static readonly BRANDING_NAMESPACE: string = "branding";
  
    /**
     * emailTemplates namespace.
     * @constant
     */
    public static readonly EMAIL_TEMPLATES_NAMESPACE: string = "emailTemplates";

    /**
     * Certificate namespace.
     * @constant
     */
    public static readonly CERTIFICATES_NAMESPACE: string = "certificates";

    /**
     * authenticationProvider namespace.
     * @constant
     */
    public static readonly AUTHENTICATION_PROVIDER_NAMESPACE: string = "authenticationProvider";

    /**
     * governanceConnectors namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly GOVERNANCE_CONNECTORS_NAMESPACE: string = "governanceConnectors";

    /**
     * Groups namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly GROUPS_NAMESPACE: string = "groups";
}
