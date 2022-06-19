<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
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

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<!-- Branding Preferences -->
<jsp:directive.include file="extensions/branding-preferences.jsp"/>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<!doctype html>
<html>
<head>
    <!-- header -->
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
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component name="ProductHeader" >
            <!-- product-title -->
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
                <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
                <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component name="MainSection" >
            <div class="ui segment left aligned">
                <form onsubmit="event.preventDefault()" id="identifierForm">
                    <div class="field">
                        <div class="ui fluid left icon input">
                            <input
                                type="text"
                                id="username"
                                value=""
                                name="username"
                                tabindex="0"
                                placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "username")%>"
                                required />
                            <i aria-hidden="true" class="user icon"></i>
                        </div>
                        <input id="authType" name="authType" type="hidden" value="idf">
                    </div>

                    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute
                            (request.getParameter("sessionDataKey"))%>'/>

                    <div class="align-right buttons">
                        <input type="button" class="ui primary large button"
                                onclick="submitIdentifier();"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "next")%>" />
                    </div>
                </form>

                <form method="POST" action="<%=commonauthURL%>" id="form" onsubmit="return false;">
                    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                    <input type="hidden" name="tokenResponse" id="tokenResponse" value="tmp val" />
                </form>
            </div>
        </layout:component>
        <layout:component name="ProductFooter" >
            <!-- product-footer -->
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

    <!-- footer -->
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

        function getParameterByName(name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return "";
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        function submitIdentifier() {
            var username = document.getElementById("username");
            username.value = username.value.trim();
            if(username.value){
                $.ajax({
                    type: "GET",
                    url: "/api/users/v1/me/webauthn/start-authentication?username=admin&" +
                        "tenantDomain=carbon.super&storeDomain=PRIMARY&appId=https://localhost:9443&" +
                        "sessionDataKey="+getParameterByName("sessionDataKey"),
                    xhrFields: { withCredentials: true },
                    success: function (data) {
                        if (data) {
                            console.log(data);
                        }
                    },
                    cache: false
                });
            }
        }

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
                            userHandle: response.response.userHandle &&
                                base64url.fromByteArray(response.response.userHandle)
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

            return extend(
                request, {
                    allowCredentials,
                    challenge: base64url.toByteArray(request.challenge),
                });
        }

        function talkToDevice(authenticatorResponse){
            var authRequest = authenticatorResponse;
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
                var form = document.getElementById('form');
                var reg = document.getElementById('tokenResponse');
                reg.value = JSON.stringify({errorCode : 400, message : err});
                form.submit();
            });
        }

    </script>
</body>
</html>
