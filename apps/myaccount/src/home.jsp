<!--
* Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
<%= htmlWebpackPlugin.options.importSuperTenantConstant %>

<jsp:scriptlet>
    session.setAttribute("authCode",request.getParameter("code"));
    session.setAttribute("sessionState", request.getParameter("session_state"));
    if(request.getParameter("state") != null) {session.setAttribute("state", request.getParameter("state"));}
</jsp:scriptlet>

<!DOCTYPE html>
<html>
    <head>
        <%= htmlWebpackPlugin.options.contentType %>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="referrer" content="no-referrer" />

        <link href="<%= htmlWebpackPlugin.options.publicPath %>libs/themes/<%= htmlWebpackPlugin.options.theme %>/theme.<%= htmlWebpackPlugin.options.themeHash %>.min.css" rel="stylesheet" type="text/css"/>
        <link rel="shortcut icon" href="<%= htmlWebpackPlugin.options.publicPath %>libs/themes/<%= htmlWebpackPlugin.options.theme %>/assets/images/branding/favicon.ico" />

        <script>
            var contextPathGlobal = "<%= htmlWebpackPlugin.options.publicPath %>";
            var serverOriginGlobal = "<%= htmlWebpackPlugin.options.serverUrl %>";
            var superTenantGlobal = "<%= htmlWebpackPlugin.options.superTenantConstant %>";
            var tenantPrefixGlobal = "<%= htmlWebpackPlugin.options.tenantPrefix %>";
        </script>
    </head>
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>
    </body>
</html>
