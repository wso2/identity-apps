<%--
 ~
 ~ Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content.
 ~
--%>

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.client.model.AuthenticationRequestWrapper" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityCoreConstants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="extensions/branding-preferences.jsp"/>

<%!
    private static final String SERVER_AUTH_URL = "/api/identity/auth/v1.1/";
    private static final String DATA_AUTH_ERROR_URL = "data/AuthenticationError/";
    private static final String REQUEST_PARAM_ERROR_KEY = "errorKey";
%>
<%
    String stat = request.getParameter(Constants.STATUS);
    String statusMessage = request.getParameter(Constants.STATUS_MSG);
    String sp = request.getParameter("sp");
    String errorCode = request.getParameter("errorCode");
    String remainingAttempts = request.getParameter("remainingAttempts");
    String applicationAccessURLWithoutEncoding = null;

    String errorKey = request.getParameter(REQUEST_PARAM_ERROR_KEY);
    String statAuthParam = null;
    String statusMsgAuthParam = null;

    if (StringUtils.isNotEmpty(errorKey)) {
        AuthenticationRequestWrapper authRequest = (AuthenticationRequestWrapper) request;
        statAuthParam = authRequest.getAuthParameter(Constants.STATUS);
        statusMsgAuthParam = authRequest.getAuthParameter(Constants.STATUS_MSG);
    }

    // If auth params are available, can skip i18n mapping validations. This is to allow displaying
    // custom error messages.
    if (StringUtils.isNotEmpty(statAuthParam) || StringUtils.isNotEmpty(statusMsgAuthParam)) {
        stat = statAuthParam;
        statusMessage = statusMsgAuthParam;
        if (StringUtils.isNotEmpty(stat)) {
            stat = AuthenticationEndpointUtil.customi18n(resourceBundle, stat);
        }
        if (StringUtils.isNotEmpty(statusMessage)) {
            statusMessage = AuthenticationEndpointUtil.customi18n(resourceBundle, statusMessage);
        }
    } else if (StringUtils.isNotEmpty(stat) || StringUtils.isNotEmpty(statusMessage)) {
        String i18nErrorMapping = AuthenticationEndpointUtil.getErrorCodeToi18nMapping(stat, statusMessage);
        if (Constants.ErrorToi18nMappingConstants.INCORRECT_ERROR_MAPPING_KEY.equals(i18nErrorMapping)) {
            stat = AuthenticationEndpointUtil.i18n(resourceBundle, "authentication.error");
            statusMessage = AuthenticationEndpointUtil.i18n(resourceBundle,
                    "something.went.wrong.during.authentication");
        } else {
            if (StringUtils.isNotEmpty(stat)) {
                stat = AuthenticationEndpointUtil.customi18n(resourceBundle, stat);
            }
            if (StringUtils.isNotEmpty(statusMessage)) {
                statusMessage = AuthenticationEndpointUtil.customi18n(resourceBundle, statusMessage);
            }
        }
    }

    if (StringUtils.isEmpty(stat)) {
        stat = AuthenticationEndpointUtil.i18n(resourceBundle, "authentication.error");
    }
    if (StringUtils.isEmpty(statusMessage)) {
        statusMessage = AuthenticationEndpointUtil.i18n(resourceBundle,
                "something.went.wrong.during.authentication");
    }
    session.invalidate();

    try {
        ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
        applicationAccessURLWithoutEncoding = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain,
                sp);
        applicationAccessURLWithoutEncoding = IdentityManagementEndpointUtil.replaceUserTenantHintPlaceholder(
                                                                applicationAccessURLWithoutEncoding, userTenantDomain);
    } catch (ApplicationDataRetrievalClientException e) {
        // Ignored and fallback to login page url.
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isSuperTenant", StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT));
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
</head>
<body class="login-portal layout authentication-portal-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader" >
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
        <layout:component componentName="MainSection" >
            <%
                if (!(StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT))) {
            %>
                <div class="ui orange attached segment mt-3">
                    <%
                        if (StringUtils.equals(errorCode, IdentityCoreConstants.USER_ACCOUNT_LOCKED_ERROR_CODE) &&
                                StringUtils.isBlank(remainingAttempts)) {
                    %>
                        <h3 class="ui header text-center slogan-message mt-3 mb-6">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unable.to.proceed")%>
                        </h3>

                        <p class="portal-tagline-description">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "your.account.is.locked.write.us.to.know.more.at")%>
                            <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                                <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                            </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "for.assistance")%>
                        </p>
                    <%
                        } else if (IdentityCoreConstants.USER_ACCOUNT_DISABLED_ERROR_CODE.equals(errorCode)) {
                    %>
                        <h3 class="ui header text-center slogan-message mt-3 mb-6">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unable.to.proceed")%>
                        </h3>

                        <p class="portal-tagline-description">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "your.account.is.disabled.write.us.to.know.more.at")%>
                            <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                                <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                            </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "for.assistance")%>
                        </p>
                    <% } else { %>
                        <h3 class="ui header text-center slogan-message mt-3 mb-6">
                            <%=Encode.forHtmlContent(stat)%>
                        </h3>

                        <p class="portal-tagline-description">
                            <%=Encode.forHtmlContent(statusMessage)%>
                        </p>

                        <% if (StringUtils.isNotBlank(applicationAccessURLWithoutEncoding)) { %>
                            <button class="ui primary basic button"
                                onclick="location.href='<%= IdentityManagementEndpointUtil.getURLEncodedCallback(applicationAccessURLWithoutEncoding) %>';">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "login")%>
                            </button>
                        <% } %>
                    <% } %>
                    <div class="ui divider hidden"></div>
                    <div class="ui divider hidden"></div>
                </div>
                <div class="ui bottom attached message support-message-container">
                    <p class="text-left mt-0">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%> <br />
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                    </p>
                    <div class="ui divider hidden"></div>

                    <%
                        File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                        if (trackingRefFile.exists()) {
                    %>
                        <jsp:include page="extensions/error-tracking-reference.jsp"/>
                        <div class="ui divider hidden"></div>
                    <% } %>
                    
                </div>
            <% } else { %>
                <%
                    if (StringUtils.equals(errorCode, IdentityCoreConstants.USER_ACCOUNT_LOCKED_ERROR_CODE) &&
                            StringUtils.isBlank(remainingAttempts)) {
                %>
                    <h2 class="ui header portal-logo-tagline slogan-message">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unable.to.proceed")%>
                    </h2>

                    <p class="portal-tagline-description mt-1 mb-5">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "your.account.is.locked.write.us.to.know.more.at")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "for.assistance")%>
                    </p>

                    <%
                        File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                        if (trackingRefFile.exists()) {
                    %>
                        <jsp:include page="extensions/error-tracking-reference.jsp"/>                
                    <% } %>

                <%
                    } else if (IdentityCoreConstants.USER_ACCOUNT_DISABLED_ERROR_CODE.equals(errorCode)) {
                %>
                    <h2 class="ui header portal-logo-tagline slogan-message">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unable.to.proceed")%>
                    </h2>

                    <p class="portal-tagline-description mt-1 mb-5">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "your.account.is.disabled.write.us.to.know.more.at")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "for.assistance")%>
                    </p>

                    <%
                        File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                        if (trackingRefFile.exists()) {
                    %>
                        <jsp:include page="extensions/error-tracking-reference.jsp"/>                
                    <% } %>


                <% } else { %>
                    <h2 class="ui header portal-logo-tagline slogan-message">
                        <%=Encode.forHtmlContent(stat)%>
                    </h2>

                    <p class="portal-tagline-description mt-1 mb-5">
                        <%=Encode.forHtmlContent(statusMessage)%>
                    </p>

                    <%
                        File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                        if (trackingRefFile.exists()) {
                    %>
                        <jsp:include page="extensions/error-tracking-reference.jsp"/>
                    <% } %>

                    <% if (StringUtils.isNotBlank(applicationAccessURLWithoutEncoding)) { %>
                    <button class="ui primary basic button mt-5"
                        onclick="location.href='<%= IdentityManagementEndpointUtil.getURLEncodedCallback(applicationAccessURLWithoutEncoding) %>';">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "login")%>
                    </button>
                    <% } %>
                <% } %>
            <% } %>
        </layout:component>
        <layout:component componentName="ProductFooter" >
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
        <layout:component componentName="ResponseImage" >
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
