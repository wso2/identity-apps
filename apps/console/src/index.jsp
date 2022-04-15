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

<script>
    var userAccessedPath = window.location.href;
    sessionStorage.setItem("userAccessedPath", userAccessedPath.split(window.origin)[1]);
</script>

<jsp:scriptlet>
    <%= htmlWebpackPlugin.options.requestForwardSnippet %>
</jsp:scriptlet>

<!DOCTYPE HTML>
<html>
    <head>
        <script src="https://unpkg.com/@asgardeo/auth-spa@0.3.3/dist/asgardeo-spa.production.min.js"></script>
    </head>
    <body>
        <script>
            var userAccessedPath = window.location.href;
            var applicationDomain = window.location.origin;

            var serverOrigin = "<%= htmlWebpackPlugin.options.serverUrl %>";
            var authorizationCode = "<%= htmlWebpackPlugin.options.authorizationCode %>" != "null" 
                                        ? "<%= htmlWebpackPlugin.options.authorizationCode %>" 
                                        : null;
            var authSessionState = "<%= htmlWebpackPlugin.options.sessionState %>" != "null" 
                                        ? "<%= htmlWebpackPlugin.options.sessionState %>" 
                                        : null;
            
            if (!authorizationCode) {
                function getApiPath(path) {
                    if (path) {
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

                var isSilentSignInDisabled = userAccessedPath.includes("disable_silent_sign_in");
                var isSignOutSuccess = userAccessedPath.includes("sign_out_success");

                if (isSignOutSuccess) {
                    window.location.href = applicationDomain + '/' + "<%= htmlWebpackPlugin.options.basename %>"
                }
                
                if (isSilentSignInDisabled) {
                    window.location.href = applicationDomain + '/' + "<%= htmlWebpackPlugin.options.basename %>" + '/authenticate?disable_silent_sign_in=true&invite_user=true';
                } else {
                    sessionStorage.setItem("auth_callback_url_console", 
                        userAccessedPath.split(window.origin)[1] 
                            ? userAccessedPath.split(window.origin)[1].replace(/\/+$/, '') : null);
                    auth.initialize(authConfig);
                    auth.signIn();
                }
            }
        </script>
    </body>
</html>
