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

<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

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
                <form action="<%=oidcLogoutURL%>" method="post" id="oidc_logout_consent_form"
                    name="oidc_logout_consent_form">
                    <div class="field">
                            <div class="text-capitalize text-typography primary">
                            <h4><%=AuthenticationEndpointUtil.i18n(resourceBundle, "logout")%></h4>
                            </div>
                            <div class="mt-5">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "are.you.sure.that.you.want.to.logout")%>
                            </div>
                        </div>
                    <div class="ui divider hidden" ></div>

                    <div class="mt-2 field">
                        <div class="mt-1 align-center">
                        <button
                            type="submit"
                            onclick="javascript: approved(); return false;"
                            class="ui primary fluid large button"
                            role="button">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "yes")%>
                        </button>
                        </div>
                        <div class="mt-1 align-center">
                            <button
                                type="submit"
                                onclick="javascript: deny(); return false;"
                                class="ui fluid large button secondary"
                                role="button">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "no")%>
                            </button>
                        </div>
                    </div>
                    <input type="hidden" name="consent" id="consent" value="deny"/>
                </form>
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
        function approved() {
            document.getElementById('consent').value = "approve";
            document.getElementById("oidc_logout_consent_form").submit();
        }

        function deny() {
            document.getElementById('consent').value = "deny";
            document.getElementById("oidc_logout_consent_form").submit();
        }
    </script>
</body>
</html>
