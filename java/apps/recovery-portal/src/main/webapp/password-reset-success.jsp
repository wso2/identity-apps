<%--
~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
~
~ This software is the property of WSO2 Inc. and its suppliers, if any.
~ Dissemination of any information or reproduction of any material contained
~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
~ You may not alter or remove any copyright or other notice from copies of this content."
--%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="org.wso2.carbon.utils.multitenancy.MultitenantUtils" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String accessUrl = (String) request.getAttribute("accessUrl");
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isResponsePage", true);
    layoutData.put("isSuccessResponse", true);
%>

<!doctype html>
<html lang="en-US">
<head>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
        <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
        <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>
<body class="login-portal layout">
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
            <div class="ui green segment mt-3 attached">
                <h3 class="ui header text-center slogan-message mt-4 mb-6" data-testid="password-recovery-notify-page-header">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "check.your.email")%>
                </h3>
                <p class="portal-tagline-description">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "follow.reset.password.email.instructions")%>
                    <br><br>
                    <%= IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "didnt.receive.email.not.registered.alt") + " "
                        + IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "signed.up.using.social.account.create.account.or.use.different.login")
                    %>
                    <%
                        if(StringUtils.isNotBlank(accessUrl)) {
                    %>
                        <br/><br/>
                        <i class="caret left icon primary"></i>
                        <a href="<%= Encode.forHtml(accessUrl)%>">
                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Back.to.application")%>
                        </a>
                    <% } %>
                </p>
                <p class="ui portal-tagline-description" data-testid="password-recovery-support-message">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "for.further.assistance.write.to")%>
                    <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>"
                    data-testid="password-recovery-resend-support-email"
                    target="_blank">
                    <span class="orange-text-color button">
                        <%= StringEscapeUtils.escapeHtml4(supportEmail) %>
                    </span>
                    </a>
                    .
                </p>
            </div>
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
