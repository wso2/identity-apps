<%--
  ~ Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.client.model.AuthenticationRequestWrapper" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityCoreConstants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Include localization --%>
<%@ include file="../includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="../includes/branding-preferences.jsp"/>

<%
    String errorMessage = request.getParameter("ERROR_MSG");
    String errorDescription = request.getParameter("ERROR_DESC");
    String spId = request.getParameter("SP_ID");
    String registrationPortalURL = request.getParameter("REG_PORTAL_URL") + "?spId=" + request.getParameter("SP_ID");
    String errorCode = request.getParameter("errorCode");

    if (StringUtils.isNotEmpty(errorMessage) || StringUtils.isNotEmpty(errorDescription)) {
        if (StringUtils.isNotEmpty(errorMessage)) {
            errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, errorMessage);
        }
        if (StringUtils.isNotEmpty(errorDescription)) {
            errorDescription = AuthenticationEndpointUtil.i18n(resourceBundle, errorDescription);
        }
    }

    if (StringUtils.isEmpty(errorMessage)) {
        errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "sign.up.error.unexpected.message");
    }

    if (StringUtils.isEmpty(errorDescription)) {
        errorDescription = AuthenticationEndpointUtil.i18n(resourceBundle,
            "sign.up.error.unexpected.description");
    }
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
            <div class="ui orange attached segment mt-3">
                <h3 class="ui header text-center slogan-message mt-3 mb-6">
                    <%= errorMessage %>
                </h3>
                <p class="portal-tagline-description">
                    <%= errorDescription %>
                </p>
                <button class="ui primary basic button"
                    onclick="location.href='<%= IdentityManagementEndpointUtil.getURLEncodedCallback(registrationPortalURL) %>';">
                    <%= i18n(resourceBundle, customText, "sign.up.try.again.button") %>
                </button>
                <div class="ui divider hidden"></div>
            </div>
            <div class="ui bottom attached warning message">
                <p class="text-left mt-0">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "need.help.contact.us")%> <br />
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
</body>
</html>
