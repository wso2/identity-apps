<%--
  ~ Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.recovery.IdentityRecoveryConstants" %>
<%@ page import="org.wso2.carbon.identity.base.IdentityRuntimeException" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.LiteRegisterApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.CodeValidationRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.CodeIntrospectResponse" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Property" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));

    if (error) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", errorMsg);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    String confirmationKey = request.getParameter("confirmation");
    String callback = request.getParameter("callback");

    Boolean isValidCallBackURL = false;
    try {
        if (StringUtils.isNotBlank(callback)) {
            PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
            isValidCallBackURL = preferenceRetrievalClient.checkIfLiteRegCallbackURLValid(tenantDomain,callback);
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

    LiteRegisterApi liteRegisterApi = new LiteRegisterApi();
    try {
        List<Property> properties = new ArrayList<>();
        Property tenantDomainProperty = new Property();
        tenantDomainProperty.setKey(MultitenantConstants.TENANT_DOMAIN);
        tenantDomainProperty.setValue(tenantDomain);
        properties.add(tenantDomainProperty);

        CodeValidationRequest validationRequest = new CodeValidationRequest();
        validationRequest.setCode(confirmationKey);
        validationRequest.setProperties(properties);
        CodeIntrospectResponse codeIntrospectResponse = liteRegisterApi.introspectCode(validationRequest);

        if ((codeIntrospectResponse != null) && (codeIntrospectResponse.getUser() != null)
                && (codeIntrospectResponse.getUser().getUsername() != null)) {
            User user = codeIntrospectResponse.getUser();
            String username = user.getUsername();
            callback = callback + "?confirmation=" + confirmationKey + "&username=" + user.getUsername();
        } else {
            request.setAttribute("error", true);
            request.setAttribute("errorMsg",
                    IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Invalid.code"));
            request.setAttribute("errorCode", "18001");
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }

        request.setAttribute("callback", callback);
        request.setAttribute("confirmLiteReg", "true");
        request.getRequestDispatcher("self-registration-complete.jsp").forward(request,response);
    } catch (ApiException e) {
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }
%>

<% request.setAttribute("pageName", "lite-user-confirm"); %>

<html lang="en-US">
<head>
    <title></title>
</head>
<body data-page="<%= request.getAttribute("pageName") %>">

</body>
</html>
