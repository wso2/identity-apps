<!--
~    Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
~
~    This software is the property of WSO2 LLC. and its suppliers, if any.
~    Dissemination of any information or reproduction of any material contained
~    herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
~    You may not alter or remove any copyright or other notice from copies of this content."
-->

<%= htmlWebpackPlugin.options.contentType %>
<%= htmlWebpackPlugin.options.importUtil %>
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
        <style>
            body {
                margin: 0;
                padding: 0;
            }

            @keyframes alert-success {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }

            .pre-loader-wrapper {
                background-color: #F5F6F6;
                min-height: 100vh;
                align-items: center;
                justify-content: center;
                display: flex;
                flex-direction: column;
                flex: 1;
                background-image: unset;
            }

            .trifacta-pre-loader  {
                margin-top: -0.1rem;
            }

            .trifacta-pre-loader svg #_1 {
                animation-name: alert-success;
                animation-duration: 3s;
                position: relative;
                animation-delay: 0s;
                animation-iteration-count: infinite;
            }

            .trifacta-pre-loader svg #_2 {
                animation-name: alert-success;
                animation-duration: 3s;
                position: relative;
                animation-delay: 1s;
                animation-iteration-count: infinite;
            }

            .trifacta-pre-loader svg #_3 {
                animation-name: alert-success;
                animation-duration: 3s;
                position: relative;
                animation-delay: 2s;
                animation-iteration-count: infinite;
            }
        </style>
        <script src="/<%= htmlWebpackPlugin.options.basename %>/startup-config.js"></script>
    </head>
    <script>

        var userAccessedPath = window.location.href;
        var applicationDomain = window.location.origin;

        var userTenant = userAccessedPath.split("/" + tenantPrefix + "/")[1] ?  userAccessedPath.split("/" + tenantPrefix + "/")[1].split("/")[0] : null;
        userTenant = userTenant ?  userTenant.split("?")[0] : null;
        var utype =  userAccessedPath.split("utype=")[1] ?  userAccessedPath.split("utype=")[1] : null;

        var serverOrigin = "<%= htmlWebpackPlugin.options.serverUrl %>";
        var authorizationCode = "<%= htmlWebpackPlugin.options.authorizationCode %>" != "null"
            ? "<%= htmlWebpackPlugin.options.authorizationCode %>"
            : null;
        var authSessionState = "<%= htmlWebpackPlugin.options.sessionState %>" != "null"
            ? "<%= htmlWebpackPlugin.options.sessionState %>"
            : null;
        var authIdPs = "<%= htmlWebpackPlugin.options.authenticatedIdPs %>" != "null"
            ? "<%= htmlWebpackPlugin.options.authenticatedIdPs %>"
            : null;

        function authenticateWithSDK() {

            if(!authorizationCode) {
                function getApiPath(path) {
                    if(path) {
                        return serverOrigin + path;
                    }

                    return serverOrigin;
                }

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
                        ? "/" + orgPrefix + "/" + getOrganizationName()
                        : "";
                };

                var auth = AsgardeoAuth.AsgardeoSPAClient.getInstance();

                var authConfig = {
                    signInRedirectURL: applicationDomain.replace(/\/+$/, '') + getOrganizationPath() + "/"
                        + "<%= htmlWebpackPlugin.options.basename %>",
                    signOutRedirectURL: applicationDomain.replace(/\/+$/, '') + getOrganizationPath(),
                    clientID: "<%= htmlWebpackPlugin.options.clientID %>",
                    baseUrl: getApiPath(),
                    responseMode: "form_post",
                    scope: ["openid SYSTEM profile"],
                    storage: "webWorker",
                    endpoints: {
                        authorizationEndpoint: getApiPath(userTenant 
                            ? "/" + tenantPrefix + "/" + superTenantProxy + authorizePath + "?ut="+userTenant.replace(/\/+$/, '') + (utype ? "&utype="+ utype : '')
                            : "/" + tenantPrefix + "/" + superTenantProxy + authorizePath),
                        clockTolerance: 300,
                        jwksEndpointURL: undefined,
                        logoutEndpointURL: getApiPath("/" + tenantPrefix "/" + superTenantProxy + logoutPath),
                        oidcSessionIFrameEndpointURL: getApiPath("/" + tenantPrefix + "/" + superTenantProxy + checksessionPath),
                        tokenEndpointURL: undefined,
                        tokenRevocationEndpointURL: undefined
                    },
                    enablePKCE: true
                }

                var isSilentSignInDisabled = userAccessedPath.includes("disable_silent_sign_in");
                var isTenantSwitchPath = userAccessedPath.includes("switch_tenant");
                const promptParam = new URL(location.href).searchParams.get("prompt");

                // Redirect user to the login page if the prompt parameter is set to login.
                if (promptParam && promptParam === 'login') {
                    auth.initialize(authConfig);
                    auth.signIn({ prompt: "login" });

                    return;
                }

                if(isSilentSignInDisabled) {

                    if(isTenantSwitchPath) {
                        auth.initialize(authConfig);
                        auth.signIn();
                    } else {
                        window.location = applicationDomain+'/authenticate?disable_silent_sign_in=true&invite_user=true';
                    }
                } else {
                    auth.initialize(authConfig);

                    if (window.top === window.self) {
                        var authCallbackUrl = window.location.pathname + window.location.hash;

                        sessionStorage.setItem("auth_callback_url_console", authCallbackUrl);
                    }

                    auth.signIn();
                }
            }
        }
    </script>
    <script>
        if(!authorizationCode) {
            var authSPAJS = document.createElement("script");

            authSPAJS.setAttribute("src", "/<%= htmlWebpackPlugin.options.basename %>/auth-spa-0.3.3.min.js");
            authSPAJS.setAttribute("async", "false");

            let head = document.head;
            head.insertBefore(authSPAJS, head.firstElementChild);

            authSPAJS.addEventListener("load", authenticateWithSDK, false);
        }
    </script>
    <body>
        <div class="pre-loader-wrapper" data-testid="preauth-pre-loader-wrapper">
            <div class="trifacta-pre-loader" data-testid="preauth-pre-loader">
                <svg data-testid="preauth-pre-loader-svg" xmlns="http://www.w3.org/2000/svg" width="67.56" height="58.476"
                     viewBox="0 0 67.56 58.476">
                    <g id="logo-only" transform="translate(-424.967 -306)">
                        <path id="_3" data-name="3"
                              d="M734.291,388.98l6.194,10.752-6.868,11.907h13.737l6.226,10.751H714.97Z"
                              transform="translate(-261.054 -82.98)" fill="#ff7300"/>
                        <path id="_2" data-name="2"
                              d="M705.95,422.391l6.227-10.751h13.736l-6.867-11.907,6.193-10.752,19.321,33.411Z"
                              transform="translate(-280.983 -82.98)" fill="#ff7300"/>
                        <path id="_1" data-name="1"
                              d="M736.65,430.2l-6.868-11.907-6.9,11.907H710.46l19.322-33.411L749.071,430.2Z"
                              transform="translate(-271.019 -65.725)" fill="#000"/>
                    </g>
                </svg>
            </div>
        </div>
    </body>
</html>
