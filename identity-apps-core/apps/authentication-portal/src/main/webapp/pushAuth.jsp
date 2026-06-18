<%--
  ~ Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
<%@ include file="util/authenticator-utils.jsp" %>

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

    // Whether the user is allowed to enroll an additional device. Sent by the push authenticator.
    boolean canRegisterDevice = Boolean.parseBoolean(request.getParameter("canRegisterDevice"));
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

                                <% if (canRegisterDevice) { %>
                                    <div class="ui divider hidden"></div>
                                    <a
                                        class="ui fluid primary basic button link-button"
                                        id="registerNewDeviceLink"
                                        href="javascript:void(0);"
                                    >
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "push.register.new.device")%>
                                    </a>
                                <% } %>

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

            /*
             * sessionStorage key for the current challenge's start timestamp. Resolved once at script load so the
             * resend click handler and the polling-completed branch can clear it before the page navigates to its
             * next state. The key is scoped per pushAuthId so parallel auth flows in other tabs cannot collide.
             */
            const PUSH_AUTH_URL_PARAMS = new URLSearchParams(window.location.search);
            const CURRENT_PUSH_AUTH_ID = PUSH_AUTH_URL_PARAMS.has('pushAuthId')
                ? PUSH_AUTH_URL_PARAMS.get('pushAuthId')
                : null;
            const PUSH_AUTH_STORAGE_KEY = CURRENT_PUSH_AUTH_ID
                ? "push-auth-started:" + CURRENT_PUSH_AUTH_ID
                : null;

            function clearPushAuthStartedEntry() {
                if (PUSH_AUTH_STORAGE_KEY) {
                    sessionStorage.removeItem(PUSH_AUTH_STORAGE_KEY);
                }
            }

            $(document).ready(function () {
                $("#resend").click(function () {
                    // The current challenge is about to be replaced by a fresh one with a new pushAuthId; drop
                    // the stored start timestamp so the orphan entry does not linger for the rest of the tab.
                    clearPushAuthStartedEntry();
                    document.getElementById("scenario").value = "RESEND_PUSH_NOTIFICATION";
                    $("#submitForm").submit();
                });

                $("#registerNewDeviceLink").click(function () {
                    // Stop polling for the current authentication and route the user to enroll a new device.
                    // The entry stays — coming back via the Back button will reuse it to resume the countdown.
                    stopPolling();
                    document.getElementById("scenario").value = "PUSH_DEVICE_ENROLLMENT";
                    $("#submitForm").submit();
                });
            });

            $(document).ready(handleWaitBeforeResendNotification);

            function handleWaitBeforeResendNotification() {
                const DEFAULT_WAIT_TIME_SECONDS = <%= enableResendTime %>;
                const RESEND_INTERVAL_MS = DEFAULT_WAIT_TIME_SECONDS * 1000;

                /*
                 * Compute the remaining countdown from a per-pushAuthId timestamp stored in sessionStorage. On the
                 * first visit to a given challenge, we record the current time and use the full configured wait
                 * window. On any subsequent visit to the same wait page — e.g. the user navigated to the
                 * additional-device registration page and came back via the Back button — we read the stored
                 * timestamp and use whatever time is left. If the window has elapsed, we render in expired mode
                 * (Resend Notification enabled, no countdown, no polling) without contacting the server.
                 */
                let startedAt;
                if (PUSH_AUTH_STORAGE_KEY) {
                    const stored = sessionStorage.getItem(PUSH_AUTH_STORAGE_KEY);
                    if (stored) {
                        startedAt = parseInt(stored, 10);
                    } else {
                        startedAt = Date.now();
                        sessionStorage.setItem(PUSH_AUTH_STORAGE_KEY, String(startedAt));
                    }
                } else {
                    // Defensive: no pushAuthId on the URL. Just use defaults, no storage interaction.
                    startedAt = Date.now();
                }

                const REMAINING_SECONDS = Math.max(
                    0,
                    Math.floor((startedAt + RESEND_INTERVAL_MS - Date.now()) / 1000)
                );

                const resendButton = document.getElementById("resend");
                const resendButtonText = resendButton.innerHTML;

                // Expired-mode short-circuit: render the page in its post-countdown state without scheduling a
                // countdown or polling. The user can manually click Resend to start a fresh challenge.
                if (REMAINING_SECONDS <= 0) {
                    resendButton.disabled = false;
                    resendButton.innerHTML = resendButtonText;
                    document.getElementById("instruction-div").style.display = "none";
                    $("#noResponseMessage").transition("fade");
                    return;
                }

                resendButton.disabled = true;
                // Update the button text initially to avoid waiting until the first tick to update.
                resendButton.innerHTML = Math.floor(REMAINING_SECONDS / 60).toString().padStart(2, '0') + " : " + (REMAINING_SECONDS % 60).toString().padStart(2, '0');

                const countdown = new Countdown(
                    Countdown.seconds(REMAINING_SECONDS),
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

                /*
                 * Defensive guard: do not poll when there is no real challenge to poll. Polling an empty id would
                 * either receive nothing meaningful or create a phantom PENDING cache entry on the server.
                 */
                if (!CURRENT_PUSH_AUTH_ID) {
                    return;
                }

                const STATUS_URL = "/push-auth/check-status?pushAuthId=" + encodeURIComponent(CURRENT_PUSH_AUTH_ID);

                pollingInterval = setInterval(() => {
                    $.ajax({
                        url: "<%= Encode.forJavaScriptBlock(identityServerEndpointContextParam)%>" + STATUS_URL,
                        type: "GET",
                        contentType: "application/json",
                        success: function (response) {
                            if (response.status === "COMPLETED") {
                                clearInterval(pollingInterval);
                                // Auth is committing; the start-timestamp entry is no longer needed.
                                clearPushAuthStartedEntry();
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

    </body>
</html>
