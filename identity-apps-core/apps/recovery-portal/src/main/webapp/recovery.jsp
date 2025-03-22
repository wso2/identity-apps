<%--
  ~ Copyright (c) 2016-2024, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="java.io.File" %>
<%@ page import="org.apache.commons.collections.map.HashedMap" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.base.IdentityRuntimeException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.UsernameRecoveryApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.RecoveryApiV2" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Claim" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.UserClaim" %>
<%@ page import="org.wso2.carbon.user.core.util.UserCoreUtil" %>
<%@ page import="org.wso2.carbon.utils.multitenancy.MultitenantUtils" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Property" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.*" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%!
    /**
     * UsernameRecoveryStage represents the two steps of recovery in the UsernameRecovery V2.
     */
    public enum UsernameRecoveryStage {
        INITIATE("INITIATE"),
        NOTIFY("NOTIFY");

        private final String value;

        UsernameRecoveryStage(String value) {
            
            this.value = value;
        }

        /**
         * Returns the string value of the enum.
         */
        public String getValue() {

            return value;
        }

        /**
         * Override the toString method of the object class.
         */
        @Override
        public String toString() {

            return value;
        }

        /**
         * Compares enum with string based on it's value.
         * @return boolean whether the passed string equals the value of the enum.
         */
        public boolean equalsValue(String otherValue) {

            return this.value.equals(otherValue);
        }
    }
%>

