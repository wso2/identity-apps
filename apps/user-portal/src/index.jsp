<!--
* Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
-->

<%= htmlWebpackPlugin.options.importUtil %>
<%= htmlWebpackPlugin.options.importTenantPrefix %>

<!doctype html>
<html>
    <head>
        <%= htmlWebpackPlugin.options.contentType %>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <link href="<%= htmlWebpackPlugin.options.publicPath %>/libs/styles/css/wso2-default.css" rel="stylesheet" type="text/css"/>

        <title><%= htmlWebpackPlugin.options.title %></title>

        <!-- runtime config -->
        <script src="<%= htmlWebpackPlugin.options.publicPath %>/runtime-config.js"></script>
        <!-- runtime config -->

        <script>
            var getTenantPrefix = function(tenantName) {
                return "<%= htmlWebpackPlugin.options.tenantPrefix %>";
            };

            var getSuperTenant = function(tenantName) {
                return "carbon.super";
            };

            var getTenantName = function() {
                var paths = window.location.pathname.split("/");
                var tenantIndex = paths.indexOf(getTenantPrefix());

                if (tenantIndex > 0) {
                    var tenantName = paths[tenantIndex + 1];
                    return (tenantName) ? tenantName : "";
                } else {
                    return "";
                }
            };

            var getTenantPath = function(tenantName) {
                return (tenantName !== "") ? "/" + getTenantPrefix() + "/" + tenantName : "";
            };

            /**
             * =====================================================
             * Update below details according to your configuration
             * =====================================================
             */

            // Update below with tenant user-portal application/service-provider details
            var serverOriginAddress = "<%= htmlWebpackPlugin.options.serverUrl %>";
            var clientOriginAddress = "<%= htmlWebpackPlugin.options.serverUrl %>";

            var tenantName = getTenantName();
            var defaultUserPortalClientID = "USER_PORTAL";
            var tenantUserPortalClientID = defaultUserPortalClientID + "_" + tenantName;

            /** ===================================================== */

            if (!window.userConfig) {
                window.userConfig = {};
            }

            window["runConfig"] = {
                appBaseName: window.userConfig.appBaseName || getTenantPath(tenantName) + 
                    "<%= htmlWebpackPlugin.options.publicPath %>",
                clientHost: window.userConfig.clientHost || clientOriginAddress + getTenantPath(tenantName),
                clientOrigin: window.userConfig.clientOrigin || clientOriginAddress,
                clientID: window.userConfig.clientID ||
                    (getTenantPath(tenantName) === ("/" + getTenantPrefix() + "/" + tenantName)) ?
                    tenantUserPortalClientID : defaultUserPortalClientID,
                serverHost: window.userConfig.serverHost || serverOriginAddress + getTenantPath(tenantName),
                serverOrigin: window.userConfig.serverOrigin || serverOriginAddress,
                tenant: window.userConfig.tenant || (tenantName === "") ? getSuperTenant() : tenantName,
                tenantPath: window.userConfig.tenantPath || getTenantPath(tenantName)
            };
        </script>
    </head>
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>
    </body>
</html>
