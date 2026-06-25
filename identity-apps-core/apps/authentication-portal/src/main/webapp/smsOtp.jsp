<%--
  ~ Copyright (c) 2022-2026, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.local.auth.smsotp.authenticator.util.AuthenticatorUtils" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>
<%@ include file="util/authenticator-utils.jsp" %>

<%
    // Add the sms-otp screen to the list to retrieve text branding customizations.
    screenNames.add("sms-otp");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%!
    private static final String LOCAL_SMS_OTP_AUTHENTICATOR_ID = "sms-otp-authenticator";
%>

<%
    request.getSession().invalidate();

    if (StringUtils.isBlank(tenantDomain)) {
        tenantDomain = (String) session.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    }

    String authenticators = Encode.forUriComponent(request.getParameter("authenticators"));
    int otpLength = 6;
    boolean isOnlyNumeric = true;
    if (authenticators.equals(LOCAL_SMS_OTP_AUTHENTICATOR_ID)) {
        try {
            otpLength = Integer.parseInt(AuthenticatorUtils.getSmsAuthenticatorConfig("SmsOTP.OTPLength", tenantDomain));
            isOnlyNumeric = AuthenticatorUtils.getSmsAuthenticatorConfig("SmsOTP.OtpRegex.UseNumericChars", tenantDomain).equals("true");
        } catch (Exception e) {
            // Exception is caught and ignored. otpLength will be kept as 6.
        }
    }

    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        String errorCode = request.getParameter("errorCode");
        if (StringUtils.isNotBlank(errorCode)) {
            String errorCodeKey = "error.sms.notification." + errorCode;
            String errorCodeMsg = AuthenticationEndpointUtil.i18n(resourceBundle, errorCodeKey);
            if (!errorCodeMsg.equalsIgnoreCase(errorCodeKey)) {
                errorMessage = errorCodeMsg;
            }
        } else if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            String error = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (error.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry.code.invalid");
            } else if (!error.equalsIgnoreCase(AuthenticationEndpointUtil.i18n(resourceBundle, error))) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, error);
            }
        }
    }
