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

import { LegacyModeInterface, ProductVersionConfigInterface } from "./core";
import { GravatarConfig } from "./profile";

/**
 * Common interface for configs.
 */
export interface CommonConfigInterface<T, S, U, V, W> {
    /**
     * Deployment related configurations.
     */
    deployment?: T;
    /**
     * Resource endpoints.
     */
    endpoints?: S;
    /**
     * Feature configurations.
     */
    features?: U;
    /**
     * I18n configurations.
     */
    i18n?: V;
    /**
     * UI configurations.
     */
    ui?: W;
}

/**
 * Common config interface for deployment settings.
 */
export interface CommonDeploymentConfigInterface<T = Record<string, unknown>, S = Record<string, unknown>> {
    /**
     * EXPERIMENTAL CONFIG -: Platform IdP configurations.
     * @remarks
     * If this is enabled, the sign-in logic will have a few extensions.
     */
    __experimental__platformIdP: {
        /**
         * Is the application fronted with a platform IdP.
         */
        enabled: true;
        /**
         * The Home Realm Id of the Platform IdP.
         */
        homeRealmId: string;
    };
    /**
     * Base name of the application (tenant qualified).
     * ex: `/t/wos2.com/sample-portal`
     */
    appBaseName: string;
    /**
     * Base name without tenant.
     * ex: `/sample-portal`
     */
    appBaseNameWithoutTenant: string;
    /**
     * Home path of the application.
     * ex: `/overview`
     */
    appHomePath: string;
    /**
     * Login path of the application.
     * ex: `/login`
     */
    appLoginPath: string;
    /**
     * Logout path of the application.
     * ex: `/logout`
     */
    appLogoutPath: string;
    /**
     * Host of the client application.
     * ex: `https://localhost:9001`
     */
    clientHost: string;
    /**
     * Client ID of the client application.
     */
    clientID: string;
    /**
     * Origin of the client application. Usually same as `clientHost`.
     */
    clientOrigin: string;
    /**
     * Origin of the client application with the tenant domain.
     * ex: `https://localhost:9001/t/wso2.com/console`
     */
    clientOriginWithTenant: string;
    /**
     * Identity SDK configurations.
     */
    idpConfigs: IdpConfigInterface<T, S>;
    /**
     * Callback to directed on successful login.
     * ex: `/sample-portal/login`
     */
    loginCallbackUrl: string;
    /**
     * Organization prefix.
     * ex: `o`.
     * usage: `/${organizationPrefix}/<org_id>` - `/o/<org_id>`
     */
    organizationPrefix: string;
    /**
     * Host of the Identity Sever.
     * ex: https://localhost:9443
     */
    serverHost: string;
    /**
     * Custom branded host of the Identity Sever.
     * ex: https://localhost:9443/t/test -\> https://api.test.com
     */
    customServerHost: string;
    /**
     * Server origin. Usually same as `serverHost`.
     */
    serverOrigin: string;
    /**
     * Super tenant. ex: `carbon.super`.
     */
    superTenant: string;
    /**
     * Tenant domain.
     * ex: `wso2.com`
     */
    tenant: string;
    /**
     * Tenant path.
     * ex: `/t/wso2.com`
     */
    tenantPath: string;
    /**
     * Tenant prefix.
     * ex: `t`
     */
    tenantPrefix: string;
}

/**
 * Common config interface for UI settings.
 */
export interface CommonUIConfigInterface<T = Record<string, unknown>> {
    /**
     * Portal Announcement banner.
     */
    announcements?: AnnouncementBannerInterface[];
    /**
     * Copyright text for the footer.
     */
    appCopyright?: string;
    /**
     * Name of the application.
     * ex: `Developer`
     */
    appName: string;
    /**
     * Title text for the browser window.
     * ex: `WSO2 Identity Server`
     */
    appTitle?: string;
    /**
     * Gravatar service configurations.
     */
    gravatarConfig?: GravatarConfig;
    /**
     * Application features configurations
     */
    features?: T;
    /**
     * i18n configurations.
     */
    i18nConfigs: I18nConfigsInterface;
    /**
     * Should show cookie consent banner;
     */
    isCookieConsentBannerEnabled: boolean;
    /**
     * Cookie policy url.
     */
    cookiePolicyUrl: string;
    /**
     * Should show/hide the avatar label in app header.
     */
    isHeaderAvatarLabelAllowed: boolean;
    /**
     * Should the left navigation be categorized.
     */
    isLeftNavigationCategorized?: boolean;
    /**
    * Flag to check whether the password validation is performed using input validation listener.
    */
    isPasswordInputValidationEnabled: boolean;
    /**
     * Privacy Policy configs.
     */
    privacyPolicyConfigs: PrivacyPolicyConfigsInterface;
    /**
     * Name of the product.
     * ex: `Identity Server`
     */
    productName: string;
    /**
     * Product version UI configurations.
     * ex: allowSnapshot, override etc.
     */
    productVersionConfig?: ProductVersionConfigInterface;
    /**
     * Legacy mode
     */
    legacyMode?: LegacyModeInterface;
    /**
     * Theme configs.
     */
    theme: AppThemeConfigInterface;
}

