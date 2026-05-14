<%--
  ~ Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>
<jsp:directive.include file="includes/branding-preferences.jsp"/>


<!doctype html>
<html lang="en-US">
<head>
    <%-- header include --%>
    <%
        java.io.File headerFile = new java.io.File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>

<body class="login-portal layout authentication-portal-layout" data-page="<%= request.getAttribute("pageName") %>">

<layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>">

    <layout:component componentName="ProductHeader">
        <%-- product-title include --%>
        <%
            java.io.File productTitleFile = new java.io.File(getServletContext().getRealPath("extensions/product-title.jsp"));
            if (productTitleFile.exists()) {
        %>
        <jsp:include page="extensions/product-title.jsp"/>
        <% } else { %>
        <jsp:include page="includes/product-title.jsp"/>
        <% } %>
    </layout:component>

    <layout:component componentName="MainSection">
        <div class="ui segment">
            <h2 class="ui header ">
                <%= AuthenticationEndpointUtil.i18n(resourceBundle, "Something went wrong!") %>
            </h2>

            <div style="margin-top: 30px; text-align: center;">
                <button id="backBtn" class="ui button primary" style="font-size: 1.1em; padding: 10px 24px;">
                    <%= AuthenticationEndpointUtil.i18n(resourceBundle, "Back to Connection") %>
                </button>
            </div>
        </div>
    </layout:component>

    <layout:component componentName="ProductFooter">
        <%-- product-footer include --%>
        <%
            java.io.File productFooterFile = new java.io.File(getServletContext().getRealPath("extensions/product-footer.jsp"));
            if (productFooterFile.exists()) {
        %>
        <jsp:include page="extensions/product-footer.jsp"/>
        <% } else { %>
        <jsp:include page="includes/product-footer.jsp"/>
        <% } %>
    </layout:component>

    <layout:dynamicComponent filePathStoringVariableName="pathOfDynamicComponent">
        <jsp:include page="${pathOfDynamicComponent}"/>
    </layout:dynamicComponent>
</layout:main>

<%-- footer include --%>
<%
    java.io.File footerFile = new java.io.File(getServletContext().getRealPath("extensions/footer.jsp"));
    if (footerFile.exists()) {
%>
<jsp:include page="extensions/footer.jsp"/>
<% } else { %>
<jsp:include page="includes/footer.jsp"/>
<% } %>

<script type="text/javascript">
    try {
        // Build the connection URL for Back button
        const urlParams = new URLSearchParams(window.location.search);
        const idpId = urlParams.get('idpId');
        const baseUrl = (function() {
            var consoleUrlAttr = '<%= request.getAttribute("consoleUrl") != null ? Encode.forJavaScript(String.valueOf(request.getAttribute("consoleUrl"))) : "" %>';
            if (consoleUrlAttr && consoleUrlAttr !== "") return consoleUrlAttr;

            var tenanted = '<%= request.getAttribute("tenantedConsoleUrl") != null ? Encode.forJavaScript(String.valueOf(request.getAttribute("tenantedConsoleUrl"))) : "" %>';
            if (tenanted && tenanted !== "") return tenanted;

            var serverUrl = '<%= request.getAttribute("serverUrl") != null ? Encode.forJavaScript(String.valueOf(request.getAttribute("serverUrl"))) : "" %>';
            var tenantPrefix = '<%= request.getAttribute("tenantPrefix") != null ? Encode.forJavaScript(String.valueOf(request.getAttribute("tenantPrefix"))) : "" %>';
            if (serverUrl && tenantPrefix) return serverUrl + tenantPrefix;

            return (window.location && window.location.origin
                ? window.location.origin
                : (window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "")))
                + "/t/carbon.super";
        })();

        var connectionUrl = baseUrl + "/console/connections/" + encodeURIComponent(idpId || "");

        // Back button redirect
        var backBtn = document.getElementById("backBtn");
        if (backBtn) {
            backBtn.onclick = function () {
                window.location.href = connectionUrl;
            };
        }
    } catch (e) {
        console.error("Failed to build connection URL for back button:", e);
    }
</script>
</body>
</html>
