<%--
  ~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ include file="includes/localize.jsp" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<!-- Branding Preferences -->
<jsp:directive.include file="extensions/branding-preferences.jsp"/>

<%
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }
    
    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
    String authenticationFailed = "false";
    
    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";
        
        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);
            
            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
            } else if (errorMessage.equalsIgnoreCase("unable.send.code")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.send.email");
            } else if (errorMessage.equalsIgnoreCase("code.mismatch")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.code.incorrect");
            } else if (errorMessage.equalsIgnoreCase("emailotp.disable")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.emailOTP.disabled");
            } else if (errorMessage.equalsIgnoreCase("directly.send.otp.disable")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.not.found");
            } else if (errorMessage.equalsIgnoreCase("user.account.locked")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked");
                String unlockTime = request.getParameter("unlockTime");
                if (unlockTime != null) {
                    errorMessage = String.format(AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.temporarly.locked"), unlockTime);
                }
            }
        }
    }
%>

<html>
<head>
    <!-- header -->
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

<body class="login-portal layout email-otp-portal-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component name="ProductHeader" >
            <!-- product-title -->
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
            <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
            <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component name="MainSection" >
            <div class="ui segment">
                <!-- page content -->
                <h2><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.emailOTP.title")%>
                </h2>
                <div class="ui divider hidden"></div>
                <%
                    if ("true".equals(authenticationFailed)) {
                %>
                <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%>
                </div>
                <% } %>
            </div>
        </layout:component>
        <layout:component name="ProductFooter" >
            <!-- product-footer -->
            <%
                File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                if (productFooterFile.exists()) {
            %>
            <jsp:include page="extensions/product-footer.jsp"/>
            <% } else { %>
            <jsp:include page="includes/product-footer.jsp"/>
            <% } %>
        </layout:component>
    </layout:main>

    <!-- footer -->
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
