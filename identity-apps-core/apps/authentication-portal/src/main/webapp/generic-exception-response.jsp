<%--
  ~ Copyright (c) 2014-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="com.google.gson.Gson" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String stat = request.getParameter("status");
    String actualError = request.getParameter("status");
    String statusMessage = request.getParameter("statusMsg");
    String actualErrorMessage = request.getParameter("statusMsg");
    String emailOtpErrorCode = "email.not.found";
    String emailOtpErrorKey = "NotSatisfyAuthenticatorPrerequisitesReason.email-otp-authenticator";
    String statusDescription = "";
    String statusTitle = "";
    Gson gson = new Gson();

    // Log the actual error for localized error fallbacks
    boolean isErrorFallbackLocale = !userLocale.toLanguageTag().equals("en_US");

    if (stat == null || statusMessage == null) {
        stat = (String) request.getAttribute("status");
        statusMessage = (String) request.getAttribute("statusMsg");
    }

    String authAPIURL = application.getInitParameter(Constants.AUTHENTICATION_REST_ENDPOINT_URL);

    if (StringUtils.isBlank(authAPIURL)) {
        authAPIURL = IdentityManagementEndpointUtil.getBasePath(tenantDomain, "/api/identity/auth/v1.1/", true);
    } else {
        // Resolve tenant domain for the authentication API URl
        authAPIURL = AuthenticationEndpointUtil.resolveTenantDomain(authAPIURL);
    }

    if (!authAPIURL.endsWith("/")) {
        authAPIURL += "/";
    }
    authAPIURL += "context/" + request.getParameter("authFlowId");

    // Get the context properties.
    String contextProperties = AuthContextAPIClient.getContextProperties(authAPIURL);
    Map data = gson.fromJson(contextProperties, Map.class);

    if (data == null) {
        statusTitle = stat;
        statusDescription = statusMessage;
    } else {
        String emailNotFoundCode = (String) data.get(emailOtpErrorKey);

        // Set the error message title and descriptions.
        if (emailOtpErrorCode.equals(emailNotFoundCode)) {
            statusTitle = AuthenticationEndpointUtil.i18n(resourceBundle, "email.otp.error");
            statusDescription = AuthenticationEndpointUtil.i18n(resourceBundle, "email.otp.error.description");
        } else {
            statusTitle = stat;
            statusDescription = statusMessage;
        }
    }

    if (stat == null || statusMessage == null) {
        if (statusTitle != null && statusDescription != null) {
            stat = statusTitle;
            statusMessage = statusDescription;
        }
    }

    // Set the error message to the fallback error message, if current error message is none or for non-english locales
    if ((stat == null || statusMessage == null) || isErrorFallbackLocale) {
        stat = AuthenticationEndpointUtil.i18n(resourceBundle, "authentication.error");
        statusMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "something.went.wrong.during.authentication");
    }

    session.invalidate();
%>

<% request.setAttribute("pageName", "generic-exception-response"); %>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isResponsePage", true);
    layoutData.put("isErrorResponse", true);
%>

<!doctype html>
<html>
<head>
    <%-- header --%>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
        <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
        <jsp:include page="includes/header.jsp"/>
    <% } %>

    <%-- analytics --%>
    <%
        File analyticsFile = new File(getServletContext().getRealPath("extensions/analytics.jsp"));
        if (analyticsFile.exists()) {
    %>
        <jsp:include page="extensions/analytics.jsp"/>
    <% } else { %>
        <jsp:include page="includes/analytics.jsp"/>
    <% } %>

    <script type="text/javascript">
        trackEvent("authentication-portal-error-generic", {
            "type": "error-response",
            "status": "<%= Encode.forJavaScriptBlock(stat) %>" !== "null" ? "<%= Encode.forJavaScriptBlock(stat) %>" : "",
            "status-message": "<%= Encode.forJavaScriptBlock(statusMessage) %>" !== "null" ? "<%= Encode.forJavaScriptBlock(statusMessage) %>" : ""
        });
    </script>
</head>
<body class="login-portal layout authentication-portal-layout" data-response-type="error" data-page="<%= request.getAttribute("pageName") %>">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
                <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
                <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="MainSection">
            <div class="ui orange attached segment mt-3">
                <h3 class="ui header text-center slogan-message mt-3 mb-6">
                    <%
                        if (!(StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT))) {
                    %>
                        <%=Encode.forHtmlContent(statusTitle)%>
                    <% } else { %>
                        <%=Encode.forHtml(stat)%>
                    <% } %>
                </h3>
                <p class="portal-tagline-description">
                    <%
                        if (!(StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT))) {
                    %>
                        <%=Encode.forHtmlContent(statusDescription)%>
                    <% } else { %>
                        <%=Encode.forHtmlContent(statusMessage)%>
                    <% } %>
                </p>
                <div class="ui divider hidden"></div>
            </div>
            <div class="ui bottom attached warning message">
                <p class="text-left mt-0">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us" )%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button">
                                <%= StringEscapeUtils.escapeHtml4(supportEmail) %>
                            </span>
                        </a>
                <%
                    if (config.getServletContext().getResource("extensions/error-tracking-reference.jsp") != null) {
                %>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below" )%>
                    </p>
                    <div class="ui divider hidden"></div>
                    <jsp:include page="extensions/error-tracking-reference.jsp">
                        <jsp:param name="logError" value="<%=isErrorFallbackLocale%>"/>
                        <jsp:param name="errorCode" value="<%=actualError%>"/>
                        <jsp:param name="error" value="<%=actualErrorMessage%>"/>
                    </jsp:include>
                <%
                    } else {
                %>
                    </p>
                <%
                    }
                %>
                <div class="ui divider hidden"></div>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
                File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                if (productFooterFile.exists()) {
            %>
                <jsp:include page="extensions/product-footer.jsp"/>
            <% } else { %>
                <jsp:include page="includes/product-footer.jsp"/>
            <% } %>
        </layout:component>
        <layout:dynamicComponent filePathStoringVariableName="pathOfDynamicComponent">
            <jsp:include page="${pathOfDynamicComponent}" />
        </layout:dynamicComponent>
    </layout:main>

    <%-- footer --%>
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
        <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
        <jsp:include page="includes/footer.jsp"/>
    <% } %>
</body>
</html>
