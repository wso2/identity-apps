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

        <script>
            var getTenantPrefix = function(tenantName) {
                return  "<%= htmlWebpackPlugin.options.tenantPrefix %>";
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

            // Update below with tenant admin-portal application/service-provider details
            var serverOriginAddress = "<%= htmlWebpackPlugin.options.serverUrl %>";
            var clientOriginAddress = window.location.origin;

            // Update below with tenant admin-portal application/service-provider details
            var tenantName = getTenantName();
            var defaultAdminPortalClientID = "ADMIN_PORTAL";
            var tenantAdminPortalClientID = defaultAdminPortalClientID + "_" + tenantName;

            /** ===================================================== */

            window["runConfig"] = {
                appBaseName: getTenantPath(tenantName) + "/admin-portal",
                clientHost: clientOriginAddress + getTenantPath(tenantName),
                clientOrigin: clientOriginAddress,
                clientID: (getTenantPath(tenantName) === ("/" + getTenantPrefix() + "/" + tenantName)) ?
                    tenantAdminPortalClientID : defaultAdminPortalClientID,
                serverHost: serverOriginAddress + getTenantPath(tenantName),
                serverOrigin: serverOriginAddress
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
