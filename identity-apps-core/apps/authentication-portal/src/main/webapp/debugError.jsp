<%--
  ~ Copyright (c) 2025, WSO2 LLC.
  ~ Licensed under the Apache License, Version 2.0.
  ~ See the License for the specific language governing permissions and limitations under the License.
--%>

<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
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
                    Back to Connection
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
            var consoleUrlAttr = '<%= request.getAttribute("consoleUrl") != null ? request.getAttribute("consoleUrl") : "" %>';
            if (consoleUrlAttr && consoleUrlAttr !== "") return consoleUrlAttr;

            var tenanted = '<%= request.getAttribute("tenantedConsoleUrl") != null ? request.getAttribute("tenantedConsoleUrl") : "" %>';
            if (tenanted && tenanted !== "") return tenanted;

            var serverUrl = '<%= request.getAttribute("serverUrl") != null ? request.getAttribute("serverUrl") : "" %>';
            var tenantPrefix = '<%= request.getAttribute("tenantPrefix") != null ? request.getAttribute("tenantPrefix") : "" %>';
            if (serverUrl && tenantPrefix) return serverUrl + tenantPrefix;

            return (window.location && window.location.origin
                ? window.location.origin
                : (window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "")))
                + "/t/carbon.super";
        })();

        var connectionUrl = baseUrl + "/console/connections/" + encodeURIComponent(idpId || "");

        // Back button redirect
        document.getElementById("backBtn").onclick = function() {
            window.location.href = connectionUrl;
        };

        // Close popup if applicable
        window.close();

    } catch (e) {
        console.error("Failed to parse or display JSON result:", e);
        document.getElementById("json").textContent = "Error displaying JSON. See browser console for details.";
    }
</script>
</body>
</html>
