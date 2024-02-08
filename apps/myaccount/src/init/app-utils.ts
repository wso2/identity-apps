/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppUtilsInterface } from "../models";

function loadUserConfig(configFile: string, callback: (responseText: string | null) => void) {
    const request: XMLHttpRequest = new XMLHttpRequest();

    request.overrideMimeType("application/json");
    request.open("GET", configFile, false);
    request.send(null);

    if (request.status === 404) {
        callback(null);
    }

    if (request.status === 200) {
        if ((request.responseText.trim().length === 0) ||
            (request.responseText.trim() === "") ||
            (request.responseText.trim() === "{}")) {

            callback(null);
        }
        else {
            callback(request.responseText);
        }
    }
}

function extend(...args: any[]) {
    args = args || [];

    for (let i: number = 1; i < args.length; i++) {
        if (!args[i])
            continue;

        for (const key in args[i]) {
            if ({}.hasOwnProperty.call(args[i], key)) {
                args[key] = args[i][key];
            }
        }
    }

    return args;
}

export const AppUtils: AppUtilsInterface = (function() {
    let _args: any = {},
        _default: any = {},
        _config: any = {};

    const superTenantFallback: string = "carbon.super";
    const tenantPrefixFallback: string = "t";
    const orgPrefixFallback: string = "o";
    const fallbackServerOrigin: string = "https://localhost:9443";
    const appBaseForHistoryAPIFallback: string = "/";
    const urlPathForSuperTenantOriginsFallback: string = "";
    const isSaasFallback: boolean = false;
    const tenantResolutionStrategyFallback: string = "id_token";

    const SERVER_ORIGIN_IDP_URL_PLACEHOLDER: string = "${serverOrigin}";
    const TENANT_PREFIX_IDP_URL_PLACEHOLDER: string = "${tenantPrefix}";
    const USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER: string = "${userTenantDomain}";
    const SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER: string= "${superTenantDomain}";

    return {
        /**
         * Constructs a basename to be used by the History API.
         *
         * @remarks For SaaS apps, basename should be "/". Since is applied on the fly.
         * @returns App base name for the History API.
         */
        constructAppBaseNameForHistoryAPI: function() {
            if (_config.legacyAuthzRuntime) {
                if (_config.appBaseNameForHistoryAPI !== undefined) {
                    return _config.appBaseNameForHistoryAPI;
                }

                return this.isSaas() ? appBaseForHistoryAPIFallback : this.getAppBaseWithTenant();
            }

            return "/";
        },

        /**
         * Constructs app paths.
         *
         * @remarks For non SaaS apps, a relative path without the tenant and basename would surfise.
         * @param path - Path to be constructed.
         * @returns App paths.
         */
        constructAppPaths: function(path: string) {
            if (!this.isSaas()) {
                return path;
            }

            return this.getAppBaseWithTenant() + path;
        },

        /**
         * Constructs redirect URLs i.e Login & Logout.
         *
         * @remarks For SaaS apps, the application the callback URLs shouldn't contain tenant domain.
         * @param url - URL to be constructed.
         * @returns Redirect URLs.
         */
        constructRedirectURLs: function(url: string) {
            if (_config.legacyAuthzRuntime) {
                if (!this.isSaas()) {
                    return _config.clientOrigin + (_config.appBaseName ? "/" + _config.appBaseName : "") + url;
                }

                return _config.clientOrigin + (_config.appBaseName ? "/" + _config.appBaseName : "") + url;
            }

            return _config.clientOrigin + this.getTenantPath() +
                (_config.appBaseName ? "/" + _config.appBaseName : "") + url;
        },

        /**
         * Get app base from URL.
         *
         * @returns App base.
         */
        getAppBase: function() {
            const path: string = this.getLocationPathWithoutTenant();
            const pathChunks: string[] = path.split("/");

            if (pathChunks.length <= 1) {
                return "/";
            }

            if (pathChunks.length === 2) {
                return path;
            }

            return "/" + this.getLocationPathWithoutTenant().split("/")[1];
        },

        /**
         * Get app base with the tenant domain.
         *
         * @returns App base with tenant.
         */
        getAppBaseWithTenant: function() {
            if (_config.legacyAuthzRuntime) {
                return this.getTenantPath(true) + (_config.appBaseName ? ("/" + _config.appBaseName) : "");
            }

            return this.getTenantPath() + (_config.appBaseName ? ("/" + _config.appBaseName) : "");
        },

        /**
         * Get app base with the tenant domain and organization.
         *
         * @returns App base with tenant and organization.
         */
        getAppBaseWithTenantAndOrganization: function() {
            if (_config.legacyAuthzRuntime) {
                return `${ this.getTenantPath(true) }${ this.getOrganizationPath() }${ _config.appBaseName
                    ? ("/" + _config.appBaseName)
                    : "" }`;
            }

            const tenantPath: string = this.getTenantPath(true)
                || `/${this.getTenantPrefix()}/${this.getSuperTenant()}`;
            const appBaseName: string = _config.appBaseName
                ? `/${_config.appBaseName}`
                : "";

            return `${ tenantPath }${ this.getOrganizationPath() }${ appBaseName }`;
        },

        /**
         * Get the client origin with the tenant.
         *
         * @returns
         */
        getClientOriginWithTenant: function() {
            if (_config.legacyAuthzRuntime) {
                return _config.clientOrigin + this.getAppBaseWithTenant();
            }

            return `${_config.clientOrigin}${this.getAppBaseWithTenantAndOrganization()}`;
        },

        /**
         * Get the config object.
         *
         * @returns Deployment Configuration.
         */
        getConfig: function() {
            if (Object.entries(_config).length === 0) {
                return null;
            }
            if (_config.consoleApp && _config.consoleApp.origin) {
                _config.consoleAppOrigin = _config.consoleApp.origin;
            }

            const tenantPath: string = _config.legacyAuthzRuntime ? this.getTenantPath(true) : this.getTenantPath();
            const resolvedTenantPath: string = tenantPath.match(this.getSuperTenant())?.length > 0 ? "" : tenantPath;
            let clientID: string = _config.clientID;

            if (_config.legacyAuthzRuntime) {
                if (this.isSaas() || this.isSuperTenant()) {
                    clientID = _config.clientID;
                } else {
                    clientID = _config.clientID + "_" + this.getTenantName();
                }
            }

            return {
                appBase: _config.appBaseName,
                appBaseNameForHistoryAPI: this.constructAppBaseNameForHistoryAPI(),
                appBaseWithTenant: this.getAppBaseWithTenantAndOrganization(),
                clientID: clientID,
                clientOrigin: _config.clientOrigin,
                clientOriginWithTenant: this.getClientOriginWithTenant(),
                consoleApp: {
                    path: _config.consoleApp?.path
                        ? _config.consoleAppOrigin + resolvedTenantPath + _config.consoleApp?.path
                        : null
                },
                customServerHost: _config.customServerHost,
                debug: _config.debug,
                extensions: _config.extensions,
                idpConfigs: this.resolveIdpConfigs(),
                isSaas: this.isSaas(),
                legacyAuthzRuntime: _config.legacyAuthzRuntime,
                loginCallbackURL: this.constructRedirectURLs(_config.loginCallbackPath),
                logoutCallbackURL: this.constructRedirectURLs(_config.logoutCallbackPath),
                organizationPrefix: this.getOrganizationPrefix(),
                productVersionConfig: _config.ui.productVersionConfig,
                routes: {
                    home: this.constructAppPaths(_config.routePaths.home),
                    login: this.constructAppPaths(_config.routePaths.login),
                    logout: this.constructAppPaths(_config.routePaths.logout)
                },
                serverOrigin: _config.serverOrigin,
                serverOriginWithOrganization: _config.serverOrigin + this.getOrganizationPath(),
                serverOriginWithTenant: _config.serverOrigin + tenantPath,
                session: _config.session,
                superTenant: this.getSuperTenant(),
                superTenantProxy: this.getSuperTenantProxy(),
                tenant: (this.isSuperTenant()) ? this.getSuperTenant() : this.getTenantName(),
                tenantPath: this.getTenantPath(),
                tenantPrefix: this.getTenantPrefix(),
                ui: _config.ui
            };
        },

        /**
         * Get URL location without tenant.
         *
         * @returns Location without the tenant.
         */
        getLocationPathWithoutTenant: function() {
            const path: string = window.location.pathname;
            const pathChunks: string[] = path.split("/");

            if ( (pathChunks[1] === this.getTenantPrefix()) && (pathChunks[2] === this.getTenantName(true)) ) {
                pathChunks.splice(1, 2);

                return pathChunks.join("/");
            }

            return path;
        },

        /**
         * Get the organization name.
         *
         * @returns Organization name.
         */
        getOrganizationName: function () {
            if (_config.legacyAuthzRuntime) {
                const path: string = window.location.pathname;
                const pathChunks: string[] = path.split("/");

                const orgPrefixIndex: number = pathChunks.indexOf(this.getOrganizationPrefix());

                if (orgPrefixIndex !== -1) {
                    return pathChunks[ orgPrefixIndex + 1 ];
                }

                return "";
            }

            if (_config.organizationName) {
                return _config.organizationName;
            }

            return "";
        },

        /**
         * Get the organization path.
         *
         * @returns Organization path.
         */
        getOrganizationPath: function () {
            return this.getOrganizationName() !== ""
                ? `/${ this.getOrganizationPrefix() }/${ this.getOrganizationName() }`
                : "";
        },

        /**
         * Get the organization prefix.
         *
         * @returns Organization prefix.
         */
        getOrganizationPrefix: function () {
            return _args.organizationPrefix || orgPrefixFallback;
        },

        /**
         * Get the super tenant.
         *
         * @returns Super tenant.
         */
        getSuperTenant: function() {
            return _args.superTenant || superTenantFallback;
        },

        /**
         * Get the proxy name for super tenant if overriden. This will be used to build the URLs
         *
         * @returns Super tenant proxy.
         */
        getSuperTenantProxy: function() {
            return _config.superTenantProxy || this.getSuperTenant();
        },

        /**
         * Get the tenant name.
         *
         * @param fromLocation - Flag to determine if resolution should be done using URL location.
         * @returns Tenant name.
         */
        getTenantName: function(fromLocation: boolean = this.getTenantResolutionStrategy() === "location") {
            if (!fromLocation && this.getTenantResolutionStrategy() === "id_token" && _config.tenant) {
                return _config.tenant;
            }

            const paths: string[] = window.location.pathname.split("/");
            const tenantIndex: number = paths.indexOf(this.getTenantPrefix());

            if (tenantIndex > 0) {
                const tenantName: string = paths[tenantIndex + 1];

                return (tenantName) ? tenantName : "";
            }

            return (_config.requireSuperTenantInUrls)
                ? this.getSuperTenant()
                : "";
        },

        /**
         * Get the tenant path.
         *
         * @remarks if `skipSuperTenant` is set to true, "" will be returned.
         * @param skipSuperTenant - Flag to skip super tenant.
         * @returns Tenant path.
         */
        getTenantPath: function(skipSuperTenant: boolean = false) {

            if (skipSuperTenant && (this.getTenantName() === this.getSuperTenant() || this.getTenantName() === "")) {
                return urlPathForSuperTenantOriginsFallback;
            }

            return (this.getTenantName() !== "") ?
                "/" + this.getTenantPrefix() + "/" + this.getTenantName() : "";
        },

        /**
         * Get the tenant prefix.
         *
         * @returns Tenant prefix.
         */
        getTenantPrefix: function() {
            return _args.tenantPrefix || tenantPrefixFallback;
        },

        /**
         * Get the tenant resolution strategy.
         *
         * @returns Tenant resolution strategy.
         */
        getTenantResolutionStrategy: function() {
            return _config.tenantResolutionStrategy !== undefined
                ? _config.tenantResolutionStrategy
                : tenantResolutionStrategyFallback;
        },

        /**
         * Initialize the config.
         *
         * @param Args - Arguments passed to the instance.
         */
        init: function(Args: any) {
            _args = Args;

            _default = {
                "accountAppOrigin": _args.accountAppOrigin || _args.serverOrigin || fallbackServerOrigin,
                "clientOrigin": window.location.origin,
                "consoleAppOrigin": _args.consoleAppOrigin || _args.serverOrigin || fallbackServerOrigin,
                "contextPath": _args.contextPath,
                "requireSuperTenantInUrls" : _args.requireSuperTenantInUrls || false,
                "serverOrigin": _args.serverOrigin || fallbackServerOrigin
            };

            _config = _default;

            const userConfigFile: string = _config.contextPath + "deployment.config.json";

            loadUserConfig(userConfigFile, function(response: string) {
                const configResponse: string = JSON.parse(response);

                if (!{}.hasOwnProperty.call(configResponse, "appBaseName"))
                    throw "'appBaseName' config is missing in " + _args.deploymentConfigFile;
                if (!{}.hasOwnProperty.call(configResponse, "clientID"))
                    throw "'clientID' config is missing in " + _args.deploymentConfigFile;
                if (!{}.hasOwnProperty.call(configResponse, "loginCallbackPath"))
                    throw "'loginCallbackPath' config is missing in " + _args.deploymentConfigFile;
                if (!{}.hasOwnProperty.call(configResponse, "logoutCallbackPath"))
                    throw "'logoutCallbackPath' config is missing in " + _args.deploymentConfigFile;
                if (!{}.hasOwnProperty.call(configResponse, "routePaths"))
                    throw "'routePaths' config is missing in " + _args.deploymentConfigFile;
                if (!{}.hasOwnProperty.call(configResponse, "ui"))
                    throw "'ui' config is missing in " + _args.deploymentConfigFile;

                _config = extend({}, _default, JSON.parse(response));
            });
        },

        /**
         * Is the app SaaS.
         *
         * @returns Is saas or not.
         */
        isSaas: function() {
            return (_config.isSaas !== undefined) ? JSON.parse(_config.isSaas) : isSaasFallback;
        },

        /**
         * Is the tenant super tenant?.
         *
         * @returns Is super tenant or not.
         */
        isSuperTenant: function() {
            if (_config.tenant && _config.tenant === this.getSuperTenant()) {
                return true;
            }

            return (this.getTenantName() === "");
        },

        /**
         * Resolves the IDP configs object.
         *
         * @returns Resolved IDP configs.
         */
        resolveIdpConfigs: function() {
            return {
                serverOrigin: this.isSaas()
                    ? _config.serverOrigin
                    : _config.serverOrigin +
                    (_config.legacyAuthzRuntime ? this.getTenantPath(true) : this.getTenantPath()),
                ..._config.idpConfigs,
                ...this.resolveURLs()
            };
        },

        /**
         * Resolves IDP URLs by resolving the placeholders.
         * ex: `/t/{userTenantDomain}/common/oauth2/authz?t={superTenantDomain}`
         * to /t/wso2.com/common/oauth2/authz?t=carbon.super
         *
         * @returns Resolved URLs.
         */
        resolveURLs: function() {
            const tenantPath: string = _config.legacyAuthzRuntime ? "" : this.getTenantPath();

            return {
                authorizeEndpointURL: _config.idpConfigs
                    && _config.idpConfigs.authorizeEndpointURL
                    && _config.idpConfigs.authorizeEndpointURL
                        .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER, _config.serverOrigin + tenantPath)
                        .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                        .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                        .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                            ? this.getTenantName()
                            : this.getSuperTenantProxy()),
                jwksEndpointURL: _config.idpConfigs
                    && _config.idpConfigs.jwksEndpointURL
                    && _config.idpConfigs.jwksEndpointURL
                        .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER,  _config.serverOrigin + tenantPath)
                        .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                        .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                        .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                            ? this.getTenantName()
                            : this.getSuperTenantProxy()),
                logoutEndpointURL: _config.idpConfigs
                    && _config.idpConfigs.logoutEndpointURL
                    && _config.idpConfigs.logoutEndpointURL
                        .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER,  _config.serverOrigin + tenantPath)
                        .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                        .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                        .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                            ? this.getTenantName()
                            : this.getSuperTenantProxy()),
                oidcSessionIFrameEndpointURL: _config.idpConfigs
                    && _config.idpConfigs.oidcSessionIFrameEndpointURL
                    && _config.idpConfigs.oidcSessionIFrameEndpointURL
                        .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER,  _config.serverOrigin + tenantPath)
                        .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                        .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                        .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName() !== this.getSuperTenant()
                            ? this.getTenantName()
                            : this.getSuperTenantProxy()),
                tokenEndpointURL: _config.idpConfigs
                    && _config.idpConfigs.tokenEndpointURL
                    && _config.idpConfigs.tokenEndpointURL
                        .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER,  _config.serverOrigin + tenantPath)
                        .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                        .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                        .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                            ? this.getTenantName()
                            : this.getSuperTenantProxy()),
                tokenRevocationEndpointURL: _config.idpConfigs
                    && _config.idpConfigs.tokenRevocationEndpointURL
                    && _config.idpConfigs.tokenRevocationEndpointURL
                        .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER,  _config.serverOrigin + tenantPath)
                        .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                        .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                        .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                            ? this.getTenantName()
                            : this.getSuperTenantProxy()),
                wellKnownEndpointURL: _config.idpConfigs
                    && _config.idpConfigs.wellKnownEndpointURL
                    && _config.idpConfigs.wellKnownEndpointURL
                        .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER,  _config.serverOrigin + tenantPath)
                        .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                        .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                        .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                            ? this.getTenantName()
                            : this.getSuperTenantProxy())
            };
        },

        /**
         * Updates the organization name.
         *
         * @param organizationName - new Organization.
         */
        updateOrganizationName: function (organizationName: string) {
            _config.organizationName = organizationName;
        },

        /**
         * Updates the organization type.
         *
         * @param organizationType - new Organization type.
         * @deprecated This is deprecated.
         */
        updateOrganizationType: function (organizationType: string) {
            _config.organizationType = organizationType;
        },

        /**
         * Updates the tenant qualified basename.
         *
         * @param tenant - new Tenant.
         */
        updateTenantQualifiedBaseName: function(tenant: string) {
            _config.tenant = tenant;
            _config.tenantPath = this.getTenantPath();
            if (tenant === this.getSuperTenant()) {
                _config.appBaseWithTenant =  "/" + _config.appBaseName;

                return;
            }

            _config.appBaseWithTenant = "/" + this.getTenantPrefix() + "/" + tenant + "/" + _config.appBaseName;

        }
    };
}());
