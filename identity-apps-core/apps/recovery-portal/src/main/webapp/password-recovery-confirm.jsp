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
<%@ page import="org.wso2.carbon.base.MultitenantConstants" %>
<%@ page import="org.wso2.carbon.identity.base.IdentityRuntimeException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.NotificationApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.CodeValidationRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Property" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="org.wso2.carbon.identity.recovery.IdentityRecoveryConstants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="javax.ws.rs.HttpMethod" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%

    String httpMethod = request.getMethod();
    // Some mail providers initially sends a HEAD request to
    // check the validity of the link before redirecting users.
    if (StringUtils.equals(httpMethod, HttpMethod.HEAD)) {
        response.setStatus(response.SC_OK);
        return;
    }

    String confirmationKey = request.getParameter("confirmation");
    String callback = request.getParameter("callback");
    if (StringUtils.isBlank(callback)) {
        callback = request.getParameter("redirect_uri");
    }

    boolean passwordExpired = Boolean.parseBoolean(request.getParameter("passwordExpired"));

    Boolean isValidCallBackURL = false;
    try {
        if (StringUtils.isNotBlank(callback)) {
            PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
            isValidCallBackURL = preferenceRetrievalClient.checkIfRecoveryCallbackURLValid(tenantDomain,callback);
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

    String username = request.getParameter("username");

    NotificationApi notificationApi = new NotificationApi();
    try {
        List<Property> properties = new ArrayList<>();
        Property tenantDomainProperty = new Property();
        tenantDomainProperty.setKey(MultitenantConstants.TENANT_DOMAIN);
        tenantDomainProperty.setValue(tenantDomain);
        properties.add(tenantDomainProperty);

        CodeValidationRequest validationRequest = new CodeValidationRequest();
        validationRequest.setCode(confirmationKey);
        validationRequest.setProperties(properties);
        notificationApi.validateCodePostCall(validationRequest);

    } catch (ApiException e) {
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    if (StringUtils.isBlank(tenantDomain)) {
        tenantDomain = IdentityManagementEndpointConstants.SUPER_TENANT;
    }
    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
    }

    if (StringUtils.isNotBlank(confirmationKey)) {
        request.getSession().setAttribute("confirmationKey", confirmationKey);
        request.setAttribute("callback", callback);
        request.setAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN, tenantDomain);
        request.setAttribute("passwordExpired", passwordExpired);
        request.getRequestDispatcher("passwordreset.do").forward(request, response);
    } else {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg",
                IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Cannot.process.email.confirmation.code.is.missing"));
        request.setAttribute("errorCode", "18001");
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }
%>

