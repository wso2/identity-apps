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

<%@ page import="org.apache.commons.collections.map.HashedMap" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.base.IdentityRuntimeException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.UsernameRecoveryApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.PasswordRecoveryApiV1" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Claim" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.UserClaim" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="org.wso2.carbon.identity.recovery.IdentityRecoveryConstants" %>
<%@ page import="org.wso2.carbon.user.core.util.UserCoreUtil" %>
<%@ page import="org.wso2.carbon.utils.multitenancy.MultitenantUtils" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Property" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.passwordrecovery.v1.*" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    boolean isPasswordRecoveryEmailConfirmation =
            Boolean.parseBoolean(request.getParameter("isPasswordRecoveryEmailConfirmation"));
    boolean isUsernameRecovery = Boolean.parseBoolean(request.getParameter("isUsernameRecovery"));
    boolean isPasswordRecoveryWithClaimsNotify =
            Boolean.parseBoolean(request.getParameter("isPasswordRecoveryWithClaimsNotify"));

    // Common parameters for password recovery with email and self registration with email
    String username = request.getParameter("username");
    String sessionDataKey = request.getParameter("sessionDataKey");
    String confirmationKey = request.getParameter("confirmationKey");
    String callback = request.getParameter("callback");
    String userTenantHint = request.getParameter("t");

    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
    }

    if (StringUtils.isNotBlank(userTenantHint)) {
        username = MultitenantUtils.getTenantAwareUsername(username);
        username = UserCoreUtil.addTenantDomainToEntry(username, userTenantHint);
    }

    // Password recovery parameters
    String recoveryOption = request.getParameter("recoveryOption");

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

    if (isUsernameRecovery) {
        // Username Recovery Scenario
        if (StringUtils.isBlank(tenantDomain)) {
            tenantDomain = IdentityManagementEndpointConstants.SUPER_TENANT;
        }

        List<Claim> claims;
        UsernameRecoveryApi usernameRecoveryApi = new UsernameRecoveryApi();
        try {
            claims = usernameRecoveryApi.getClaimsForUsernameRecovery(tenantDomain, true);
        } catch (ApiException e) {
            IdentityManagementEndpointUtil.addErrorInformation(request, e);
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }

        List<UserClaim> claimDTOList = new ArrayList<UserClaim>();

        for (Claim claimDTO : claims) {
            if (StringUtils.isNotBlank(request.getParameter(claimDTO.getUri()))) {
                UserClaim userClaim = new UserClaim();
                userClaim.setUri(claimDTO.getUri());
                userClaim.setValue(request.getParameter(claimDTO.getUri()).trim());
                claimDTOList.add(userClaim);
            }
        }

        try {
            Map<String, String> requestHeaders = new HashedMap();
            if (request.getParameter("g-recaptcha-response") != null) {
                requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
            }

            usernameRecoveryApi.recoverUsernamePost(claimDTOList, tenantDomain, null, requestHeaders);
            request.setAttribute("callback", callback);
            request.setAttribute("tenantDomain", tenantDomain);
            request.getRequestDispatcher("username-recovery-complete.jsp").forward(request, response);
        } catch (ApiException e) {
            if (e.getCode() == 204) {
                request.setAttribute("error", true);
                request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "No.valid.user.found"));
                request.getRequestDispatcher("error.jsp").forward(request, response);
                return;
            }

            IdentityManagementEndpointUtil.addErrorInformation(request, e);
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }

    } else if (isPasswordRecoveryWithClaimsNotify) {
        // Let user recover password by email or security questions.
        String recoveryCode = request.getParameter("recoveryCode");
        String notificationChannel = "";

        PasswordRecoveryApiV1 passwordRecoveryApiV1 = new PasswordRecoveryApiV1();
        if (recoveryOption.equals("SECURITY_QUESTIONS")) {
            username = IdentityManagementEndpointUtil.getFullQualifiedUsername(username, tenantDomain, null);
            request.setAttribute("callback", callback);
            request.setAttribute("sessionDataKey", sessionDataKey);
            request.setAttribute("username", username);
            session.setAttribute("username", username);
            IdentityManagementEndpointUtil.addReCaptchaHeaders(request, passwordRecoveryApiV1.
                    getApiClient().getResponseHeaders());
            request.getRequestDispatcher("challenge-question-request.jsp?username=" + username).forward(request,
                    response);
            return;
        } else {
            List<Property> properties = new ArrayList<>();
            Property callbackProperty = new Property();
            callbackProperty.setKey("callback");
            callbackProperty.setValue(URLEncoder.encode(callback, "UTF-8"));
            properties.add(callbackProperty);

            Property sessionDataKeyProperty = new Property();
            sessionDataKeyProperty.setKey("sessionDataKey");
            sessionDataKeyProperty.setValue(sessionDataKey);
            properties.add(sessionDataKeyProperty);

            RecoveryRequest recoveryRequest = new RecoveryRequest();
            recoveryRequest.setProperties(properties);
            recoveryRequest.setChannelId(recoveryOption);
            recoveryRequest.setRecoveryCode(recoveryCode);
            try {
                Map<String, String> requestHeaders = new HashedMap();
                RecoveryResponse recoveryResponse = passwordRecoveryApiV1.recoverPassword(recoveryRequest,
                        tenantDomain, requestHeaders);
                notificationChannel = recoveryResponse.getNotificationChannel();
                request.setAttribute("callback", callback);
                if (notificationChannel.equals("EMAIL")) {
                    request.getRequestDispatcher("password-recovery-with-claims-notify.jsp").forward(request,
                            response);
                    return;
                } else {
                    request.setAttribute("error", true);
                    request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                            "Unknown.password.recovery.option"));
                    request.getRequestDispatcher("error.jsp").forward(request, response);
                }
            }
            catch (ApiException e) {
                IdentityManagementEndpointUtil.addErrorInformation(request, e);
                request.getRequestDispatcher("error.jsp").forward(request, response);
                return;
            }
        }
    } else {
        request.setAttribute("sessionDataKey", sessionDataKey);

        if (isPasswordRecoveryEmailConfirmation) {
            session.setAttribute("username", username);
            session.setAttribute("confirmationKey", confirmationKey);
            request.setAttribute("callback", callback);
            request.getRequestDispatcher("password-reset.jsp").forward(request, response);
        } else {
            request.setAttribute("username", username);
            session.setAttribute("username", username);

            if (IdentityManagementEndpointConstants.PasswordRecoveryOptions.EMAIL.equals(recoveryOption)) {
                request.setAttribute("callback", callback);
                request.getRequestDispatcher("password-recovery-notify.jsp").forward(request, response);
            } else if (IdentityManagementEndpointConstants.PasswordRecoveryOptions.SECURITY_QUESTIONS
                    .equals(recoveryOption)) {
                request.setAttribute("callback", callback);
                request.getRequestDispatcher("challenge-question-request.jsp?username=" + username).forward(request,
                        response);
            } else {
                request.setAttribute("error", true);
                request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Unknown.password.recovery.option"));
                request.getRequestDispatcher("error.jsp").forward(request, response);
            }
        }
    }
%>
<html lang="en-US">
<head>
    <title></title>
</head>
<body>

</body>
</html>
