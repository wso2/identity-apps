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

    return {
        getAppBase: function() {
            const path = this.getLocationPathWithoutTenant();
            const pathChuncks = path.split("/");

            if (pathChuncks.length <= 1) {
                return "/";
            }

            if (pathChuncks.length === 2) {
                return path;
            }

            return "/" + this.getLocationPathWithoutTenant().split("/")[1];
        },

        getConfig: function() {
            if (Object.entries(_config).length === 0) {
                return null;
            }

            if (_config.accountApp && _config.accountApp.origin) {
                _config.accountAppOrigin = _config.accountApp.origin;
            }

            return {
                accountApp: {
                    path: _config.accountAppOrigin + this.getTenantPath() + _config.accountApp.path
                },
                adminApp: _config.adminApp,
                appBase: _config.appBaseName,
                appBaseWithTenant: this.getTenantPath() + "/" + _config.appBaseName,
                clientID: (this.isSuperTenant()) ?
                    _config.clientID : _config.clientID + "_" + this.getTenantName(),
                clientOrigin: _config.clientOrigin,
                clientOriginWithTenant: _config.clientOrigin + this.getTenantPath(),
                debug: _config.debug,
                developerApp: _config.developerApp,
                documentation: _config.documentation,
                extensions: _config.extensions,
                loginCallbackURL: _config.clientOrigin + this.getTenantPath() + "/" + _config.appBaseName +
                    _config.loginCallbackPath,
                logoutCallbackURL: _config.clientOrigin + this.getTenantPath() + "/" + _config.appBaseName +
                    _config.logoutCallbackPath,
                productVersion: _config.productVersion,
                productVersionConfig: _config.ui.productVersionConfig,
                routes: _config.routePaths,
                serverOrigin: _config.serverOrigin,
                serverOriginWithTenant: _config.serverOrigin + this.getTenantPath(),
                session: _config.session,
                tenant: (this.isSuperTenant()) ? this.getSuperTenant() : this.getTenantName(),
                tenantPath: this.getTenantPath(),
                ui: _config.ui
            };
        },

        getLocationPathWithoutTenant: function() {
            const path = window.location.pathname;
            const pathChunks = path.split("/");

            if ( (pathChunks[1] === this.getTenantPrefix()) && (pathChunks[2] === this.getTenantName()) ) {
                pathChunks.splice(1, 2);

                return pathChunks.join("/");
            }

            return path;
        },

        getSuperTenant: function() {
            return _args.superTenant || "carbon.super";
        },

        getTenantName: function() {
            const paths = window.location.pathname.split("/");
            const tenantIndex = paths.indexOf(this.getTenantPrefix());

            if (tenantIndex > 0) {
                const tenantName = paths[tenantIndex + 1];
                return (tenantName) ? tenantName : "";
            } else {
                return "";
            }
        },

        getTenantPath: function() {
            return (this.getTenantName() !== "") ?
                "/" + this.getTenantPrefix() + "/" + this.getTenantName() : "";
        },

        getTenantPrefix: function() {
            return _args.tenantPrefix || "t";
        },

        init: function(Args) {
            _args = Args;

            _default = {
                "accountAppOrigin": _args.accountAppOrigin || _args.serverOrigin || fallbackServerOrigin,
                "clientOrigin": window.location.origin,
                "serverOrigin": _args.serverOrigin || fallbackServerOrigin
            };

            _config = _default;

            const userConfigFile = this.getAppBase() + "/deployment.config.json";

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

        isSuperTenant: function(){
            return (this.getTenantName() === "");
        }
    };
}());
