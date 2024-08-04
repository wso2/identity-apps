<%--
 ~ Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content.
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>

<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="../includes/localize.jsp" />

<%-- Branding Preferences --%>
<jsp:directive.include file="../includes/branding-preferences.jsp"/>

<%
    // Read promptId from request.
    String promptId = Encode.forJavaScriptAttribute((String) request.getAttribute("promptId"));

    List<String> WaitingMethods = Arrays.asList("FIXED_DELAY", "POLLING");

    // Default waiting method.
    String type = "FIXED_DELAY";

    // Fixed delay related variables.
    int maxTimeout = 20;        // Max timeout in seconds.
    int timeout = 10;

    // Polling related variables.
    String pollingEndpoint = "";
    String pollingRequestMethod = "GET";
    Object pollingEndpointData = null;
    String pollingRequestContentType = "application/x-www-form-urlencoded";
    int pollingInterval = 2;

    // Read the data from request.
    Object requestDataObject = request.getAttribute("data");

    // Extract and set properties from the request data.
    Map<String, String> properties = new HashMap<>();

    // Apply i18n translations for the default greeting and message.
    String greeting = AuthenticationEndpointUtil.i18n(resourceBundle, "prompt.template.internal.wait.greeting");
    String message = AuthenticationEndpointUtil.i18n(resourceBundle, "prompt.template.internal.wait.message");

    if (requestDataObject instanceof Map) {
        Map<String, Object> requestData = (Map<String, Object>) requestDataObject;

        if (StringUtils.isNotBlank((String) requestData.get("waitingType"))) {
            if (WaitingMethods.contains((String) requestData.get("waitingType"))) {
                type = Encode.forJavaScriptAttribute((String) requestData.get("waitingType"));
            }
        } else if (StringUtils.isNotBlank((String) requestData.get("type"))) {
            if (WaitingMethods.contains((String) requestData.get("type"))) {
                type = Encode.forJavaScriptAttribute((String) requestData.get("type"));
            }
        }

        // Process the function data.
        Map<String, Object> functionData = (Map<String, Object>) requestData.get("waitingConfigs");
        if (functionData == null) {
            functionData = (Map<String, Object>) requestData.get("data");
        }


        if (functionData != null) {
            // Set the greeting and message.
            if (StringUtils.isNotBlank((String) functionData.get("greeting"))) {
                greeting = Encode.forHtml((String) functionData.get("greeting"));
            }
            if (StringUtils.isNotBlank((String) functionData.get("message"))) {
                message = Encode.forHtml((String) functionData.get("message"));
            }

            // Set the timeout.
            if (StringUtils.isNotBlank((String) functionData.get("timeout"))) {
                timeout = Integer.parseInt(Encode.forJavaScriptAttribute((String) functionData.get("timeout")));

                if (timeout > maxTimeout) {
                    timeout = maxTimeout;
                }
            }

            if ("POLLING".equals(type)) {
                // Set the polling related parameters.
                if (StringUtils.isNotBlank((String) functionData.get("pollingEndpoint"))) {
                    pollingEndpoint = Encode.forJavaScriptAttribute((String) functionData.get("pollingEndpoint"));
                }
                if (StringUtils.isNotBlank((String) functionData.get("requestMethod"))) {
                    pollingRequestMethod = Encode.forJavaScriptAttribute((String) functionData.get("requestMethod"));
                }
                if (StringUtils.isNotBlank((String) functionData.get("contentType"))) {
                    pollingRequestContentType = Encode.forJavaScriptAttribute((String) functionData.get("contentType"));
                }
                if (StringUtils.isNotBlank((String) functionData.get("pollingInterval"))) {
                    pollingInterval = Integer.parseInt(Encode.forJavaScriptAttribute((String) functionData.get("pollingInterval")));
                }
                if (functionData.get("requestData") != null) {
                    pollingEndpointData = (Object) functionData.get("requestData");
                }
            }
        }
    }
%>

