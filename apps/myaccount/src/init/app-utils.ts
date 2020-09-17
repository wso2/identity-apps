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

    const fallbackServerOrigin = "https://localhost:9443";
    const appBaseForHistoryAPIFallback = "/";
    const urlPathForSuperTenantOriginsFallback = "";
    const isSaasFallback = true;
    const tenantResolutionStrategyFallback = "location";

    return {
        constructAppBaseNameForHistoryAPI: function() {
            if (_config && _config.appBaseNameForHistoryAPI) {
                return _config.appBaseNameForHistoryAPI;
            }

            return this.isSaas() ? appBaseForHistoryAPIFallback : this.getAppBaseWithTenant();
        },

        constructAppPaths: function(path) {
            if (!this.isSaas()) {
                return path;
            }

            return this.getAppBaseWithTenant() + path;
        },

        constructRedirectURLs: function(url) {
            if (!this.isSaas()) {
                return _config.clientOrigin + this.getTenantPath(true) + "/" + _config.appBaseName + url;
            }

            return _config.clientOrigin + "/" + _config.appBaseName + url;
        },

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

        getAppBaseWithTenant: function() {
            return this.getTenantPath(true) + "/" + _config.appBaseName;
        },

        getConfig: function() {
            if (Object.entries(_config).length === 0) {
                return null;
            }

            return {
                appBase: _config.appBaseName,
                appBaseNameForHistoryAPI: this.constructAppBaseNameForHistoryAPI(),
                appBaseWithTenant: this.getAppBaseWithTenant(),
                clientID: (this.isSaas() || this.isSuperTenant())
                    ? _config.clientID
                    : _config.clientID + "_" + this.getTenantName(),
                clientOrigin: _config.clientOrigin,
                clientOriginWithTenant: _config.clientOrigin + this.getTenantPath(true),
                debug: _config.debug,
                idpConfigs: this.resolveIdpConfigs(),
                isSaas: _config.isSaas,
                loginCallbackURL: this.constructRedirectURLs(_config.loginCallbackPath),
                logoutCallbackURL: this.constructRedirectURLs(_config.logoutCallbackPath),
                productVersion: _config.productVersion,
                productVersionConfig: _config.ui.productVersionConfig,
                routes: {
                    home: this.constructAppPaths(_config.routePaths.home),
                    login: this.constructAppPaths(_config.routePaths.login),
                    logout: this.constructAppPaths(_config.routePaths.logout)
                },
                serverOrigin: _config.serverOrigin,
                serverOriginWithTenant: _config.serverOrigin + this.getTenantPath(true),
                session: _config.session,
                tenant: (this.isSuperTenant()) ? this.getSuperTenant() : this.getTenantName(),
                tenantPath: this.getTenantPath(),
                tenantPrefix: this.getTenantPrefix(),
                ui: _config.ui
            };
        },

        getLocationPathWithoutTenant: function() {
            const path = window.location.pathname;
            const pathChunks = path.split("/");

            if ( (pathChunks[1] === this.getTenantPrefix()) && (pathChunks[2] === this.getTenantName(true)) ) {
                pathChunks.splice(1, 2);

                return pathChunks.join("/");
            }

            return path;
        },

        getSuperTenant: function() {
            return _args.superTenant || "carbon.super";
        },

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

        getTenantPath: function(skipSuperTenant = false) {
            if (skipSuperTenant && (this.getTenantName() === this.getSuperTenant() || this.getTenantName() === "")) {
                return urlPathForSuperTenantOriginsFallback;
            }

            return (this.getTenantName() !== "") ?
                "/" + this.getTenantPrefix() + "/" + this.getTenantName() : "";
        },

        getTenantPrefix: function() {
            return _args.tenantPrefix || "t";
        },

        getTenantResolutionStrategy: function() {
            return (_config && _config.tenantResolutionStrategy)
                ? _config.tenantResolutionStrategy
                : tenantResolutionStrategyFallback;
        },

        init: function(Args) {
            _args = Args;

            _default = {
                "clientOrigin": window.location.origin,
                "serverOrigin": _args.serverOrigin || fallbackServerOrigin
            };

            _config = _default;

            const userConfigFile = this.getAppBase() + "/deployment.config.json";

            loadUserConfig(userConfigFile, function(response) {
                const configResponse = JSON.parse(response);

                if (!{}.hasOwnProperty.call(configResponse, "appBaseName"))
                    throw "'appBaseName' config is missing in " + _args.deploymentConfigFile;
                if (!{}.hasOwnProperty.call(configResponse, "clientID"))
                    throw "'clientID' config is missing in " + _args.deploymentConfigFile;
                if (!{}.hasOwnProperty.call(configResponse, "idpConfigs"))
                    throw "'idpConfigs' are missing in " + _args.deploymentConfigFile;
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

        isSaas: function() {
            return (_config && _config.isSaas !== undefined) ? _config.isSaas : isSaasFallback;
        },

        isSuperTenant: function() {
            if (_config && _config.tenant && _config.tenant === this.getSuperTenant()) {
                return true;
            }

            return (this.getTenantName() === "");
        },

        resolveIdpConfigs: function() {
            return {
                serverOrigin: this.isSaas()
                    ? _config.serverOrigin
                    : _config.serverOrigin + this.getTenantPath(true),
                ..._config.idpConfigs
            }
        },

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
