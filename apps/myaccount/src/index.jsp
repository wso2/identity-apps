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

<%= htmlWebpackPlugin.options.contentType %>
<%= htmlWebpackPlugin.options.importUtil %>
<%= htmlWebpackPlugin.options.importSuperTenantConstant %>
<%= htmlWebpackPlugin.options.importOwaspEncode %>
<%= htmlWebpackPlugin.options.getOrganizationManagementAvailability %>

<jsp:scriptlet>
    <%= htmlWebpackPlugin.options.requestForwardSnippet %>
</jsp:scriptlet>

<!DOCTYPE html>
<html>
    <head>
        <script>
            // Handles myaccount tenanted signout before auth sdk get loaded
            var applicationDomain = window.location.origin;
            var userAccessedPath = window.location.href;
            var isSignOutSuccess = userAccessedPath.includes("sign_out_success");

            if(isSignOutSuccess) {
                window.location.href = applicationDomain+'/'+"<%= htmlWebpackPlugin.options.basename %>"
            }
        </script>
        <script src="/<%= htmlWebpackPlugin.options.basename %>/auth-spa-0.3.3.min.js"></script>
    </head>
    <body>
        <script>
            var serverOrigin = "<%= htmlWebpackPlugin.options.serverUrl %>";
            var authorizationCode = "<%= htmlWebpackPlugin.options.authorizationCode %>" != "null"
                                        ? "<%= htmlWebpackPlugin.options.authorizationCode %>"
                                        : null;
            var authSessionState = "<%= htmlWebpackPlugin.options.sessionState %>" != "null"
                                        ? "<%= htmlWebpackPlugin.options.sessionState %>"
                                        : null;
            var isOrganizationManagementEnabled = JSON.parse("<%= htmlWebpackPlugin.options.isOrganizationManagementEnabled %>");


            if(!authorizationCode) {
                function getApiPath(path) {
                    if(path) {
                        return serverOrigin + path;
                    }

                    return serverOrigin;
                }

                var auth = AsgardeoAuth.AsgardeoSPAClient.getInstance();

                var authConfig = {
                    signInRedirectURL: applicationDomain.replace(/\/+$/, '') + "/" + "<%= htmlWebpackPlugin.options.basename %>",
                    signOutRedirectURL: applicationDomain.replace(/\/+$/, ''),
                    clientID: "<%= htmlWebpackPlugin.options.clientID %>",
                    baseUrl: getApiPath(),
                    responseMode: "form_post",
                    scope: ["openid SYSTEM"],
                    storage: "webWorker",
                    enablePKCE: true
                }

                if(isOrganizationManagementEnabled) {
                    authConfig.endpoints = {
                        authorizationEndpoint: getApiPath("/t/carbon.super/oauth2/authorize?ut=")
                    }
                }

                sessionStorage.setItem("auth_callback_url_my_account",
                    userAccessedPath.split(window.origin)[1]
                        ? userAccessedPath.split(window.origin)[1].replace(/\/+$/, '')
                        : null
                );

                auth.initialize(authConfig);
                auth.signIn();
            }
        </script>
    </body>
</html>
