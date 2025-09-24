<%--
  ~ Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
  ~ KIND, either express or implied. See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityCoreConstants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.EndpointConfigManager" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS_MSG" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.CONFIGURATION_ERROR" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.AUTHENTICATION_MECHANISM_NOT_CONFIGURED" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.ENABLE_AUTHENTICATION_WITH_REST_API" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL" %>
<%@ page import="java.nio.charset.Charset" %>
<%@ page import="org.apache.commons.codec.binary.Base64" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.owasp.encoder.Encode" %>

<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<% request.setAttribute("pageName", "hyprlogin"); %>

<!doctype html>
<html lang="en-US">
<head>
    <script language="JavaScript" type="text/javascript" src="libs/jquery_3.6.0/jquery-3.6.0.min.js"></script>
    <%-- header --%>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>

<body class="login-portal layout email-otp-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
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
                <h2><%=AuthenticationEndpointUtil.i18n(resourceBundle, "hypr.heading")%></h2>
                <div class="ui divider hidden"></div>
                <div class="ui visible negative message" style="display: none;" id="error-msg"></div>

                <div class="segment-form">
                    <form class="ui large form" id="loginForm" action="<%=commonauthURL%>" method="POST">
                        <div class="ui fluid left icon input">
                            <div class="ui fluid icon input addon-wrapper">
                                <input type="text" id="username"  name="username" tabindex="1" placeholder="Username" aria-required="true">
                                <i aria-hidden="true" class="user icon"></i>
                            </div>
                        </div>
                        <input id="sessionDataKeyLoginForm" type="hidden" name="sessionDataKey"
                            value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>' />
                        <input id="authType" name="authType" type="hidden" value="hypr">
                        <div class="ui divider hidden"></div>
                        <div class="align-center buttons">
                            <button type="button" class="ui primary large button" tabindex="4" role="button"
                            onClick="loginFormOnSubmit();">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "hypr.login.button")%>
                            </button>
                        </div>
                    </form>

                    <!-- Authentication on progress -->
                    <div class="align-center" id="inProgressDisplay" >
                        <h5 id="authenticationStatusMessage"></h5>
                    </div>

                    <!-- Proceed Authentication form -->
                    <form id="completeAuthenticationForm" action="<%=commonauthURL%>" method="POST">
                        <input id="sessionDataKeyAuthenticationForm" type="hidden" name="sessionDataKey"
                        value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>' />
                        <input id="authType" name="authType" type="hidden" value="hypr">
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

    <%
        String toEncode = EndpointConfigManager.getAppName() + ":" + String.valueOf(EndpointConfigManager.getAppPassword());
        byte[] encoding = Base64.encodeBase64(toEncode.getBytes());
        String authHeader = new String(encoding, Charset.defaultCharset());
        String header = "Client " + authHeader;
        
        // Handle error message with precedence for request parameter but fallback to generic message
        String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "hypr.generic.error");
        String error = request.getParameter("message");
        
        if (error != null && !error.equalsIgnoreCase(AuthenticationEndpointUtil.i18n(resourceBundle, error))) {
            errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, error);
        }
    %>

    <script type="text/javascript">
        var i = 0;
        var sessionDataKey;
        var refreshInterval = 5000;
        var timeout = 90000;
        var intervalListener;
        var isPollingStopped = false;
        var authStatusCheckApiWithQueryParams = "/api/hypr/v1/authentication/status/";
        var GET = 'GET';

        $(document).ready(function () {

            var urlParams = new URLSearchParams(window.location.search);
            sessionDataKey = urlParams.get('sessionDataKey');
            tenantDomain = urlParams.get('tenantDomain');

            if (urlParams.has("status")){
                var status = urlParams.get("status");

                if(status == "PENDING") {
                    document.getElementById("loginForm").style.display = 'none';
                    document.getElementById("inProgressDisplay").style.display = 'block';
                    document.getElementById("authenticationStatusMessage").innerText = "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "hypr.auth.status")%>";
                    pollAuthStatus();

                } else if (status == 'CANCELED' || status == 'FAILED' || status == 'INVALID_REQUEST' || status == 'INVALID_TOKEN') {
                    handleError('<%= Encode.forHtmlContent(errorMessage) %>');
                } else if (status == 'INVALID_USER') {
                    handleUserError('<%= Encode.forHtmlContent(errorMessage) %>');
                }
            }
        });

        function loginFormOnSubmit() {
            var username = document.getElementById("username").value;
            var generic_error_message = "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "hypr.username.error")%>";
            var invalid_email_error_message = "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "hypr.invalid.email")%>";

            if(username == '') {
                handleError(generic_error_message);
                return;
            }

            if (username.length > 254) {
                handleError(invalid_email_error_message);
                return;
            }
            initiateAuthentication();
        }

        function pollAuthStatus() {
            var startTime = new Date().getTime();

            intervalListener = window.setInterval(function () {
                if (isPollingStopped) {
                    return;
                } else {
                    checkWaitStatus();
                    i++;
                }
            }, refreshInterval);

            function checkWaitStatus() {
                var now = new Date().getTime();
                if ((startTime + timeout) < now) {
                    handleAuthenticationTimedOut();
                } else {
                    $.ajax("<%= Encode.forJavaScriptBlock(identityServerEndpointContextParam)%>" + authStatusCheckApiWithQueryParams + sessionDataKey, {
                    method: GET,
                    headers: {
                        "Authorization": "<%=header%>"
                    },
                    success: function (res) {
                        handleStatusResponse(res);
                    },
                    error: function (err) {
                        handleAuthenticationFailed();
                    },
                    failure: function () {
                        isPollingStopped = true;
                        window.clearInterval(intervalListener);
                    }
                });
                }

            }

            function handleStatusResponse(res) {
                if (["COMPLETED", "CANCELED", "FAILED"].includes(res.status)) {
                    completeAuthentication();
                }
            }

           function handleAuthenticationTimedOut () {
            if (!isPollingStopped) {
                var error_message = "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "hypr.timeout.error")%>";
                window.clearInterval(intervalListener);
                handleError(error_message);
            }
           }

           function handleAuthenticationFailed () {
            if (!isPollingStopped) {
                isPollingStopped = true;
                var error_message = "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "hypr.generic.error")%>";
                window.clearInterval(intervalListener);
                handleError(error_message);
            }
           }
        }

        function handleError(msg){
            var error_message = document.getElementById("error-msg");
            document.getElementById("loginForm").style.display = 'block';
            document.getElementById("inProgressDisplay").style.display = 'none';
            error_message.innerHTML = msg;
            error_message.style.display = "block";
        }

        function handleUserError(msg){
            var error_message = document.getElementById("error-msg");
            document.getElementById("inProgressDisplay").style.display = 'none';
            document.getElementById("loginForm").style.display = 'none';
            error_message.innerHTML = msg;
            error_message.style.display = "block";
        }

        function initiateAuthentication() {
            document.getElementById("error-msg").style.display = 'none';
            document.getElementById("loginForm").style.display = 'none';
            document.getElementById("inProgressDisplay").style.display = 'block';
            document.getElementById("authenticationStatusMessage").innerText = "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "hypr.auth.start")%>";
            document.getElementById("loginForm").submit();
        }

        function completeAuthentication() {
            if (!isPollingStopped) {
                isPollingStopped = true;
                console.log("Complete authentication request");
                window.clearInterval(intervalListener);
                document.getElementById("completeAuthenticationForm").submit();
            }
        }
    </script>
</body>
</html>
