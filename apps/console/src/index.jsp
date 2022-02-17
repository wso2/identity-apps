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

<!DOCTYPE HTML>
<html>
    <head>
        <script src="https://unpkg.com/@asgardeo/auth-spa@latest/dist/asgardeo-spa.production.min.js"></script>
    </head>
    <body>
        <script>
            var userAccessedPath = window.location.href;
            var applicationDomain = window.location.origin;
            var userTenant = userAccessedPath.split("/t/")[1] ?  userAccessedPath.split("/t/")[1].split("/")[0] : null;

            var serverOrigin = "<%=serverUrl%>";

            function getApiPath(path) {
                if(path) {
                    return serverOrigin + path;
                }

                return serverOrigin;
            }

            var auth = AsgardeoAuth.AsgardeoSPAClient.getInstance();

            var authConfig = {
                signInRedirectURL: applicationDomain.replace(/\/+$/, ''),
                signOutRedirectURL: applicationDomain.replace(/\/+$/, ''),
                clientID: "CONSOLE",
                serverOrigin: getApiPath(),
                responseMode: "form_post",
                scope: ["openid SYSTEM"],
                storage: "webWorker",
                endpoints: {
                    authorizationEndpoint: getApiPath(userTenant ? "/t/a/oauth2/authorize?ut="+userTenant.replace(/\/+$/, '') : "/t/a/oauth2/authorize"),
                    clockTolerance: 300,
                    jwksEndpointURL: undefined,
                    logoutEndpointURL: getApiPath("/t/a/oidc/logout"),
                    oidcSessionIFrameEndpointURL: getApiPath("/t/a/oidc/checksession"),
                    serverOrigin: getApiPath(),
                    tokenEndpointURL: undefined,
                    tokenRevocationEndpointURL: undefined,
                    wellKnownEndpointURL: undefined,
                },
                enablePKCE: true,
                overrideWellEndpointConfig: true
            }

            auth.initialize(authConfig);

            auth.trySignInSilently().then(res => {
                if(res === false) {
                    auth.signIn();
                } else {
                    sessionStorage.setItem("auth_callback_url_console", userAccessedPath.split(window.origin)[1])
                    sessionStorage.setItem("userAccessedPath", userAccessedPath.split(window.origin)[1])
                    
                    window.location = '/authenticate';
                }
            });
        </script>
    </body>
</html>
