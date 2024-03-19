<%--
  ~ Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Arrays" %>

<%-- Include tenant context --%>
<jsp:directive.include file="init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="branding-preferences.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="localize.jsp" />

<%-- Cookie Consent Banner --%>
<%
    if (config.getServletContext().getResource("extensions/cookie-consent-banner.jsp") != null) {
%>
        <jsp:include page="/extensions/cookie-consent-banner.jsp"/>
<%
    } else {
%>
        <jsp:include page="/includes/cookie-consent-banner.jsp"/>
<%
    }
%>

<%-- footer --%>
<footer class="footer">
    <div class="ui container fluid">
        <div class="ui text stackable menu">
            <div class="left menu">
                <a class="item no-hover" id="copyright">
                    <%
                        String copyright = i18n(resourceBundle, customText, "copyright", __DEPRECATED__copyrightText);
                        if (StringUtils.isNotBlank(copyright)) {
                    %>
                        <span class="copyright-text line-break"><%= copyright %></span>
                    <% } %>
                    <%
                        if (!shouldRemoveDefaultBranding) {
                    %>
                        <% if (StringUtils.isNotBlank(productURL) && StringUtils.isNotBlank(poweredByLogoURL)) {%>
                            <div class="powered-by-logo-divider">|</div>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "powered.by")%>
                            <div class="powered-by-logo" onclick="window.open('<%= StringEscapeUtils.escapeHtml4(productURL) %>', '_self', 'noopener,noreferrer,resizable')">
                                <img width="80" height="20" src="<%= StringEscapeUtils.escapeHtml4(poweredByLogoURL) %>" alt="<%= StringEscapeUtils.escapeHtml4(logoAlt) %>" />
                            </div>
                        <% } %>
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
                    href="<%= i18nLink(userLocale, privacyPolicyURL) %>"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="login-page-privacy-policy-link"
                >
                    <%=i18n(resourceBundle, customText, "privacy.policy")%>
                </a>
            <% } %>
            <%
                if (!StringUtils.isBlank(termsOfUseURL)) {
            %>
                <a
                    id="terms-of-service"
                    class="item"
                    href="<%= i18nLink(userLocale, termsOfUseURL) %>"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="login-page-privacy-policy-link"
                >
                    <%=i18n(resourceBundle, customText, "terms.of.service")%>
                </a>
            <% } %>

            <%
                List<String> langSwitcherEnabledServlets = Arrays.asList("/oauth2_login.do", "/oauth2_error.do",
                    "/confirmregistration.do", "/confirmrecovery.do", "/claims.do", "/oauth2_consent.do",
                    "/fido2-auth.jsp", "/fido2-identifierfirst.jsp", "/fido2-enroll.jsp", "/fido2-passkey-status.jsp",
                    "/fido2-error.jsp", "/email_otp.do", "/org_name.do", "/org_discovery.do", "/retry.do", "/totp_enroll.do",
                    "/backup_code.do", "/device.do", "/error.do");
                if (langSwitcherEnabledServlets.contains(request.getServletPath())) {
                    File languageSwitcherFile = new File(getServletContext().getRealPath("extensions/language-switcher.jsp"));
                    if (languageSwitcherFile.exists()) {
            %>
                        <jsp:include page="../extensions/language-switcher.jsp"/>
                    <% } else { %>
                        <jsp:include page="language-switcher.jsp"/>
                    <% } %>
                <% } %>
            </div>
        </div>
    </div>
</footer>
