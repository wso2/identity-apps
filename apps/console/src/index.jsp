<!--
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
-->

<%= htmlWebpackPlugin.options.importUtil %>
<%= htmlWebpackPlugin.options.importTenantPrefix %>
<%= htmlWebpackPlugin.options.importSuperTenantConstant %>

<jsp:scriptlet>
    session.setAttribute("authCode",request.getParameter("code"));
    session.setAttribute("sessionState", request.getParameter("session_state"));
</jsp:scriptlet>

<!DOCTYPE HTML>
<html>
    <head>
        <%= htmlWebpackPlugin.options.contentType %>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="referrer" content="no-referrer" />

        <link href="<%= htmlWebpackPlugin.options.publicPath %>/libs/themes/default/theme.min.css" rel="stylesheet" type="text/css"/>

        <title><%= htmlWebpackPlugin.options.title %></title>

        <script>
            var serverOriginGlobal = "<%= htmlWebpackPlugin.options.serverUrl %>";
            var superTenantGlobal = "<%= htmlWebpackPlugin.options.superTenantConstant %>";
            var tenantPrefixGlobal = "<%= htmlWebpackPlugin.options.tenantPrefix %>";
        </script>
    </head>
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <iframe
            id="rpIFrame"
            style="display: block"
            src="<%= htmlWebpackPlugin.options.publicPath %>/rpIFrame.html"
            frameborder="0"
            width="0"
            height="0"
        >
        </iframe>
        <div id="root"></div>
    </body>
</html>
