<%--
~ Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
~
~ WSO2 LLC. licenses this file to you under the Apache License,
~ Version 2.0 (the "License"); you may not use this file except
~ in compliance with the License.
~ You may obtain a copy of the License at
~
~ http://www.apache.org/licenses/LICENSE-2.0
~
~ Unless required by applicable law or agreed to in writing,
~ software distributed under the License is distributed on an
~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
~ KIND, either express or implied.  See the License for the
~ specific language governing permissions and limitations
~ under the License.
--%>

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="org.wso2.carbon.identity.governance.IdentityGovernanceService" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Optional" %>
<%@ page import="org.wso2.carbon.identity.local.auth.smsotp.authenticator.util.AuthenticatorUtils" %>
<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%
    // Add the sms-otp and email-otp screen to the list to retrieve text branding customizations.
    screenNames.add("sms-otp");
    screenNames.add("email-otp");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%!
    private static final String LOCAL_SMS_OTP_AUTHENTICATOR_ID = "sms-otp-authenticator";
    private static final String RECOVERY_CONNECTOR = "account-recovery";
    private static final String ACCOUNT_MANAGEMENT_GOVERNANCE_DOMAIN = "Account Management";
    private static final String PROP_ACCOUNT_PASSWORD_RECOVERY_OTP_LENGTH =
        "Recovery.Notification.Password.OTP.OTPLength";
%>

<%
    request.getSession().invalidate();
    if (StringUtils.isBlank(tenantDomain)) {
        tenantDomain = (String) session.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    }

    int otpLength = 10;
    try {
        Optional<String> optionalOtpLength = new PreferenceRetrievalClient().getPropertyValue(
            tenantDomain,
            ACCOUNT_MANAGEMENT_GOVERNANCE_DOMAIN,
            RECOVERY_CONNECTOR,
            PROP_ACCOUNT_PASSWORD_RECOVERY_OTP_LENGTH);
        otpLength = Integer.parseInt(optionalOtpLength.get());
    } catch (Exception e) {
        // Exception is caught and ignored. otpLength will be kept as 10 to trigger the full input field.
    }

    String username = Encode.forJava(request.getParameter("username"));
    if (username == null) {
        username = (String) request.getAttribute("username");
    }
    String urlQuery = request.getParameter("urlQuery");
    if (urlQuery == null) {
        urlQuery = (String) request.getAttribute("urlQuery");
    }
    String channel = (String) request.getAttribute("channel");
    if (channel == null) {
        channel = Encode.forJava(request.getParameter("channel"));
    }
    boolean isEmailOtp = IdentityManagementEndpointConstants.PasswordRecoveryOptions.EMAIL.equals(channel);
    String errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "error");
    boolean authenticationFailed = Boolean.parseBoolean((String)request.getAttribute("isAuthFailure"));
    boolean resendFailed = Boolean.parseBoolean((String)request.getAttribute("isResendFailure"));
    boolean isMultiRecoveryOptionsAvailable =
        Boolean.parseBoolean(request.getParameter("isMultiRecoveryOptionsAvailable")) ||
        Boolean.parseBoolean((String)request.getAttribute("isMultiRecoveryOptionsAvailable"));

    if (authenticationFailed) {
        if (request.getAttribute("authFailureMsg") != null) {
            String errorMessageAttr = (String)request.getAttribute("authFailureMsg");
            if (errorMessageAttr.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "error.retry.code.invalid");
            }
        }
    } else if (resendFailed) {
        if (request.getAttribute("resendFailureMsg") != null) {
            String errorMessageAttr = (String)request.getAttribute("resendFailureMsg");
            if (errorMessageAttr.equalsIgnoreCase("resend.fail.message")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(
                    recoveryResourceBundle, "resend.time.exceed.or.max.resend.count.exceed");
            }
        }
    }
%>

