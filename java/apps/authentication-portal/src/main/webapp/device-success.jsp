<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="extensions/branding-preferences.jsp"/>

<%@include file="includes/localize.jsp" %>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isSuperTenant", StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT));
    layoutData.put("isResponsePage", true);
    layoutData.put("isErrorResponse", request.getParameter("app_name") == null);
    layoutData.put("isSuccessResponse", request.getParameter("app_name") != null);
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
<body class="login-portal layout authentication-portal-layout" onload="loadFunc()">
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
                <% if (request.getParameter("app_name") == null) {  %>
                    <div class="ui orange attached segment mt-3">
                            <h3 class="ui header text-center slogan-message mt-3 mb-6">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "authentication.error")%>
                            </h3>
                            <p class="portal-tagline-description">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle,
                                    "something.went.wrong.during.authentication")%>
                            </p>
                            <div class="ui divider hidden"></div>
                            <div class="ui divider hidden"></div>
                    </div>
                    <div class="ui bottom attached warning message">
                        <p  class="text-left mt-0">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%>
                            <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                                <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                            </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                        </p>
                        <div class="ui divider hidden"></div>
                        <jsp:include page="includes/error-tracking-reference.jsp"/>
                        <div class="ui divider hidden"></div>
                    </div>
                <% } else { %>
                    <div class="ui green segment mt-3 attached">
                        <h3 class="ui header text-center slogan-message mt-4 mb-6">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "successful")%>
                        </h3>
                        <p class="portal-tagline-description">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "login.success.app")%>
                        <%= Encode.forHtmlAttribute(request.getParameter("app_name"))%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "close.browser")%>
                        </p>
                    </div>
                <% } %>
            <% } else { %>
                <% if (request.getParameter("app_name") == null) {  %>
                    <h2 class="ui header portal-logo-tagline slogan-message">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "authentication.error")%>
                    </h2>

                    <h4 class="ui header sub-tagline">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle,
                            "something.went.wrong.during.authentication")%>
                    </h4>

                    <p class="portal-tagline-description">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                    </p>
                    <jsp:include page="includes/error-tracking-reference.jsp"/>
                <% } else { %>
                    <h2 class="ui header portal-logo-tagline">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "successful")%>
                    </h2>
                    <p class="portal-tagline-description">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "login.success.app")%>
                        <%= Encode.forHtmlAttribute(request.getParameter("app_name"))%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "close.browser")%>
                    </p>
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
            <% if (request.getParameter("app_name") == null) {  %>
                <div class="thank-you-img">
                    <img src="libs/themes/asgardio/assets/images/something-went-wrong.svg">
                </div>
            <% } else { %>
                <div>
                    <img class="ui centered medium image"
                        src='libs/themes/asgardio/assets/images/illustrations/account-creation-success.svg'
                        alt="password-recovery-success-illustration"/>
                </div>
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

        var userCode;

        function loadFunc() {

            const urlParams = new URLSearchParams(window.location.search);
            userCode = urlParams.get('user_code');
            document.getElementById("user_code").value = userCode;
        }
    </script>
</body>
</html>
