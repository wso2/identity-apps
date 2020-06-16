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
    var request = new XMLHttpRequest();

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

function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
        continue;

        for (var key in arguments[i]) {
            if ({}.hasOwnProperty.call(arguments[i], key)) {
                out[key] = arguments[i][key];
            }
        }
    }

    return out;
}

var AppUtils = AppUtils || (function() {
    var _args = {},
        _default = {},
        _config = {};

    var fallbackServerOrigin = "https://localhost:9443";

    return {
        getAppBase: function() {
            var path = this.getLocationPathWithoutTenant();
            var pathChuncks = path.split("/");

            if (pathChuncks.length <= 1) {
                return "/";
            }

            if (pathChuncks.length === 2) {
                return path;
            }

            return "/" + this.getLocationPathWithoutTenant().split("/")[1];
        },

        getConfig: function() {
            return {
                appBase: _config.appBaseName,
                appBaseWithTenant: this.getTenantPath() + "/" + _config.appBaseName,
                clientID: (this.isSuperTenant()) ?
                _config.clientID : _config.clientID + "_" + this.getTenantName(),
                clientOrigin: _config.clientOrigin,
                clientOriginWithTenant: _config.clientOrigin + this.getTenantPath(),
                loginCallbackURL: _config.clientOrigin + this.getTenantPath() + "/" + _config.appBaseName + 
                    _config.loginCallbackPath,
                logoutCallbackURL: _config.clientOrigin + this.getTenantPath() + "/" + _config.appBaseName + 
                    _config.logoutCallbackPath,
                productVersion: _config.productVersion,
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
            var path = window.location.pathname;
            var pathChunks = path.split("/");

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
            var paths = window.location.pathname.split("/");
            var tenantIndex = paths.indexOf(this.getTenantPrefix());

            if (tenantIndex > 0) {
                var tenantName = paths[tenantIndex + 1];
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
                "clientOrigin": window.location.origin,
                "serverOrigin": _args.serverOrigin || fallbackServerOrigin
            };

            _config = _default;

            var userConfigFile = this.getAppBase() + "/deployment.config.json";

            loadUserConfig(userConfigFile, function(response) {
                var configResponse = JSON.parse(response);

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
