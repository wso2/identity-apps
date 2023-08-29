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
        <script src="/<%= htmlWebpackPlugin.options.basename %>/auth-spa-0.3.3.min.js"></script>
    </head>
    <body>
        <script>
            var userAccessedPath = window.location.href;
            var applicationDomain = window.location.origin;

            var userTenant = userAccessedPath.split("/t/")[1] ?  userAccessedPath.split("/t/")[1].split("/")[0] : null;
            userTenant = userTenant ?  userTenant.split("?")[0] : null;
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
                var orgPrefix = "o";

                /**
                 * Get the organization name.
                 *
                 * @returns {string}
                 */
                function getOrganizationName() {
                    const path = window.location.pathname;
                    const pathChunks = path.split("/");

                    const orgPrefixIndex = pathChunks.indexOf(orgPrefix);

                    if (orgPrefixIndex !== -1) {
                        return pathChunks[ orgPrefixIndex + 1 ];
                    }

                    return "";
                };

                /**
                 * Get the organization path.
                 *
                 * @returns {string}
                 */
                function getOrganizationPath() {
                    return getOrganizationName() !== ""
                        ? "/" + orgPrefix + "/" +  getOrganizationName()
                        : "";
                };

                var authConfig = {
                    signInRedirectURL: applicationDomain.replace(/\/+$/, '') + getOrganizationPath() + "/"
                        + "<%= htmlWebpackPlugin.options.basename %>",
                    signOutRedirectURL: applicationDomain.replace(/\/+$/, '') + getOrganizationPath(),
                    clientID: "<%= htmlWebpackPlugin.options.clientID %>",
                    baseUrl: getApiPath(),
                    responseMode: "form_post",
                    scope: ["openid SYSTEM profile"],
                    storage: "webWorker",
                    enablePKCE: true,
                    endpoints: {
                        authorizationEndpoint: getApiPath(userTenant ? "/t/carbon.super/oauth2/authorize?ut="+userTenant.replace(/\/+$/, '') : "/t/carbon.super/oauth2/authorize")
                    }
                }

                var isSilentSignInDisabled = userAccessedPath.includes("disable_silent_sign_in");
                var isSignOutSuccess = userAccessedPath.includes("sign_out_success");

                if (isSignOutSuccess) {
                    window.location.href = userAccessedPath.split("?")[0];
                }

                if (isSilentSignInDisabled) {
                    window.location.href = applicationDomain + '/' + "<%= htmlWebpackPlugin.options.basename %>" + '/authenticate?disable_silent_sign_in=true&invite_user=true';
                } else {
                    auth.initialize(authConfig);

                    if (window.top === window.self) {
                        var authCallbackUrl = window.location.pathname + window.location.hash;

                        sessionStorage.setItem("auth_callback_url_console", authCallbackUrl);
                    }

                    auth.signIn();
                }
            }
        </script>
    </body>
</html>
