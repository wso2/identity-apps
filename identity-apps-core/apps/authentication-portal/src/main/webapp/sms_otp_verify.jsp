<%--
~ Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="com.google.gson.Gson" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.base.MultitenantConstants" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.SelfRegisterApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.CodeValidationRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Property" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.ResendCodeRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    request.getSession().invalidate();

    if (StringUtils.isBlank(tenantDomain)) {
        tenantDomain = (String) session.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    }

    String verificationFailed = "false";
    String otpResendFailed = "false";

    if ("true".equals(request.getParameter("validateCode"))) {
        try {
            String code = request.getParameter("OTPcode");
            String sessionDataKey = request.getParameter("sessionDataKey");

            List<Property> properties = new ArrayList<>();
            Property tenantDomainProperty = new Property();
            tenantDomainProperty.setKey(MultitenantConstants.TENANT_DOMAIN);
            tenantDomainProperty.setValue(tenantDomain);
            properties.add(tenantDomainProperty);

            CodeValidationRequest validationRequest = new CodeValidationRequest();
            validationRequest.setCode(code);
            validationRequest.setProperties(properties);
            SelfRegisterApi selfRegisterApi = new SelfRegisterApi();
            selfRegisterApi.validateCodePostCall(validationRequest);

            // Redirect to commonauth
            String redirectURL = commonauthURL + "?sessionDataKey=" + java.net.URLEncoder.encode(sessionDataKey, "UTF-8");
            response.sendRedirect(redirectURL);
            return;
        } catch (Exception e) {
            verificationFailed = "true";
        }
    }

    if ("true".equals(request.getParameter("resendCode"))) {
        try {
            String authAPIURL = application.getInitParameter(Constants.AUTHENTICATION_REST_ENDPOINT_URL);
            if (StringUtils.isBlank(authAPIURL)) {
                authAPIURL = IdentityManagementEndpointUtil.getBasePath(tenantDomain, "/api/identity/auth/v1.1/", true);
            } else {
                authAPIURL = AuthenticationEndpointUtil.resolveTenantDomain(authAPIURL);
            }
            if (!authAPIURL.endsWith("/")) {
                authAPIURL += "/";
            }
            authAPIURL += "context/" + request.getParameter("sessionDataKey");
            String contextProperties = AuthContextAPIClient.getContextProperties(authAPIURL);
            Gson gson = new Gson();
            Map data = gson.fromJson(contextProperties, Map.class);

            User user = IdentityManagementServiceUtil.getInstance().resolveUser((String) data.get("username"), tenantDomain, true);
            List<Property> properties = new ArrayList<>();
            Property scenrioProperty = new Property();
            scenrioProperty.setKey("RecoveryScenario");
            scenrioProperty.setValue((String) data.get("recoveryScenario"));
            properties.add(scenrioProperty);
            ResendCodeRequest resendCodeRequest = new ResendCodeRequest();
            resendCodeRequest.setUser(user);
            resendCodeRequest.setProperties(properties);

            SelfRegisterApi selfRegisterApi = new SelfRegisterApi();
            selfRegisterApi.resendCodePostCall(resendCodeRequest);
        } catch (Exception e) {
            otpResendFailed = "true";
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
                        <%= i18n(resourceBundle, customText, "sms.otp.heading") %>
                    </h2>
                    <div class="ui divider hidden"></div>
                        <%
                            if ("true".equals(verificationFailed)) {
                        %>
                            <div class="ui negative message" id="failed-msg">
                                <%= AuthenticationEndpointUtil.i18n(resourceBundle, "verify.code.invalid") %>
                            </div>
                            <div class="ui divider hidden"></div>
                        <% } %>
                    <div id="alertDiv"></div>

                    <div class="segment-form">
                    <form id="codeForm" method="post" action="">
                        <input type="hidden" name="validateCode" value="true"/>
                        <%
                            if ("true".equals(request.getParameter("resendCode"))) {
                                if ("false".equals(otpResendFailed)) {
                        %>
                                <div id="resend-msg" class="ui positive message">
                                    <%= AuthenticationEndpointUtil.i18n(resourceBundle, "resend.code.success") %>
                                </div>
                                <div class="ui divider hidden"></div>
                            <%
                                }
                                if ("true".equals(otpResendFailed)) {
                            %>
                                <div id="resend-msg" class="ui negative message">
                                    <%= AuthenticationEndpointUtil.i18n(resourceBundle, "sms.resend.code.failed") %>
                                </div>
                                <div class="ui divider hidden"></div>
                            <%
                                }
                            }
                        %>

                        <div class="field">
                            <label for="password">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.code.sent.smsotp")%>:
                            </label>

                            <div class="ui fluid icon input addon-wrapper">
                                <input type="text" id='OTPCode' name="OTPcode" size='30'/>
                                <i id="password-eye" class="eye icon right-align password-toggle slash" onclick="showOTPCode()"></i>
                            </div>
                        </div>

                        <input type="hidden" name="sessionDataKey"
                            value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                        <input type='hidden' name='resendCode' id='resendCode' value='false'/>

                        <div class="ui divider hidden"></div>

                        <div class="buttons">

                            <input type="submit"
                                name="authenticate"
                                id="authenticate"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "authenticate")%>"
                                class="ui primary fluid large button"/>

                            <button type="button"
                                    class="ui fluid large button secondary mt-2"
                                    id="resend">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "resend.code")%>
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
            var insightsTenantIdentifier = "<%=userTenant%>";

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
                    $("input[name='validateCode']").remove();
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
    </body>
</html>
