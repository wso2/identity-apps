<%--
  ~ Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

<% request.setAttribute("pageName", "iproovlogin"); %>

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
    <script src="https://cdn.iproov.app/iproovme/5.1.0/iProovMe.js"></script>
    <style type="text/css">
        .iproov-segment {
            text-align: center !important;
        }

        .iproov-lang-heading {
            display : none;
        }

        .iproov-lang-term {
        	display : none;
        }

        .iproov-text {
            padding: 5px 5px 30px 0;
        }

        .scan-button, .iproov-state-screen a, .iproov-state-screen button {
            background: <%= theme != null ? "(var(--asg-colors-primary-main) !important" : "linear-gradient(77.74deg, rgb(235, 79, 99) 11.16%, rgb(250, 123, 63) 99.55%) !important" %> ;
            color:  <%= theme != null ? "var(--asg-primary-button-base-text-color)" : "#fff" %> ;
            border-radius: <%= theme != null ? "var(--asg-primary-button-base-border-radius)" : "22px" %> ;
            border: none;
            font-weight: 400;
            box-shadow: 0 0 0 0 rgba(34,36,38,.15) inset;
            font-size: 1.14285714rem;
            padding: 12px 36px;
        }

    </style>
</head>

<body class="login-portal layout iproov-layout" data-page="<%= request.getAttribute("pageName") %>">
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
                <h2><%=AuthenticationEndpointUtil.i18n(resourceBundle, "iproov.heading")%></h2>
                <div class="ui visible negative message" style="display: none;" id="error-msg"></div>

                <div class="segment-form iproov-segment">
                    <form class="ui large form" id="loginForm" action="<%=commonauthURL%>" method="POST">
                        <div class="ui fluid left icon input">
                            <div class="ui fluid icon input addon-wrapper">
                                <input type="text" id="username"  name="username" tabindex="1" placeholder="Username" aria-required="true">
                                <i aria-hidden="true" class="user icon"></i>
                            </div>
                        </div>
                        <input id="sessionDataKeyLoginForm" type="hidden" name="sessionDataKey"
                            value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>' />
                        <div class="ui divider hidden"></div>
                        <div class="align-center buttons">
                            <button type="button" class="ui primary large button" tabindex="4" role="button"
                            onClick="loginFormOnSubmit();">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "iproov.login.button")%>
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
                        <input type="hidden" name="scenario" id="scenario" value="tmp val"/>
                    </form>

                    <%
                    String token = request.getParameter("verifyToken");
                    if (token == null) {
                        token = request.getParameter("enrollToken");
                    }
                     if ( token != null) {
                        %>
        <iproov-me token='<%=Encode.forHtmlAttribute(token)%>'>
            <div slot="ready">
    				<h1 class="iproov-lang-heading">iProov Ready</h1>
  			</div>
  			 <div slot="canceled">
    				<h1 class="iproov-lang-heading">iProov Canceled</h1>
  			</div>
  			 <div slot="error">
    				<h1 class="iproov-lang-heading">iProov Error</h1>
  			</div>
  			 <div slot="failed">
    				<h1 class="iproov-lang-heading">iProov Authentication Failed</h1>
  			</div>
  			 <div slot="no_camera">
    				<h1 class="iproov-lang-heading">No Camera Detected</h1>
  			</div>
  			 <div slot="passed">
    				<h1 class="iproov-lang-heading">Authenticated Successfully</h1>
  			</div>
  			 <div slot="rotate_portrait">
    				<h1 class="iproov-lang-heading">Rotate Potrait</h1>
  			</div>
  			 <div slot="unsupported">
    				<h1 class="iproov-lang-heading">Unsupported</h1>
  			</div>
  			<div slot="grant_permission">
    				<h1 class="iproov-lang-heading">Grant Permission</h1>
  			</div>
            <%
            if (("true").equals(request.getParameter("retry"))) {
            %>
                <div slot="button">
			        <div class="iproov-text">
				        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "iproov.authentication.failed.message")%>
			        </div>
                    <button class="scan-button" type="button">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "iproov.rescan.face.button")%>
                    </button>
                </div>
                <%
                } else {
                %>
                <div slot="button">
                    <button class="scan-button" type="button">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "iproov.scan.face.button")%>
                    </button>
                </div>
                <%
                }
                %>
                <div slot="grant_button">
                    <div class="iproov-text">
                    	<%=AuthenticationEndpointUtil.i18n(resourceBundle, "iproov.grant.camera.access.message")%>
                    </div>
                    <button class="scan-button" type="button">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "iproov.grant.camera.access.button")%>
                    </button>
                </div>
        </iproov-me>
            <%
            }
            %>

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
    %>

    <script type="text/javascript">
        var i = 0;
        var sessionDataKey;
        var refreshInterval = 5000;
        var timeout = 90000;
        var intervalListener;
        var isPollingStopped = false;
        var authStatusCheckApiWithQueryParams = "/api/iproov/v1/authentication/status/";
        var GET = 'GET';

        $(document).ready(function () {

            var urlParams = new URLSearchParams(window.location.search);
            sessionDataKey = urlParams.get('sessionDataKey');
            tenantDomain = urlParams.get('tenantDomain');

            if (urlParams.has("status")){
                var status = urlParams.get("status");
                if(status == "PENDING") {
                    document.getElementById("loginForm").style.display = 'none';
                }
                if (status == 'CANCELED' || status == 'FAILED' || status == 'INVALID_REQUEST' || status == 'INVALID_TOKEN') {
                    handleError(urlParams.get("message"));
                } else if (status == 'INVALID_USER') {
                    handleUserError(urlParams.get("message"));
                }
            }
        });

        function loginFormOnSubmit() {
            var username = document.getElementById("username").value;
            var generic_error_message = "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "iproov.username.error")%>";

            if(username == '') {
                handleError(generic_error_message);
                return;
            }
            initiateAuthentication();
        }

        function handleError(msg){
            var error_message = document.getElementById("error-msg");
            document.getElementById("loginForm").style.display = 'block';
            document.getElementById("inProgressDisplay").style.display = 'none';
            error_message.innerHTML = Encode.forHtmlContent(msg);
            error_message.style.display = "block";
        }

        function handleUserError(msg){
            var error_message = document.getElementById("error-msg");
            document.getElementById("inProgressDisplay").style.display = 'none';
            document.getElementById("loginForm").style.display = 'none';
            error_message.innerHTML = Encode.forHtmlContent(msg);
            error_message.style.display = "block";
        }

        function initiateAuthentication() {
            document.getElementById("error-msg").style.display = 'none';
            document.getElementById("loginForm").style.display = 'none';
            document.getElementById("inProgressDisplay").style.display = 'block';
            document.getElementById("authenticationStatusMessage").innerText = "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "iproov.auth.start")%>";
            document.getElementById("loginForm").submit();
        }

        function completeAuthentication() {
            if (!isPollingStopped) {
                isPollingStopped = true;
                window.clearInterval(intervalListener);
                document.getElementById("completeAuthenticationForm").submit();
            }
        }

        const iProovMe = document.querySelector("iproov-me");
        iProovMe.addEventListener("ready", iProovEvent);
        iProovMe.addEventListener("started", iProovEvent);
        iProovMe.addEventListener("canceled", iProovEvent);
        iProovMe.addEventListener("streaming", iProovEvent);
        iProovMe.addEventListener("streamed", iProovEvent);
        iProovMe.addEventListener("progress", iProovEvent);
        iProovMe.addEventListener("passed", iProovEvent);
        iProovMe.addEventListener("failed", iProovEvent);
        iProovMe.addEventListener("error", iProovEvent);
        iProovMe.addEventListener("unsupported", iProovEvent);
        iProovMe.addEventListener("permission", iProovEvent);
        iProovMe.addEventListener("permission_denied", iProovEvent);

        function iProovEvent(event) {
            switch (event.type) {
                case "canceled":
                    break
                case "error":
                    break
                case "unsupported":
                    break
                case "permission":
                    break
                case "permission_denied":
                    break
                case "progress":
                    break
                case "passed":
                    var form =  document.getElementById("completeAuthenticationForm");
                    var scenario = document.getElementById('scenario');

                    <% if ((request.getParameter("enrollToken") != null)){ %>
                        scenario.value = "enrollment";
                    <% } else { %>
                        scenario.value = "authentication";
                    <% } %>
                    form.submit();
                    break

                case "failed":
                    var form =  document.getElementById("completeAuthenticationForm");
                    var scenario = document.getElementById('scenario');
                    scenario.value = "retry";
                    form.submit();
                    break
                default:
                	break
            }
        }
    </script>
</body>
</html>
