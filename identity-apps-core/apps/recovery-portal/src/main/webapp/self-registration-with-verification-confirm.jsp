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
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.base.MultitenantConstants" %>
<%@ page import="org.wso2.carbon.core.SameSiteCookie" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.base.IdentityRuntimeException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.SelfRegisterApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.CodeValidationRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Property" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="javax.ws.rs.HttpMethod" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="javax.servlet.http.Cookie" %>
<%@ page import="java.util.Base64" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    String AUTO_LOGIN_COOKIE_NAME = "ALOR";
    String AUTO_LOGIN_COOKIE_DOMAIN = "AutoLoginCookieDomain";
    String AUTO_LOGIN_FLOW_TYPE = "SELF_SIGNUP";
    String username = null;
    String applicationAccessUrl = "";

    String confirmationKey = request.getParameter("confirmation");
    String callback = request.getParameter("callback");
    String httpMethod = request.getMethod();
    String sp = Encode.forJava(request.getParameter("sp"));
    PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
    Boolean isAutoLoginEnable = preferenceRetrievalClient.checkAutoLoginAfterSelfRegistrationEnabled(tenantDomain);

    // Some mail providers initially sends a HEAD request to
    // check the validity of the link before redirecting users.
    if (StringUtils.equals(httpMethod, HttpMethod.HEAD)) {
        response.setStatus(response.SC_OK);
        return;
    }

    if (error) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", errorMsg);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    try {
        if (StringUtils.isNotBlank(sp)) {
            ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
            applicationAccessUrl = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain, sp);
        }
    } catch (ApplicationDataRetrievalClientException e) {
        // Ignored.
    }

    Boolean isValidCallBackURL = false;
    try {
        if (StringUtils.isNotBlank(applicationAccessUrl)) {
            // Disregard callbackURL regex validation when accessURL is configured in the application.
            isValidCallBackURL = true;
        } else if (StringUtils.isNotBlank(callback)) {
            isValidCallBackURL = preferenceRetrievalClient.checkIfSelfRegCallbackURLValid(tenantDomain, callback);
        }
    } catch (PreferenceRetrievalClientException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil
            .i18n(recoveryResourceBundle, "something.went.wrong.contact.admin"));
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    try {
        if (StringUtils.isNotBlank(callback) && !isValidCallBackURL) {
            request.setAttribute("error", true);
            request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "Callback.url.format.invalid"));
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }
    } catch (IdentityRuntimeException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", e.getMessage());
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
    }


    if (StringUtils.isBlank(confirmationKey)) {
        confirmationKey = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("confirmationKey"));
    }
    String message = "" ;

    try {
        SelfRegisterApi selfRegisterApi = new SelfRegisterApi();
        CodeValidationRequest validationRequest = new CodeValidationRequest();
        List<Property> properties = new ArrayList<>();
        Property tenantDomainProperty = new Property();
        tenantDomainProperty.setKey(MultitenantConstants.TENANT_DOMAIN);
        tenantDomainProperty.setValue(tenantDomain);
        properties.add(tenantDomainProperty);

        validationRequest.setCode(confirmationKey);
        validationRequest.setProperties(properties);

        User user = selfRegisterApi.validateCodeUserPostCall(validationRequest);
        username = user.getUsername();
        String userStoreDomain = user.getRealm();
        tenantDomain = user.getTenantDomain();
        if (isAutoLoginEnable) {
            username = userStoreDomain + "/" + username + "@" + tenantDomain;

            String cookieDomain = application.getInitParameter(AUTO_LOGIN_COOKIE_DOMAIN);
            JSONObject contentValueInJson = new JSONObject();
            contentValueInJson.put("username", username);
            contentValueInJson.put("createdTime", System.currentTimeMillis());
            contentValueInJson.put("flowType", AUTO_LOGIN_FLOW_TYPE);
            if (StringUtils.isNotBlank(cookieDomain)) {
                contentValueInJson.put("domain", cookieDomain);
            }
            String content = contentValueInJson.toString();

            JSONObject cookieValueInJson = new JSONObject();
            cookieValueInJson.put("content", content);
            String signature = Base64.getEncoder().encodeToString(IdentityUtil.signWithTenantKey(content, user.getTenantDomain()));
            cookieValueInJson.put("signature", signature);
            String cookieValue = Base64.getEncoder().encodeToString(cookieValueInJson.toString().getBytes());

            IdentityManagementEndpointUtil.setCookie(request, response, AUTO_LOGIN_COOKIE_NAME, cookieValue,
                300, SameSiteCookie.NONE, "/", cookieDomain);
            request.setAttribute("isAutoLoginEnabled", true);
        }

        request.setAttribute("callback", callback);
        request.setAttribute("confirm", "true");
        request.setAttribute("username", username);
        request.getRequestDispatcher("self-registration-complete.jsp").forward(request,response);
    } catch (Exception e) {
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }
%>

<html lang="en-US">
<head>
    <title></title>
</head>
<body>

</body>
</html>
