<%--
  ~ Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="../includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="../includes/branding-preferences.jsp"/>

<%
    String stat = AuthenticationEndpointUtil.i18n(resourceBundle, "error.502");
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
        <jsp:include page="../extensions/header.jsp"/>
    <% } else { %>
        <jsp:include page="../includes/header.jsp"/>
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

    <script type="text/javascript">
        trackEvent("authentication-portal-error", {
            "type": "error-response",
            "status": "502",
            "status-message": "<%=stat%>" !== "null" ? "<%=stat%>" : ""
        });
    </script>
</head>
<body class="login-portal layout authentication-portal-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
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
        <layout:component componentName="MainSection">
            <%
                if (!(StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT))) {
            %>
                <div class="ui orange attached segment mt-3">
                    <h3 class="ui header text-center slogan-message mt-3 mb-2">
                        <%=Encode.forHtml(stat)%>
                    </h3>
                </div>
                
                <%
                    File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                    if (trackingRefFile.exists()) {
                %>
                    <div class="ui bottom attached warning message">
                        <p class="text-left mt-0">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%> <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                                <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                            </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                        </p>

                        <div class="ui divider hidden"></div>
                        <jsp:include page="../extensions/error-tracking-reference.jsp"/>
                        <div class="ui divider hidden"></div>
                    </div>
                <% } %>
            <% } else { %>
                <h2 class="ui header portal-logo-tagline slogan-message">
                    <%=Encode.forHtml(stat)%>
                </h2>

                <%
                    File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                    if (trackingRefFile.exists()) {
                %>
                    <p class="portal-tagline-description">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%> <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                    </p>

                    <jsp:include page="../extensions/error-tracking-reference.jsp"/>            
                <% } %>

            <% } %>
        </layout:component>
        <layout:component componentName="ProductFooter">
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
        <layout:component componentName="ResponseImage">
            <%-- illustration--%>
            <div class="thank-you-img">
                <img class="ui fluid image" src="libs/themes/default/assets/images/something-went-wrong.svg">
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
