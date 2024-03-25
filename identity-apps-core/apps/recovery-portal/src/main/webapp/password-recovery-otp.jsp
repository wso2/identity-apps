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

<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>

<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.List" %>
<%@ page import="org.apache.commons.collections.map.HashedMap" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.RecoveryApiV2" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Property" %>
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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.ResetRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.recovery.v2.ResetResponse" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>

<%-- Include tenant context --%>
<%@ include file="tenant-resolve.jsp"%>

<%
    RecoveryApiV2 recoveryApiV2 = new RecoveryApiV2();
    String username = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("username"));

    String channel = (String)request.getAttribute("channel");
    if (StringUtils.isBlank(channel)) {
        channel = request.getParameter("channel");
    }

    String queryString = request.getQueryString();
    queryString = StringUtils.isNotBlank(queryString)? "?"+queryString: "";

    if (IdentityManagementEndpointConstants.PasswordRecoveryOptions.SMSOTP.equals(channel)) {
        String recoveryStage = request.getParameter("recoveryStage");
        switch (recoveryStage) {
            case "INITIATE":
                List<UserClaim> userClaims = new ArrayList<UserClaim>();

                // get the username claim string for the tenant
                String usernameClaimUriForTenant = "http://wso2.org/claims/username"; // todo: RNN : get this claim from somewhere
                UserClaim userNameClaim = new UserClaim();
                userNameClaim.setUri(usernameClaimUriForTenant);
                userNameClaim.setValue(MultitenantUtils.getTenantAwareUsername(username));
                userClaims.add(userNameClaim);

                // STEP ONE : Initiate password recovery
                RecoveryInitRequest recoveryInitRequest = new RecoveryInitRequest();
                recoveryInitRequest.setClaims(userClaims);

                String flawConfirmationCode = "";
                String recoveryCode = "";
                String channelId = "";
                String channelValue = "";

                try {
                    Map<String, String> requestHeaders = new HashedMap();
                    if (request.getParameter("g-recaptcha-response") != null) {
                        requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
                    }
                    List<AccountRecoveryType> resp = recoveryApiV2.initiatePasswordRecovery(recoveryInitRequest, tenantDomain, requestHeaders);

                    org.apache.logging.log4j.LogManager.getLogger().warn(resp);
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
                                    channelValue = ch.getValue();
                                }
                                resultFound = true;
                            }
                        }
                        if(resultFound) {
                            break;
                        }
                    }

                    // STEP TWO : Get Recovery Information
                    RecoveryRequest recoveryRequest = new RecoveryRequest();
                    recoveryRequest.setChannelId(channelId);
                    recoveryRequest.setRecoveryCode(recoveryCode);
                    RecoveryResponse recoveryResponse = recoveryApiV2.recoverPassword(recoveryRequest, tenantDomain, requestHeaders);
                    request.setAttribute("resendCode", recoveryResponse.getResendCode());
                    request.setAttribute("flowConfirmationCode", recoveryResponse.getFlowConfirmationCode());
                } catch (ApiException e) {
                    if (!StringUtils.isBlank(username)) {
                        request.setAttribute("username", username);
                    }
                    IdentityManagementEndpointUtil.addErrorInformation(request, e);
                    request.getRequestDispatcher("error.jsp").forward(request, response);
                    return;
                }
                
                // STEP THREE : Redirect to enter the OTP sent
                request.getRequestDispatcher("sms-otp.jsp" + queryString).forward(request, response);
                break;
            case "RESEND":
                org.apache.logging.log4j.LogManager.getLogger().error("RESENDING");
                String resendCode = request.getParameter("resendCode");
                org.apache.logging.log4j.LogManager.getLogger().error("Resend Code : "+resendCode);

                // SENDING RESEND REQEUST
                try {
                    Map<String, String> requestHeaders = new HashedMap();
                    if (request.getParameter("g-recaptcha-response") != null) {
                        requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
                    }
                    ResendRequest resendRequest = new ResendRequest();
                    resendRequest.setResendCode(resendCode);
                    ResendResponse resendResponse = recoveryApiV2.resendPasswordNotification(resendRequest, tenantDomain, requestHeaders);
                    
                    // Resend code re-attached to the reqeust to avoid value being missed after page refresh happening  
                    // after the resent operation.
                    request.setAttribute("resendCode", resendResponse.getResendCode());
                    request.setAttribute("flowConfirmationCode", resendResponse.getFlowConfirmationCode());
                } catch (ApiException e) {
                    if (!StringUtils.isBlank(username)) {
                        request.setAttribute("username", username);
                    }
                    IdentityManagementEndpointUtil.addErrorInformation(request, e);
                    request.getRequestDispatcher("error.jsp").forward(request, response);
                    return;
                }
                request.getRequestDispatcher("sms-otp.jsp" + queryString).forward(request, response);
                break;
            case "CONFIRM":
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
                    ConfirmResponse confirmResponse = recoveryApiV2.confirmPasswordRecovery(confirmRequest, tenantDomain, requestHeaders);
                    request.setAttribute("resetCode", confirmResponse.getResetCode());
                } catch (ApiException e) {
                    if (!StringUtils.isBlank(username)) {
                        request.setAttribute("username", username);
                    }
                    IdentityManagementEndpointUtil.addErrorInformation(request, e);
                    request.getRequestDispatcher("error.jsp").forward(request, response);
                    return;
                }
                request.getRequestDispatcher("password-reset.jsp" + queryString).forward(request, response);
                break;
            case "RESET":
                request.setAttribute("useRecoveryV2API", "true");            
                request.getRequestDispatcher("password-reset-complete.jsp" + queryString).forward(request, response);
                break;
            default:
                request.setAttribute("errorMsg", "Invalid password recovery stage.");
                if (!StringUtils.isBlank(username)) {
                    request.setAttribute("username", username);
                }
                request.getRequestDispatcher("error.jsp").forward(request, response);
                break;
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
