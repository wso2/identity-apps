<!--
~    Copyright (c) 2022-2025, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
~
~    This software is the property of WSO2 Inc. and its suppliers, if any.
~    Dissemination of any information or reproduction of any material contained
~    herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
~    You may not alter or remove any copyright or other notice from copies of this content."
-->

<%= buildOptions.serverConfiguration %>
<%= buildOptions.proxyContextPathConstant %>
<%= buildOptions.importUtil %>
<%= buildOptions.importTenantPrefix %>
<%= buildOptions.importSuperTenantConstant %>
<%= buildOptions.importStringUtils %>
<%= buildOptions.getOrganizationManagementAvailability %>
<%= buildOptions.getAdaptiveAuthenticationAvailability %>

<%= buildOptions.cookieproEnabledFlag %>
<%= buildOptions.cookieproInitialScriptTypeCheck %>
<%= buildOptions.cookieproDomainScriptId %>

<jsp:scriptlet>
    session.setAttribute("authCode",request.getParameter("code"));
    session.setAttribute("sessionState", request.getParameter("session_state"));
    if(request.getParameter("state") != null) {session.setAttribute("state", request.getParameter("state"));}
</jsp:scriptlet>

<!DOCTYPE HTML>
<html>
    <head>
        <%= buildOptions.contentType %>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="referrer" content="no-referrer" />

        <!-- Start of loading application configurations -->
        <script type="text/javascript" src="<%= buildOptions.publicPath %>update.config.js"></script>
        <script type="text/javascript" src="<%= buildOptions.publicPath %>config.js"></script>
        <!-- End of loading application configurations -->

        <link href="<%= buildOptions.publicPath %>libs/themes/<%= buildOptions.theme %>/theme.<%= buildOptions.themeHash %>.min.css" rel="stylesheet" type="text/css"/>
        <link rel="shortcut icon" href="<%= buildOptions.publicPath %>libs/themes/<%= buildOptions.theme %>/assets/images/branding/favicon.ico" />

        <%= buildOptions.cookieproEnabledCheck %>
             <!-- CookiePro Cookies Consent Notice start for asgardeo.io -->
            <script src="https://cookie-cdn.cookiepro.com/scripttemplates/otSDKStub.js"  type="text/javascript" charset="UTF-8" data-domain-script="<%=buildOptions.cookieproDomainScriptIdVar%>" ></script>
            <script type="text/javascript">
                function OptanonWrapper() {
                    // Get initial OnetrustActiveGroups ids
                    if (typeof OptanonWrapperCount == "undefined") {
                        otGetInitialGroups();
                    }

                    // Delete cookies
                    otDeleteCookie(otInitialConsentedGroups);

                    // Assign OnetrustActiveGroups to custom variable
                    function otGetInitialGroups() {
                        OptanonWrapperCount = "";
                        otInitialConsentedGroups =  OnetrustActiveGroups;
                    }

                    function otDeleteCookie(iniOptGrpIdsListStr) {
                        try {
                            var otDomainGrps = JSON.parse(JSON.stringify(Optanon.GetDomainData().Groups));
                            // publish custom event to announce the cookie consent change
                            const cookiePrefChangeEvent = new CustomEvent("cookie-pref-change", { pref: OnetrustActiveGroups });
                            window.dispatchEvent(cookiePrefChangeEvent)
                            // return consent revoked group id list
                            var otRevokedGrpIds = otGetInactiveId(iniOptGrpIdsListStr, OnetrustActiveGroups);

                            if(otRevokedGrpIds.length != 0 && otDomainGrps.length != 0){
                                for(var i=0; i < otDomainGrps.length; i++){
                                    // Check if CustomGroupId matches
                                    if(otDomainGrps[i]["CustomGroupId"] != "" && otRevokedGrpIds.includes(otDomainGrps[i]["CustomGroupId"])){
                                        for(var j=0; j < otDomainGrps[i]['Cookies'].length; j++){
                                            console.info("Deleting cookie ",otDomainGrps[i]['Cookies'][j]['Name'])
                                            // Delete cookie
                                            eraseCookie(otDomainGrps[i]["Cookies"][j]["Name"]);
                                        }
                                    }

                                    // Check if Hostid matches
                                    if(otDomainGrps[i]["Hosts"].length != 0){
                                        for(var j = 0; j < otDomainGrps[i]["Hosts"].length; j++){
                                            // Check if HostId presents in the deleted list and cookie array is not blank
                                            if(otRevokedGrpIds.includes(otDomainGrps[i]["Hosts"][j]["HostId"]) && otDomainGrps[i]['Hosts'][j]['Cookies'].length !=0){
                                                for(var k=0; k < otDomainGrps[i]["Hosts"][j]["Cookies"].length; k++){
                                                    // Delete cookie
                                                    eraseCookie(otDomainGrps[i]["Hosts"][j]["Cookies"][k]["Name"]);
                                                }
                                            }
                                        }
                                    }

                                }
                            }
                            otGetInitialGroups(); //Reassign new group ids
                        } catch (err) {
                            console.error(err)
                        }
                    }

                    // Get inactive ids
                    function otGetInactiveId(prevGroupIdListStr, otActiveGrp) {
                        prevGroupIdList = prevGroupIdListStr.split(",");
                        prevGroupIdList = prevGroupIdList.filter(Boolean);

                        // After action OnetrustActiveGroups
                        otActiveGrp = otActiveGrp.split(",");
                        otActiveGrp = otActiveGrp.filter(Boolean);

                        var result = [];
                        for (var i = 0; i < prevGroupIdList.length; i++){
                            if (otActiveGrp.indexOf(prevGroupIdList[i]) <= -1){
                                result.push(prevGroupIdList[i]);
                            }
                        }
                        return result;
                    }

                    // Delete cookie
                    function eraseCookie(name) {
                        // Delete root path cookies
                        domainName = window.location.hostname;
                        document.cookie = name+"=; Max-Age=-99999999; Path=/;Domain="+ domainName;
                        document.cookie = name+"=; Max-Age=-99999999; Path=/;";

                        // Delete LSO incase LSO being used, cna be commented out.
                        localStorage.removeItem(name);

                        // Check for the current path of the page
                        pathArray = window.location.pathname.split('/');
                        // Loop through path hierarchy and delete potential cookies at each path.
                        for (var i = 0; i < pathArray.length; i++){
                            if (pathArray[i]){
                                // Build the path string from the Path Array e.g /site/login
                                var currentPath = pathArray.slice(0,i+1).join('/');
                                document.cookie = name+"=; Max-Age=-99999999; Path=' + currentPath + ';Domain="+ domainName;
                                document.cookie = name+"=; Max-Age=-99999999; Path=' + currentPath + ';";
                                // Maybe path has a trailing slash!
                                document.cookie = name+"=; Max-Age=-99999999; Path=' + currentPath + '/;Domain="+ domainName;
                                document.cookie = name+"=; Max-Age=-99999999; Path=' + currentPath + '/;";

                            }
                        }
                    }
                }
            </script>
        <%= buildOptions.cookieproEnabledCheckEnd %>
        <script>
            var contextPathGlobal = "<%= buildOptions.publicPath %>";
            var serverOriginGlobal = "<%= buildOptions.serverUrl %>";
            var proxyContextPathGlobal = "<%= buildOptions.proxyContextPath %>";
            var superTenantGlobal = "<%= buildOptions.superTenantConstant %>";
            var tenantPrefixGlobal = "<%= buildOptions.tenantPrefix %>";
            var isAdaptiveAuthenticationAvailable = JSON.parse("<%= buildOptions.isAdaptiveAuthenticationAvailable %>");
            var isOrganizationManagementEnabled = "<%= buildOptions.isOrganizationManagementEnabled %>" === "true";
        </script>

        <script>
            var userAccessedPath = sessionStorage.getItem("userAccessedPath");
            var isSilentSignInDisabled = userAccessedPath.includes("disable_silent_sign_in") ||
                                            window.location.href.includes("disable_silent_sign_in");
            var isInviteUserFlow = userAccessedPath.includes("invite_user");
            var isApplicationsPath = userAccessedPath.includes("develop/applications") ||
                                        window.location.href.includes("develop/applications");

            if(isInviteUserFlow) {
                window.location = window.location.origin;
            }
        </script>

        <!-- Start of custom stylesheets -->
        <link rel="stylesheet" type="text/css" href="<%= buildOptions.publicPath %>extensions/stylesheet.css"/>
        <!-- End of custom stylesheets -->

        <!-- Start of custom scripts added to the head -->
        <script
            id="head-script"
            type="text/javascript"
            src="<%= buildOptions.publicPath %>extensions/head-script.js"
            data-page-id="home"
        ></script>
        <!-- End of custom scripts added to the head -->
    </head>
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>

        <!-- Start of custom scripts added to the body -->
        <script type="text/javascript" src="<%= buildOptions.publicPath %>extensions/body-script.js"></script>
        <!-- End of custom scripts added to the body -->
    </body>
</html>
