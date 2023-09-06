<%--
 ~
 ~ Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 Inc. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="extensions/branding-preferences.jsp"/>

<%
    request.getSession().invalidate();
    if (StringUtils.isBlank(tenantDomain)) {
        tenantDomain = (String) session.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    }
    
    // TODO: Use this once "com.wso2.identity.asgardeo.auth.smsotp.util.AuthenticatorUtils" is moved to IS
    // int otpLength = Integer.parseInt(AuthenticatorUtils.getSmsAuthenticatorConfig("SmsOTP.OTPLength", tenantDomain));
    int otpLength = 6;

    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry.code.invalid");
            }
        }
    }
%>

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

        <%-- analytics --%>
        <%
            File analyticsFile = new File(getServletContext().getRealPath("extensions/analytics.jsp"));
            if (analyticsFile.exists()) {
        %>
            <jsp:include page="extensions/analytics.jsp"/>
        <% } else { %>
            <jsp:include page="includes/analytics.jsp"/>
        <% } %>

        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="login-portal layout sms-otp-portal-layout">

        <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
            <jsp:include page="extensions/timeout.jsp"/>
        <% } else { %>
            <jsp:include page="util/timeout.jsp"/>
        <% } %>

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
            <layout:component componentName="MainSection" >
                <div class="ui segment">
                    <%-- page content --%>
                    <h2><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "auth.with.smsotp")%></h2>
                    <div class="ui divider hidden"></div>
                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                            <div class="ui negative message" id="failed-msg">
                                <%=Encode.forHtmlContent(errorMessage)%>
                            </div>
                            <div class="ui divider hidden"></div>
                    <% } %>
                    <div class="error-msg"></div>
                    <div class="segment-form">
                        <form class="ui large form" id="pin_form" name="pin_form" action="../commonauth"  method="POST">
                            <%
                                String loginFailed = request.getParameter("authFailure");
                                if (loginFailed != null && "true".equals(loginFailed)) {
                                    String authFailureMsg = request.getParameter("authFailureMsg");
                                    if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                            %>
                                <div class="ui visible negative message">
                                    <%=IdentityManagementEndpointUtil.i18n(resourceBundle, "error.retry")%>
                                </div>
                                <div class="ui divider hidden"></div>
                            <% } }  %>
                            <%-- Token Pin --%>
                            <% if (request.getParameter("screenvalue") != null) { %>
                            <div class="field">
                                <label for="OTPcode">
                                    <%=IdentityManagementEndpointUtil.i18n(resourceBundle, "enter.code.sent.smsotp")%><%=Encode.forHtmlContent(request.getParameter("screenvalue"))%>
                                </label>
                                <input type="password" id='OTPcode' name="OTPcode"
                                        size='30'/>
                            <% } else { %>
                            <div class="field">
                                <label for="OTPcode"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "enter.code.sent.smsotp")%></label>
                                <input type="password" id='OTPcode' name="OTPcode"
                                size='30'/>
                            <% } %>
                            </div>
                            <input type="hidden" name="sessionDataKey"
                            value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/><br/>
                            <div class="align-right buttons">
                                <%
                                    if ("true".equals(authenticationFailed)) {
                                        String reSendCode = request.getParameter("resendCode");
                                        if ("true".equals(reSendCode)) {
                                %>
                                    <div
                                        id="resendCodeLinkDiv"
                                        class="ui button secondary"
                                        tabindex="0"
                                        onclick="resendOtp()"
                                        onkeypress="javascript: if (window.event.keyCode === 13) resendOtp()">
                                        <a id="resend"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "resend.code")%></a>
                                    </div>
                                <% } } %>
                                <input
                                    type="submit" name="authenticate" id="authenticate"
                                    value="<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "authenticate.button")%>" class="ui primary button"/>
                            </div>
                            <input type='hidden' name='resendCode' id='resendCode' value='false'/>
                        </form>
                    </div>
                    <div class="ui divider hidden"></div>
                    <%
                        String multiOptionURI = request.getParameter("multiOptionURI");
                        if (multiOptionURI != null && AuthenticationEndpointUtil.isValidURL(multiOptionURI)) {
                    %>
                        <a class="ui primary basic button link-button" id="goBackLink"
                        href='<%=Encode.forHtmlAttribute(multiOptionURI)%>'>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "choose.other.option")%>
                        </a>
                    <%
                        }
                    %>
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

        <script type="text/javascript">
            var insightsTenantIdentifier = "<%=userTenant%>";
            var otpLength = "<%=otpLength%>";

            function movetoNext(current, nextFieldID, previousID) {
                var key = event.keyCode || event.charCode;
                if(key == 8 || key == 46) {
                    if (previousID != null && previousID != 'null') {
                        document.getElementById(previousID).focus();
                    }
                } else {
                    if (nextFieldID != null && nextFieldID != 'null' && current.value.length >= current.maxLength) {
                        document.getElementById(nextFieldID).focus();
                    }
                }
            }

            function sub() {

                var token = null;
                var hasNullDigit = false;

                for(var i = 1; i <= otpLength; i++){
                    var currentDigit = document.getElementById("pincode-"+i).value;
                    if(!currentDigit || currentDigit == null || currentDigit == 'null') {
                        hasNullDigit = true;
                        break;
                    }
                    if(i === 1) {
                        token = currentDigit;
                    } else {
                        token += currentDigit;
                    }
                }

                document.getElementById('OTPCode').value = token;

                if (!hasNullDigit) {
                    trackEvent("authentication-portal-sms-otp-click-continue", {
                        "tenant": insightsTenantIdentifier != "null" ? insightsTenantIdentifier : ""
                    });
                    // Disable during the initial submission to prevent double submissions.
                    document.getElementById("subButton").disabled = true;
                    document.getElementById("codeForm").submit();
                }

            }

            // Handle paste events
    	    function handlePaste(e) {
     	        var clipboardData, value;

                // Stop data get being pasted into element
                e.stopPropagation();
                e.preventDefault();

                // Get pasted data via clipboard API
                clipboardData = e.clipboardData || window.clipboardData;
                value = clipboardData.getData('Text');
                const reg = new RegExp(/^\d+$/);
                if (reg.test(value)) {
                    for (n = 0; n < 6; ++n) {
                        $("#pincode-" + (n+1)).val(value[n]);
                        $("#pincode-" + (n+1)).focus();
                    }
                }
            }

           document.getElementById('pincode-1') ? document.getElementById('pincode-1').addEventListener('paste', handlePaste) : null;

            $(document).ready(function () {
                $.fn.preventDoubleSubmission = function() {
                    $('#codeForm').on('submit',function(e){
                        if($('#codeForm').data("submitted") == true) {
                            e.preventDefault();
                            console.warn("Prevented a possible double submit event");
                        } else {
                            var code = document.getElementById("OTPCode").value;
                            if (code == "") {
                                e.preventDefault();
                                document.getElementById('alertDiv').innerHTML
                                    = '<div id="error-msg" class="ui negative message"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.enter.code")%></div>'
                                    +'<div class="ui divider hidden"></div>';
                            } else {
                                trackEvent("authentication-portal-sms-otp-click-continue", {
                                    "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
                                });
                                $('#codeForm').data("submitted", true);
                            }
                        }
                    });
                };
                $('#codeForm').preventDoubleSubmission();
            });

            $(document).ready(function () {
                $('#resend').click(function () {
                    document.getElementById("resendCode").value = "true";
                    $('#codeForm').submit();
                });
            });

            // Show OTP code function.
            function showOTPCode() {
                var otpField = $('#OTPCode');

                if (otpField.attr("type") === 'text') {
                    otpField.attr("type", "password");
                    document.getElementById("password-eye").classList.remove("slash");
                } else {
                    otpField.attr("type", "text");
                    document.getElementById("password-eye").classList.add("slash");
                }
            }

            $(document).ready(handleWaitBeforeResendOTP);

            function handleWaitBeforeResendOTP() {
                // value should be less than 3600
                const WAIT_TIME_SECONDS = 60;

                const resendButton = document.getElementById("resend");
                resendButton.disabled = true;
                const resendButtonText = resendButton.innerHTML;
                // Update the button text initially to avoid waiting until the first tick to update.
                resendButton.innerHTML = Math.floor(WAIT_TIME_SECONDS / 60).toString().padStart(2, '0') + " : " + (WAIT_TIME_SECONDS % 60).toString().padStart(2, '0');

                const countdown = new Countdown(
                    Countdown.seconds(WAIT_TIME_SECONDS),
                    () => {
                        resendButton.innerHTML = resendButtonText;
                        resendButton.disabled = false;
                    },
                    (time) => {
                        resendButton.innerHTML = time.minutes.toString().padStart(2, '0') + " : " + time.seconds.toString().padStart(2, '0');
                    },
                    "SMS_OTP_TIMER"
                ).start();
            }
        </script>

        <%!
            private boolean isMultiAuthAvailable(String multiOptionURI) {
                boolean isMultiAuthAvailable = true;
                if (multiOptionURI == null || multiOptionURI.equals("null")) {
                    isMultiAuthAvailable = false;
                } else {
                    int authenticatorIndex = multiOptionURI.indexOf("authenticators=");
                    if (authenticatorIndex == -1) {
                        isMultiAuthAvailable = false;
                    } else {
                        String authenticators = multiOptionURI.substring(authenticatorIndex + 15);
                        int authLastIndex = authenticators.indexOf("&") != -1 ? authenticators.indexOf("&") : authenticators.length();
                        authenticators = authenticators.substring(0, authLastIndex);
                        List<String> authList = new ArrayList<>(Arrays.asList(authenticators.split("%3B")));
                        if (authList.size() < 2) {
                            isMultiAuthAvailable = false;
                        }
                        else if (authList.size() == 2 && authList.contains("backup-code-authenticator%3ALOCAL")) {
                            isMultiAuthAvailable = false;
                        }
                    }
                }
                return isMultiAuthAvailable;
            }
        %>
    </body>
</html>
