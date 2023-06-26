<%--
  ~ Copyright (c) 2018-2023, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="com.google.gson.Gson" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.template.mgt.model.Template" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ taglib prefix="e" uri="https://www.owasp.org/index.php/OWASP_Java_Encoder_Project" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- Localization --%>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%-- Dynamic Prompt Template Mapper --%>
<jsp:directive.include file="includes/template-mapper.jsp"/>

<%
    String templateId = Encode.forHtmlAttribute(request.getParameter("templateId"));
    String promptId = Encode.forHtmlAttribute(request.getParameter("promptId"));

    String authAPIURL = application.getInitParameter(Constants.AUTHENTICATION_REST_ENDPOINT_URL);
    if (StringUtils.isBlank(authAPIURL)) {
        authAPIURL = IdentityManagementEndpointUtil.getBasePath(tenantDomain, "/api/identity/auth/v1.1/", true);
    } else {
        // Resolve tenant domain for the authentication API URl
        authAPIURL = AuthenticationEndpointUtil.resolveTenantDomain(authAPIURL);
    }
    if (!authAPIURL.endsWith("/")) {
        authAPIURL += "/";
    }
    authAPIURL += "context/" + promptId;
    String contextProperties = AuthContextAPIClient.getContextProperties(authAPIURL);


    Gson gson = new Gson();
    Map data = gson.fromJson(contextProperties, Map.class);
    String templatePath = templateMap.get(templateId);
%>

<%-- Data for the layout from the page --%>
<%
    String templateIdCapitalized = templateId.substring(0, 1).toUpperCase() + templateId.substring(1);
    layoutData.put("is" + templateIdCapitalized + "DynamicPrompt", true);
    layoutData.put("isDynamicPrompt", true);
    layoutData.put("containerSize", "medium");
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

    <script type="text/javascript">
        var data = JSON.parse("<%=Encode.forJavaScript(contextProperties)%>");
        var prompt_id = "<%=promptId%>";
    </script>
</head>
<body class="login-portal layout authentication-portal-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
            String productTitleFilePath = "extensions/product-title.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productTitleFilePath = customLayoutFileRelativeBasePath + "/product-title.jsp";
            }
            if (!new File(getServletContext().getRealPath(productTitleFilePath)).exists()) {
                productTitleFilePath = "includes/product-title.jsp";
            }
            %>
            <jsp:include page="<%= productTitleFilePath %>" />
        </layout:component>
        <layout:component componentName="MainSection" >
            <div class="ui segment">
                <%
                    if (templatePath != null) {
                %>
                <div>
                    <c:set var="data" value="<%=data%>" scope="request"/>
                    <c:set var="promptId" value="<%=URLEncoder.encode(promptId, StandardCharsets.UTF_8.name())%>"
                    scope="request"/>
                    <jsp:include page="<%=templatePath%>"/>
                </div>
                <% } else { %>
                <h3 class="ui header">
                        <%=Encode.forHtmlContent("Incorrect Request")%>
                </h3>

                <div class="ui visible negative message">
                    <div class="header"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "attention")%> :</div>
                    <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "no.template.found")%></p>
                </div>
                <% } %>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
            String productFooterFilePath = "extensions/product-footer.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productFooterFilePath = customLayoutFileRelativeBasePath + "/product-footer.jsp";
            }
            if (!new File(getServletContext().getRealPath(productFooterFilePath)).exists()) {
                productFooterFilePath = "includes/product-footer.jsp";
            }
            %>
            <jsp:include page="<%= productFooterFilePath %>" />
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
        function doLogin() {
            var loginForm = document.getElementById('loginForm');
            loginForm.submit();
        }
    </script>
</body>
</html>
