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

<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL" %>

<%
    String serverUrl = getServerURL("", true, true);
    String authorizationCode = request.getParameter("code");
    String authSessionState = request.getParameter("session_state");
    String authIdPs = request.getParameter("AuthenticatedIdPs");
%>

<!DOCTYPE html>
<html>
    <head>
        <script>
            // Handles myaccount tenanted signout before auth sdk get loaded
            var applicationDomain = window.location.origin;
            var userAccessedPath = window.location.href;
            var isSignOutSuccess = userAccessedPath.includes("sign_out_success");
            var userTenant = userAccessedPath.split("/t/")[1] ?  userAccessedPath.split("/t/")[1].split("/")[0] : null;
            userTenant = userTenant ?  userTenant.split("?")[0] : null;

            if(isSignOutSuccess && userTenant) {
                window.location.href = applicationDomain+"/t/"+userTenant
            }
        </script>
        <script src="https://unpkg.com/@asgardeo/auth-spa@0.2.19/dist/asgardeo-spa.production.min.js"></script>
    </head>
    <body>
        <script>
            var serverOrigin = "<%=serverUrl%>";
            var authorizationCode = "<%=authorizationCode%>" != "null" ? "<%=authorizationCode%>" : null;
            var authSessionState = "<%=authSessionState%>" != "null" ? "<%=authSessionState%>" : null;
            var authIdPs = "<%=authIdPs%>" != "null" ? "<%=authIdPs%>" : null;

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
                clientID: "MY_ACCOUNT",
                serverOrigin: getApiPath(),
                responseMode: "form_post",
                scope: ["openid SYSTEM"],
                storage: "webWorker",
                endpoints: {
                    authorizationEndpoint: userTenant ? getApiPath("/t/"+userTenant+"/common/oauth2/authorize") : getApiPath("/t/a/common/oauth2/authorize"),
                    clockTolerance: 300,
                    jwksEndpointURL: undefined,
                    logoutEndpointURL: userTenant ? getApiPath("/t/"+userTenant+"/common/oidc/logout") : getApiPath("/t/a/common/oidc/logout"),
                    oidcSessionIFrameEndpointURL: userTenant ? getApiPath("/t/"+userTenant+"/common/oidc/checksession") : getApiPath("/t/a/common/oidc/checksession"),
                    serverOrigin: getApiPath(),
                    tokenEndpointURL: undefined,
                    tokenRevocationEndpointURL: undefined,
                    wellKnownEndpointURL: undefined,
                },
                enablePKCE: true,
                overrideWellEndpointConfig: true
            }
            
            if(authorizationCode) {
                sessionStorage.setItem("auth_callback_url_console", userAccessedPath.split(window.origin)[1]);
                sessionStorage.setItem("userAccessedPath", userAccessedPath.split(window.origin)[1]);
                window.location = applicationDomain+'/authenticate?code='+authorizationCode+'&state=sign-in-silently'+'&AuthenticatedIdPs='+authIdPs+
                            '&session_state='+authSessionState;
            } else {
                auth.initialize(authConfig);
                auth.signIn();
            }
        </script>
    </body>
</html>
