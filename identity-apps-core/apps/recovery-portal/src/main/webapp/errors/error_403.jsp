<%--
  ~ Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<%@ include file="../includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="../includes/branding-preferences.jsp"/>

<% request.setAttribute("pageName","error-403"); %>

<%
    String status = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "error.403");
%>

<%-- Data for the layout from the page --%>
<%
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
</head>
<body class="login-portal layout authentication-portal-layout" data-response-type="error" data-page="<%= request.getAttribute("pageName") %>">
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
        <layout:component componentName="MainSection" >
            <div class="ui orange attached segment mt-3">
                <h3 class="ui header text-center slogan-message mt-3 mb-2" data-testid="recovery-portal-error-403-page-header">
                    <%=Encode.forHtml(status)%>
                </h3>
            </div>
            <div class="ui bottom attached warning message">
                <p class="text-left mt-0">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "need.help.contact.us")%>
                    <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                    <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                </a>
                <%
                    if (config.getServletContext().getResource("extensions/error-tracking-reference.jsp") != null) {
                %>
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "with.tracking.reference.below")%>
                    </p>
                    <div class="ui divider hidden"></div>
                    <jsp:include page="../extensions/error-tracking-reference.jsp"/>
                <%
                    } else {
                %>
                    </p>
                <%
                    }
                %>
                <div class="ui divider hidden"></div>
            </div>
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
        <layout:dynamicComponent filePathStoringVariableName="pathOfDynamicComponent">
            <jsp:include page="${pathOfDynamicComponent}" />
        </layout:dynamicComponent>
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
