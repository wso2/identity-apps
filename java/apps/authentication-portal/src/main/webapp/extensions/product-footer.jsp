<%--
 ~
 ~ Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 Inc. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>


<%-- localize.jsp MUST already be included in the calling script --%>

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Arrays" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="./branding-preferences.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="../includes/localize.jsp" />

<%
    String asgardeoLogoURL = "libs/themes/asgardio/assets/images/branding/asgardeo-logo.svg";

    if (StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT)) {
        privacyPolicyURL = application.getInitParameter("PrivacyPolicyURL");
        termsOfUseURL = application.getInitParameter("TermsOfServiceURL");

        // If `PrivacyPolicyURL` is not configured in the configuration (web.xml) fallback to default.
        if (StringUtils.isBlank(termsOfUseURL)) {
            termsOfUseURL = "https://wso2.com/asgardeo/terms-of-use";
        }

        // If `PrivacyPolicyURL` is not configured in the configuration (web.xml) fallback to default.
        if (StringUtils.isBlank(privacyPolicyURL)) {
            privacyPolicyURL = "https://wso2.com/asgardeo/privacy-policy";
        }
    }

    if (!StringUtils.isEmpty(activeThemeName)) {
        if (StringUtils.equalsIgnoreCase(activeThemeName, "DARK")) {
            asgardeoLogoURL = "libs/themes/asgardio/assets/images/branding/asgardeo-logo-white.svg";
        }
    }
%>

<%-- Appending locale to privacy policy and ToC links --%>
<%
    String localeString = userLocale.toLanguageTag();

    if (!StringUtils.isBlank(privacyPolicyURL)) {
        if (privacyPolicyURL.contains("?")) {
            privacyPolicyURL = privacyPolicyURL.concat("&ui_locales=" + localeString);
        } else {
            privacyPolicyURL = privacyPolicyURL.concat("?ui_locales=" + localeString);
        }
    }

    if (!StringUtils.isBlank(termsOfUseURL)) {
        if (termsOfUseURL.contains("?")) {
            termsOfUseURL = termsOfUseURL.concat("&ui_locales=" + localeString);
        } else {
            termsOfUseURL = termsOfUseURL.concat("?ui_locales=" + localeString);
        }
    }
%>

<%-- footer --%>
<footer class="footer">
    <div class="ui container fluid">
        <div class="ui text stackable menu">
            <div class="left menu">
                <a class="item no-hover" id="copyright">
                    <%
                        if (!StringUtils.isBlank(copyrightText)) {
                    %>
                        <span><%= StringEscapeUtils.escapeHtml4(copyrightText) %></span>
                    <%
                        } else {
                    %>    
                        &copy; <script>document.write(new Date().getFullYear());</script> WSO2 LLC.
                    <%
                        }
                    %>
                    <%
                        if (!shouldRemoveDefaultBranding) {
                    %>
                    <div class="powered-by-logo-divider">|</div><%=AuthenticationEndpointUtil.i18n(resourceBundle, "powered.by")%>
                    <div class="powered-by-logo" onclick="window.open('https://wso2.com/asgardeo', '_self', 'noopener,noreferrer,resizable')">
                        <img width="80" height="20" src="<%= StringEscapeUtils.escapeHtml4(asgardeoLogoURL) %>" alt="Asgardeo Logo" />
                    </div>
                    <% } %>
                </a>
            </div>
            <div class="right menu">
            <%
                if (!StringUtils.isBlank(privacyPolicyURL)) {
            %>
                <a
                    id="privacy-policy"
                    class="item"
                    href="<%= StringEscapeUtils.escapeHtml4(privacyPolicyURL) %>"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="login-page-privacy-policy-link"
                >
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.general")%>
                </a>
            <% } %>
            <%
                if (!StringUtils.isBlank(termsOfUseURL)) {
            %>
                <a
                    id="terms-of-service"
                    class="item"
                    href="<%= StringEscapeUtils.escapeHtml4(termsOfUseURL) %>"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="login-page-privacy-policy-link"
                >
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "terms.of.service")%>
                </a>
            <% } %>

                <%
                    List<String> langSwitcherEnabledServlets = Arrays.asList("/oauth2_login.do", "/oauth2_error.do",
                            "/confirmregistration.do", "/confirmrecovery.do", "/claims.do", "/oauth2_consent.do",
                            "/fido2-auth.jsp", "/email_otp.do", "/org_name.do", "/retry.do", "/totp_enroll.do");
                    if (langSwitcherEnabledServlets.contains(request.getServletPath())) {
                %>
                        <jsp:include page="../includes/language-switcher.jsp"/>
                <% } %>
            </div>
        </div>
    </div>
</footer>
