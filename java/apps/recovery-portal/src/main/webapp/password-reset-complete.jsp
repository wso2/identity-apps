<%--
  ~ Copyright (c) 2016-2023, WSO2 LLC. (https://www.wso2.com).
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

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.http.client.utils.URIBuilder" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.core.SameSiteCookie" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.NotificationApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Error" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Property" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.ResetPasswordRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URISyntaxException" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="javax.servlet.http.Cookie" %>
<%@ page import="java.util.Base64" %>
<%@ page import="org.wso2.carbon.core.util.SignatureUtil" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="java.net.URI" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String ERROR_MESSAGE = "errorMsg";
    String ERROR_CODE = "errorCode";
    String PASSWORD_RESET_PAGE = "password-reset.jsp";
    String AUTO_LOGIN_COOKIE_NAME = "ALOR";
    String AUTO_LOGIN_FLOW_TYPE = "RECOVERY";
    String AUTO_LOGIN_COOKIE_DOMAIN = "AutoLoginCookieDomain";
    String ASGARDEO_USERSTORE = "ASGARDEO-USER";
    String CUSTOMER_USERSTORE = "DEFAULT";
    String USERSTORE_DOMAIN = "userstoredomain";
    String RECOVERY_TYPE_INVITE = "invite";
    String CONSOLE_APP_NAME = "Console";
    String MY_ACCOUNT_APP_NAME = "My Account";
    String passwordHistoryErrorCode = "22001";
    String passwordPatternErrorCode = "20035";
    String confirmationKey =
            IdentityManagementEndpointUtil.getStringValue(request.getSession().getAttribute("confirmationKey"));
    String newPassword = request.getParameter("reset-password");
    String callback = request.getParameter("callback");
    String spId = request.getParameter("spId");
    String userStoreDomain = request.getParameter(USERSTORE_DOMAIN);
    String type = request.getParameter("type");
    String username = null;
    String tenantAwareUsername = null;
    String applicationName = null;
    PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
    Boolean isAutoLoginEnable = preferenceRetrievalClient.checkAutoLoginAfterPasswordRecoveryEnabled(tenantDomain);

    if (StringUtils.isNotBlank(newPassword)) {
        NotificationApi notificationApi = new NotificationApi();
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        List<Property> properties = new ArrayList<Property>();
        if (StringUtils.isNotBlank(callback)) {
            Property property = new Property();
            property.setKey("callback");
            property.setValue(URLEncoder.encode(callback, "UTF-8"));
            properties.add(property);
        }

        Property tenantProperty = new Property();
        tenantProperty.setKey(IdentityManagementEndpointConstants.TENANT_DOMAIN);
        if (tenantDomain == null) {
            tenantDomain = IdentityManagementEndpointConstants.SUPER_TENANT;
        }
        tenantProperty.setValue(URLEncoder.encode(tenantDomain, "UTF-8"));
        properties.add(tenantProperty);

        resetPasswordRequest.setKey(confirmationKey);
        resetPasswordRequest.setPassword(newPassword);
        resetPasswordRequest.setProperties(properties);

        try {
            User user = notificationApi.setUserPasswordPost(resetPasswordRequest);
            username = user.getUsername();
            userStoreDomain = user.getRealm();

            if (isAutoLoginEnable) {
                if (StringUtils.isNotBlank(userStoreDomain)) {
                    tenantAwareUsername = userStoreDomain + "/" + username + "@" + tenantDomain;
                }

                String cookieDomain = application.getInitParameter(AUTO_LOGIN_COOKIE_DOMAIN);
                JSONObject contentValueInJson = new JSONObject();
                contentValueInJson.put("username", tenantAwareUsername);
                contentValueInJson.put("createdTime", System.currentTimeMillis());
                contentValueInJson.put("flowType", AUTO_LOGIN_FLOW_TYPE);
                if (StringUtils.isNotBlank(cookieDomain)) {
                    contentValueInJson.put("domain", cookieDomain);
                }
                String content = contentValueInJson.toString();

                JSONObject cookieValueInJson = new JSONObject();
                cookieValueInJson.put("content", content);
                String signature = Base64.getEncoder().encodeToString(SignatureUtil.doSignature(content));
                cookieValueInJson.put("signature", signature);
                String cookieValue = Base64.getEncoder().encodeToString(cookieValueInJson.toString().getBytes());

                IdentityManagementEndpointUtil.setCookie(request, response, AUTO_LOGIN_COOKIE_NAME, cookieValue,
                    300, SameSiteCookie.NONE, "/", cookieDomain);
            }
        } catch (ApiException e) {

            Error error = IdentityManagementEndpointUtil.buildError(e);
            IdentityManagementEndpointUtil.addErrorInformation(request, error);
            if (error != null) {
                request.setAttribute(ERROR_MESSAGE, error.getDescription());
                request.setAttribute(ERROR_CODE, error.getCode());
                if (passwordHistoryErrorCode.equals(error.getCode()) ||
                        passwordPatternErrorCode.equals(error.getCode())) {
                    String i18Resource = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "error." + error.getCode());
                    if (!i18Resource.equals(error.getCode())) {
                        request.setAttribute(ERROR_MESSAGE, i18Resource);
                    }
                    request.setAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN, tenantDomain);
                    request.setAttribute(IdentityManagementEndpointConstants.CALLBACK, callback);
                    request.setAttribute(USERSTORE_DOMAIN, userStoreDomain);
                    request.getRequestDispatcher(PASSWORD_RESET_PAGE).forward(request, response);
                    return;
                }
            }
            if (!StringUtils.isBlank(username)) {
                request.setAttribute("username", username);
            }
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }

    } else {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "Password.cannot.be.empty"));
        request.setAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN, tenantDomain);
        request.setAttribute(IdentityManagementEndpointConstants.CALLBACK, callback);
        request.setAttribute(USERSTORE_DOMAIN, userStoreDomain);
        request.getRequestDispatcher("password-reset.jsp").forward(request, response);
        return;
    }

    if (StringUtils.isNotBlank(callback) &&
        StringUtils.isNotBlank(userStoreDomain) &&
        userStoreDomain.equals(ASGARDEO_USERSTORE)) {
        if (callback.contains(CONSOLE_APP_NAME.toLowerCase())) {
            applicationName = CONSOLE_APP_NAME;
        } else if (callback.contains(MY_ACCOUNT_APP_NAME.toLowerCase().replaceAll("\\s+", ""))) {
            applicationName = MY_ACCOUNT_APP_NAME;
        }
    } else {
            if (StringUtils.isNotBlank(spId)) {
            try {
                ApplicationDataRetrievalClient applicationDataRetrieval = new ApplicationDataRetrievalClient();
                if (spId.equals("My_Account")) {
                    applicationName = MY_ACCOUNT_APP_NAME;
                } else {
                    applicationName = applicationDataRetrieval.getApplicationName(tenantDomain,spId);
                }
            } catch (Exception e) {
                // Ignored and fallback to my account page url.
            }
        }
    }

    // Retrieve application access url to redirect user back to the application.
    String applicationAccessURLWithoutEncoding = null;
    if (StringUtils.isNotBlank(applicationName)) {
        try {
            ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
            applicationAccessURLWithoutEncoding = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain,
                    applicationName);
            applicationAccessURLWithoutEncoding = IdentityManagementEndpointUtil.replaceUserTenantHintPlaceholder(
                    applicationAccessURLWithoutEncoding, userTenantDomain);
        } catch (ApplicationDataRetrievalClientException e) {
            // Ignored and fallback to login page url.
        }
    }

    if ((StringUtils.isNotBlank(userStoreDomain) && userStoreDomain.equals(CUSTOMER_USERSTORE)
        && StringUtils.isNotBlank(callback)
        && callback.contains(MY_ACCOUNT_APP_NAME.toLowerCase().replaceAll("\\s+", "")))) {

	    applicationAccessURLWithoutEncoding = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL),
                    tenantDomain);
	}

    session.invalidate();
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isResponsePage", true);
    layoutData.put("isSuccessResponse", true);
