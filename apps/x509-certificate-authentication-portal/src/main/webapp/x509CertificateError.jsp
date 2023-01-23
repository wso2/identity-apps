<%--
  ~ Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.TenantDataManager" %>
<%@ page import="java.util.ResourceBundle" %>
<%@ include file="includes/localize.jsp" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    request.getSession().invalidate();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorCode = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"unknown.error.code");
    String authenticationFailed = "false";
    String errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"unknown.error.message");

    if (Boolean.parseBoolean(request.getParameter("authFailure"))) {
        authenticationFailed = "true";

        if (request.getParameter("errorCode") != null) {
            errorCode = request.getParameter("errorCode");

            if (errorCode.equalsIgnoreCase("18013")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"certificateNotFound.error.message");
            } else if (errorCode.equalsIgnoreCase("18003")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"userNotFound.error.message");
            } else if (errorCode.equalsIgnoreCase("20015")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"userNamesConflict.error.message");
            } else if (errorCode.equalsIgnoreCase("17001")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"userNotFoundInUserStore.error.message");
            } else if (errorCode.equalsIgnoreCase("17002")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"user.account.locked");
            } else if (errorCode.equalsIgnoreCase("18015")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"not.valid.certificate");
            } else if (errorCode.equalsIgnoreCase("17003")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"fail.validation.certificate");
            } else if (errorCode.equalsIgnoreCase("17004")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "x509certificateauthenticator.alternativenames.regex.multiplematches.code.17004.error.message");
            } else if (errorCode.equalsIgnoreCase("17005")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "x509certificateauthenticator.alternativenames.regex.nomatches.code.17005.error.message");
            } else if (errorCode.equalsIgnoreCase("17006")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "x509certificateauthenticator.subjectdn.regex.multiplematches.code.17006.error.message");
            } else if (errorCode.equalsIgnoreCase("17007")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "x509certificateauthenticator.subjectdn.regex.nomatches.code.17007.error.message");
            } else if (errorCode.equalsIgnoreCase("17008")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "x509certificateauthenticator.alternativenames.notfound.code.17008.error.message");
            } else if (errorCode.equalsIgnoreCase("17010")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"user.account.disabled");
            }
        }
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<html lang="en-US">
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
        <script src="js/scripts.js"></script>
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="login-portal layout x509-certificate-portal-layout">
        <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
            <layout:component componentName="ProductHeader" >
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
            <layout:component componentName="MainSection" >
                <div class="ui segment">
                    <!-- page content -->
                    <h2><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "failed.auth")%></h2>
                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                            <div class="ui negative message" id="failed-msg"><%=errorMessage%></div>
                    <% } %>
                    <div id="alertDiv"></div>
                </div>
            </layout:component>
            <layout:component componentName="ProductFooter" >
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