<%
    File usernameResolverFile = new File(getServletContext().getRealPath("extensions/username-resolver.jsp"));
    if (usernameResolverFile.exists()) {
%>
        <jsp:include page="extensions/username-resolver.jsp"/>
<% } else { %>
        <jsp:include page="includes/username-resolver.jsp"/>
<% } %>

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
    String spId = request.getParameter("spId");
    String userTenantHint = request.getParameter("t");
    String applicationAccessUrl = "";

    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
    }

    if (StringUtils.isNotBlank(username)) {
        username = (String) request.getAttribute("resolvedUsername");
    }

    // Password recovery parameters
    String recoveryOption = request.getParameter("recoveryOption");

    try {
        String sp = Encode.forJava(request.getParameter("sp"));
        if (StringUtils.isNotBlank(sp)) {
            ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
            applicationAccessUrl = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain, sp);
        }
    } catch (Exception e) {
        // Ignored.
    }

    Boolean isValidCallBackURL = false;
    try {
        if (StringUtils.isNotBlank(applicationAccessUrl)) {
            // Disregard callbackURL regex validation when accessURL is configured in the application.
            isValidCallBackURL = true;
        } else if (StringUtils.isNotBlank(callback)) {
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
        // Username recovery scenario.
        String recoveryStage = request.getAttribute("recoveryStage") != null 
                    ? (String) request.getAttribute("recoveryStage") 
                    : Encode.forJava(request.getParameter("recoveryStage"));

        if (StringUtils.isBlank(tenantDomain)) {
            tenantDomain = IdentityManagementEndpointConstants.SUPER_TENANT;
        }

        if (UsernameRecoveryStage.INITIATE.equalsValue(recoveryStage)) {
            
            // Separate the contact to mobile or email.
            String contact = Encode.forJava(request.getParameter("contact"));
            if (contact.matches(IdentityManagementEndpointConstants.UserInfoRecovery.MOBILE_CLAIM_REGEX)) {
                request.setAttribute(IdentityManagementEndpointConstants.ClaimURIs.MOBILE_CLAIM, contact);
            } else {
                request.setAttribute(IdentityManagementEndpointConstants.ClaimURIs.EMAIL_CLAIM, contact);
            }
            

            List<Claim> claims;
            UsernameRecoveryApi usernameRecoveryApi = new UsernameRecoveryApi();
            RecoveryApiV2 recoveryApiV2 = new RecoveryApiV2();
            RecoveryInitRequest recoveryInitRequest = new RecoveryInitRequest();

            try {
                claims = usernameRecoveryApi.getClaimsForUsernameRecovery(tenantDomain, true);
            } catch (ApiException e) {
                IdentityManagementEndpointUtil.addErrorInformation(request, e);
                if (!StringUtils.isBlank(username)) {
                    request.setAttribute("username", username);
                }
                request.getRequestDispatcher("error.jsp").forward(request, response);
                return;
            }

            List<UserClaim> claimDTOList = new ArrayList<UserClaim>();

            for (Claim claimDTO : claims) {

                // Check if the claim is present in the request attributes or parameters.
                String claimValue = (String) request.getAttribute(claimDTO.getUri());

                if (claimValue == null && request.getParameter(claimDTO.getUri()) != null) {
                    claimValue = Encode.forJava(request.getParameter(claimDTO.getUri()).toString().trim());
                }

                // If the claim value is present (either from parameters or attributes), add it.
                if (StringUtils.isNotBlank(claimValue)) {
                    UserClaim userClaim = new UserClaim();
                    userClaim.setUri(claimDTO.getUri());
                    userClaim.setValue(claimValue);
                    claimDTOList.add(userClaim);
                }
            }
            recoveryInitRequest.claims(claimDTOList);

            try {
                Map<String, String> requestHeaders = new HashedMap();
                if (request.getParameter("g-recaptcha-response") != null) {
                    requestHeaders.put("g-recaptcha-response", Encode.forJava(request.getParameter("g-recaptcha-response")));
                }

                request.setAttribute("callback", callback);
                request.setAttribute("tenantDomain", tenantDomain);
                request.setAttribute("isUserFound", true);

                List<AccountRecoveryType> initiateUsernameRecoveryResponse = 
                            recoveryApiV2.initiateUsernameRecovery(recoveryInitRequest, tenantDomain, requestHeaders);

                if (initiateUsernameRecoveryResponse == null || initiateUsernameRecoveryResponse.isEmpty()) {
                    request.setAttribute("isUserFound", false);
                    request.getRequestDispatcher("channelselection.do").forward(request, response);
                    return;
                }

                request.setAttribute("recoveryCode", initiateUsernameRecoveryResponse.get(0).getChannelInfo().getRecoveryCode());

                List<RecoveryChannel> firstMatchChannels = initiateUsernameRecoveryResponse.get(0).getChannelInfo().getChannels();
                request.setAttribute("channels", firstMatchChannels);

                request.getRequestDispatcher("channelselection.do").forward(request, response);
                return;
            
            } catch (ApiException e) {
                IdentityManagementEndpointUtil.addErrorInformation(request, e);
                request.getRequestDispatcher("recoveraccountrouter.do").forward(request, response);
                return;
            }
            
        } else if (UsernameRecoveryStage.NOTIFY.equalsValue(recoveryStage)) {
            RecoveryApiV2 recoveryApiV2 = new RecoveryApiV2();
            String recoveryCode = request.getAttribute("recoveryCode") != null 
                        ? (String) request.getAttribute("recoveryCode") 
                        : Encode.forJava(request.getParameter("recoveryCode")); 

            String usernameRecoveryOption = request.getAttribute("usernameRecoveryOption") != null 
                        ? (String) request.getAttribute("usernameRecoveryOption") 
                        : Encode.forJava(request.getParameter("usernameRecoveryOption"));

            String isUserFoundParam = request.getParameter("isUserFound");
            Boolean isUserFound = (isUserFoundParam != null) 
                        ? Boolean.parseBoolean(isUserFoundParam) 
                        : IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("isUserFound"));

            String recoveryChannelType = null;
            String recoveryChannelId = null;
            
            // Extract the recovery channel name and id from the recovery option.
            if (usernameRecoveryOption != null) {
                String[] parts = usernameRecoveryOption.split(":");
                recoveryChannelId = parts[0];
                recoveryChannelType = parts[1];
            }
            
            request.setAttribute("recoveryChannelType", recoveryChannelType);
 
            // Sending the notification if we only found a user.
            if (isUserFound){
                RecoveryRequest recoveryRequest = new RecoveryRequest();
                recoveryRequest.setRecoveryCode(recoveryCode);
                recoveryRequest.setChannelId(recoveryChannelId);

                Map<String, String> requestHeaders = new HashedMap();
                if (request.getParameter("g-recaptcha-response") != null) {
                    requestHeaders.put("g-recaptcha-response", Encode.forJava(request.getParameter("g-recaptcha-response")));
                }

                try{
                    recoveryApiV2.recoverUsername(recoveryRequest, tenantDomain, requestHeaders);
                    
                } catch (ApiException e) {
                    IdentityManagementEndpointUtil.addErrorInformation(request, e);
                    request.getRequestDispatcher("recoveraccountrouter.do").forward(request, response);
                    return;
                }
            }
            
            request.getRequestDispatcher("username-recovery-complete.jsp").forward(request, response);
            return;

        } else {
            request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                    "Invalid.username.recovery.stage"));
            request.getRequestDispatcher("error.jsp").forward(request, response);
        }

    } else if (isPasswordRecoveryWithClaimsNotify) {
        // Let user recover password by email or security questions.
        String recoveryCode = request.getParameter("recoveryCode");
        String notificationChannel = "";

        RecoveryApiV2 recoveryApiV2 = new RecoveryApiV2();
        if (recoveryOption.equals("SECURITY_QUESTIONS")) {
            username = IdentityManagementEndpointUtil.getFullQualifiedUsername(username, tenantDomain, null);
            request.setAttribute("callback", callback);
            request.setAttribute("sessionDataKey", sessionDataKey);
            request.setAttribute("username", username);
            session.setAttribute("username", username);
            IdentityManagementEndpointUtil.addReCaptchaHeaders(request, recoveryApiV2.
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
                RecoveryResponse recoveryResponse = recoveryApiV2.recoverPassword(recoveryRequest,
                        tenantDomain, requestHeaders);
                notificationChannel = recoveryResponse.getNotificationChannel();
                request.setAttribute("callback", callback);
                if (notificationChannel.equals("EMAIL")) {
                    Boolean isEmailOtpBasedPasswordRecoveryEnabledByTenant = Boolean.parseBoolean(
                        Encode.forJava(request.getParameter("isEmailOtpBasedPasswordRecoveryEnabledByTenant")));
                    if (isEmailOtpBasedPasswordRecoveryEnabledByTenant) {
                        request.setAttribute("channel", IdentityManagementEndpointConstants.PasswordRecoveryOptions.EMAIL);
                        request.setAttribute("resendCode", recoveryResponse.getResendCode());
                        request.setAttribute("flowConfirmationCode", recoveryResponse.getFlowConfirmationCode());
                        request.getRequestDispatcher("sms-and-email-otp.jsp").forward(request, response);
                        return;
                    }
                    request.getRequestDispatcher("password-recovery-with-claims-notify.jsp").forward(request,
                            response);
                    return;
                } else if(notificationChannel.equals("SMS")) {
                    request.setAttribute("screenValue", request.getParameter("screenValue"));
                    request.setAttribute("resendCode", recoveryResponse.getResendCode());
                    request.setAttribute("flowConfirmationCode", recoveryResponse.getFlowConfirmationCode());
                    request.getRequestDispatcher("sms-and-email-otp.jsp").forward(request, response);
                } else {
                    request.setAttribute("error", true);
                    request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                            "Unknown.password.recovery.option"));
                    if (!StringUtils.isBlank(username)) {
                        request.setAttribute("username", username);
                    }
                    request.getRequestDispatcher("error.jsp").forward(request, response);
                }
            }
            catch (ApiException e) {
                IdentityManagementEndpointUtil.addErrorInformation(request, e);
                if (!StringUtils.isBlank(username)) {
                    request.setAttribute("username", username);
                }
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
                Boolean isEmailOtpBasedPasswordRecoveryEnabledByTenant = Boolean.parseBoolean(
                    request.getParameter("isEmailOtpBasedPasswordRecoveryEnabledByTenant"));
                if (isEmailOtpBasedPasswordRecoveryEnabledByTenant) {
                    request.setAttribute("channel", IdentityManagementEndpointConstants.PasswordRecoveryOptions.EMAIL);
                    request.getRequestDispatcher("password-recovery-otp.jsp").forward(request, response);
                    return;
                }
                request.setAttribute("callback", callback);
                request.getRequestDispatcher("password-recovery-notify.jsp").forward(request, response);
            } else if(IdentityManagementEndpointConstants.PasswordRecoveryOptions.SMSOTP.equals(recoveryOption)) {
                request.setAttribute("channel", IdentityManagementEndpointConstants.PasswordRecoveryOptions.SMSOTP);
                request.getRequestDispatcher("password-recovery-otp.jsp").forward(request, response);
            }  else if (IdentityManagementEndpointConstants.PasswordRecoveryOptions.SECURITY_QUESTIONS
                    .equals(recoveryOption)) {
                request.setAttribute("callback", callback);
                request.getRequestDispatcher("challenge-question-request.jsp?username=" + username).forward(request,
                        response);
            }else {
                request.setAttribute("error", true);
                request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Unknown.password.recovery.option"));
                if (!StringUtils.isBlank(username)) {
                    request.setAttribute("username", username);
                }
                request.getRequestDispatcher("error.jsp").forward(request, response);
            }
        }
    }
%>