<head>
    <%-- header --%>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
        <jsp:include page="../extensions/header.jsp"/>
    <% } else { %>
        <jsp:include page="../includes/header.jsp"/>
    <% } %>

    <script type="text/javascript">
        window.onload = function() {
            var promptId = "<%= promptId %>";
            var waitingType = "<%= type %>";

            var greeting = "<%= greeting %>";
            var message = "<%= message %>";

            // Add the promptID value as a hidden input field in the form.
            var form = document.getElementById('myForm');
            if (promptId) {
                var promptIdInput = document.createElement('input');
                promptIdInput.type = 'hidden';
                promptIdInput.name = 'promptId';
                promptIdInput.value = promptId;
                form.appendChild(promptIdInput);
            }

            var greetingElement = document.getElementById('greeting');
            greetingElement.innerText = greeting;

            var messageElement = document.getElementById('message');
            messageElement.innerText = message;

            var spinnerElement = document.getElementById('spinner-container');
            var countdownElement = document.getElementById('countdown');

            if ("FIXED_DELAY" === waitingType) {
                // Set the countdown duration in seconds.
                var secondsLeft = "<%= timeout %>";

                countdownElement.innerText = secondsLeft;

                // Start the countdown.
                var countdownIntervalHandler = setInterval(function() {
                    secondsLeft--;
                    countdownElement.innerText = secondsLeft;

                    // Check if the countdown is completed.
                    if (secondsLeft <= 0) {
                        clearInterval(countdownIntervalHandler);
                        greetingElement.style.display = 'none';
                        spinnerElement.style.display = 'none';
                        messageElement.style.display = 'none';
                        countdownElement.style.display = 'none';
                        form.submit();
                    }
                }, 1000);
            } else {
                // Polling method.
                var pollingInterval = "<%= pollingInterval %>";

                countdownElement.style.display = 'none';

                // Set a handler to count for the max timeout.
                var secondsLeft = "<%= timeout %>";

                // Start the countdown.
                var countdownIntervalHandler = setInterval(function() {

                    secondsLeft--;

                    // Check if the countdown is completed.
                    if (secondsLeft <= 0) {
                        clearInterval(countdownIntervalHandler);
                        greetingElement.style.display = 'none';
                        spinnerElement.style.display = 'none';
                        messageElement.style.display = 'none';

                        window.location.replace("retry.do");
                    }
                }, 1000);

                var pollingIntervalHandler = setInterval(function () {
                    pollStatus(pollingIntervalHandler, countdownIntervalHandler, secondsLeft);
                }, pollingInterval * 1000);
            }
        };

        function pollStatus(pollingIntervalHandler, countdownIntervalHandler, secondsLeft) {

            $.ajax({
                type: "<%= pollingRequestMethod %>",
                url: "<%= pollingEndpoint %>",
                async: false,
                data: "<%= pollingEndpointData %>",
                contentType: "<%= pollingRequestContentType %>",
                success: function (res) {
                    handlePollingStatus(res, pollingIntervalHandler, countdownIntervalHandler);
                },
                error: function (res) {
                    window.clearInterval(pollingIntervalHandler);
                    window.clearInterval(countdownIntervalHandler);
                    window.location.replace("retry.do");
                },
                failure: function (res) {
                    window.clearInterval(pollingIntervalHandler);
                    window.clearInterval(countdownIntervalHandler);
                    window.location.replace("retry.do");
                }
            });
        }

        function handlePollingStatus(res, pollingIntervalHandler, countdownIntervalHandler) {

            if (res.status === 'PENDING') {
                // Do nothing.
            } else if (res.status === 'COMPLETE') {
                window.clearInterval(pollingIntervalHandler);
                window.clearInterval(countdownIntervalHandler);
                var form = document.getElementById('myForm');
                form.submit();
            } else {
                window.clearInterval(pollingIntervalHandler);
                window.clearInterval(countdownIntervalHandler);
                window.location.replace("retry.do");
            }
        }
    </script>

    <style>
        #spinner-container {
            position: relative;
            margin-top: 40px;
            margin-bottom: 40px;
            background-color: unset;
        }
    </style>
</head>
<body>
    <div class="ui">
        <h2 id="greeting" data-componentid="internal-wait-greeting" class="ui header text-align:center"></h2>
        <div id="spinner-container" class="ui active inverted dimmer">
            <div class="ui massive loader"></div>
        </div>
        <p id="message" data-componentid="internal-wait-message" class="message text-align:center"></p>
        <h4 id="countdown" data-componentid="internal-wait-countdown" class="message text-align:center"></h4>
    </div>

    <form id="myForm" action="<%= commonauthURL %>" method="post">
        <input type="hidden" id="promptResp" name="promptResp" value="true">
        <input type="hidden" id="customClaim" name="customClaim" value="PickedFromExternal">
    </form>
</body>
