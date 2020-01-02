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
            function getTenantDomain() {
                var url = window.location.href;
                if (url.includes(<%= htmlWebpackPlugin.options.tenantDelimiter %>)){
                    var index = url.indexOf(<%= htmlWebpackPlugin.options.tenantDelimiter %>);
                    var endIndex = url.indexOf("/", index+3);
                    var domain = (endIndex != -1) ? url.substring(index+3, endIndex) : url.substring(index+3);
                    return domain;
                }
                return null;
            }

            function getServerHost() {
                var serverURL = "<%= htmlWebpackPlugin.options.serverUrl %>";
                var tenantDomain = (getTenantDomain()) ? getTenantDomain().toString(): null;
                var tenantPrefix = "<%= htmlWebpackPlugin.options.tenantPrefix %>";
                var serverHost = null;
                if (serverURL != null) {
                    serverHost = serverURL;
                    if (tenantDomain != null && tenantPrefix != null) {
                        serverHost = serverHost + "/" + tenantPrefix + "/" + tenantDomain;
                    }
                    window["runConfig"] = {
                        serverHost: serverHost
                    };
                }
            }

            getServerHost();
        </script>
    </head>
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>
    </body>
</html>
