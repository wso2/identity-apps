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

import { AppThemeConfigInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";
import { identityProviderConfig } from "../../../extensions/configs";
import {
    GovernanceCategoryForOrgsInterface,
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorUtils
} from "../../server-configurations";

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
        return window["AppUtils"]?.getConfig()?.superTenant;
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

        const useNewConnectionsView: boolean = identityProviderConfig?.useNewConnectionsView;

        return new Map<string, string>()
            .set("ADMIN_OVERVIEW", `${ AppConstants.getAdminViewBasePath() }/gozetim`)
            .set("APPLICATIONS", `${ AppConstants.getDeveloperViewBasePath() }/uygulamalar`)
            .set("APPLICATION_TEMPLATES", `${ AppConstants.getDeveloperViewBasePath() }/uygulamalar/sablonlar`)
            .set("APPLICATION_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/uygulamalar/:id`)
            .set("APPLICATION_SIGN_IN_METHOD_EDIT", `${ AppConstants.getDeveloperViewBasePath()
            }/uygulamalar/:id:tabName`)
            .set("APPROVALS", `${ AppConstants.getAdminViewBasePath() }/onaylamalar`)
            .set("CERTIFICATES", `${ AppConstants.getAdminViewBasePath() }/sertifikalar`)
            .set("CLAIM_DIALECTS", `${ AppConstants.getAdminViewBasePath() }/attributes-and-mappings`)
            .set("CONNECTIONS", `${ AppConstants.getDeveloperViewBasePath() }/baglantilar`)
            .set("CONNECTION_TEMPLATES", `${ AppConstants.getDeveloperViewBasePath() }/baglantilar/sablonlar`)
            .set("CONNECTION_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/baglantilar/:id`)
            .set("CUSTOMIZE", `${ AppConstants.getMainViewBasePath() }/ozellestirme`)
            .set("DEVELOPER_OVERVIEW", `${ AppConstants.getDeveloperViewBasePath() }/gozetim`)
            .set("EMAIL_TEMPLATE_TYPES", `${ AppConstants.getAdminViewBasePath() }/eposta-sablonlari`)
            .set("EMAIL_TEMPLATES", `${ AppConstants.getAdminViewBasePath() }/eposta-sablonlari/:templateTypeId`)
            .set("EMAIL_TEMPLATE", `${
                AppConstants.getAdminViewBasePath() }/eposta-sablonlari/:templateTypeId/:templateId`)
            .set("EMAIL_TEMPLATE_ADD", `${
                AppConstants.getAdminViewBasePath() }/eposta-sablonlari/:templateTypeId/${
                AppConstants.EMAIL_TEMPLATE_ADD_URL_PARAM }`)
            .set("EXTERNAL_DIALECT_EDIT", `${ AppConstants.getAdminViewBasePath() }/edit-attribute-mappings/:id`)
            .set("GROUPS", `${ AppConstants.getAdminViewBasePath() }/gruplar`)
            .set("GROUP_EDIT", `${ AppConstants.getAdminViewBasePath() }/gruplar/:id`)
            .set("IDP",
                useNewConnectionsView
                    ? `${ AppConstants.getDeveloperViewBasePath() }/baglantilar`
                    : `${ AppConstants.getDeveloperViewBasePath() }/kimlik-saglayicilar`
            )
            .set("IDP_TEMPLATES",
                useNewConnectionsView
                    ? `${ AppConstants.getDeveloperViewBasePath() }/baglantilar/sablonlar`
                    : `${ AppConstants.getDeveloperViewBasePath() }/kimlik-saglayicilar/sablonlar`
            )
            .set("IDP_EDIT",
                useNewConnectionsView
                    ?`${ AppConstants.getDeveloperViewBasePath() }/kimlik-saglayicilar/:id`
                    :`${ AppConstants.getDeveloperViewBasePath() }/baglantilar/:id`
            )
            .set("IDVP", `${ AppConstants.getDeveloperViewBasePath() }/kimlik-dogrulayicilar`)
            .set("IDVP_TEMPLATES",
                `${ AppConstants.getDeveloperViewBasePath() }/kimlik-dogrulayicilar/sablonlar`
            )
            .set("IDVP_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/kimlik-dogrulayicilar/:id`)
            .set("EVENT_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/etkinlik-duzenle`)
            .set("LOCAL_CLAIMS", `${ AppConstants.getAdminViewBasePath() }/nitelikler`)
            .set("LOCAL_CLAIMS_EDIT", `${ AppConstants.getAdminViewBasePath() }/nitelikleri-duzenle/:id`)
            .set("LOGIN",  window[ "AppUtils" ]?.getConfig()?.routes.login)
            .set("SCIM_MAPPING", `${ AppConstants.getAdminViewBasePath() }/nitelik-haritalama/scim`)
            .set("LOGOUT",  window[ "AppUtils" ]?.getConfig()?.routes.logout)
            .set("OIDC_SCOPES", `${ AppConstants.getAdminViewBasePath() }/oidc-kapsamlari`)
            .set("OIDC_SCOPES_EDIT", `${ AppConstants.getAdminViewBasePath() }/oidc-kapsamlari/:id`)
            .set("PAGE_NOT_FOUND", `${ AppConstants.getMainViewBasePath() }/404`)
            .set("PRIVACY", `${ AppConstants.getMainViewBasePath() }/gizlilik`)
            .set("REMOTE_REPO_CONFIG", `${ AppConstants.getAdminViewBasePath() }/uzak-depo-yapilandirmasi`)
            .set("ROLES", `${ AppConstants.getAdminViewBasePath() }/roles`)
            .set("ROLE_EDIT", `${ AppConstants.getAdminViewBasePath() }/roles/:id`)
            .set("ROOT", "/")
            .set("GOVERNANCE_CONNECTORS", `${AppConstants.getAdminViewBasePath()}/yönetisim-baglayici/:id`)
            .set("UNAUTHORIZED", `${AppConstants.getMainViewBasePath()}/yetkisiz`)
            .set("USERS", `${AppConstants.getAdminViewBasePath()}/kullanicilar`)
            .set("USER_EDIT", `${AppConstants.getAdminViewBasePath()}/kullanicilar/:id`)
            .set("USERSTORES", `${AppConstants.getAdminViewBasePath()}/kullanici-depolari`)
            .set("USERSTORES_EDIT", `${AppConstants.getAdminViewBasePath()}/kullanici-deposu-duzenle/:id`)
            .set("USERSTORE_TEMPLATES", `${AppConstants.getAdminViewBasePath()}/kullanici-deposu-sablonlari`)
            .set("STORING_DATA_DISABLED", `${AppConstants.getMainViewBasePath()}/storing_data_disabled`)
            .set("GOVERNANCE_CONNECTOR", `${AppConstants.getAdminViewBasePath()}/baglayici/:id`)
            .set(
                "GOVERNANCE_CONNECTOR_EDIT",
                `${AppConstants.getAdminViewBasePath()}/baglayici/:categoryId/:connectorId`
            )
            .set("SECRETS", `${AppConstants.getDeveloperViewBasePath()}/secrets`)
            .set("SECRET_EDIT", `${AppConstants.getDeveloperViewBasePath()}/secrets/:type/:name`)
            .set("ATTRIBUTE_MAPPINGS", `${AppConstants.getAdminViewBasePath()}/nitelik-haritalama/:type`)
            .set("CREATE_TENANT", `${AppConstants.getMainViewBasePath()}/create-tenant`)
            .set("ORGANIZATIONS", `${AppConstants.getAdminViewBasePath()}/organizasyonlar`)
            .set("ORGANIZATION_UPDATE", `${AppConstants.getAdminViewBasePath()}/organizasyonlar/:id`)
            .set("ORGANIZATION_ROLES", `${AppConstants.getAdminViewBasePath()}/organizasyonlar-roles`)
            .set("ORGANIZATION_ROLE_UPDATE", `${AppConstants.getAdminViewBasePath()}/organizasyonlar-rolleri/:id`)
            .set("ADMINISTRATORS", `${AppConstants.getAdminViewBasePath()}/yöneticiler`)
            .set("MY_ACCOUNT", `${AppConstants.getAdminViewBasePath()}/hesabim`)
            .set("MY_ACCOUNT_EDIT", `${AppConstants.getAdminViewBasePath()}/hesabimi-duzenle`)
            .set("VALIDATION_CONFIG", `${AppConstants.getAdminViewBasePath()}/onay-yapilandirmasi`)
            .set("VALIDATION_CONFIG_EDIT", `${AppConstants.getAdminViewBasePath()}/onay-yapilandirmasi-duzenle`)
            .set("ACCOUNT_LOGIN", `${AppConstants.getAdminViewBasePath()}/hesap-girisi`)
            .set("USERNAME_VALIDATION_EDIT", `${AppConstants.getAdminViewBasePath()}/kullanici-onayi-duzenle`)
            .set(
                "PRIVATE_KEY_JWT_CONFIG_EDIT",
                `${AppConstants.getAdminViewBasePath()}/private-key-jwt-yapilandirmasi-duzenle`
            );
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

        const filteredGovernaceConnector: GovernanceConnectorCategoryInterface[] = 
            governanceConnectorCategories.filter((connector: GovernanceConnectorCategoryInterface) =>
                showGovernanceConnectorsIdOfSuborgs.includes(connector.id));

        return filteredGovernaceConnector;
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
    public static readonly LOGIN_ERRORS: Map<string, string> = new Map<string, string>()
        .set("NO_LOGIN_PERMISSION", "no_login_permission")
        .set("ACCESS_DENIED", "access_denied")
        .set("USER_DENIED_CONSENT", "consent_denied");

    /**
     * Route ids that are enabled in an organization.
     */
    public static readonly ORGANIZATION_ENABLED_ROUTES: string[] = [
        "identityProviders",
        "users",
        "organizations",
        "groups",
        "organization-roles",
        "applications",
        "emailTemplates",
        "governanceConnectors"
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
        "organization-roles"
    ]

    /**
     * Name of the root node
     */
    public static readonly PERMISSIONS_ROOT_NODE: string = "All Permissions";

    /**
     * Default status of the My Account portal.
     */
    public static readonly DEFAULT_MY_ACCOUNT_STATUS: boolean = true;
}
