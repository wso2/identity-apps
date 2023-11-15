<%--
~ Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
~
~ This software is the property of WSO2 Inc. and its suppliers, if any.
~ Dissemination of any information or reproduction of any material contained
~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
~ You may not alter or remove any copyright or other notice from copies of this content."
--%>

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
<jsp:directive.include file="includes/init-url.jsp" />

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
        <layout:component componentName="ProductHeader">
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
            <div class="ui green segment mt-3 attached">
                <h3 class="ui header text-center slogan-message mt-4 mb-6" data-testid="password-recovery-notify-page-header">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "magic.link.heading" )%>
                </h3>
                <p class="portal-tagline-description">
                    <span id="sent-email">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "magic.link.content" )%>
                    </span>
                </p>

                <% if (StringUtils.isNotBlank(supportEmail)) { %>
                    <p class="ui portal-tagline-description" data-testid="password-recovery-support-message">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "if.you.still.havent.received.please.write.to")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>"
                        data-testid="magic-link-resend-support-email"
                        target="_blank">
                        <span class="orange-text-color button">
                            <%= StringEscapeUtils.escapeHtml4(supportEmail) %>
                        </span>
                        </a>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "for.assistance")%>
                    </p>
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

    <script type="text/javascript">
        $(document).ready(function () {
            if(sessionStorage.getItem("username")){
                var username = sessionStorage.getItem("username").split("@");
                username[0] = username[0].split("").map(function(letter, index) {
                    if (index === 0 || index === username[0].length - 1) {
                        return letter;
                    } else {
                        return "*";
                    }
                }).join("");
            }
        });
    </script>
</body>
</html>