%>
<%
    boolean reCaptchaEnabled = false;
    if (request.getParameter("reCaptcha") != null && Boolean.parseBoolean(request.getParameter("reCaptcha"))) {
        reCaptchaEnabled = true;
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

        <%
            if (reCaptchaEnabled) {
                String reCaptchaAPI = CaptchaUtil.reCaptchaAPIURL();
        %>
            <script src='<%=(reCaptchaAPI)%>'></script>
        <%
            }
        %>
    </head>

    <body class="login-portal layout sms-otp-portal-layout" data-page="<%= request.getAttribute("pageName") %>">

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
            <layout:component componentName="MainSection">
              <div class="ui segment">
                      <%-- page content --%>
                      <h2>
                        <%= i18n(resourceBundle, customText, "sms.otp.heading") %>
                      </h2>
                      <div class="ui divider hidden"></div>
                      <%
                          if ("true".equals(authenticationFailed)) {
                      %>
                      <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%>
                      </div>
                      <div class="ui divider hidden"></div>
                      <% } %>
                      <div id="alertDiv"></div>
                      <div class="segment-form">
                          <form class="ui large form otp-form" id="codeForm" name="codeForm" action="<%=commonauthURL%>" method="POST">
                              <%
                                  String loginFailed = request.getParameter("authFailure");
                                  if (loginFailed != null && "true".equals(loginFailed)) {
                                      String authFailureMsg = request.getParameter("authFailureMsg");
                                      if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                              %>
                              <div class="ui negative message"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry")%>
                              </div>
                              <div class="ui divider hidden"></div>
                              <% }
                              } %>

                            <div class="field">
                                <%
                                    String screenValue = request.getParameter("screenValue");
                                    if (screenValue == null) {
                                        screenValue = request.getParameter("screenvalue");
                                    }
                                    if (screenValue != null) {
                                %>
                                    <label for="password">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.code.sent.smsotp")%>
                                        (<%=Encode.forHtmlContent(screenValue)%>)
                                    </label>
                                <% } else { %>
                                    <label for="password">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.code.sent.smsotp")%>:
                                    </label>
                                <% } %>

                                <% if (authenticators.equals(LOCAL_SMS_OTP_AUTHENTICATOR_ID) && otpLength <= 6) { %>
                                    <div class="sms-otp-fields equal width fields segmented-otp-field">
                                        <input
                                            type="text"
                                            id="OTPCode"
                                            name="OTPcode"
                                            class="segmented-otp-input"
                                            maxlength="<%=otpLength%>"
                                            autocomplete="one-time-code"
                                            autocorrect="off"
                                            autocapitalize="off"
                                            spellcheck="false"
                                            inputmode="<%= isOnlyNumeric ? "numeric" : "text" %>"
                                            autofocus
                                            aria-label="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "verification.code")%>"
                                        >
                                        <% for (int index = 1; index <= otpLength; index++) { %>
                                        <div class="field mt-5">
                                            <div class="text-center p-1 pb-3 pt-3" id="pincode-<%=index%>" aria-hidden="true">·</div>
                                        </div>
                                        <% } %>
                                    </div>
                                <% } else { %>
                                    <div class="ui fluid icon input addon-wrapper">
                                        <input type="text" id='OTPCode' name="OTPcode" size='30'
                                            autocomplete="one-time-code"
                                            autocorrect="off"
                                            autocapitalize="off"
                                            spellcheck="false"
                                            inputmode="<%= isOnlyNumeric ? "numeric" : "text" %>"/>
                                        <i id="password-eye" class="eye icon right-align password-toggle slash" onclick="showOTPCode()"></i>
                                    </div>
                                <% } %>
                            </div>

                                  <input type="hidden" name="sessionDataKey"
                                      value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                                  <input id="multiOptionURI" type="hidden" name="multiOptionURI"
                                     value='<%=Encode.forHtmlAttribute(request.getParameter("multiOptionURI"))%>' />
                                  <input type='hidden' name='resendCode' id='resendCode' value='false'/>

                                  <div class="ui divider hidden"></div>

                                  <% if(request.getParameter("multiOptionURI") != null &&
                                          request.getParameter("multiOptionURI").contains("backup-code-authenticator")) { %>
                                      <div class="social-login blurring social-dimmer text-left">
                                          <div class="field text-left">
                                              <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "cannot.access.smsotp")%></label>

                                              <a
                                                  onclick="window.location.href='<%=commonauthURL%>?idp=LOCAL&authenticator=backup-code-authenticator&sessionDataKey=<%=Encode.forUriComponent(request.getParameter("sessionDataKey"))%>&multiOptionURI=<%=Encode.forUriComponent(request.getParameter("multiOptionURI"))%>';"
                                                  target="_blank"
                                                  class="clickable-link text-left ui form"
                                                  rel="noopener noreferrer"
                                                  data-testid="login-page-backup-code-link"
                                                  style="cursor: pointer;display:block"
                                              >
                                                  <%=AuthenticationEndpointUtil.i18n(resourceBundle, "use.backup.code")%>
                                              </a>
                                          </div>
                                      </div>
                                  <% }%>

                                <div class="buttons">
                                    <% if (authenticators.equals(LOCAL_SMS_OTP_AUTHENTICATOR_ID) && otpLength <= 6) { %>
                                        <div>
                                            <input type="submit"
                                                id="subButton"
                                                disabled
                                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "authenticate")%>"
                                                class="ui primary fluid large button" />
                                        </div>
                                    <% } else { %>
                                        
                                        <% if (!reCaptchaEnabled) { %>
                                            <input type="submit"
                                                name="authenticate"
                                                id="authenticate"
                                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "authenticate")%>"
                                                class="ui primary fluid large button"/>
                                        <% } else { %>
                                            <input type="button"
                                                name="authenticate"
                                                id="authenticate"
                                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "authenticate")%>"
                                                class="ui primary fluid large button"/>
                                        <% } %>
                                    <% } %>

                                    <button type="button"
                                            class="ui fluid large button secondary mt-2"
                                            id="resend">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "resend.code")%>
                                    </button>

                                    <%
                                        String multiOptionURI = request.getParameter("multiOptionURI");
                                        if (multiOptionURI != null && AuthenticationEndpointUtil.isValidMultiOptionURI(multiOptionURI) && isMultiAuthAvailable(multiOptionURI, request.getParameter("authenticators"))) {
                                    %>
                                        <div class="ui divider hidden"></div>
                                        <a
                                            class="ui fluid primary basic button link-button"
                                            id="goBackLink"
                                            href='<%=Encode.forHtmlAttribute(multiOptionURI)%>'
                                        >
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "choose.other.option")%>
                                        </a>
                                    <% } %>
                                </div>

                                <%
                                    if (reCaptchaEnabled && otpLength <= 6) {
                                        String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
                                %>
                                    <div class="field">
                                        <div class="g-recaptcha"
                                            data-sitekey="<%=Encode.forHtmlAttribute(reCaptchaKey)%>"
                                            data-testid="login-page-g-recaptcha"
                                            data-bind="subButton"
                                            data-callback="sub"
                                            data-theme="light"
                                            data-tabindex="-1"
                                        >
                                        </div>
                                    </div>
                                <%
                                    } else if (reCaptchaEnabled && otpLength > 6) {
                                        String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
                                %>
                                    <div class="field">
                                        <div class="g-recaptcha"
                                            data-sitekey="<%=Encode.forHtmlAttribute(reCaptchaKey)%>"
                                            data-testid="login-page-g-recaptcha"
                                            data-bind="authenticate"
                                            data-callback="submitForm"
                                            data-theme="light"
                                            data-tabindex="-1"
                                        >
                                        </div>
                                    </div>
                                <% } %>
                          </form>
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

            (function() {
                var OTPInput = document.getElementById('OTPCode');
                if (!OTPInput || !OTPInput.classList.contains('segmented-otp-input')) return;
                var submitBtn = document.getElementById('subButton');
                var otpLen = parseInt(otpLength);
                var isOnlyNumeric = <%= isOnlyNumeric %>;

                function updateDigitBoxes(value) {
                    for (var i = 1; i <= otpLen; i++) {
                        var box = document.getElementById('pincode-' + i);
                        if (box) box.textContent = (value.length >= i) ? value[i - 1] : '·';
                    }
                }

                function updateCursor(value) {
                    for (var i = 1; i <= otpLen; i++) {
                        var box = document.getElementById('pincode-' + i);
                        if (box) box.classList.remove('active-pincode');
                    }
                    if (value.length < otpLen) {
                        var activeBox = document.getElementById('pincode-' + (value.length + 1));
                        if (activeBox) activeBox.classList.add('active-pincode');
                    }
                }

                function handlePaste(e) {
                    e.preventDefault();
                    var pasted = (e.clipboardData || window.clipboardData).getData('Text').replace(/\s/g, '');
                    var isValid = isOnlyNumeric ? /^\d+$/.test(pasted) : pasted.length > 0;
                    if (!isValid) return;
                    OTPInput.value = pasted.slice(0, otpLen);
                    OTPInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
                }

                function handleKeypress(e) {
                    if (!isOnlyNumeric) return;
                    var char = String.fromCharCode(e.which);
                    if (!/\d/.test(char)) e.preventDefault();
                }

                function handleInput() {
                    var sanitized = isOnlyNumeric ? OTPInput.value.replace(/\D/g, '') : OTPInput.value.replace(/\s/g, '');
                    if (sanitized !== OTPInput.value) OTPInput.value = sanitized;
                    updateDigitBoxes(sanitized);
                    updateCursor(sanitized);
                    if (submitBtn) submitBtn.disabled = sanitized.length !== otpLen;
                }

                document.addEventListener('selectionchange', function () {
                    if (document.activeElement === OTPInput) {
                        OTPInput.selectionStart = OTPInput.selectionEnd = OTPInput.value.length;
                    }
                });
                OTPInput.addEventListener('copy', function (e) { e.preventDefault(); });
                OTPInput.addEventListener('cut', function (e) { e.preventDefault(); });
                OTPInput.addEventListener('focus', function () { updateCursor(this.value); });
                OTPInput.addEventListener('blur', function () { updateCursor(Array(otpLen + 1).join('x')); });
                OTPInput.addEventListener('keypress', handleKeypress);
                OTPInput.addEventListener('paste', handlePaste);
                OTPInput.addEventListener('input', handleInput);
                updateCursor(OTPInput.value);
            })();

            // Shim retained so reCaptcha data-callback="sub" continues to submit the form
            // when captcha is solved (segmented + reCaptcha-enabled case).
            function sub() {
                var OTPInput = document.getElementById('OTPCode');
                if (!OTPInput || OTPInput.value.length < parseInt(otpLength)) return;
                trackEvent("authentication-portal-sms-otp-click-continue", {
                    "tenant": insightsTenantIdentifier != "null" ? insightsTenantIdentifier : ""
                });
                document.getElementById("subButton").disabled = true;
                document.getElementById("codeForm").submit();
            }

            function submitForm() {

                var insightsTenantIdentifier = "<%=userTenant%>";
                var code = document.getElementById("OTPCode").value;
                if (code == "") {
                    document.getElementById('alertDiv').innerHTML
                        = '<div id="error-msg" class="ui negative message"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.enter.code")%></div>'
                        +'<div class="ui divider hidden"></div>';
                } else {
                    if ($('#codeForm').data("submitted") === true) {
                        console.log("Prevented a possible double submit event from Submit Form");
                        console.warn("Prevented a possible double submit event");
                    } else {
                        trackEvent("authentication-portal-sms-otp-click-continue", {
                            "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
                        });
                        $('#codeForm').submit();
                    }
                }
            }

            $(document).ready(function () {
                $.fn.preventDoubleSubmission = function() {
                    $('#codeForm').on('submit',function(e){
                        if($('#codeForm').data("submitted") == true) {
                            e.preventDefault();
                            console.warn("Prevented a possible double submit event");
                        } else {
                            var code = document.getElementById("OTPCode").value;
                            var resendFlagElement = document.getElementById("resendCode");
                            var isResend = resendFlagElement.value;
                            if (code == "" && isResend == "false") {
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

            $(document).ready(function () {
                $('#subButton').click(function () {
                    <% if (!reCaptchaEnabled) { %>
                        sub();
                        return false;
                    <% } %>
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

    </body>
</html>
