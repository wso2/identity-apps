<!--
~    Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
~
~    This software is the property of WSO2 Inc. and its suppliers, if any.
~    Dissemination of any information or reproduction of any material contained
~    herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
~    You may not alter or remove any copyright or other notice from copies of this content."
-->

<%= htmlWebpackPlugin.options.importUtil %>
<%= htmlWebpackPlugin.options.importTenantPrefix %>
<%= htmlWebpackPlugin.options.importSuperTenantConstant %>
<%= htmlWebpackPlugin.options.importStringUtils %>
<%= htmlWebpackPlugin.options.getOrganizationManagementAvailability %>
<%= htmlWebpackPlugin.options.getAdaptiveAuthenticationAvailability %>

<%= htmlWebpackPlugin.options.cookieproEnabledFlag %>
<%= htmlWebpackPlugin.options.cookieproInitialScriptTypeCheck %>
<%= htmlWebpackPlugin.options.cookieproDomainScriptId %>

<jsp:scriptlet>
    session.setAttribute("authCode",request.getParameter("code"));
    session.setAttribute("sessionState", request.getParameter("session_state"));
    if(request.getParameter("state") != null) {session.setAttribute("state", request.getParameter("state"));}
</jsp:scriptlet>

<!DOCTYPE HTML>
<html>
    <head>
        <%= htmlWebpackPlugin.options.contentType %>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="referrer" content="no-referrer" />

        <link href="<%= htmlWebpackPlugin.options.publicPath %>libs/themes/<%= htmlWebpackPlugin.options.theme %>/theme.<%= htmlWebpackPlugin.options.themeHash %>.min.css" rel="stylesheet" type="text/css"/>
        <link rel="shortcut icon" href="<%= htmlWebpackPlugin.options.publicPath %>libs/themes/<%= htmlWebpackPlugin.options.theme %>/assets/images/branding/favicon.ico" />

        <%= htmlWebpackPlugin.options.cookieproEnabledCheck %>
             <!-- CookiePro Cookies Consent Notice start for asgardeo.io -->
            <script src="https://cookie-cdn.cookiepro.com/scripttemplates/otSDKStub.js"  type="text/javascript" charset="UTF-8" data-domain-script="<%=htmlWebpackPlugin.options.cookieproDomainScriptIdVar%>" ></script>
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
        <%= htmlWebpackPlugin.options.cookieproEnabledCheckEnd %>
        <script>
            var contextPathGlobal = "<%= htmlWebpackPlugin.options.publicPath %>";
            var serverOriginGlobal = "<%= htmlWebpackPlugin.options.serverUrl %>";
            var superTenantGlobal = "<%= htmlWebpackPlugin.options.superTenantConstant %>";
            var tenantPrefixGlobal = "<%= htmlWebpackPlugin.options.tenantPrefix %>";
            var isAdaptiveAuthenticationAvailable = JSON.parse("<%= htmlWebpackPlugin.options.isAdaptiveAuthenticationAvailable %>");
            var isOrganizationManagementEnabled = "<%= htmlWebpackPlugin.options.isOrganizationManagementEnabled %>" === "true";
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

        <!-- Start of custom scripts added to the head -->
        <script type="text/javascript" src="<%= htmlWebpackPlugin.options.publicPath %>extensions/head-script.js"></script>
        <!-- End of custom scripts added to the head -->
    </head>
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>

        <!-- Start of custom scripts added to the body -->
        <script type="text/javascript" src="<%= htmlWebpackPlugin.options.publicPath %>extensions/body-script.js"></script>
        <!-- End of custom scripts added to the body -->
    </body>
</html>
