<%--
 ~
 ~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 Inc. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
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

    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.fail");
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.fail");
            }
        }
    }

    // Log the actual error for localized error fallbacks
    boolean isErrorFallbackLocale = !userLocale.toLanguageTag().equals("en_US");
    String actualError = errorMessage;

    if (isErrorFallbackLocale) {
        errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.fail");
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

        <%-- analytics --%>
        <%
            File analyticsFile = new File(getServletContext().getRealPath("extensions/analytics.jsp"));
            if (analyticsFile.exists()) {
        %>
            <jsp:include page="extensions/analytics.jsp"/>
        <% } else { %>
            <jsp:include page="includes/analytics.jsp"/>
        <% } %>
        
        <script src="js/scripts.js"></script>
        <script src="/totpauthenticationendpoint/js/scripts.js"></script>

        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->

        <script type="text/javascript">
            trackEvent("authentication-portal-error-totp", {
                "type": "error-response",
                "error-message": "<%= Encode.forJavaScriptBlock(errorMessage) %>" !== "null" ? "<%= Encode.forJavaScriptBlock(errorMessage) %>" : ""
            });
        </script>
    </head>

    <body class="login-portal layout totp-portal-layout" onload="getLoginDiv()">
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
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.fail")%>
                        </h3>
                        <p class="portal-tagline-description">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.totp.not.enabled")%>
                        </p>
                        <div class="ui divider hidden"></div>
                        <div class="ui divider hidden"></div>
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
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.fail")%>
                    </h2>

                    <h4 class="ui header sub-tagline">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.totp.not.enabled")%>
                    </h4>

                    
                    <%
                        File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                        if (trackingRefFile.exists()) {
                    %>
                    <p class="portal-tagline-description">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
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
