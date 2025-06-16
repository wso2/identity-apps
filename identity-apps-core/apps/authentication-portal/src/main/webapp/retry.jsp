<%--
  ~ Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%!
    private static final String SERVER_AUTH_URL = "/api/identity/auth/v1.1/";
    private static final String DATA_AUTH_ERROR_URL = "data/AuthenticationError/";
    private static final String REQUEST_PARAM_ERROR_KEY = "errorKey";
    private static final String APP_DISABLED_I18N_ERROR_KEY = "authentication.flow.app.disabled";

    /*
     * This error code should be defined in a public repo along with related logic
     * to handle the error.
     * Tracked with https://github.com/wso2/product-is/issues/16932
     */
    private static final String UNVERIFIED_EMAIL_IN_MSFT_ERROR_CODE = "17101";
%>
<%
    String stat = request.getParameter(Constants.STATUS);
    String statusMessage = request.getParameter(Constants.STATUS_MSG);
    String sp = Encode.forJava(request.getParameter("sp"));
    String errorCode = request.getParameter("errorCode");
    String remainingAttempts = request.getParameter("remainingAttempts");
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

<% request.setAttribute("pageName", "retry"); %>

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
<body class="login-portal layout authentication-portal-layout" data-response-type="error" data-page="<%= request.getAttribute("pageName") %>">
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
                <%
                    if (IdentityCoreConstants.LOGIN_FAILED_GENERIC_ERROR_CODE.equals(errorCode)) {
                %>
                    <h3 class="ui header text-center slogan-message mt-3 mb-6">
                        <%=i18n(resourceBundle, customText, "unable.to.proceed")%>
                    </h3>

                    <p class="portal-tagline-description">
                        <%=i18n(resourceBundle, customText, "login.failed.generic")%>
                    </p>
                <%
                    } else if (StringUtils.equals(errorCode, IdentityCoreConstants.USER_ACCOUNT_LOCKED_ERROR_CODE) &&
                            StringUtils.isBlank(remainingAttempts)) {
                %>
                    <h3 class="ui header text-center slogan-message mt-3 mb-6">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unable.to.proceed")%>
                    </h3>

                    <p class="portal-tagline-description">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "your.account.is.locked.write.us.to.know.more.at")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "for.assistance")%>
                    </p>
                <%
                    } else if (IdentityCoreConstants.USER_ACCOUNT_NOT_CONFIRMED_ERROR_CODE.equals(errorCode)) {
                %>
                    <h3 class="ui header text-center slogan-message mt-3 mb-6">
                        <%=i18n(resourceBundle, customText, "unable.to.proceed")%>
                    </h3>

                    <p class="portal-tagline-description">
                        <%=i18n(resourceBundle, customText, "account.confirmation.pending")%>
                    </p>
                <%
                    } else if (IdentityCoreConstants.USER_ACCOUNT_DISABLED_ERROR_CODE.equals(errorCode)) {
                %>
                    <h3 class="ui header text-center slogan-message mt-3 mb-6">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unable.to.proceed")%>
                    </h3>

                    <p class="portal-tagline-description">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "your.account.is.disabled.write.us.to.know.more.at")%>
                        <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                            <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                        </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "for.assistance")%>
                    </p>

                    <%
                        File trackingRefFile = new File(getServletContext().getRealPath("extensions/error-tracking-reference.jsp"));
                        if (trackingRefFile.exists()) {
                    %>
                        <jsp:include page="extensions/error-tracking-reference.jsp"/>
                    <% } %>


                    <% } else if (UNVERIFIED_EMAIL_IN_MSFT_ERROR_CODE.equals(errorCode)) { %>
                        <h2 class="ui header portal-logo-tagline slogan-message">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "email.not.verified")%>
                        </h2>
                        <p class="portal-tagline-description mt-1 mb-5">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "your.microsoft.account.email.is.not.verified.verify.and.try.again")%>
                        </p>
                        <jsp:include page="includes/error-tracking-reference.jsp"/>
                        </br>
                        <% if (StringUtils.isNotBlank(applicationAccessURLWithoutEncoding)) { %>
                            <a class="clickable-link"
                               href="<%= IdentityManagementEndpointUtil.getURLEncodedCallback(applicationAccessURLWithoutEncoding) %>">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "back.to.sign.in")%>
                            </a>
                        <% } %>
                <% } else { %>
                    <h3 class="ui header text-center slogan-message mt-3 mb-6">
                        <%=stat%>
                    </h3>

                    <p class="portal-tagline-description">
                        <%=statusMessage%>
                    </p>

                    <% if (
                           StringUtils.isNotBlank(applicationAccessURLWithoutEncoding)
                           && !StringUtils.equals(statAuthParam, APP_DISABLED_I18N_ERROR_KEY)
                       ) { %>
                        <button class="ui primary basic button"
                            onclick="location.href='<%= IdentityManagementEndpointUtil.getURLEncodedCallback(applicationAccessURLWithoutEncoding) %>';">
                            <%= i18n(resourceBundle, customText, "login.button") %>
                        </button>
                    <% } %>
                <% } %>
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
