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
<%@ page import="org.wso2.carbon.identity.local.auth.push.authenticator.util.AuthenticatorUtils" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%
    // Add the push-auth screen to the list to retrieve text branding customizations.
    screenNames.add("push-auth");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%!
    private static final String LOCAL_PUSH_AUTHENTICATOR_ID = "push-notification-authenticator";
%>

<%
    request.getSession().invalidate();

    if (StringUtils.isBlank(tenantDomain)) {
        tenantDomain = (String) session.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    }

    String authenticators = Encode.forUriComponent(request.getParameter("authenticators"));
    String numberChallengeConfig = "false";
    int enableResendTime = 60;
    String numberChallengeValue = null;
    String pushAuthId = null;
    if (authenticators.equals(LOCAL_PUSH_AUTHENTICATOR_ID)) {
        try {
            numberChallengeConfig = AuthenticatorUtils.getPushAuthenticatorConfig("PUSH.EnableNumberChallenge", tenantDomain);
            enableResendTime = Integer.parseInt(AuthenticatorUtils.getPushAuthenticatorConfig("PUSH.ResendNotificationTime", tenantDomain));
            numberChallengeValue = Encode.forUriComponent(request.getParameter("numberChallenge"));
            pushAuthId = Encode.forUriComponent(request.getParameter("pushAuthId"));
        } catch (Exception e) {
            // Exception is caught and ignored. The numberChallenge property will be kept as false.
        }
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

    String noAuthResponseMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "push.notification.no.auth.response");
    String mobileResponseReceived = AuthenticationEndpointUtil.i18n(resourceBundle, "push.notification.mobile.response.received");
%>

<% request.setAttribute("pageName", "push-auth"); %>

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

    <body class="login-portal layout push-auth-portal-layout" data-page="<%= request.getAttribute("pageName") %>">

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
                        <%= i18n(resourceBundle, customText, "push.auth.heading") %>
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
                        <form class="ui large form" id="submitForm" name="submitForm" action="<%=commonauthURL%>" method="POST">

                            <%-- auth failure message content --%>
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

                            <%-- polling response message content --%>
                            <div id="pollingResponse"></div>

                            <%-- Display notification success message and number challenge if enabled --%>
                            <div class="field">
                                <div id='responseReceived' class='ui green icon message transition hidden'>
                                    <div style="width: 30%; padding-left: 25px">
                                        <i class='big green check circle outline icon'></i>
                                    </div>
                                    <div style="width: 70%">
                                        <p><%= mobileResponseReceived %></p>
                                    </div>
                                </div>
                                <div id='noResponseMessage' class='ui negative message transition hidden' style='text-align: center;'><%= noAuthResponseMessage %></div>
                                <div id="instruction-div">
                                    <%
                                        if (Boolean.parseBoolean(numberChallengeConfig)) {
                                    %>
                                    <p class="text-center">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "push.notification.sent.msg.with.challenge")%>
                                    </p>
                                    <h3 class="text-center">
                                        <%= Encode.forHtmlContent(numberChallengeValue) %>
                                    </h3>
                                    <% } else { %>
                                    <p class="text-center">
                                        <%=i18n(resourceBundle, customText, "push.notification.sent.msg")%>
                                    </p>
                                    <% } %>
                                </div>

                                <div class="ui divider hidden"></div>
                            </div>

                            <input type="hidden" name="sessionDataKey"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                            <input id="multiOptionURI" type="hidden" name="multiOptionURI"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("multiOptionURI"))%>' />
                            <input type='hidden' name='scenario' id='scenario' value=''/>

                            <div class="buttons">
                                <button type="button"
                                        class="ui fluid large button primary mt-2"
                                        id="resend">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "resend.push.notification")%>
                                </button>

                                <%
                                    String multiOptionURI = request.getParameter("multiOptionURI");
                                    if (isMultiAuthAvailable(multiOptionURI) && AuthenticationEndpointUtil.isValidMultiOptionURI(multiOptionURI)) {
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
                $("#resend").click(function () {
                    document.getElementById("scenario").value = "RESEND_PUSH_NOTIFICATION";
                    $("#submitForm").submit();
                });
            });

            $(document).ready(handleWaitBeforeResendNotification);

            function handleWaitBeforeResendNotification() {
                // value should be less than 3600
                const WAIT_TIME_SECONDS = <%= enableResendTime %>;

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
                        // Stop polling when the countdown ends.
                        stopPolling();
                        document.getElementById("instruction-div").style.display = "none";
                        $("#noResponseMessage").transition("fade");
                    },
                    (time) => {
                        resendButton.innerHTML = time.minutes.toString().padStart(2, '0') + " : " + time.seconds.toString().padStart(2, '0');
                    },
                    "PUSH_NOTIFICATION_TIMER"
                ).start();

                startPolling();
            }

            let pollingInterval = null;

            function startPolling() {
                // Poll every 5 seconds

                const POLL_INTERVAL_MS = 5000;

                const urlParams = new URLSearchParams(window.location.search);
                var pushAuthId = null;
                if (urlParams.has('pushAuthId')) {
                    pushAuthId = encodeURIComponent(urlParams.get('pushAuthId'));
                }

                const STATUS_URL = "/push-auth/check-status?pushAuthId="+pushAuthId;

                pollingInterval = setInterval(() => {
                    $.ajax({
                        url: "<%= Encode.forJavaScriptBlock(identityServerEndpointContextParam)%>" + STATUS_URL,
                        type: "GET",
                        contentType: "application/json",
                        success: function (response) {
                            if (response.status === "COMPLETED") {
                                clearInterval(pollingInterval);
                                setTimeout(() => {
                                    document.getElementById("scenario").value = "PROCEED_PUSH_AUTHENTICATION";
                                    $("#submitForm").submit();
                                }, 2500);
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("Error occurred while polling for push notification status: " + error);
                        }
                    });
                }, POLL_INTERVAL_MS);
            }

            function stopPolling() {
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    pollingInterval = null;
                }
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

    </body>
</html>
