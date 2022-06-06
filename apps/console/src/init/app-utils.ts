/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

function loadUserConfig(configFile, callback) {
    const request = new XMLHttpRequest();

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

function extend(...args) {
    args = args || [];

    for (let i = 1; i < args.length; i++) {
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

export const AppUtils = (function() {
    let _args: any = {},
        _default: any = {},
        _config: any = {};

    const superTenantFallback = "carbon.super";
    const tenantPrefixFallback = "t";
    const fallbackServerOrigin = "https://localhost:9443";
    const appBaseForHistoryAPIFallback = "/";
    const urlPathForSuperTenantOriginsFallback = "";
    const isSaasFallback = true;
    const tenantResolutionStrategyFallback = "id_token";

    const SERVER_ORIGIN_IDP_URL_PLACEHOLDER = "${serverOrigin}";
    const TENANT_PREFIX_IDP_URL_PLACEHOLDER = "${tenantPrefix}";
    const USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER = "${userTenantDomain}";
    const SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER = "${superTenantDomain}";

    return {
        /**
         * Constructs a basename to be used by the History API.
         *
         * @remarks For SaaS apps, basename should be "/". Since is applied on the fly.
         * @return {any | string | string}
         */
        constructAppBaseNameForHistoryAPI: function() {
            if (_config.appBaseNameForHistoryAPI !== undefined) {
                return _config.appBaseNameForHistoryAPI;
            }

            return this.isSaas() ? appBaseForHistoryAPIFallback : this.getAppBaseWithTenant();
        },

        /**
         * Constructs app paths.
         *
         * @remarks For non SaaS apps, a relative path without the tenant and basename would surfise.
         * @param path - Path to be constructed.
         * @return {string | any}
         */
        constructAppPaths: function(path) {
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
         * @return {string}
         */
        constructRedirectURLs: function(url) {
            if (!this.isSaas()) {
                return _config.clientOrigin + this.getTenantPath(true) + "/" + _config.appBaseName + url;
            }

            return _config.clientOrigin + (_config.appBaseName ? "/" + _config.appBaseName : "") + url;
        },

        /**
         * Get app base from URL.
         *
         * @return {string}
         */
        getAppBase: function() {
            const path = this.getLocationPathWithoutTenant();
            const pathChunks = path.split("/");

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
         * @return {string}
         */
        getAppBaseWithTenant: function() {
            return this.getTenantPath(true) + (_config.appBaseName ? ("/" + _config.appBaseName) : "");
        },

        /**
         * Get the config object.
         *
         * @return {object}
         */
        getConfig: function() {
            if (Object.entries(_config).length === 0) {
                return null;
            }

            if (_config.accountApp && _config.accountApp.origin) {
                _config.accountAppOrigin = _config.accountApp.origin;
            }

            let skipTenant = false;

            if (_config.accountApp.skipTenant) {
                skipTenant = true;
            }

            let commonPostLogoutUrl = false;

            if (_config.accountApp.useCommonPostLogoutUrl) {
                commonPostLogoutUrl = true;
            }

            let allowMultipleAppProtocol = false;

            if (_config.allowMultipleAppProtocols) {
                allowMultipleAppProtocol = true;
            }

            return {
                accountApp: {
                    commonPostLogoutUrl : commonPostLogoutUrl,
                    path: skipTenant ?
                        _config.accountAppOrigin + _config.accountApp.path:
                        _config.accountAppOrigin + this.getTenantPath(true) + _config.accountApp.path,
                    tenantQualifiedPath: this.getTenantQualifiedAccountAppPath(skipTenant 
                        ? "" 
                        : _config.accountApp.path)
                },
                adminApp: {
                    basePath: this.constructAppPaths(_config.adminApp.basePath),
                    displayName: _config.adminApp.displayName,
                    path: this.constructAppPaths(_config.adminApp.path)
                },
                allowMultipleAppProtocols: allowMultipleAppProtocol,
                appBase: _config.appBaseName,
                appBaseNameForHistoryAPI: this.constructAppBaseNameForHistoryAPI(),
                appBaseWithTenant: this.getAppBaseWithTenant(),
                clientID: (this.isSaas() || this.isSuperTenant())
                    ? _config.clientID
                    : _config.clientID + "_" + this.getTenantName(),
                clientOrigin: _config.clientOrigin,
                clientOriginWithTenant: _config.clientOrigin + this.getTenantPath(true),
                customServerHost: _config.customServerHost,
                debug: _config.debug,
                developerApp: {
                    basePath: this.constructAppPaths(_config.developerApp.basePath),
                    displayName: _config.developerApp.displayName,
                    path: this.constructAppPaths(_config.developerApp.path)
                },
                docSiteUrl: _config.docSiteUrl,
                documentation: _config.documentation,
                extensions: _config.extensions,
                idpConfigs: this.resolveIdpConfigs(),
                isSaas: this.isSaas(),
                loginCallbackURL: this.constructRedirectURLs(_config.loginCallbackPath),
                logoutCallbackURL: this.constructRedirectURLs(_config.logoutCallbackPath),
                productVersionConfig: _config.ui.productVersionConfig,
                routes: {
                    home: this.constructAppPaths(_config.routePaths.home),
                    login: this.constructAppPaths(_config.routePaths.login),
                    logout: this.constructAppPaths(_config.routePaths.logout)
                },
                serverOrigin: _config.serverOrigin,
                serverOriginWithTenant: _config.serverOrigin + this.getTenantPath(true),
                session: _config.session,
                superTenant: this.getSuperTenant(),
                tenant: (this.isSuperTenant()) ? this.getSuperTenant() : this.getTenantName(),
                tenantPath: this.getTenantPath(),
                tenantPrefix: this.getTenantPrefix(),
                ui: _config.ui
            };
        },

        /**
         * Get URL location without tenant.
         *
         * @return {string}
         */
        getLocationPathWithoutTenant: function() {
            const path = window.location.pathname;
            const pathChunks = path.split("/");

            if ( (pathChunks[1] === this.getTenantPrefix()) && (pathChunks[2] === this.getTenantName(true)) ) {
                pathChunks.splice(1, 2);

                return pathChunks.join("/");
            }

            return path;
        },

        /**
         * Get the super tenant.
         *
         * @return {string}
         */
        getSuperTenant: function() {
            return _args.superTenant || superTenantFallback;
        },

        /**
         * Get the proxy name for super tenant if overriden. This will be used to build the URLs
         *
         * @return {string}
         */
        getSuperTenantProxy: function() {
            return _config.superTenantProxy || this.getSuperTenant();
        },

        /**
         * Get the tenant name.
         *
         * @param {boolean} fromLocation - Flag to determine if resolution should be done using URL location.
         * @return {string | any}
         */
        getTenantName: function(fromLocation = this.getTenantResolutionStrategy() === "location") {
            if (!fromLocation && this.getTenantResolutionStrategy() === "id_token" && _config.tenant) {
                return _config.tenant;
            }

            const paths = window.location.pathname.split("/");
            const tenantIndex = paths.indexOf(this.getTenantPrefix());

            if (tenantIndex > 0) {
                const tenantName = paths[tenantIndex + 1];

                return (tenantName) ? tenantName : "";
            } else {
                return "";
            }
        },

        /**
         * Get the tenant path.
         *
         * @remarks if `skipSuperTenant` is set to true, "" will be returned.
         * @param {boolean} skipSuperTenant - Flag to skip super tenant.
         * @return {string}
         */
        getTenantPath: function(skipSuperTenant = false) {
            if (skipSuperTenant && (this.getTenantName() === this.getSuperTenant() || this.getTenantName() === "")) {
                return urlPathForSuperTenantOriginsFallback;
            }

            return (this.getTenantName() !== "") ?
                "/" + this.getTenantPrefix() + "/" + this.getTenantName() : "";
        },

        /**
         * Get the tenant prefix.
         *
         * @return {string}
         */
        getTenantPrefix: function() {
            return _args.tenantPrefix || tenantPrefixFallback;
        },

        /**
         * Get the URL for the tenanted Myaccount.
         * 
         * We append any given path to a qualified path.
         * when skipTenant is false in tenantQualifiedPath, 
         * the argument _config.accountApp.path will get appended. 
         * This is because through extensions we can control the MyAccount path for different deployments.
         * 
         * @return {string}
         */
        getTenantQualifiedAccountAppPath: function(append) {
            return (((this.getTenantPrefix() !== "") && (this.getTenantName() !== "")) ?
                _config.accountAppOrigin +
                "/" + this.getTenantPrefix() +
                "/" + this.getTenantName() : "") + append; 
        },

        /**
         * Get the tenant resolution strategy.
         *
         * @return {string}
         */
        getTenantResolutionStrategy: function() {
            return _config.tenantResolutionStrategy !== undefined
                ? _config.tenantResolutionStrategy
                : tenantResolutionStrategyFallback;
        },

        /**
         * Initialize the config.
         *
         * @param Args
         */
        init: function(Args) {
            _args = Args;

            _default = {
                "accountAppOrigin": _args.accountAppOrigin || _args.serverOrigin || fallbackServerOrigin,
                "clientOrigin": window.location.origin,
                "contextPath": _args.contextPath,
                "serverOrigin": _args.serverOrigin || fallbackServerOrigin
            };

            _config = _default;

            const userConfigFile = _config.contextPath + "/deployment.config.json";

            loadUserConfig(userConfigFile, function(response) {
                const configResponse = JSON.parse(response);

                if (!{}.hasOwnProperty.call(configResponse, "accountApp"))
                    throw "'accountApp' config is missing in " + _args.deploymentConfigFile;
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
         * @return {boolean}
         */
        isSaas: function() {
            return (_config.isSaas !== undefined) ? _config.isSaas : isSaasFallback;
        },

        /**
         * Is the tenant super tenant?.
         *
         * @return {boolean}
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
         * @return {(IdpConfigInterface<T, S> & {serverOrigin: any}) | ({serverOrigin: any} & {serverOrigin: any})}
         */
        resolveIdpConfigs: function() {
            return {
                serverOrigin: this.isSaas()
                    ? _config.serverOrigin
                    : _config.serverOrigin + this.getTenantPath(true),
                ..._config.idpConfigs,
                ...this.resolveURLs()
            };
        },

        /**
         * Resolves IDP URLs by resolving the placeholders.
         * ex: /t/{userTenantDomain}/common/oauth2/authz?t={superTenantDomain} ->
         * /t/wso2.com/common/oauth2/authz?t=carbon.super
         */
        resolveURLs: function() {
            return {
                authorizeEndpointURL: _config.idpConfigs
                        && _config.idpConfigs.authorizeEndpointURL
                        && _config.idpConfigs.authorizeEndpointURL
                            .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER, _config.serverOrigin)
                            .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                            .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                            .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                                ? this.getTenantName()
                                : ""),
                jwksEndpointURL: _config.idpConfigs
                        && _config.idpConfigs.jwksEndpointURL
                        && _config.idpConfigs.jwksEndpointURL
                            .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER, _config.serverOrigin)
                            .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                            .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                            .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                                ? this.getTenantName()
                                : ""),
                logoutEndpointURL: _config.idpConfigs
                        && _config.idpConfigs.logoutEndpointURL
                        && _config.idpConfigs.logoutEndpointURL
                            .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER, _config.serverOrigin)
                            .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                            .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                            .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                                ? this.getTenantName()
                                : ""),
                oidcSessionIFrameEndpointURL: _config.idpConfigs
                        && _config.idpConfigs.oidcSessionIFrameEndpointURL
                        && _config.idpConfigs.oidcSessionIFrameEndpointURL
                            .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER, _config.serverOrigin)
                            .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                            .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                            .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                                ? this.getTenantName()
                                : ""),
                tokenEndpointURL: _config.idpConfigs
                        && _config.idpConfigs.tokenEndpointURL
                        && _config.idpConfigs.tokenEndpointURL
                            .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER, _config.serverOrigin)
                            .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                            .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                            .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                                ? this.getTenantName()
                                : ""),
                tokenRevocationEndpointURL: _config.idpConfigs
                        && _config.idpConfigs.tokenRevocationEndpointURL
                        && _config.idpConfigs.tokenRevocationEndpointURL
                            .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER, _config.serverOrigin)
                            .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                            .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                            .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                                ? this.getTenantName()
                                : ""),
                wellKnownEndpointURL: _config.idpConfigs
                        && _config.idpConfigs.wellKnownEndpointURL
                        && _config.idpConfigs.wellKnownEndpointURL
                            .replace(SERVER_ORIGIN_IDP_URL_PLACEHOLDER, _config.serverOrigin)
                            .replace(TENANT_PREFIX_IDP_URL_PLACEHOLDER, this.getTenantPrefix())
                            .replace(SUPER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getSuperTenantProxy())
                            .replace(USER_TENANT_DOMAIN_IDP_URL_PLACEHOLDER, this.getTenantName()
                                ? this.getTenantName()
                                : "")
            };
        },

        /**
         * Updates the custom server host.
         *
         * @param customServerHost - server host.
         */
        updateCustomServerHost: function(customServerHost) {
            _config.customServerHost = customServerHost;
        },

        /**
         * Updates the tenant qualified basename.
         *
         * @param tenant - new Tenant.
         */
        updateTenantQualifiedBaseName: function(tenant) {
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
