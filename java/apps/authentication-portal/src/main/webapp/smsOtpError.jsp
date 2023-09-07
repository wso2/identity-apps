<%--
 ~
 ~ Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 Inc. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.authenticator.smsotp.SMSOTPConstants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.authenticator.smsotp.SMSOTPUtils" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="static java.util.Base64.getDecoder" %>
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
            } else if (errorMessage.equalsIgnoreCase("unable.send.code")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.send.sms");
            } else if (errorMessage.equalsIgnoreCase("code.mismatch")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.code.incorrect");
            } else if (errorMessage.equalsIgnoreCase("smsotp.disable")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.smsotp.disabled");
            } else if (errorMessage.equalsIgnoreCase("user.mobile.not.found")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.mobile.not.found");
            } else if (errorMessage.equalsIgnoreCase("directly.send.otp.disable")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.not.found");
            } else if (errorMessage.equalsIgnoreCase("user.account.locked")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked");
                String unlockTime = request.getParameter("unlockTime");
                if (unlockTime != null) {
                    errorMessage = String.format(AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.temporarly.locked"), unlockTime);
                }
            } else if (errorMessage.equalsIgnoreCase("resent.count.exceeded")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.resent.count.exceeded");
            } else if(errorMessage.equalsIgnoreCase("sms.quota.exceeded")){
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.sms.quota.exceeded");
            } else if (isErrorFallbackLocale) {
                actualError = errorMessage;
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
            }
        }
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isSuperTenant", StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT));
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
    <body class="login-portal layout sms-otp-portal-layout">

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
                <%
                    if (!(StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT))) {
                %>
                    <div class="ui orange attached segment mt-3">
                            <h3 class="ui header text-center slogan-message mt-3 mb-6">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.smsotp.title")%>
                            </h3>
                            <%
                                if ("true".equals(authenticationFailed)) {
                            %>
                            <p class="portal-tagline-description">
                                <%=Encode.forHtmlContent(errorMessage)%>
                            </p>
                            <div class="ui divider hidden"></div>
                            <div class="ui divider hidden"></div>
                            <% } %>
                    </div>
                    
                    <%
                        File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                        if (trackingRefFile.exists()) {
                    %>
                        <div class="ui bottom attached warning message">
                            <p class="text-left mt-0">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%>
                                <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                                    <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                                </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                            </p>

                            <div class="ui divider hidden"></div>
                            <jsp:include page="extensions/error-tracking-reference.jsp">
                                <jsp:param name="logError" value="<%=isErrorFallbackLocale%>"/>
                                <jsp:param name="errorCode" value="<%=actualError%>"/>
                                <jsp:param name="error" value="<%=actualError%>"/>
                            </jsp:include>
                            <div class="ui divider hidden"></div>
                        </div>
                    <% } %>
                <% } else { %>
                    <h2 class="ui header portal-logo-tagline slogan-message">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.smsotp.title")%>
                    </h2>

                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                    <h4 class="ui header sub-tagline" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%>
                    </h4>
                    <% } %>

                    <%
                        File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                        if (trackingRefFile.exists()) {
                    %>
                        <p class="portal-tagline-description">
                            Need help? Contact us via <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                                <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                            </a> with the tracking reference given below.
                        </p>

                        <jsp:include page="extensions/error-tracking-reference.jsp">
                            <jsp:param name="logError" value="<%=isErrorFallbackLocale%>"/>
                            <jsp:param name="errorCode" value="<%=actualError%>"/>
                            <jsp:param name="error" value="<%=actualError%>"/>
                        </jsp:include>
                    <% } %>
                <% } %>
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
            <layout:component componentName="ResponseImage">
                <%-- illustration--%>
                <div class="thank-you-img">
                    <img src="libs/themes/asgardio/assets/images/something-went-wrong.svg">
                </div>
            </layout:component>
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
