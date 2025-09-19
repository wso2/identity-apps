<%--
  ~ Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%
    // Add the email-otp screen to the list to retrieve text branding customizations.
    screenNames.add("email-otp");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

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
                List<String> authList = Arrays.asList(authenticators.split("%3B"));
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

<%
    request.getSession().invalidate();
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

<% request.setAttribute("pageName","email-otp"); %>

<html lang="en-US">
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
    <script type="text/javascript">
        function submitForm() {
            var insightsTenantIdentifier = "<%=userTenant%>";
            var code = document.getElementById("OTPCode").value;
            if (code == "") {
                document.getElementById('alertDiv').innerHTML
                    = '<div id="error-msg" class="ui negative message"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.enter.code")%></div>'
                    +'<div class="ui divider hidden"></div>';
            } else {
                if ($('#codeForm').data("submitted") === true) {
                    console.warn("Prevented a possible double submit event");
                } else {
                    trackEvent("authentication-portal-email-otp-click-continue", {
                        "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
                    });
                    $('#codeForm').data("submitted", true);
                    $('#codeForm').submit();
                }
            }
        }
    </script>
</head>

<body class="login-portal layout email-otp-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
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
                    <%= i18n(resourceBundle, customText, "email.otp.heading") %>
                </h2>
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
                <%
                    String resendCode = request.getParameter("resendCode");
                    if (resendCode != null && "true".equals(resendCode)) {
                %>
                <div id="resend-msg" class="ui positive message"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "resend.code.success")%></div>
                <div class="ui divider hidden"></div>
                <% } %>
                <div class="segment-form">
                    <form class="ui large form" id="codeForm" name="codeForm" action="<%=commonauthURL%>" method="POST">
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
                        <% if (request.getParameter("screenValue") != null) { %>
                        <div class="field">
                            <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.code")%>
                                (<%=Encode.forHtmlContent(request.getParameter("screenValue"))%>)
                            </label>
                            <%-- Input Description for Screen Readers --%>
                            <span id="OTPDescription" style="display: none;">Enter your OTP</span>
                            <div class="ui fluid icon input addon-wrapper">
                                <input
                                    type="text"
                                    id='OTPCode'
                                    name="OTPCode"
                                    c size='30'
                                    autocomplete="off"
                                    aria-describedby="OTPDescription"/>
                                <i id="password-eye" class="eye icon right-align password-toggle slash" onclick="showOTPCode()"></i>
                            </div>
                                <% } else { %>
                            <div class="field">
                                <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.code")%>
                                    :</label>
                                <div class="ui fluid icon input addon-wrapper">
                                    <input
                                        type="text"
                                        id='OTPCode'
                                        name="OTPCode"
                                        size='30'
                                        autocomplete="off"
                                        aria-describedby="OTPDescription"/>
                                    <i id="password-eye" class="eye icon right-align password-toggle slash" onclick="showOTPCode()"></i>
                                </div>
                                <% } %>
                            </div>
                            <input type="hidden" name="sessionDataKey"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                            <input type='hidden' name='resendCode' id='resendCode' value='false'/>

                            <div class="ui divider hidden"></div>

                            <% if (request.getParameter("multiOptionURI") != null &&
                                AuthenticationEndpointUtil.isValidURL(request.getParameter("multiOptionURI")) &&
                                request.getParameter("multiOptionURI").contains("backup-code-authenticator")) { %>
                                <div class="social-login blurring social-dimmer text-left">
                                        <div class="field text-left">
                                            <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "cannot.access.emailOTP")%></label>

                                            <a
                                                onclick="window.location.href='<%=commonauthURL%>?idp=LOCAL&authenticator=backup-code-authenticator&sessionDataKey=<%=Encode.forUriComponent(request.getParameter("sessionDataKey"))%>&multiOptionURI=<%=Encode.forUriComponent(request.getParameter("multiOptionURI"))%>';"
                                                target="_blank"
                                                class="clickable-link text-left"
                                                rel="noopener noreferrer"
                                                data-testid="login-page-backup-code-link"
                                            >
                                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "use.backup.code")%>
                                            </a>
                                        </div>
                                </div>
                            <% }%>
                            <div class="ui divider hidden"></div>
                            <div class="buttons">
                                <input type="button" name="authenticate" id="authenticate"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "authenticate")%>"
                                class="ui primary fluid button"/>
                                <a class="ui button fluid secondary mt-3" tabindex="0"
                                id="resend"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "resend.code")%>
                                </a>
                            </div>

                            <input id="multiOptionURI" type="hidden" name="multiOptionURI"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("multiOptionURI"))%>' />
                        <%
                            if (reCaptchaEnabled) {
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
                        <%
                            }
                        %>
                    </form>
                </div>
                <div class="ui divider hidden"></div>
                <%
                    String multiOptionURI = request.getParameter("multiOptionURI");
                    if (multiOptionURI != null && AuthenticationEndpointUtil.isValidMultiOptionURI(multiOptionURI) &&
                    isMultiAuthAvailable(multiOptionURI)) {
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
            $('#authenticate').click(function () {
                <% if (!reCaptchaEnabled) { %>
                    submitForm();
                <% } %>
            });
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
    </script>
</body>
</html>
