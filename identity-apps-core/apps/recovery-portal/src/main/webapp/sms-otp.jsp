<%--
  ~ Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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
<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>

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
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="tenant-resolve.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%!
    private static final String LOCAL_SMS_OTP_AUTHENTICATOR_ID = "sms-otp-authenticator";
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
            <layout:component componentName="MainSection">
              <div class="ui segment">
                      <%-- page content --%>
                      <h2>
                        Enter SMS OTP
                      </h2>
                      <div class="ui divider hidden"></div>
                      <% 
                       // todo : RNN : Change this to read from reqeust 
                        String authenticationFailed = "true";
                        String errorMessage = "OTP Verification Failed. Please Re-Enter.";
                       %> 
                      <%
                          if ("true".equals(authenticationFailed)) {
                      %>
                      <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%>
                      </div>
                      <div class="ui divider hidden"></div>
                      <% } %>
                      <div id="alertDiv"></div>
                      <div class="segment-form">
                          <form class="ui large form" id="codeForm" name="codeForm" action="passwordreset.do" method="POST">
                              <%
                                  String loginFailed = request.getParameter("authFailure");
                                  if (loginFailed != null && "true".equals(loginFailed)) {
                                      String authFailureMsg = request.getParameter("authFailureMsg");
                                      if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                              %>
                              <div class="ui negative message">
                              <%-- <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry")%> --%>
                              <span>Error while OTP verification. Please retry.</span>
                              </div>
                              <div class="ui divider hidden"></div>
                              <% }
                              } %>

                            <div class="field">
                                <% if (request.getParameter("screenValue") != null) { %>
                                    <label for="password">
                                        <%-- <%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.code.sent.smsotp")%> --%>
                                        <span>Please enter the OTP sent to </span>
                                        (<%=Encode.forHtmlContent(request.getParameter("screenValue"))%>)
                                    </label>
                                <% } else { %>
                                    <label for="password">
                                        <%-- <%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.code.sent.smsotp")%>: --%>
                                        <span>Please enter the OTP sent to given mobile.</span>
                                    </label>
                                <% } %>
                                <div class="ui fluid icon input addon-wrapper">
                                    <input type="text" id='OTPCode' name="OTPcode" size='30'/>
                                    <i id="password-eye" class="eye icon right-align password-toggle slash" onclick="showOTPCode()"></i>
                                </div>
                            </div>
                            <input type='hidden' name='recoveryStage' id='recoveryStage' value='INITIATE_CONFIRM'/>
                            <input type='hidden' name='channel' id='channel' value='<%=IdentityManagementEndpointConstants.PasswordRecoveryOptions.SMSOTP%>'/>

                            <div class="ui divider hidden"></div>

                            <div class="buttons">
                                <input type="submit"
                                    name="authenticate"
                                    id="authenticate"
                                    <%-- value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "authenticate")%>" --%>
                                    value="Authenticate"
                                    class="ui primary fluid large button"/>

                                <button type="button"
                                        class="ui fluid large button secondary mt-2"
                                        id="resend">
                                    <%-- <%=AuthenticationEndpointUtil.i18n(resourceBundle, "resend.code")%> --%>
                                    <span>Resend Code</span>
                                </button>
                            </div>
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

            $(document).ready(function () {
                $.fn.preventDoubleSubmission = function() {
                    $('#codeForm').on('submit',function(e){
                        if($('#codeForm').data("submitted") == true) {
                            e.preventDefault();
                            console.warn("Prevented a possible double submit event");
                        } else {
                            var code = document.getElementById("OTPCode").value;
                            var recoveryStageElement = document.getElementById("recoveryStage");
                            var isResend = recoveryStageElement.value === 'RESEND';
                            if (code == "" && !isResend) {
                                e.preventDefault();
                                document.getElementById('alertDiv').innerHTML
                                    <%-- = '<div id="error-msg" class="ui negative message"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.enter.code")%></div>' --%>
                                    = '<div id="error-msg" class="ui negative message"><span>OTP Cannot be empty</span></div>'
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
                    alert("clicked resend");
                    document.getElementById("recoveryStage").value = 'RESEND';
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

    </body>
</html>
