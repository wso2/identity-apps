<%--
  ~ Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<% request.setAttribute("pageName","device-success"); %>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isResponsePage", true);
    layoutData.put("isErrorResponse", request.getParameter("app_name") == null);
    layoutData.put("isSuccessResponse", request.getParameter("app_name") != null);
    layoutData.put("isDeviceSuccessPage", request.getParameter("app_name") != null);
%>

<%
    String responseType = "error";
    if (request.getParameter("app_name") != null){
        responseType = "success";
    }
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
<body class="login-portal layout authentication-portal-layout" onload="loadFunc()" data-response-type="<%= responseType %>" data-page="<%= request.getAttribute("pageName") %>">
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
                </div>
                <div class="ui bottom attached warning message">
                    <p  class="text-left mt-0">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a>
                    <%
                        if (config.getServletContext().getResource("extensions/error-tracking-reference.jsp") != null) {
                    %>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "with.tracking.reference.below")%>
                        </p>
                        <div class="ui divider hidden"></div>
                        <jsp:include page="extensions/error-tracking-reference.jsp"/>
                    <%  } else { %>
                        </p>
                    <%  } %>
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

        var userCode;

        function loadFunc() {

            const urlParams = new URLSearchParams(window.location.search);
            userCode = urlParams.get('user_code');
            document.getElementById("user_code").value = userCode;
        }
    </script>
</body>
</html>
