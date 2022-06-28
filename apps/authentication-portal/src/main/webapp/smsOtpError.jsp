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

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.authenticator.smsotp.SMSOTPConstants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.authenticator.smsotp.SMSOTPUtils" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="static java.util.Base64.getDecoder" %>
<%@ include file="includes/localize.jsp" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.retry");
    String authenticationFailed = "false";
    String errorInfo = null;

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.retry");
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.UNABLE_SEND_CODE_VALUE)) {
                errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.send");
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.ERROR_CODE_MISMATCH)) {
                errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.code");
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.ERROR_SMSOTP_DISABLE_MSG)) {
                errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.smsotp.disabled");
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.TOKEN_EXPIRED_VALUE)) {
                errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.token.expired");
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.SEND_OTP_DIRECTLY_DISABLE_MSG)) {
                errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.user.not.found.smsotp");
            } else if (errorMessage.equalsIgnoreCase("user.account.locked")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.user.account.locked");
                String unlockTime = request.getParameter("unlockTime");
                if (unlockTime != null) {
                  errorMessage = String.format(IdentityManagementEndpointUtil.i18n(resourceBundle,"error.user.locked.temporarly"), unlockTime);
                }
            } else if (SMSOTPUtils.useInternalErrorCodes()) {
                String httpCode = URLDecoder.decode(errorMessage, SMSOTPConstants.CHAR_SET_UTF_8);
                errorMessage = SMSOTPConstants.ErrorMessage.getMappedErrorMessage(httpCode);
            }
        }
        if (request.getParameter(SMSOTPConstants.AUTH_FAILURE_INFO) != null) {
            errorInfo = new
                    String(getDecoder().decode(request.getParameter(SMSOTPConstants.AUTH_FAILURE_INFO)));

        }
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
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

    <body class="login-portal layout sms-otp-portal-layout">
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
                    <h2><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "error.failed.with.smsotp")%></h2>
                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                            <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%></div>
                        <% if (StringUtils.isNotEmpty(errorInfo)){ %>
                            <div class="ui negative message" id="failed-msg-info">
                                <p class="word-break-all"><%=Encode.forHtmlContent(errorInfo)%></p>
                            </div>
                    <% }
                        }
                    %>
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
