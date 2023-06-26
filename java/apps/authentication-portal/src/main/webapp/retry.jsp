<%--
  ~ Copyright (c) 2014-2023, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.client.model.AuthenticationRequestWrapper" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<%@include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%!
    private static final String SERVER_AUTH_URL = "/api/identity/auth/v1.1/";
    private static final String DATA_AUTH_ERROR_URL = "data/AuthenticationError/";
    private static final String REQUEST_PARAM_ERROR_KEY = "errorKey";
%>
<%
    String stat = request.getParameter(Constants.STATUS);
    String statusMessage = request.getParameter(Constants.STATUS_MSG);
    String sp = request.getParameter("sp");
    String applicationAccessURLWithoutEncoding = null;

    String errorKey = request.getParameter(REQUEST_PARAM_ERROR_KEY);
    String statAuthParam = null;
    String statusMsgAuthParam = null;

    if (StringUtils.isNotEmpty(errorKey)) {
        AuthenticationRequestWrapper authRequest = (AuthenticationRequestWrapper) request;
        statAuthParam = authRequest.getAuthParameter(Constants.STATUS);
        statusMsgAuthParam = authRequest.getAuthParameter(Constants.STATUS_MSG);
    }

    // If auth params are available, can skip i18n mapping validations. This is to allow displaying
    // custom error messages.
    if (StringUtils.isNotEmpty(statAuthParam) || StringUtils.isNotEmpty(statusMsgAuthParam)) {
        stat = statAuthParam;
        statusMessage = statusMsgAuthParam;
        if (StringUtils.isNotEmpty(stat)) {
            stat = AuthenticationEndpointUtil.customi18n(resourceBundle, stat);
        }
        if (StringUtils.isNotEmpty(statusMessage)) {
            statusMessage = AuthenticationEndpointUtil.customi18n(resourceBundle, statusMessage);
        }
    } else if (StringUtils.isNotEmpty(stat) || StringUtils.isNotEmpty(statusMessage)) {
        String i18nErrorMapping = AuthenticationEndpointUtil.getErrorCodeToi18nMapping(stat, statusMessage);
        if (Constants.ErrorToi18nMappingConstants.INCORRECT_ERROR_MAPPING_KEY.equals(i18nErrorMapping)) {
            stat = AuthenticationEndpointUtil.i18n(resourceBundle, "authentication.error");
            statusMessage = AuthenticationEndpointUtil.i18n(resourceBundle,
                    "something.went.wrong.during.authentication");
        } else {
            if (StringUtils.isNotEmpty(stat)) {
                stat = AuthenticationEndpointUtil.customi18n(resourceBundle, stat);
            }
            if (StringUtils.isNotEmpty(statusMessage)) {
                statusMessage = AuthenticationEndpointUtil.customi18n(resourceBundle, statusMessage);
            }
        }
    }

    if (StringUtils.isEmpty(stat)) {
        stat = AuthenticationEndpointUtil.i18n(resourceBundle, "authentication.error");
    }
    if (StringUtils.isEmpty(statusMessage)) {
        statusMessage = AuthenticationEndpointUtil.i18n(resourceBundle,
                "something.went.wrong.during.authentication");
    }
    session.invalidate();

    try {
        ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
        applicationAccessURLWithoutEncoding = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain,
                sp);
        applicationAccessURLWithoutEncoding = IdentityManagementEndpointUtil.replaceUserTenantHintPlaceholder(
                                                                applicationAccessURLWithoutEncoding, userTenantDomain);
    } catch (ApplicationDataRetrievalClientException e) {
        // Ignored and fallback to login page url.
    }
%>

<%-- Data for the layout from the page --%>
<%
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
                <div class="segment-form">
                    <div class="ui visible negative message">
                        <div class="header"><%=Encode.forHtmlContent(stat)%></div>
                        <p><%=Encode.forHtmlContent(statusMessage)%></p>
                        <% if (StringUtils.isNotBlank(applicationAccessURLWithoutEncoding)) { %>
                        <i class="caret left icon primary"></i><a href="<%= IdentityManagementEndpointUtil.getURLEncodedCallback(applicationAccessURLWithoutEncoding)%>">Back to sign in</a>
                        <% } %>
                    </div>
                </div>
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
</body>
</html>
