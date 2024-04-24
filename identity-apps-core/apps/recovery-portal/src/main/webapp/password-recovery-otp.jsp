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

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.Random" %>
<%@ page import="java.util.UUID" %>
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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>

<%-- Include tenant context --%>
<%@ include file="tenant-resolve.jsp"%>

<%! 
    public enum RecoveryStage {
        INITIATE("INITIATE"),
        RESEND("RESEND"),
        CONFIRM("CONFIRM"),
        RESET("RESET");

        private final String value;

        RecoveryStage(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        // Override toString() method to return the enum value
        @Override
        public String toString() {
            return value;
        }

        // Custom method to compare the enum value with a string
        public boolean equalsValue(String otherValue) {
            return this.value.equals(otherValue);
        }
    }
%>
<%! 
    public static String getRandomNumberString(int len, String seed) {

        StringBuilder sb = new StringBuilder(len);
        Random random = new Random(seed.hashCode());

        for (int i = 0; i < len; i++) {
            Integer numAtIndex = random.nextInt(10);
            sb.append(numAtIndex.toString());
        }
        return sb.toString();
    }
%>
<%
    RecoveryApiV2 recoveryApiV2 = new RecoveryApiV2();
    String username = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("username"));

    String channel = (String)request.getAttribute("channel");
    if (StringUtils.isBlank(channel)) {
        channel = request.getParameter("channel");
    }

    if (IdentityManagementEndpointConstants.PasswordRecoveryOptions.SMSOTP.equals(channel)) {
        String recoveryStage = request.getParameter("recoveryStage");

        if (RecoveryStage.INITIATE.equalsValue(recoveryStage)) {
            List<UserClaim> userClaims = new ArrayList<UserClaim>();

            // get the username claim string for the tenant
            final String USERNAME_CLAIM_URI_FOR_TENANT = "http://wso2.org/claims/username";
            UserClaim userNameClaim = new UserClaim();
            userNameClaim.setUri(USERNAME_CLAIM_URI_FOR_TENANT);
            userNameClaim.setValue(MultitenantUtils.getTenantAwareUsername(username));
            userClaims.add(userNameClaim);

            // STEP ONE : Initiate password recovery
            RecoveryInitRequest recoveryInitRequest = new RecoveryInitRequest();
            recoveryInitRequest.setClaims(userClaims);

            String flawConfirmationCode = "";
            String recoveryCode = "";
            String channelId = "";
            String screenValue = "";

            try {
                Map<String, String> requestHeaders = new HashedMap();
                if (request.getParameter("g-recaptcha-response") != null) {
                    requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
                }
                List<AccountRecoveryType> resp = 
                    recoveryApiV2.initiatePasswordRecovery(recoveryInitRequest, tenantDomain, requestHeaders);
                if (resp == null) {
                    /** handling invalid username scenario. proceeds to next level without warning to 
                    avoid an attacker bruteforcing to learn the usernames. */
                    request.setAttribute("screenValue", "******" + getRandomNumberString(4, username));
                    request.setAttribute("resendCode", UUID.randomUUID().toString());
                    request.setAttribute("flowConfirmationCode", UUID.randomUUID().toString());
                    request.getRequestDispatcher("sms-otp.jsp").forward(request, response);
                    return;
                }
                boolean resultFound = false;
                for(AccountRecoveryType x: resp) {
                    if (x.getMode().equals("recoverWithNotifications")) {
                        RecoveryChannelInformation channelInfo = x.getChannelInfo();
                        recoveryCode = channelInfo.getRecoveryCode();
                        List<RecoveryChannel> channels = channelInfo.getChannels();
                        for(RecoveryChannel ch: channels) {
                            flawConfirmationCode = x.getFlowConfirmationCode();
                            if (ch.getType().equals("SMS")) {
                                channelId = ch.getId();
                                screenValue = ch.getValue();
                            }
                            resultFound = true;
                        }
                    }
                    if (resultFound) {
                        break;
                    }
                }

                // STEP TWO : Get Recovery Information.
                RecoveryRequest recoveryRequest = new RecoveryRequest();
                recoveryRequest.setChannelId(channelId);
                recoveryRequest.setRecoveryCode(recoveryCode);
                RecoveryResponse recoveryResponse = 
                    recoveryApiV2.recoverPassword(recoveryRequest, tenantDomain, requestHeaders);
                request.setAttribute("screenValue", screenValue);
                request.setAttribute("resendCode", recoveryResponse.getResendCode());
                request.setAttribute("flowConfirmationCode", recoveryResponse.getFlowConfirmationCode());
            } catch (ApiException e) {
                IdentityManagementEndpointUtil.addErrorInformation(request, e);
                request.getRequestDispatcher("error.jsp").forward(request, response);
                return;
            }
            // STEP THREE : Redirect to enter the OTP sent.
            request.getRequestDispatcher("sms-otp.jsp").forward(request, response);
        } else if (RecoveryStage.RESEND.equalsValue(recoveryStage)) {
            String resendCode = request.getParameter("resendCode");
            // SENDING RESEND REQEUST
            try {
                Map<String, String> requestHeaders = new HashedMap();
                if (request.getParameter("g-recaptcha-response") != null) {
                    requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
                }
                ResendRequest resendRequest = new ResendRequest();
                resendRequest.setResendCode(resendCode);
                ResendResponse resendResponse = 
                    recoveryApiV2.resendPasswordNotification(resendRequest, tenantDomain, requestHeaders);
                
                /** Resend code re-attached to the reqeust to avoid value being missed after page refresh happening  
                after the resend operation. */
                request.setAttribute("resendCode", resendResponse.getResendCode());
                request.setAttribute("flowConfirmationCode", resendResponse.getFlowConfirmationCode());
            } catch (ApiException e) {
                if (!StringUtils.isBlank(username)) {
                    request.setAttribute("username", username);
                }
                /** Status code 406 is used for invalid/expired channel id/recovery code. Other error are considered
                unexpected and redirected to the error page. */
                if (e.getCode() != 406) {
                    IdentityManagementEndpointUtil.addErrorInformation(request, e);
                    request.getRequestDispatcher("error.jsp").forward(request, response);
                    return;
                }
                request.setAttribute("isAuthFailure","true");
                request.setAttribute("authFailureMsg", "authentication.fail.message");
                request.setAttribute("resendCode", resendCode);
                request.setAttribute("flowConfirmationCode", request.getParameter("flowConfirmationCode"));
            }
            request.getRequestDispatcher("sms-otp.jsp").forward(request, response);
        } else if (RecoveryStage.CONFIRM.equalsValue(recoveryStage)) {
            String flowConfirmationCode = request.getParameter("flowConfirmationCode"); 
            String OTPcode = request.getParameter("OTPcode");
            try {
                Map<String, String> requestHeaders = new HashedMap();
                if (request.getParameter("g-recaptcha-response") != null) {
                    requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
                }
                ConfirmRequest confirmRequest = new ConfirmRequest();
                // For local notification channels flowConfirmationCode is used as confirmation code
                confirmRequest.setConfirmationCode(flowConfirmationCode);
                confirmRequest.setOtp(OTPcode);
                ConfirmResponse confirmResponse = 
                    recoveryApiV2.confirmPasswordRecovery(confirmRequest, tenantDomain, requestHeaders);
                request.setAttribute("resetCode", confirmResponse.getResetCode());
            } catch (ApiException e) {
                if (!StringUtils.isBlank(username)) {
                    request.setAttribute("username", username);
                }
                if (e.getCode() != 406) {
                    IdentityManagementEndpointUtil.addErrorInformation(request, e);
                    request.getRequestDispatcher("error.jsp").forward(request, response);
                    return;
                }
                request.setAttribute("isAuthFailure","true");
                request.setAttribute("authFailureMsg", "authentication.fail.message");
                request.setAttribute("resendCode", request.getParameter("resendCode"));
                request.setAttribute("flowConfirmationCode", request.getParameter("flowConfirmationCode"));
                request.getRequestDispatcher("sms-otp.jsp").forward(request, response);
                return;
            }
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
    }
%>

<!doctype html>
<html lang="en-US">
<head>
</head>
<body>
</body>
</html>
