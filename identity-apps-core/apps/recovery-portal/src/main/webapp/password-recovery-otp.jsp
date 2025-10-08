<%--
  ~ Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>

<%@ page import="java.io.IOException" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.Random" %>
<%@ page import="java.util.UUID" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>
<%@ page import="javax.servlet.ServletException" %>
<%@ page import="org.apache.commons.collections.map.HashedMap" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.RecoveryApiV2" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.AccountRecoveryType" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.RecoveryInitRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.UserClaim" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.utils.multitenancy.MultitenantUtils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.ConfirmRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.ConfirmResponse" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.RecoveryChannelInformation" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.RecoveryChannel" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.RecoveryRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.RecoveryResponse" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.ResendRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.ResendResponse" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.user.core.util.UserCoreUtil" %>
<%@ page import="org.owasp.encoder.Encode" %>

<%-- Include tenant context --%>
<%@ include file="tenant-resolve.jsp"%>

<%! 
    /**
     * RecoveryStage represents the four steps of recovery in the 
     * PasswordRecoveryAPI V2.
     */
    public enum RecoveryStage {

        INITIATE("INITIATE"),
        RESEND("RESEND"),
        CONFIRM("CONFIRM"),
        RESET("RESET");

        private final String value;

        RecoveryStage(String value) {
            
            this.value = value;
        }

        /**
         * Returns tye string value of the enum.
         */
        public String getValue() {

            return value;
        }

        /**
         * Override the toStirng method of the object class.
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
<%!
    /**
     * This redirects the flow to the error page with the provided error message.
     */
    public void redirectToErrorPageWithMessage(HttpServletRequest request, 
        HttpServletResponse response, String errorMsg) throws ServletException, IOException {
        
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", errorMsg);
        request.getRequestDispatcher("error.jsp").forward(request, response);
    }
%>
<%
    String userIdentifierClaimKey = "http://wso2.org/claims/username";
    final String MULTI_ATTRIBUTE_USER_IDENTIFIER_CLAIM_URI = "internal.user.identifier.claim.uri";
    final RecoveryApiV2 recoveryApiV2 = new RecoveryApiV2();
    
    try {
        PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
        if (preferenceRetrievalClient.checkMultiAttributeLogin(tenantDomain)) {
            userIdentifierClaimKey = MULTI_ATTRIBUTE_USER_IDENTIFIER_CLAIM_URI;
        }
    } catch (PreferenceRetrievalClientException e) {
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    String username = (String) request.getAttribute("username");
    if (StringUtils.isBlank(username)) {
        username = request.getParameter("username");
    }
    String recoveryStage = request.getParameter("recoveryStage");

    if (RecoveryStage.INITIATE.equalsValue(recoveryStage)) {
        // If otp is supported by a new channel update this value assignment. null means unsupported.
        final String targetChannel =IdentityManagementEndpointConstants.PasswordRecoveryOptions.SMSOTP
            .equals((String) request.getAttribute("channel")) 
                ? "SMS"
                : IdentityManagementEndpointConstants.PasswordRecoveryOptions.EMAIL
                .equals((String) request.getAttribute("channel"))
                    ? "EMAIL"
                    : null;

        // Manage unsupported channel
        if (StringUtils.isBlank(targetChannel)) {
            redirectToErrorPageWithMessage(request, response, "Unknown.channel");
            return;
        }
        List<UserClaim> userClaims = new ArrayList<UserClaim>();

        // Get the username claim string for the tenant
        UserClaim userNameClaim = new UserClaim();
        userNameClaim.setUri(userIdentifierClaimKey);
        userNameClaim.setValue(MultitenantUtils.getTenantAwareUsername(username));
        userClaims.add(userNameClaim);

        String flawConfirmationCode = "";
        String recoveryCode = "";
        String channelId = "";

        try {
            // Initiate password recovery.
            RecoveryInitRequest recoveryInitRequest = new RecoveryInitRequest();
            recoveryInitRequest.setClaims(userClaims);
            Map<String, String> requestHeaders = new HashedMap();
            if (request.getParameter("g-recaptcha-response") != null) {
                requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
            }
            List<AccountRecoveryType> resp = 
                recoveryApiV2.initiatePasswordRecovery(recoveryInitRequest, tenantDomain, requestHeaders);
            if (resp == null) {
                /** Handle invalid username scenario. proceeds to next level without warning to 
                avoid an attacker bruteforcing to learn the usernames. */
                
                request.setAttribute("resendCode", UUID.randomUUID().toString());
                request.setAttribute("flowConfirmationCode", UUID.randomUUID().toString());
                request.getRequestDispatcher("sms-and-email-otp.jsp").forward(request, response);
                return;
            }
            for(AccountRecoveryType recoveryType: resp) {
                if ("recoverWithNotifications".equals(recoveryType.getMode())) {
                    RecoveryChannelInformation channelInfo = recoveryType.getChannelInfo();
                    recoveryCode = channelInfo.getRecoveryCode();
                    List<RecoveryChannel> channels = channelInfo.getChannels();
                    for(RecoveryChannel ch: channels) {
                        flawConfirmationCode = recoveryType.getFlowConfirmationCode();
                        if (ch.getType().equals(targetChannel)) {
                            channelId = ch.getId();
                            break;
                        }
                    }
                }
                if (StringUtils.isNotBlank(channelId)) {
                    break;
                }
            }

            /**
             * Manage user don't have phone number set up in the account.
             */
            if (StringUtils.isBlank(channelId)) {
                request.setAttribute("resendCode", UUID.randomUUID().toString());
                request.setAttribute("flowConfirmationCode", UUID.randomUUID().toString());
                request.getRequestDispatcher("sms-and-email-otp.jsp").forward(request, response);
                return;
            }

            // Get Recovery Information.
            RecoveryRequest recoveryRequest = new RecoveryRequest();
            recoveryRequest.setChannelId(channelId);
            recoveryRequest.setRecoveryCode(recoveryCode);
            RecoveryResponse recoveryResponse = 
                recoveryApiV2.recoverPassword(recoveryRequest, tenantDomain, requestHeaders);
            request.setAttribute("resendCode", recoveryResponse.getResendCode());
            request.setAttribute("flowConfirmationCode", recoveryResponse.getFlowConfirmationCode());
        } catch (ApiException e) {
            IdentityManagementEndpointUtil.addErrorInformation(request, e);
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }
        // Redirect to enter the OTP.
        request.getRequestDispatcher("sms-and-email-otp.jsp").forward(request, response);
    } else if (RecoveryStage.RESEND.equalsValue(recoveryStage)) {
        String resendCode = request.getParameter("resendCode");
        String flowConfirmationCode = request.getParameter("flowConfirmationCode");
        // Sending resend request
        try {
            Map<String, String> requestHeaders = new HashedMap();
            if (request.getParameter("g-recaptcha-response") != null) {
                requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
            }
            ResendRequest resendRequest = new ResendRequest();
            resendRequest.setResendCode(resendCode);
            ResendResponse resendResponse = 
                recoveryApiV2.resendPasswordNotification(resendRequest, tenantDomain, requestHeaders);
            
            /** Resend code re-attached to the reqeust to avoid value being missed after the page refresh that
             *  happens after the resend operation. */
            resendCode = resendResponse.getResendCode();
            flowConfirmationCode = resendResponse.getFlowConfirmationCode();
            request.setAttribute("resendSuccess", true);
        } catch (ApiException e) {
            /** Status code 406 is used for invalid/expired channel id/recovery code. Other error are considered
            unexpected and redirected to the error page. */
            if (e.getCode() != 406) {
                IdentityManagementEndpointUtil.addErrorInformation(request, e);
                request.getRequestDispatcher("error.jsp").forward(request, response);
                return;
            }
            request.setAttribute("isResendFailure","true");
            request.setAttribute("resendFailureMsg", "resend.fail.message");
        }
        request.setAttribute("resendCode", resendCode);
        request.setAttribute("sp", request.getParameter("sp"));
        request.setAttribute("flowConfirmationCode", flowConfirmationCode);
        request.getRequestDispatcher("sms-and-email-otp.jsp").forward(request, response);
    } else if (RecoveryStage.CONFIRM.equalsValue(recoveryStage)) {
        String flowConfirmationCode = request.getParameter("flowConfirmationCode"); 
        String OTPcode = request.getParameter("OTPcode");
        try {
            Map<String, String> requestHeaders = new HashedMap();
            if (request.getParameter("g-recaptcha-response") != null) {
                requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
            }
            ConfirmRequest confirmRequest = new ConfirmRequest();
            /** For local notification channels flowConfirmationCode is used as confirmation code. */
            confirmRequest.setConfirmationCode(flowConfirmationCode);
            confirmRequest.setOtp(OTPcode);
            ConfirmResponse confirmResponse = 
                recoveryApiV2.confirmPasswordRecovery(confirmRequest, tenantDomain, requestHeaders);
            request.setAttribute("resetCode", confirmResponse.getResetCode());
        } catch (ApiException e) {
            /** Status code 406 is used for invalid/expired channel id/recovery code. Other error are considered
            unexpected and redirected to the error page. */
            if (e.getCode() != 406) {
                IdentityManagementEndpointUtil.addErrorInformation(request, e);
                request.getRequestDispatcher("error.jsp").forward(request, response);
                return;
            }
            request.setAttribute("isAuthFailure","true");
            request.setAttribute("authFailureMsg", "authentication.fail.message");
            request.setAttribute("resendCode", request.getParameter("resendCode"));
            request.setAttribute("sp", request.getParameter("sp"));
            request.setAttribute("flowConfirmationCode", flowConfirmationCode);
            request.getRequestDispatcher("sms-and-email-otp.jsp").forward(request, response);
            return;
        }
        String spId = Encode.forJava(request.getParameter("spId"));
        request.setAttribute("spId", spId);
        request.getRequestDispatcher("password-reset.jsp").forward(request, response);
    } else if (RecoveryStage.RESET.equalsValue(recoveryStage)) {
        request.setAttribute("useRecoveryV2API", "true");
        request.getRequestDispatcher("password-reset-complete.jsp").forward(request, response);
    } else {
        request.setAttribute("errorMsg", "Invalid password recovery stage.");
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        request.getRequestDispatcher("error.jsp").forward(request, response);
    }
%>
