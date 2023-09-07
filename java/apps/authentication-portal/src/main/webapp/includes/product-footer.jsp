<%--
  ~ Copyright (c) 2019-2023, WSO2 LLC. (https://www.wso2.com).
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

<%-- Cookie Consent Banner --%>
<%
    if (config.getServletContext().getResource("extensions/cookie-consent-banner.jsp") != null) {
%>
        <jsp:include page="extensions/cookie-consent-banner.jsp"/>
<%
    } else if (config.getServletContext().getResource("includes/cookie-consent-banner.jsp") != null) {
%>
        <jsp:include page="includes/cookie-consent-banner.jsp"/>
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
                    <div class="powered-by-logo-divider">|</div>
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "powered.by")%> 
                    <div class="powered-by-logo" onclick="window.open('<%= StringEscapeUtils.escapeHtml4(productURL) %>', '_self', 'noopener,noreferrer,resizable')">
                        <img width="80" height="20" src="<%= StringEscapeUtils.escapeHtml4(logoURL) %>" alt="<%= StringEscapeUtils.escapeHtml4(logoAlt) %>" />
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
                    <%=IdentityManagementEndpointUtil.i18n(resourceBundle, "privacy.policy.general")%>
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
                    <%=IdentityManagementEndpointUtil.i18n(resourceBundle, "terms.of.service")%>
                </a>
            <% } %>

                <%
                    List<String> langSwitcherEnabledServlets = Arrays.asList("/oauth2_login.do", "/oauth2_error.do",
                        "/confirmregistration.do", "/confirmrecovery.do", "/claims.do", "/oauth2_consent.do",
                        "/fido2-auth.jsp", "/email_otp.do", "/org_name.do", "/retry.do", "/totp_enroll.do");
                    if (langSwitcherEnabledServlets.contains(request.getServletPath())) {
                %>
                        <jsp:include page="language-switcher.jsp"/>
                <% } %>
            </div>
        </div>
    </div>
</footer>
