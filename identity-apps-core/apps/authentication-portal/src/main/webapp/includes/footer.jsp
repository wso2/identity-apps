<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
  --%>

<script src="libs/themes/default/semantic.min.js"></script>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>

<% 
    String isDowntimeBannerEnabled = application.getInitParameter("isDowntimeBannerEnabled");
%>

<script type="text/javascript">
    // Automatically shows on init if the user hasn't already acknowledged cookie usage.
    $(document).ready(function () {
        // downtime-banner.
        var SHOW_DOWNTIME_BANNER = <%= StringUtils.equalsIgnoreCase(isDowntimeBannerEnabled, "true")%>;

        if(SHOW_DOWNTIME_BANNER) {
            $("#downtime-banner")
            .nag("show");
        }

        if (!isCookieConsentShown()) {
            // Simply show the banner without a transition.
            // Having a opening transition will be weird when switching
            // from apps. i.e From website to login portal.
            $("#cookie-consent-banner")
                .transition({
                    animation : undefined,
                    duration  : 0
                });
        }
    });

    /**
     * Get the name of the cookie consent cookie.
     */
    function getCookieConsentCookieName() {

        return "accepts-cookies";
    }

    /**
     * Callback for cookie consent banner action click.
     * @param e - Click event.
     */
    function onCookieConsentClear(e) {

        var cookieString = getCookieConsentCookieName() + "=true;max-age=31536000;path=/";

        if (extractDomainFromHost()) {
            cookieString = cookieString + ";domain=" + extractDomainFromHost();
        }

        document.cookie = cookieString;

        $("#cookie-consent-banner")
            .transition({
                animation : "slide up",
                duration  : 500
            });
    }

    /**
     * Look for a specific browser cookie.
     * @param name - Name of the cookie to find.
     */
    function getCookie(name) {

        var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));

        if (match) {
            return match[2];
        }
    }

    /**
     * Checks if the cookie consent is shown.
     */
    function isCookieConsentShown() {

        var COOKIE_CONSENT_COOKIE_NAME = "accepts-cookies";
        var isShown = getCookie(COOKIE_CONSENT_COOKIE_NAME);

        if (isShown !== undefined) {
            return isShown;
        }

        return false;
    }

    /**
     * Extracts the domain from the hostname.
     * If parsing fails, undefined will be returned.
     */
    function extractDomainFromHost() {

        var domain = undefined;

        /**
        * Extract the domain from the hostname.
        * Ex: If sub.sample.domain.com is parsed, `domain.com` will be set as the domain.
        */
        try {
            var hostnameTokens = window.location.hostname.split('.');

            if (hostnameTokens.length > 1) {
                domain = hostnameTokens.slice((hostnameTokens.length -2), hostnameTokens.length).join(".");
            } else if (hostnameTokens.length == 1) {
                domain = hostnameTokens[0];
            }
        } catch(e) {
            // Couldn't parse the hostname.
        }

        return domain;
    }
</script>
