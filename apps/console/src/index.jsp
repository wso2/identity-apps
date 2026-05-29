<!--
~    Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
~
~    This software is the property of WSO2 LLC. and its suppliers, if any.
~    Dissemination of any information or reproduction of any material contained
~    herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
~    You may not alter or remove any copyright or other notice from copies of this content."
-->

<%= buildOptions.contentType %>
<%= buildOptions.serverConfiguration %>
<%= buildOptions.proxyContextPathConstant %>
<%= buildOptions.importUtil %>
<%= buildOptions.importIdentityTenantUtil %>
<%= buildOptions.importOwaspEncode %>
<%= buildOptions.importIsSuperTenantRequiredInUrl %>

<script>
    var userAccessedPath = window.location.href;
    sessionStorage.setItem("userAccessedPath", userAccessedPath.split(window.origin)[1]);
</script>

<jsp:scriptlet>
    <%= buildOptions.requestForwardSnippet %>
</jsp:scriptlet>

<!DOCTYPE HTML>
<html>
    <head>
        <!-- Start of loading application configurations -->
        <script type="text/javascript" src="<%= buildOptions.publicPath %>update.config.js"></script>
        <script type="text/javascript" src="<%= buildOptions.publicPath %>config.js"></script>
        <!-- End of loading application configurations -->

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

            .pre-loader-logo {
                margin-top: -0.1rem;
            }

            .content-loader {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                user-select: none;
            }

            .content-loader .ui.loader {
                display: block;
                position: relative;
                margin-top: 10px;
                margin-bottom: 25px;
            }

            @keyframes loader {
                0% {
                    transform: rotate(0)
                }

                to {
                    transform: rotate(1turn)
                }
            }

            .content-loader .ui.loader:before {
                content: "";
                display: block;
                height: 26px;
                width: 26px;
                border: .2em solid rgba(0,0,0,.1);
                border-radius: 500rem;
            }

            .content-loader .ui.loader:after {
                content: "";
                position: absolute;
                height: 26px;
                width: 26px;
                border-color: #767676 transparent transparent !important;
                border: .2em solid transparent;
                animation: loader .6s linear;
                animation-iteration-count: infinite;
                border-radius: 500rem;
                box-shadow: 0 0 0 1px transparent;
                top: 0;
                left: 0;
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
        <script
            src="/<%= buildOptions.basename + '/' %>startup-config.js"
        ></script>

        <!-- Start of custom stylesheets -->
        <link rel="stylesheet" type="text/css" href="<%= buildOptions.publicPath %>extensions/stylesheet.css"/>
        <!-- End of custom stylesheets -->

        <!-- Start of custom scripts added to the head -->
        <script
            id="head-script"
            type="text/javascript"
            src="<%= buildOptions.publicPath %>extensions/head-script.js"
            data-page-id="preauth"
        ></script>
        <!-- End of custom scripts added to the head -->
    </head>
    <script>

        var proxyContextPathGlobal = "<%= buildOptions.proxyContextPath %>";
        var proxyContextPathConsole = window.__WSO2_IS_RUNTIME_CONFIG__ ? window.__WSO2_IS_RUNTIME_CONFIG__.server.proxyContextPath : null;
        if (proxyContextPathConsole) {
            proxyContextPathGlobal = proxyContextPathConsole;
        }
        var isSuperTenantRequiredInUrl = "<%= buildOptions.isSuperTenantRequiredInUrl %>";
        var userAccessedPath = window.location.href;
        var applicationDomain = window.location.origin;

        var userTenant = userAccessedPath.split("/" + startupConfig.tenantPrefix + "/")[1] ?  userAccessedPath.split("/" + startupConfig.tenantPrefix + "/")[1].split("/")[0] : null;
        userTenant = userTenant ?  userTenant.split("?")[0] : null;
        var utype =  userAccessedPath.split("utype=")[1] ?  userAccessedPath.split("utype=")[1] : null;

        var serverOrigin = "<%= buildOptions.serverUrl %>";
        var authorizationCode = "<%= buildOptions.authorizationCode %>" != "null"
            ? "<%= buildOptions.authorizationCode %>"
            : null;
        var authSessionState = "<%= buildOptions.sessionState %>" != "null"
            ? "<%= buildOptions.sessionState %>"
            : null;
        var authIdPs = "<%= buildOptions.authenticatedIdPs %>" != "null"
            ? "<%= buildOptions.authenticatedIdPs %>"
            : null;

        function authenticateWithSDK() {

            if(!authorizationCode) {
                function getTenantName() {
                    var path = window.location.pathname;
                    var pathChunks = path.split("/");
                    var tenantPrefixIndex = pathChunks.indexOf(startupConfig.tenantPrefix);
                    if (tenantPrefixIndex !== -1) {
                        return pathChunks[ tenantPrefixIndex + 1 ];
                    }
                    return "";
                }

                function getTenantPath(tenantDomain) {
                    var _tenantDomain = tenantDomain ? tenantDomain : getTenantName();

                    if (!_tenantDomain && isSuperTenantRequiredInUrl === "true") {
                        if (startupConfig.superTenantProxy) {
                            _tenantDomain = startupConfig.superTenantProxy;
                        } else {
                            _tenantDomain = startupConfig.superTenant;
                        }
                    }

                    return _tenantDomain !== ""
                        ? "/" + startupConfig.tenantPrefix + "/" + _tenantDomain
                        : "";
                };

                function getApiPath(path) {
                    var tenantDomain = getTenantName();

                    if (!tenantDomain) {
                        if (startupConfig.superTenantProxy) {
                            tenantDomain = startupConfig.superTenantProxy;
                        } else {
                            tenantDomain = startupConfig.superTenant;
                        }
                    }

                    if (path) {
                        return serverOrigin + getTenantPath(tenantDomain) + path;
                    }

                    return serverOrigin + getTenantPath(tenantDomain);
                }

                /**
                 * Get the organization name.
                 *
                 * @returns {string}
                 */
                function getOrganizationName() {
                    var path = window.location.pathname;
                    var pathChunks = path.split("/");

                    var orgPrefixIndex = pathChunks.indexOf(startupConfig.orgPrefix);

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
                        ? "/" + startupConfig.orgPrefix + "/" + getOrganizationName()
                        : "";
                };

                 /**
                 * Check if the current tenant is super tenant.
                 *
                 * @returns {boolean}
                 */
                function isSuperTenant() {
                    if (getTenantName()) {
                        return false;
                    }

                    var tenantName;

                    if (startupConfig.superTenantProxy) {
                        tenantName = startupConfig.superTenantProxy;
                    } else {
                        tenantName = startupConfig.superTenant;
                    }

                    return tenantName === startupConfig.superTenant;
                }

                /**
                 * Get the tenant qualified client id.
                 *
                 * @returns {string}
                 */
                function resolveClientId() {
                    var enableTenantQualifiedUrls = <%= buildOptions.isTenantQualifiedUrlsEnabled %>;
                    var defaultClientId = "<%= buildOptions.clientID %>";

                    if (enableTenantQualifiedUrls === true || isSuperTenant()) {
                        return defaultClientId;
                    } else {
                        return defaultClientId + "_" + getTenantName();
                    }
                }

                /**
                 * Construct the sign-in redirect URL.
                 *
                 * @returns {string} Contructed URL.
                 */
                function signInRedirectURL() {
                    // When there's no proxy context path, the IS server returns "null".
                    var contextPath = (!proxyContextPathGlobal || proxyContextPathGlobal === "null") ? "" : "/" + proxyContextPathGlobal;

                    if (getTenantName() === startupConfig.superTenant && isSuperTenantRequiredInUrl !== "true") {
                        return applicationDomain.replace(/\/+$/, '') + contextPath
                            + "<%= '/' + buildOptions.basename %>";
                    }

                    return applicationDomain.replace(/\/+$/, '') + contextPath + getTenantPath()
                        + "<%= '/' + buildOptions.basename %>";
                }

                /**
                 * Construct the sign-out redirect URL.
                 *
                 * @returns {string} Constructed URL.
                 */
                function getSignOutRedirectURL() {
                    if (getTenantName() === startupConfig.superTenant && isSuperTenantRequiredInUrl !== "true") {
                        return applicationDomain.replace(/\/+$/, '');
                    }

                    return applicationDomain.replace(/\/+$/, '') + getTenantPath();
                }

                /**
                 * Construct the auth params for organization login `authorize` requets.
                 *
                 * @remarks This only applies to the new authz runtime.
                 *
                 * @returns {string} Contructed auth params.
                 */
                function getAuthParamsForOrganizationLogins(orginalParams) {
                    var authParams = Object.assign({}, orginalParams);

                    if (getOrganizationPath()) {
                        var initialUserOrgInLocalStorage = localStorage.getItem("user-org");
                        var orgIdInLocalStorage = localStorage.getItem("org-id");

                        if (orgIdInLocalStorage) {
                            if (orgIdInLocalStorage === getOrganizationName() && initialUserOrgInLocalStorage !== "undefined") {
                                authParams["fidp"] = "OrganizationSSO";
                                authParams["orgId"] = getOrganizationName();
                            }
                        } else {
                            authParams["fidp"] = "OrganizationSSO";
                            authParams["orgId"] = getOrganizationName();
                        }
                    }

                    return authParams;
                }

                /**
                 * Retrieves the super tenant.
                 * If a super tenant proxy is defined in the startup configuration, it is returned;
                 * otherwise, the super tenant directly from the startup configuration is returned.
                 *
                 * @returns {string} The super tenant.
                 */
                function getSuperTenant() {
                    if (startupConfig.superTenantProxy) {
                        return startupConfig.superTenantProxy;
                    }

                    startupConfig.superTenant;
                }

                var auth = AsgardeoAuth.AsgardeoSPAClient.getInstance();

                var authConfig = {
                    signInRedirectURL: signInRedirectURL(),
                    signOutRedirectURL: getSignOutRedirectURL(),
                    clientID: resolveClientId(),
                    baseUrl: getApiPath(),
                    responseMode: "form_post",
                    scope: ["openid SYSTEM profile"],
                    storage: "webWorker",
                    endpoints: {
                        authorizationEndpoint: getApiPath("/oauth2/authorize"),
                        clockTolerance: 300,
                        jwksEndpointURL: undefined,
                        logoutEndpointURL: getApiPath("/oidc/logout"),
                        oidcSessionIFrameEndpointURL: getApiPath("/oidc/checksession"),
                        tokenEndpointURL: undefined,
                        tokenRevocationEndpointURL: undefined
                    },
                    enablePKCE: true
                }

                var isSilentSignInDisabled = userAccessedPath.includes("disable_silent_sign_in");
                var isTenantSwitchPath = userAccessedPath.includes("switch_tenant");
                var promptParam = new URL(location.href).searchParams.get("prompt");

                // Redirect user to the login page if the prompt parameter is set to login.
                if (promptParam && promptParam === 'login') {
                    auth.initialize(authConfig);
                    auth.signIn(getAuthParamsForOrganizationLogins({ prompt: "login" }));

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

                    auth.signIn(getAuthParamsForOrganizationLogins({}));
                }
            }
        }
    </script>
    <script>
        if(!authorizationCode) {
            var authSPAJS = document.createElement("script");
            var authScriptSrc = "<%= '/' + buildOptions.basename + '/auth-spa-3.1.2.min.js' %>";

            authSPAJS.setAttribute("src", authScriptSrc);
            authSPAJS.setAttribute("async", "false");

            var head = document.head;
            head.insertBefore(authSPAJS, head.firstElementChild);

            authSPAJS.addEventListener("load", authenticateWithSDK, false);
        }
    </script>
    <body>
        <div class="pre-loader-wrapper" data-testid="preauth-pre-loader-wrapper">
            <div class="content-loader" id="loader">
                <div class="ui dimmer">
                    <div class="ui loader"></div>
                </div>
            </div>
        </div>
        <!-- Start of custom scripts added to the body -->
        <script type="text/javascript" src="<%= buildOptions.publicPath %>extensions/body-script.js"></script>
        <!-- End of custom scripts added to the body -->
    </body>
</html>