%>

<!doctype html>
<html lang="en-US">
<head>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>
<body class="login-portal layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader" >
            <%-- product-title --%>
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
                <jsp:include page="extensions/product-title.jsp"/>
            <%  } else { %>
                <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="MainSection" >
            <div class="ui green segment mt-3 attached">
                <h3 class="ui header text-center slogan-message mt-4 mb-6" data-testid="password-reset-complete-page-header">
                    <% if (RECOVERY_TYPE_INVITE.equalsIgnoreCase(type)) { %>
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Password.set.success")%>
                    <% } else { %>
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Password.reset.Success")%>
                    <% } %>
                </h3>
                <p class="portal-tagline-description">
                    <% if (RECOVERY_TYPE_INVITE.equalsIgnoreCase(type)) { %>
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "successfully.set.a.password")%>.
                    <% } else { %>
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "successfully.set.a.password.you.can.sign.in.now")%>.
                    <% } %>
                    <br/><br/>
                    <% if (StringUtils.isNotBlank(applicationAccessURLWithoutEncoding) &&
                            !RECOVERY_TYPE_INVITE.equalsIgnoreCase(type)) { %>
                        <i class="caret left icon primary"></i>
                        <% if (StringUtils.isNotBlank(userStoreDomain) && userStoreDomain.equals(CUSTOMER_USERSTORE)) {
                            if (StringUtils.isNotBlank(applicationName) && applicationName.equals(MY_ACCOUNT_APP_NAME)) {
                        %>
                            <a href="<%=IdentityManagementEndpointUtil.getURLEncodedCallback(
                                                    applicationAccessURLWithoutEncoding)%>">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Go.to.MyAccount")%>
                            </a>
                        <%
                            } else {
                        %>
                            <a href="<%=IdentityManagementEndpointUtil.getURLEncodedCallback(
                                                applicationAccessURLWithoutEncoding)%>">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Back.to.application")%>
                            </a>
                        <%
                            }
                        %>
                        <% } else { %>
                            <a href="<%=IdentityManagementEndpointUtil.getURLEncodedCallback(
                                    applicationAccessURLWithoutEncoding)%>">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Back.to.application")%>
                            </a>
                        <% } %>
                    <% } %>
                </p>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter" >
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