<% request.setAttribute("pageName", "sms-otp"); %>

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

        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="login-portal layout sms-otp-portal-layout" data-page="<%= request.getAttribute("pageName") %>">

        <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
            <jsp:include page="extensions/timeout.jsp"/>
        <% } else { %>
            <jsp:include page="util/timeout.jsp"/>
        <% } %>

        <layout:main layoutName="<%= layout %>"
            layoutFileRelativePath="<%=layoutFileRelativePath%>" data="<%= layoutData %>" >
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
            <layout:component componentName="MainSection">
            <div class="ui segment">
                    <%-- page content --%>
                    <h2>
                    <%= i18n(recoveryResourceBundle, customText,
                            isEmailOtp ? "email.otp.heading" : "sms.otp.heading") %>
                    </h2>
                    <div class="ui divider hidden"></div>
                    <%
                        if (authenticationFailed || resendFailed) {
                    %>
                    <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%>
                    </div>
                    <div class="ui divider hidden"></div>
                    <% } %>
                    <%
                        if ("true".equals(String.valueOf((Object)request.getAttribute("resendSuccess")))) {
                            String resendSuccessMessage = isEmailOtp ? "resend.code.success.email"
                                                                     : "resend.code.success";
                    %>
                    <div id="resend-msg" class="ui positive message">
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, resendSuccessMessage)%>
                    </div>
                    <%
                        }
                    %>
                    <div id="alertDiv"></div>
                    <div class="segment-form">
                        <form class="ui large form" id="codeForm" name="codeForm"
                            action="passwordrecoveryotp.do" method="POST">
                            <%
                                String loginFailed = request.getParameter("authFailure");
                                if (loginFailed != null && "true".equals(loginFailed)) {
                                    String authFailureMsg = request.getParameter("authFailureMsg");
                                    if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                            %>
                            <div class="ui negative message">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "error.retry")%>
                            </div>
                            <div class="ui divider hidden"></div>
                            <% }
                            } %>

                            <div class="field">
                                <% String otpHeader = isEmailOtp ? "enter.code.sent.emailotp" : "enter.code.sent.smsotp"; %>
                                <label for="password" class="text-center">
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                       otpHeader)%>
                                </label>

                                <% if (otpLength <= 6) { %>
                                    <div class="sms-otp-fields equal width fields">
                                        <input
                                            hidden
                                            type="text"
                                            id="OTPCode"
                                            name="OTPcode"
                                            class="form-control"
                                            data-testid="recovery-otp-page-segmented-otp-input"
                                            placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                                "verification.code")%>"
                                        >
                                        <% for (int index = 1; index <= otpLength;) {
                                            String previousStringIndex = null;
                                            if (index != 1) {
                                                previousStringIndex = "pincode-" + (index - 1);
                                            }
                                            String currentStringIndex = "pincode-" + index;
                                            index++;
                                            String nextStringIndex = null;
                                            if (index != (otpLength + 1)) {
                                                nextStringIndex = "pincode-" + index;
                                            }
                                        %>
                                            <div class="field mt-5">
                                                <input
                                                    class="text-center pl-0 pr-0 pt-3 pb-3"
                                                    id=<%= currentStringIndex %>
                                                    name=<%= currentStringIndex %>
                                                    onkeyup="movetoNext(this, '<%= nextStringIndex %>',
                                                        '<%= previousStringIndex %>')"
                                                    tabindex="1"
                                                    placeholder="·"
                                                    autofocus
                                                    maxlength="1"
                                                >
                                            </div>
                                        <% } %>
                                    </div>
                                <% } else { %>
                                    <div class="ui fluid icon input addon-wrapper mt-3">
                                        <input
                                            type="text"
                                            id='OTPCode'
                                            name="OTPcode"
                                            size='30'
                                            data-testid="recovery-otp-page-non-segmented-otp-input"
                                        />
                                        <i id="password-eye" class="eye icon right-align password-toggle slash"
                                            onclick="showOTPCode()"></i>
                                    </div>
                                <% } %>
                            </div>

                            <input type='hidden' name='username'
                                value='<%=Encode.forHtmlAttribute(username)%>'/>
                            <input type="hidden" name="channel"
                                value='<%=isEmailOtp ? IdentityManagementEndpointConstants.PasswordRecoveryOptions.EMAIL
                                        : IdentityManagementEndpointConstants.PasswordRecoveryOptions.SMSOTP%>'/>
                            <input type="hidden" id="recoveryStage" name="recoveryStage"
                                value='CONFIRM'/>
                            <input type="hidden" name="resendCode"
                                value='<%=Encode.forHtmlAttribute((String)request.getAttribute("resendCode"))%>'/>
                            <input type="hidden" name="sp"
                                value='<%=Encode.forHtmlAttribute((String)request.getAttribute("sp"))%>'/>
                            <input type="hidden" name="spId"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("spId"))%>'/>
                            <input type="hidden" name="flowConfirmationCode"
                                value='<%=Encode.forHtmlAttribute(
                                    (String)request.getAttribute("flowConfirmationCode"))%>'/>
                            <input type="hidden" name="sessionDataKey"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                            <input id="multiOptionURI" type="hidden" name="multiOptionURI"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("multiOptionURI"))%>' />
                            <input type='hidden' name='resendFlagElement' id='resendFlagElement' value='false'/>
                            <input type="hidden" name="isMultiRecoveryOptionsAvailable"
                                value='<%=isMultiRecoveryOptionsAvailable%>' />
                            <input type="hidden" name="urlQuery" value='<%=Encode.forHtmlAttribute(urlQuery)%>'/>

                            <div class="ui divider hidden"></div>

                            <% if(request.getParameter("multiOptionURI") != null &&
                                    request.getParameter("multiOptionURI").contains("backup-code-authenticator")) { %>
                                <div class="social-login blurring social-dimmer text-left">
                                    <div class="field text-left">
                                        <label>
                                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                            "cannot.access.smsotp")%>
                                        </label>
                                        <a
                                            onclick="window.location.href = '<%= commonauthURL %>?' +
                                                'idp=LOCAL&authenticator=backup-code-authenticator&sessionDataKey=' +
                                                '<%=Encode.forUriComponent(request.getParameter("sessionDataKey"))%>' +
                                                '&multiOptionURI=<%=Encode.forUriComponent(
                                                request.getParameter("multiOptionURI")) %>';"
                                            target="_blank"
                                            class="clickable-link text-left ui form"
                                            rel="noopener noreferrer"
                                            data-testid="login-page-backup-code-link"
                                            style="cursor: pointer;display:block"
                                        >
                                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                                "use.backup.code")%>
                                        </a>
                                    </div>
                                </div>
                            <% } %>

                                <div class="buttons">
                                    <% if (otpLength <= 6) { %>
                                        <div>
                                            <input type="button"
                                                id="subButton"
                                                onclick="sub(); return false;"
                                                value="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                                    "sms.otp.submit.button")%>"
                                                class="ui primary fluid large button" />
                                        </div>
                                    <% } else { %>
                                        <input type="submit"
                                            name="authenticate"
                                            id="authenticate"
                                            value="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                                "sms.otp.submit.button")%>"
                                            class="ui primary fluid large button"/>
                                    <% } %>

                                    <button type="button"
                                            class="ui fluid large button secondary mt-2"
                                            id="resend">
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                            "sms.otp.resend.code")%>
                                    </button>
                                </div>
                        </form>
                        <% if (isMultiRecoveryOptionsAvailable) { %>
                            <div class="text-center mt-1">
                                <%
                                    String baseUrl = ServiceURLBuilder.create()
                                        .addPath("/accountrecoveryendpoint/recoveraccountrouter.do").build()
                                        .getRelativePublicURL();
                                    String multiOptionPathWithQuery;
                                    String selectedOption = isEmailOtp ? "EMAIL" : "SMSOTP";
                                    if (urlQuery.contains("&username=")) {
                                        multiOptionPathWithQuery =
                                            urlQuery.replaceAll("(&username=)[^&]+", "$1" + username);
                                    } else {
                                        multiOptionPathWithQuery = urlQuery + "&username=" + username
                                            + "&selectedOption=" + selectedOption;
                                    }
                                %>
                                <a class="ui primary basic button link-button" id="goBackLink"
                                    href=<%=Encode.forHtmlAttribute(baseUrl + "?" + multiOptionPathWithQuery)%>>
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                            "choose.other.option")%>
                                </a>
                            </div>
                        <% } %>
                    </div>
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
            <layout:dynamicComponent filePathStoringVariableName="pathOfDynamicComponent">
                <jsp:include page="${pathOfDynamicComponent}" />
            </layout:dynamicComponent>
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
                const reg = new RegExp(/^[a-zA-Z0-9_]+$/);
                if (reg.test(value)) {
                    for (n = 0; n < 6; ++n) {
                        $("#pincode-" + (n+1)).val(value[n]);
                        $("#pincode-" + (n+1)).focus();
                    }
                }
            }

            document.getElementById('pincode-1') ? document.getElementById('pincode-1')
                .addEventListener('paste', handlePaste) : null;

            $(document).ready(function () {
                $.fn.preventDoubleSubmission = function() {
                    $('#codeForm').on('submit',function(e){
                        if($('#codeForm').data("submitted") == true) {
                            e.preventDefault();
                            console.warn("Prevented a possible double submit event");
                        } else {
                            var code = document.getElementById("OTPCode").value;
                            var resendFlagElement = document.getElementById("resendFlagElement");
                            var isResend = resendFlagElement.value;
                            if (code == "" && isResend == "false") {
                                e.preventDefault();
                                document.getElementById('alertDiv').innerHTML
                                    = '<div id="error-msg" class="ui negative message"><%=IdentityManagementEndpointUtil
                                    .i18n(recoveryResourceBundle, "error.enter.code")%></div>'
                                    +'<div class="ui divider hidden"></div>';
                            } else {
                                $('#codeForm').data("submitted", true);
                            }
                        }
                    });
                };
                $('#codeForm').preventDoubleSubmission();
            });

            $(document).ready(function () {
                $('#resend').click(function () {
                    document.getElementById("resendFlagElement").value = "true";
                    document.getElementById("recoveryStage").value = "RESEND";
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
                resendButton.innerHTML = Math.floor(WAIT_TIME_SECONDS / 60).toString().padStart(2, '0') + " : "
                    + (WAIT_TIME_SECONDS % 60).toString().padStart(2, '0');

                const countdown = new Countdown(
                    Countdown.seconds(WAIT_TIME_SECONDS),
                    () => {
                        resendButton.innerHTML = resendButtonText;
                        resendButton.disabled = false;
                    },
                    (time) => {
                        resendButton.innerHTML = time.minutes.toString().padStart(2, '0') + " : "
                            + time.seconds.toString().padStart(2, '0');
                    },
                    "SMS_OTP_TIMER"
                ).start();
            }
        </script>
    </body>
</html>
