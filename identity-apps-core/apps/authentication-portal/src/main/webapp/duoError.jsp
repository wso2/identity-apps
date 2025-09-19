<%--
  ~ Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
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

    String error = AuthenticationEndpointUtil.i18n(resourceBundle, "authentication.error");
    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "something.went.wrong.during.authentication");
    String authenticationFailed = "false";
    boolean isErrorFallbackLocale = !userLocale.toLanguageTag().equals("en_US");

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("user.not.registered")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.not.registered");
            } else if (errorMessage.equalsIgnoreCase("user.not.found")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.duo.user.not.found");
            } else if (errorMessage.equalsIgnoreCase("unable.to.get.duo.mobileNumber")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.mobile.not.found.duo");
            } else if (errorMessage.equalsIgnoreCase("unable.to.find.number")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.mobile.not.found");
            } else if (errorMessage.equalsIgnoreCase("number.mismatch")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.number.mismatch.duo");
            } else if (isErrorFallbackLocale) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "something.went.wrong.during.authentication");
            }
        }
    }
%>

<% request.setAttribute("pageName","duo-error"); %>

<html lang="en-US">
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

    <body class="login-portal layout email-otp-portal-layout" data-response-type="error" data-page="<%= request.getAttribute("pageName") %>">
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
                <div class="ui segment">
                    <%-- page content --%>
                    <h2><%=error%></h2>
                    <div class="ui divider hidden"></div>
                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                    <div class="ui negative message" id="failed-msg"><%= Encode.forHtml(errorMessage) %></div>
                    <% } %>
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
