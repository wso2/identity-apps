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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="../includes/localize.jsp" %>
<%@ include file="../app-insights.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="../extensions/branding-preferences.jsp"/>

<%
    String stat = AuthenticationEndpointUtil.i18n(resourceBundle, "error.400");
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
    <script type="text/javascript">
        AppInsights.getInstance().trackEvent("authentication-portal-error", {
            "type": "error-response",
            "status": "400",
            "status-message": "<%=stat%>" !== "null" ? "<%=stat%>" : ""
        });
    </script>
    <%-- header --%>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
        <jsp:include page="../extensions/header.jsp"/>
    <% } else { %>
        <jsp:include page="../includes/header.jsp"/>
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
                <jsp:include page="../extensions/product-title.jsp"/>
            <% } else { %>
                <jsp:include page="../includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="MainSection" >
            <%
                if (!(StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT))) {
            %>
                <div class="ui orange attached segment mt-3">
                    <h3 class="ui header text-center slogan-message mt-3 mb-2">
                        <%=Encode.forHtml(stat)%>
                    </h3>
                </div>
                <div class="ui bottom attached warning message">
                    <p class="text-left mt-0">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                    </p>
                    <div class="ui divider hidden"></div>
                    <jsp:include page="../includes/error-tracking-reference.jsp"/>
                    <div class="ui divider hidden"></div>
                </div>
            <% } else { %>
                <h2 class="ui header portal-logo-tagline slogan-message">
                    <%=Encode.forHtml(stat)%>
                </h2>

                <p class="portal-tagline-description">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%>
                    <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                        <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                    </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                </p>
                <jsp:include page="../includes/error-tracking-reference.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="ProductFooter" >
            <%-- product-footer --%>
            <%
                File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                if (productFooterFile.exists()) {
            %>
                <jsp:include page="../extensions/product-footer.jsp"/>
            <% } else { %>
                <jsp:include page="../includes/product-footer.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="ResponseImage" >
            <%-- illustration--%>
            <div class="thank-you-img">
                <img class="ui fluid image" src="libs/themes/asgardio/assets/images/something-went-wrong.svg">
            </div>
        </layout:component>
    </layout:main>

    <%-- footer --%>
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
        <jsp:include page="../extensions/footer.jsp"/>
    <% } else { %>
        <jsp:include page="../includes/footer.jsp"/>
    <% } %>
</body>
</html>