/**
 * Privacy Policy configs interface.
 */
export interface PrivacyPolicyConfigsInterface {
    /**
     * Show/Hide the privacy policy link on footer.
     */
    visibleOnFooter?: boolean;
}

/**
 * i18n configs interface.
 */
export interface I18nConfigsInterface {
    /**
     * Show/Hide the language switcher.
     */
    showLanguageSwitcher?: boolean;
}

/**
 * App theme configs interface.
 */
export interface AppThemeConfigInterface {
    /**
     * App theme.
     * ex: "default", "dark" etc.
     */
    name: string;
    /**
     * App theme path. Used to override the default theme path defined in the source.
     * ex: "https://cdn.wso2.com/is/assets/theme.min.css".
     */
    path?: string;
    /**
     * Set of override stylesheets.
     * ex: [ "https://cdn.wso2.com/is/assets/override.theme.min.css", "/libs/themes/overrides/color.css" ].
     */
    styleSheets?: string[];
}

/**
 * Announcement banner interface.
 */
export interface AnnouncementBannerInterface {
    /**
     * Color of the banner.
     */
    color: string;
    /**
     * Expiry timestamp.
     */
    expire: string;
    /**
     * Unique ID.
     */
    id: string;
    /**
     * Order of the advertisement.
     */
    order: number;
    /**
     * Message to be displayed.
     */
    message: string;
}

/**
 * Github served documentation options interface.
 */
export interface GithubDocumentationOptionsInterface {
    /**
     * Github branch.
     */
    branch: string;
}

/**
 * Interface to extent in-order to enable scope based access control.
 */
export interface FeatureAccessConfigInterface {
    /**
     * CRUD scopes for the feature.
     */
    scopes: CRUDScopesInterface;
    /**
     * Set of deprecated features.
     */
    deprecatedFeaturesToShow?: DeprecatedFeatureInterface[];
    /**
     * Set of disabled features.
     */
    disabledFeatures?: string[];
    /**
     * Enable the feature.
     */
    enabled?: boolean;
    /**
     * Enable the tour option
     */
    tryittourenabled?: boolean;
}

export interface DeprecatedFeatureInterface {
    /**
     * Name of the deprecated feature.
     */
    name?: string;
    /**
     * An array of deprecated properties.
     */
    deprecatedProperties?: string[];
}

/**
 * Interface for Scopes related to CRUD permission.
 */
export interface CRUDScopesInterface {
    /**
     * Feature wise scopes array.
     */
    feature: string[];
    /**
     * Create permission scopes array.
     */
    create: string[];
    /**
     * Read permission scopes array.
     */
    read: string[];
    /**
     * Update permission scopes array.
     */
    update: string[];
    /**
     * Delete permission scopes array.
     */
    delete: string[];
}

/**
 * Interface to extend when scope based access control should be enabled for a component.
 */
export interface SBACInterface<T> {
    /**
     * Feature config.
     */
    featureConfig?: T;
}

/**
 * Interface for IDP configs.
 */
export interface IdpConfigInterface<T = Record<string, unknown>, S = Record<string, unknown>> {
    /**
     * If PKCE enabled or not.
     */
    enablePKCE: boolean;
    /**
     * Allowed leeway for id_tokens.
     */
    clockTolerance: number;
    /**
     * Authorization code response mode.
     */
    responseMode: T;
    /**
     * Scopes requested with the token.
     */
    scope: string[];
    /**
     * Server origin URL.
     */
    serverOrigin: string;
    /**
     * Token storage strategy.
     */
    storage: S;
    /**
     * Authorization endpoint URL provided from outside.
     */
    authorizeEndpointURL?: string;
    /**
     * JWKS endpoint URL provided from outside.
     */
    jwksEndpointURL?: string;
    /**
     * OIDC logout endpoint URL provided from outside.
     */
    logoutEndpointURL?: string;
    /**
     * OIDC session iframe endpoint URL provided from outside.
     */
    oidcSessionIFrameEndpointURL?: string;
    /**
     * Token revocation endpoint URL provided from outside.
     */
    tokenRevocationEndpointURL?: string;
    /**
     * Token endpoint URL provided from outside.
     */
    tokenEndpointURL?: string;
    /**
     * Well known endpoint URL provided from outside.
     */
    wellKnownEndpointURL?: string;
}
