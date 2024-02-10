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

<%= htmlWebpackPlugin.options.cookieproEnabledFlag %>
<%= htmlWebpackPlugin.options.cookieproInitialScriptTypeCheck %>
<%= htmlWebpackPlugin.options.cookieproDomainScriptId %>

<jsp:scriptlet>
    session.setAttribute("authCode",request.getParameter("code"));
    session.setAttribute("sessionState", request.getParameter("session_state"));
    if(request.getParameter("state") != null) {session.setAttribute("state", request.getParameter("state"));}
</jsp:scriptlet>

<!DOCTYPE html>
<html>
    <head>
        <%= htmlWebpackPlugin.options.contentType %>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="referrer" content="no-referrer" />

        <link href="<%= htmlWebpackPlugin.options.publicPath %>libs/themes/<%= htmlWebpackPlugin.options.theme %>/theme.<%= htmlWebpackPlugin.options.themeHash %>.min.css" rel="stylesheet" type="text/css"/>
        <link rel="shortcut icon" href="<%= htmlWebpackPlugin.options.publicPath %>libs/themes/<%= htmlWebpackPlugin.options.theme %>/assets/images/branding/favicon.ico" data-react-helmet="true" />

        <%= htmlWebpackPlugin.options.cookieproEnabledCheck %>
             <!-- CookiePro Cookies Consent Notice start for asgardeo.io -->
            <script src="https://cookie-cdn.cookiepro.com/scripttemplates/otSDKStub.js"  type="text/javascript" charset="UTF-8" data-domain-script="<%=htmlWebpackPlugin.options.cookieproDomainScriptIdVar%>" ></script>
            <script type="text/javascript">
            function OptanonWrapper() {
                // Get initial OnetrustActiveGroups ids
                if(typeof OptanonWrapperCount == "undefined"){
                    otGetInitialGrps();
                }

                //Delete cookies
                otDeleteCookie(otInitialConsentedGroups);

                // Assign OnetrustActiveGroups to custom variable
                function otGetInitialGrps(){
                    OptanonWrapperCount = '';
                    otInitialConsentedGroups =  OnetrustActiveGroups;
                }

                function otDeleteCookie(iniOptGrpIdsListStr)
                {
                    var otDomainGrps = JSON.parse(JSON.stringify(Optanon.GetDomainData().Groups));
                    // publish custom event to announce the cookie consent change
                    const cookiePrefChangeEvent = new CustomEvent('cookie-pref-change', { pref: OnetrustActiveGroups });
                    window.dispatchEvent(cookiePrefChangeEvent)
                    // return consent revoked group id list
                    var otRevokedGrpIds = otGetInactiveId(iniOptGrpIdsListStr, OnetrustActiveGroups);
                    if(otRevokedGrpIds.length != 0 && otDomainGrps.length !=0){
                        for(var i = 0; i < otDomainGrps.length; i++){
                            //Check if CustomGroupId matches
                        if(otDomainGrps[i]['CustomGroupId'] != '' && otRevokedGrpIds.includes(otDomainGrps[i]['CustomGroupId'])){
                                for(var j = 0; j < otDomainGrps[i]['Cookies'].length; j++){
                                    console.info("Deleting cookie ",otDomainGrps[i]['Cookies'][j]['Name'])
                                    //Delete cookie
                                    eraseCookie(otDomainGrps[i]['Cookies'][j]['Name']);
                                }
                            }

                            //Check if Hostid matches
                            if(otDomainGrps[i]['Hosts'].length != 0){
                                for(var j=0; j < otDomainGrps[i]['Hosts'].length; j++){
                                    //Check if HostId presents in the deleted list and cookie array is not blank
                                    if(otRevokedGrpIds.includes(otDomainGrps[i]['Hosts'][j]['HostId']) && otDomainGrps[i]['Hosts'][j]['Cookies'].length !=0){
                                        for(var k = 0; k < otDomainGrps[i]['Hosts'][j]['Cookies'].length; k++){
                                            //Delete cookie
                                            eraseCookie(otDomainGrps[i]['Hosts'][j]['Cookies'][k]['Name']);
                                        }
                                    }
                                }
                            }

                        }
                    }
                    otGetInitialGrps(); //Reassign new group ids
                }

                //Get inactive ids
                function otGetInactiveId(prevGroupIdListStr, otActiveGrp){
                    prevGroupIdList = prevGroupIdListStr.split(",");
                    prevGroupIdList = prevGroupIdList.filter(Boolean);

                    //After action OnetrustActiveGroups
                    otActiveGrp = otActiveGrp.split(",");
                    otActiveGrp = otActiveGrp.filter(Boolean);

                    var result = [];
                    for (var i = 0; i < prevGroupIdList.length; i++){
                        if ( otActiveGrp.indexOf(prevGroupIdList[i]) <= -1 ){
                            result.push(prevGroupIdList[i]);
                        }
                    }
                    return result;
                }

                //Delete cookie
                function eraseCookie(name) {
                    //Delete root path cookies
                    domainName = window.location.hostname;
                    document.cookie = name + '=; Max-Age=-99999999; Path=/;Domain=' + domainName;
                    document.cookie = name + '=; Max-Age=-99999999; Path=/;';

                    //Delete LSO incase LSO being used, cna be commented out.
                    localStorage.removeItem(name);

                    //Check for the current path of the page
                    pathArray = window.location.pathname.split('/');
                    //Loop through path hierarchy and delete potential cookies at each path.
                    for (var i = 0; i < pathArray.length; i++){
                        if (pathArray[i]){
                            //Build the path string from the Path Array e.g /site/login
                            var currentPath = pathArray.slice(0,i+1).join('/');
                            document.cookie = name + '=; Max-Age=-99999999; Path=' + currentPath + ';Domain='+ domainName;
                            document.cookie = name + '=; Max-Age=-99999999; Path=' + currentPath + ';';
                            //Maybe path has a trailing slash!
                            document.cookie = name + '=; Max-Age=-99999999; Path=' + currentPath + '/;Domain='+ domainName;
                            document.cookie = name + '=; Max-Age=-99999999; Path=' + currentPath + '/;';

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
        </script>

        <!-- Analytics -->
    <%= htmlWebpackPlugin.options.vwoSystemVariable %>
    <%= htmlWebpackPlugin.options.vwoSystemVariableNullCheck %>
        <!-- Start VWO Async SmartCode -->
        <script type="<%= htmlWebpackPlugin.options.cookieproInitialScriptTypeVar %>" class="optanon-category-C0002">
            var vwo_ac_id = <%= htmlWebpackPlugin.options.vwoScriptVariable %>;
            if (vwo_ac_id !== null && vwo_ac_id) {
                window._vwo_code = window._vwo_code || (function(){
                var account_id = vwo_ac_id,
                settings_tolerance=2000,
                library_tolerance=2500,
                use_existing_jquery=false,
                is_spa=1,
                hide_element='body',

                /* DO NOT EDIT BELOW THIS LINE */
                f=false,d=document,code={use_existing_jquery:function(){return use_existing_jquery;},library_tolerance:function(){return library_tolerance;},finish:function(){if(!f){f=true;var a=d.getElementById('_vis_opt_path_hides');if(a)a.parentNode.removeChild(a);}},finished:function(){return f;},load:function(a){var b=d.createElement('script');b.src=a;b.type='text/javascript';b.innerText;b.onerror=function(){_vwo_code.finish();};d.getElementsByTagName('head')[0].appendChild(b);},init:function(){
                        window.settings_timer=setTimeout('_vwo_code.finish()',settings_tolerance);var a=d.createElement('style'),b=hide_element?hide_element+'{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}':'',h=d.getElementsByTagName('head')[0];a.setAttribute('id','_vis_opt_path_hides');a.setAttribute('type','text/css');if(a.styleSheet)a.styleSheet.cssText=b;else a.appendChild(d.createTextNode(b));h.appendChild(a);this.load('https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(d.URL)+'&f='+(+is_spa)+'&r='+Math.random());return settings_timer; }};window._vwo_settings_timer = code.init(); return code; }());
            } else {
                console.warn("VWO is disabled");
            }
        </script>
        <!-- End VWO Async SmartCode -->

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
