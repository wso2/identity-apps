<%--
  ~ Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ page import="org.apache.commons.logging.Log" %>
<%@ page import="org.apache.commons.logging.LogFactory" %>

<%@ page import="org.wso2.carbon.identity.application.authenticator.fido2.core.WebAuthnService" %>
<%@ page import="org.wso2.carbon.identity.application.authenticator.fido2.dto.FIDO2RegistrationRequest" %>
<%@ page import="org.wso2.carbon.identity.application.authenticator.fido.util.FIDOUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authenticator.fido2.util.Either" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.framework.context.AuthenticationContext" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.framework.util.FrameworkUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.framework.model.AuthenticatedUser" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.framework.config.model.StepConfig" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper" %>
<%@ page import="com.yubico.internal.util.JacksonCodecs" %>

<%-- Localization --%>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<%@include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String regRequest = request.getParameter("data");
%>

<% request.setAttribute("pageName", "fido2-enroll"); %>

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

                <h3 class="ui header">
                    <span id="fido-header">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.title.registration.instruction")%>
                    </span>
                    <span id="fido-keyname-header" style="display: none;">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.title.name.passkey")%>
                    </span>
                    <span id="fido-header-error" style="display: none;">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.title.error.registration")%>
                    </span>
                </h3>
                <div class="ui two column left aligned stackable grid">
                    <div id="fido-initialize" class="middle aligned row">
                        <div class="six wide column">
                            <img class="img-responsive" src="images/U2F.png" />
                        </div>
                        <div class="ten wide column">
                            <p id="general-browser-instruction">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.info.registration.instruction")%>
                            </p>
                            <div id="safari-instruction" style="display:none">
                                <p>
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.failed.instruction")%>
                                </p>
                                <div class="ui divider hidden"></div>
                                <button class="ui primary fluid large button" id="initiateFlow" type="button" onclick="talkToDevice()">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.proceed")%>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="fido-keyname-content" style="display: none;" class="middle aligned row">
                        <div class="sixteen wide column">
                            <p>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.info.name.passkey")%>
                            </p>
                            <div class="ui form">
                                <div class="field">
                                    <input type="text" id="keynameInput"
                                            placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.placeholder.name.passkey")%>">
                                    <div class="mt-1 left aligned" id="keynameError" style="display: none;">
                                        <i class="red exclamation circle fitted icon"></i>
                                        <span class="validation-error-message" id="keynameErrorText">
                                           <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.error.name.passkey")%>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4">
                                <div class="buttons">
                                    <button class="ui primary fluid large button" type="button" onclick="finishFidoFlow()">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.submit")%>
                                    </button>
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="column buttons">
                                    <button class="ui secondary fluid large button" type="button" onclick="cancelFlow()">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.cancel")%>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="fido-error-content" style="display: none;" class="middle aligned row">
                        <div class="sixteen wide column">
                            <p>
                                 <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.info.error.registration")%>
                            </p>
                            <div class="mt-4">
                                <div class="column buttons">
                                    <button class="ui primary fluid large button" type="button" onclick="retry()"
                                        data-testid="registration-page-fido-retry-button">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.retry")%>
                                    </button>
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="column buttons">
                                    <button class="ui secondary fluid large button" type="button" onclick="cancelFlow()"
                                        data-testid="registration-page-fido-cancel-button">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.cancel")%>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>

                <form method="POST" action="<%=commonauthURL%>" id="form" onsubmit="return false;">
                    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                    <input type="hidden" name="challengeResponse" id="challengeResponse" value="tmp val"/>
                    <input type="hidden" name="scenario" id="scenario" value="tmp val"/>
                    <input type="hidden" name="displayName" id="displayName" value="tmp val"/>
                </form>
            </div>

        </layout:component>
        <layout:component componentName="ProductFooter" >
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

    <script type="text/javascript">
        $(document).ready(function () {
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

        function decodePublicKeyCredentialCreationOptions (request) {
            // Decode the excludeCredentials field if it exists.
            const excludeCredentials = request.excludeCredentials.map((credential) => ({
                ...credential,
                id: base64url.toByteArray(credential.id),
            }));

            // Decode the challenge field.
            const challenge = base64url.toByteArray(request.challenge);

            // Decode the user.id field.
            const userId = base64url.toByteArray(request.user.id);

            // Create a new object with the decoded values and set attestation to "direct".
            return {
                ...request,
                attestation: "direct",
                user: {
                    ...request.user,
                    id: userId,
                },
                challenge,
                excludeCredentials,
            };
        };

        let fidoError;

        function talkToDevice(){
            var regRequest = '<%=Encode.forJavaScriptBlock(regRequest)%>';
            var jsonRegRequest = JSON.parse(regRequest);
            console.log(jsonRegRequest);
            console.log(jsonRegRequest.publicKeyCredentialCreationOptions);

            navigator.credentials.create({
                publicKey: decodePublicKeyCredentialCreationOptions(jsonRegRequest.publicKeyCredentialCreationOptions),
            })
            .then(function(data) {
                payload = {};
                payload.requestId = jsonRegRequest.requestId;
                payload.credential = responseToObject(data);
                var reg = document.getElementById('challengeResponse');
                reg.value = JSON.stringify(payload);

                showKeynameFlow();
            })
            .catch(function(err) {
                showError();
                fidoError = err;
            });
        }

        function retry() {
            showFidoFlow();
            talkToDevice();
        }

        function showError() {
            $("#fido-header-error").show();
            $("#fido-error-content").show();
            $("#fido-header").hide();
            $("#fido-initialize").hide();
            $("#loader-bar").hide();
            $("#fido-keyname-header").hide();
            $("#fido-keyname-content").hide();
        }

        function showFidoFlow() {
            $("#fido-header-error").hide();
            $("#fido-error-content").hide();
            $("#fido-header").show();
            $("#fido-initialize").show();
            $("#loader-bar").show();
            $("#fido-keyname-header").hide();
            $("#fido-keyname-content").hide();
        }

        function showKeynameFlow() {
            $("#fido-header-error").hide();
            $("#fido-error-content").hide();
            $("#fido-header").hide();
            $("#fido-initialize").hide();
            $("#loader-bar").hide();
            $("#fido-keyname-header").show();
            $("#fido-keyname-content").show();
        }

        function cancelFlow(){
            var form = document.getElementById('form');
            var reg = document.getElementById('challengeResponse');
            reg.value = JSON.stringify({ errorCode: 400, message: fidoError });
            var scenario = document.getElementById('scenario');
            scenario.value = "CANCEL_FIDO_ENROLL" ;
            form.submit();
        }

        function finishFidoFlow() {

            var keynameInput = document.getElementById('keynameInput');
            var displayName = document.getElementById('displayName');
            var scenario = document.getElementById('scenario');

            // Get the keyname input value and trim whitespace
            var keyname = keynameInput.value.trim();

            // Check if the keyname is empty
            if (keyname === '') {
                // Show the error message
                keynameError.style.display = 'block';
                return;
            } else {
                // Hide the error message
                keynameError.style.display = 'none';
            }

            // Set the displayName and scenario values
            displayName.value = keyname;
            scenario.value = "FINISH_FIDO_ENROLL";

            var form = document.getElementById('form');
            form.submit();
        }

    </script>
</body>
</html>
