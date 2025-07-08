<%--
  ~ Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>

<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
    String actualError = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
    String authenticationFailed = "false";
    boolean isErrorFallbackLocale = !userLocale.toLanguageTag().equals("en_US");

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {

            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);
            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
            } else if (errorMessage.equalsIgnoreCase("error.push.registered.device.not.found")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.push.registered.device.not.found");
            } else if (errorMessage.equalsIgnoreCase("error.push.resent.count.exceeded")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.push.resent.count.exceeded");
            } else if (errorMessage.equalsIgnoreCase("error.push.user.denied.consent")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.push.user.denied.consent");
            } else if (errorMessage.equalsIgnoreCase("error.push.number.challenge.failed")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.push.number.challenge.failed");
            } else if (errorMessage.equalsIgnoreCase("error.push.token.response.failure")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.push.token.response.failure");
            } else if (errorMessage.equalsIgnoreCase("error.push.internal.error")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.push.internal.error");
            } else if (errorMessage.equalsIgnoreCase("error.push.authentication.failed")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.push.authentication.failed");
            } else if (errorMessage.equalsIgnoreCase("user.account.locked")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked");
                String unlockTime = request.getParameter("unlockTime");
                if (unlockTime != null) {
                    errorMessage = String.format(AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.temporarly.locked"), unlockTime);
                }
            } else if (isErrorFallbackLocale) {
                actualError = errorMessage;
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
            }
        }
    }

%>

<% request.setAttribute("pageName", "push-auth-error"); %>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isResponsePage", true);
    layoutData.put("isErrorResponse", true);
%>

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

        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>
    <body class="login-portal layout push-auth-portal-layout" data-response-type="error" data-page="<%= request.getAttribute("pageName") %>">

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
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.push.auth.title")%>
                    </h3>
                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                        <p class="portal-tagline-description">
                            <%=Encode.forHtmlContent(errorMessage)%>
                        </p>
                        <div class="ui divider hidden"></div>
                    <% } %>
                </div>

                <div class="ui bottom attached warning message">
                    <p class="text-left mt-0">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a>
                    <%
                        if (config.getServletContext().getResource("extensions/error-tracking-reference.jsp") != null) {
                    %>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                        </p>
                        <div class="ui divider hidden"></div>
                        <jsp:include page="extensions/error-tracking-reference.jsp">
                            <jsp:param name="logError" value="<%=isErrorFallbackLocale%>"/>
                            <jsp:param name="errorCode" value="<%=actualError%>"/>
                            <jsp:param name="error" value="<%=actualError%>"/>
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
