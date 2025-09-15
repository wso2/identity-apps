<%--
  ~ Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="com.google.gson.Gson" %>
<%@ page import="java.io.File" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.client.model.AuthenticationRequestWrapper" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

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
                } else if (authList.size() == 2 && authList.contains("backup-code-authenticator%3ALOCAL")) {
                    isMultiAuthAvailable = false;
                }
            }
        }
        return isMultiAuthAvailable;
    }
%>

<%
    String authRequest = Encode.forJavaScriptBlock(request.getParameter("data"));

    Map data = ((AuthenticationRequestWrapper) request).getAuthParams();
    boolean enablePasskeyProgressiveEnrollment = (boolean) data.get("FIDO.EnablePasskeyProgressiveEnrollment");
%>

<%!
    private static final String MY_ACCOUNT = "/myaccount";
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp" />

<% request.setAttribute("pageName", "fido2-auth"); %>

<!doctype html>
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
</head>
<body class="login-portal layout authentication-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
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
                <div id="loader-bar" class="loader-bar"></div>

                <h3 class="ui header center aligned">
                    <span id="fido-header" data-testid="login-page-fido-heading">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "verification" )%>
                    </span>
                    <span id="fido-header-error" style="display: none;" data-testid="login-page-fido-heading-error">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.error" )%>
                    </span>
                </h3>
                <div class="ui two column left aligned stackable grid">
                    <div id="fido-initialize" class="middle aligned row">
                        <div class="six wide column">
                            <img class="img-responsive" src="images/U2F.png" />
                        </div>
                        <div class="ten wide column">
                            <p id="general-browser-instruction">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "touch.your.u2f.device" )%>
                            </p>
                            <div id="safari-instruction" style="display:none">
                                <p>
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.failed.instruction" )%>
                                </p>
                                <div class="ui divider hidden"></div>
                                <button class="ui primary fluid large button" id="initiateFlow" type="button" onclick="talkToDevice()"
                                data-testid="login-page-fido-proceed-button">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.proceed" )%>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="fido-error-content" style="display: none;" class="middle aligned row">
                        <div class="sixteen wide column">
                            <p>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.registration.info" )%>
                                <% if(enablePasskeyProgressiveEnrollment){ %>
                                    <a href="#" onClick="passkeyEnrollmentFlow()">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.register" )%>
                                    </a>
                                <% } else { %>
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.registration.option.info" )%>
                                    <a target="_blank" id="my-account-link">My Account.</a>
                                <% } %>
                            </p>
                            <p>
                                <% if (supportEmail != null && !supportEmail.isEmpty()) { %>
                                    <span>
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.learn.more.part.one" )%>
                                    </span>
                                    <a href="mailto:<%=supportEmail%>"><%=StringEscapeUtils.escapeHtml4(supportEmail)%></a>
                                <% } %>
                            </p>
                            <div class="mt-4">
                                <div class="buttons">
                                    <button class="ui primary fluid large button" type="button" onclick="retry()"
                                    data-testid="login-page-fido-retry-button">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.retry" )%>
                                    </button>
                                </div>
                            </div>
                            <%
                                String multiOptionURI = Encode.forJava(request.getParameter("multiOptionURI"));
                                if (multiOptionURI != null && AuthenticationEndpointUtil.isValidMultiOptionURI(multiOptionURI) &&
                                    isMultiAuthAvailable(multiOptionURI)) {
                            %>
                                <div class="text-center mt-1">
                                    <a
                                        class="ui primary basic button link-button"
                                        id="goBackLink"
                                        href='<%=Encode.forHtmlAttribute(multiOptionURI)%>'
                                    >
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "choose.other.option")%>
                                    </a>
                                </div>
                            <%
                                } else {
                            %>
                                <div class="mt-3">
                                    <div class="buttons">
                                        <button class="ui secondary fluid large button" type="button" onclick="cancelFlow()"
                                        data-testid="login-page-fido-cancel-button">
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.cancel" )%>
                                        </button>
                                    </div>
                                </div>
                            <%
                                }
                            %>
                        </div>
                    </div>
                </div>

                <form method="POST" action="<%=commonauthURL%>" id="form" onsubmit="return false;">
                    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                    <input type="hidden" name="tokenResponse" id="tokenResponse" value="tmp val"/>
                    <input type="hidden" name="scenario" id="scenario" value="tmp val"/>
                </form>
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

    <script type="text/javascript" src="js/u2f-api.js"></script>
    <script type="text/javascript" src="libs/base64js/base64js-1.3.0.min.js"></script>
    <script type="text/javascript" src="libs/base64url.js"></script>

    <% String clientId=Encode.forJavaScriptBlock(request.getParameter("client_id")); %>

    <script type="text/javascript">
        var insightsAppIdentifier = "<%=clientId%>";
        var insightsTenantIdentifier = "<%=userTenant%>";
        if (insightsAppIdentifier == "MY_ACCOUNT") {
            insightsAppIdentifier = "my-account";
        } else if (insightsAppIdentifier == "CONSOLE") {
            insightsAppIdentifier = "console";
        } else if (insightsTenantIdentifier !== "<%=org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME%>") {
            insightsAppIdentifier = "business-app";
        }
        trackEvent("page-visit-authentication-portal-fido2", {
            "app": insightsAppIdentifier,
            "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
        });
    </script>

    <%
        String myaccountUrl = application.getInitParameter("MyAccountURL");
        if (StringUtils.isNotEmpty(myaccountUrl)) {
            myaccountUrl = myaccountUrl + "/t/" + tenantDomain;
        } else {
            myaccountUrl = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
        }
    %>

    <script type="text/javascript">
        $(document).ready(function () {

            $("#my-account-link").attr("href", '<%=myaccountUrl%>');
            if(navigator ){
                let userAgent = navigator.userAgent;
                let browserName;

                if (userAgent.match(/chrome|chromium|crios/i)) {
                    browserName = "chrome";
                } else if (userAgent.match(/firefox|fxios/i)) {
                    browserName = "firefox";
                } else if (userAgent.match(/safari/i)) {
                    browserName = "safari";
                } else if (userAgent.match(/opr\//i)) {
                    browserName = "opera";
                } else if (userAgent.match(/edg/i)) {
                    browserName = "edge";
                } else {
                    browserName = "No browser detection";
                }

                if (browserName === "safari") {
                    $('#safari-instruction').show();
                    $('#general-browser-instruction').hide();
                } else {
                    $('#general-browser-instruction').show();
                    $("#initiateFlow").click();
                }
            }
        });

        function responseToObject(response) {
            if (response.u2fResponse) {
                return response;
            } else {
                var clientExtensionResults = {};

                try {
                    clientExtensionResults = response.getClientExtensionResults();
                } catch (e) {
                    console.error('getClientExtensionResults failed', e);
                }

                if (response.response.attestationObject) {
                    return {
                        id: response.id,
                        response: {
                            attestationObject: base64url.fromByteArray(response.response.attestationObject),
                            clientDataJSON: base64url.fromByteArray(response.response.clientDataJSON)
                        },
                        clientExtensionResults,
                        type: response.type
                    };
                } else {
                    return {
                        id: response.id,
                        response: {
                            authenticatorData: base64url.fromByteArray(response.response.authenticatorData),
                            clientDataJSON: base64url.fromByteArray(response.response.clientDataJSON),
                            signature: base64url.fromByteArray(response.response.signature),
                            userHandle: response.response.userHandle && base64url.fromByteArray(response.response.userHandle)
                        },
                        clientExtensionResults,
                        type: response.type
                    };
                }
            }
        }

        function extend(obj, more) {
            return Object.assign({}, obj, more);
        }

        function decodePublicKeyCredentialRequestOptions(request) {
            const allowCredentials = request.allowCredentials && request.allowCredentials.map(credential => extend(
                credential, {
                    id: base64url.toByteArray(credential.id),
                }));

            const publicKeyCredentialRequestOptions = extend(
                request, {
                    allowCredentials,
                    challenge: base64url.toByteArray(request.challenge),
                });

            return publicKeyCredentialRequestOptions;
        }

        let fidoError;

        function talkToDevice(){
            var jsonAuthRequest = JSON.parse('<%=authRequest%>');

            navigator.credentials.get({
                publicKey: decodePublicKeyCredentialRequestOptions(jsonAuthRequest.publicKeyCredentialRequestOptions),
            })
            .then(function(data) {
                payload = {};
                payload.requestId = jsonAuthRequest.requestId;
                payload.credential = responseToObject(data);
                var form = document.getElementById('form');
                var reg = document.getElementById('tokenResponse');
                reg.value = JSON.stringify(payload);
                form.submit();
            })
            .catch(function(err) {
                showError();
                fidoError = err;
            });
        }

        function retry() {
            trackEvent("authentication-portal-fido2-click-retry", {
                "app": insightsAppIdentifier,
                "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
            });
            showFidoFlow();
            talkToDevice();
        }

        function showError() {
            $("#fido-header-error").show();
            $("#fido-error-content").show();
            $("#fido-header").hide();
            $("#fido-initialize").hide();
            $("#loader-bar").hide();
        }

        function showFidoFlow() {
            $("#fido-header-error").hide();
            $("#fido-error-content").hide();
            $("#fido-header").show();
            $("#fido-initialize").show();
            $("#loader-bar").show();
        }

        function cancelFlow(){
            var form = document.getElementById('form');
            var reg = document.getElementById('tokenResponse');
            reg.value = JSON.stringify({ errorCode: 400, message: fidoError });
            form.submit();
        }

        function passkeyEnrollmentFlow(){
            var form = document.getElementById('form');
            var scenario = document.getElementById('scenario');
            scenario.value = "INIT_FIDO_ENROLL";
            form.submit();
        }

    </script>
</body>
</html>
