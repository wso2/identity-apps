<%--
 ~ Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content.
--%>

<%--  
    This template is used to keep an user waiting using the adaptive auth dynamic prompt capability.
    An example prompt usage in adaptive script is shown below. The parameters are optional and if not provided,
    the default values will be used.

    prompt("internalWait", {
        "timeout": "<TIMEOUT_SECONDS>",
        "greeting": "<GREETING_TEXT>",
        "message": "<WAITING_MESSAGE>"
    }, {
        onSuccess: function(context) {
            Log.info("Successfully redirected back from waiting page.");
        },
        onFail: function(context, data) {
            Log.info("Error occurred during the prompt.");
        }
    });
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>

<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="../includes/localize.jsp" />

<%-- Branding Preferences --%>
<jsp:directive.include file="../includes/branding-preferences.jsp"/>

<%
    // Read promptId from request.
    String promptId = (String) request.getAttribute("promptId");

    // Max timeout in seconds.
    int maxTimeout = 20;

    // Read the data from request.
    Object dataObj = request.getAttribute("data");

    // Extract and set properties from the request data.
    Map<String, String> properties = new HashMap<>();
    int timeout = 10;

    // TODO: Set i18n mappings/ translations.
    String greeting = "Hello There!";
    String message = "Please wait until we setup your environment...";

    if (dataObj instanceof Map) {
        Map<String, Object> data = (Map<String, Object>) dataObj;

        if (StringUtils.isNotBlank((String) data.get("timeout"))) {
            timeout = Integer.parseInt((String) data.get("timeout"));

            if (timeout > maxTimeout) {
                timeout = maxTimeout;
            }
        }
        if (StringUtils.isNotBlank((String) data.get("greeting"))) {
            greeting = (String) data.get("greeting");
        }
        if (StringUtils.isNotBlank((String) data.get("message"))) {
            message = (String) data.get("message");
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

    <script>
        window.onload = function() {
            var promptId = "<%= promptId %>";
            var timeout = "<%= timeout %>";
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

            // Set the countdown duration in seconds.
            var secondsLeft = timeout;

            countdownElement.innerText = secondsLeft;

            // Start the countdown.
            var countdownInterval = setInterval(function() {
                secondsLeft--;
                countdownElement.innerText = secondsLeft;

                // Check if the countdown is completed.
                if (secondsLeft <= 0) {
                    clearInterval(countdownInterval);
                    greetingElement.style.display = 'none';
                    spinnerElement.style.display = 'none';
                    messageElement.style.display = 'none';
                    countdownElement.style.display = 'none';
                    form.submit();
                }
            }, 1000);
        };
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
        <h2 id="greeting" class="ui header text-align:center"></h2>
        <div id="spinner-container" class="ui active inverted dimmer">
            <div class="ui massive loader"></div>
        </div>
        <p id="message" class="message text-align:center"></p>
        <h4 id="countdown" class="message text-align:center"></h4>
    </div>

    <form id="myForm" action="<%= commonauthURL %>" method="post">
        <input type="hidden" id="promptResp" name="promptResp" value="true">
        <input type="hidden" id="customClaim" name="customClaim" value="PickedFromExternal">
    </form>
</body>
