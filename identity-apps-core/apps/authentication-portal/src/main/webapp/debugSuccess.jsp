<%--
  ~ Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~  http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    request.setAttribute("pageName", "authentication-success");
%>

<!doctype html>
<html lang="en-US">
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
<body class="login-portal layout authentication-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
<layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>">
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
            <h2 class="ui header"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "Authentication successful")%></h2>
            <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "You will be redirected shortly")%>...</p>
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
    <layout:component componentName="DynamicSection">
        <jsp:include page="${pathOfDynamicComponent}"/>
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

<script type='text/javascript'>
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get('state');
        const idpId = urlParams.get('idpId');

        const baseUrl = (function() {
            var consoleUrlAttr = '<%= request.getAttribute("consoleUrl") != null ? request.getAttribute("consoleUrl") : "" %>';
            if (consoleUrlAttr && consoleUrlAttr !== "") return consoleUrlAttr;
            var tenanted = '<%= request.getAttribute("tenantedConsoleUrl") != null ? request.getAttribute("tenantedConsoleUrl") : "" %>';
            if (tenanted && tenanted !== "") return tenanted;
            var serverUrl = '<%= request.getAttribute("serverUrl") != null ? request.getAttribute("serverUrl") : "" %>';
            var tenantPrefix = '<%= request.getAttribute("tenantPrefix") != null ? request.getAttribute("tenantPrefix") : "" %>';
            if (serverUrl && tenantPrefix) return serverUrl + tenantPrefix;
            return (window.location && window.location.origin ? window.location.origin : (window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : ""))) + "/t/carbon.super";
        })();

        var finalUrl = baseUrl + "/console/connections/" + idpId + "/debug-results#status=successful";

        setTimeout(function () {
            window.location.href = finalUrl;
        }, 5000);

        window.close();
    } catch (e) {
        console.error("Failed to redirect:", e);
    }
</script>

</body>
</html>
