<%--
  ~ Copyright (c) 2019-2023, WSO2 LLC. (https://www.wso2.com).
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

<%-- Localization --%>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<%@include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String authRequest = request.getParameter("data");
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<%!
    private static final String MY_ACCOUNT = "/myaccount";
%>

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
<body class="login-portal layout authentication-portal-layout">

    <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
        <jsp:include page="extensions/timeout.jsp"/>
    <% } else { %>
        <jsp:include page="util/timeout.jsp"/>
    <% } %>

    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
            String productTitleFilePath = "extensions/product-title.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productTitleFilePath = customLayoutFileRelativeBasePath + "/product-title.jsp";
            }
            if (!new File(getServletContext().getRealPath(productTitleFilePath)).exists()) {
                productTitleFilePath = "includes/product-title.jsp";
            }
            %>
            <jsp:include page="<%= productTitleFilePath %>" />
        </layout:component>
        <layout:component componentName="MainSection" >
            <div class="ui segment left aligned">
                <div id="loader-bar" class="loader-bar"></div>

                <h3 class="ui header">
                    <span id="fido-header">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "verification" )%>
                    </span>
                    <span id="fido-header-error" style="display: none;">
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
                                <button class="ui button primary" id="initiateFlow" type="button" onclick="talkToDevice()">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.proceed" )%>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="fido-error-content" style="display: none;" class="middle aligned row">
                        <div class="sixteen wide column">
                            <p>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.registration.info" )%>
                                <a id="my-account-link">My Account.</a>
                            </p>
                            <p>
                                <% if (supportEmail != null && !supportEmail.isEmpty()) { %>
                                    <span>
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.learn.more.part.one" )%>
                                    </span>
                                    <a href="mailto:<%=supportEmail%>"><%=StringEscapeUtils.escapeHtml4(supportEmail)%>.</a>
                                <% } %>
                            </p>
                            <div class="ui divider hidden"></div>
                            <div class="align-right buttons">
                                <button class="ui button secondary" type="button" onclick="cancelFlow()"
                                    data-testid="login-page-fido-cancel-button">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.cancel" )%>
                                </button>
                                <button class="ui button primary" type="button" onclick="retry()"
                                    data-testid="login-page-fido-retry-button">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.retry" )%>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>

                <form method="POST" action="<%=commonauthURL%>" id="form" onsubmit="return false;">
                    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                    <input type="hidden" name="tokenResponse" id="tokenResponse" value="tmp val"/>
                </form>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
            String productFooterFilePath = "extensions/product-footer.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productFooterFilePath = customLayoutFileRelativeBasePath + "/product-footer.jsp";
            }
            if (!new File(getServletContext().getRealPath(productFooterFilePath)).exists()) {
                productFooterFilePath = "includes/product-footer.jsp";
            }
            %>
            <jsp:include page="<%= productFooterFilePath %>" />
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

    <%
        String myaccountUrl = application.getInitParameter("MyAccountURL");
        if (StringUtils.isEmpty(myaccountUrl)) {
            myaccountUrl = ServiceURLBuilder.create().addPath(MY_ACCOUNT).build().getAbsolutePublicURL();
        }
    %>
    <script type="text/javascript">
        $(document).ready(function () {
            var myaccountUrl = '<%=myaccountUrl%>';
            var tenantDomain = '<%=Encode.forJavaScriptBlock(tenantDomain)%>';

            if (tenantDomain !== "" && tenantDomain !== "null") {
                myaccountUrl = myaccountUrl + "/t/" + tenantDomain;
            }

            $("#my-account-link").attr("href", myaccountUrl +"/myaccount");

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
            var authRequest = '<%=Encode.forJavaScriptBlock(authRequest)%>';
            var jsonAuthRequest = JSON.parse(authRequest);

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

    </script>
</body>
</html>
