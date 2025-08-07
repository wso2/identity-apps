<%--
  ~ Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
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
<script src="libs/tldts-6.1.73.umd.min.js" async></script>
<script src="util/url-utils.js" async></script>

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Arrays" %>

<%-- Include tenant context --%>
<jsp:directive.include file="init-url.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="localize.jsp" />

<%-- Branding Preferences --%>
<jsp:directive.include file="branding-preferences.jsp"/>

<%
    // Determining whether the application user is going to login is Console, as the maintenance banner
    // should only be shown in console related authentication flows.
    List<String> downtimeBannerEnabledAppList = Arrays.asList("Console");
    Boolean isDowntimeBannerEnabled = StringUtils.equals("true", application.getInitParameter("isDowntimeBannerEnabled"))
        && downtimeBannerEnabledAppList.contains(Encode.forJava(request.getParameter("sp")));
%>

<script type="text/javascript">
    // Automatically shows on init if the user hasn't already acknowledged cookie usage.
    $(document).ready(function () {
        // downtime-banner.
        var SHOW_DOWNTIME_BANNER = <%= isDowntimeBannerEnabled %>;

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

        var cookieString = getCookieConsentCookieName() + "=true;max-age=31536000;path=/;Secure";
        var domain = URLUtils.getDomain(window.location.href);

        if (domain) {
            cookieString = cookieString + ";domain=" + domain;
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
</script>

<% if (StringUtils.isNotBlank(jsContent)){ %>
<script type="text/javascript"><%= jsContent %></script>
<% } %>
