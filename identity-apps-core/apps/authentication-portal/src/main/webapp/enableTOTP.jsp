<%--
  ~ Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            String error = Encode.forHtmlAttribute(request.getParameter(Constants.AUTH_FAILURE_MSG));

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
            } else if (!error.equalsIgnoreCase(AuthenticationEndpointUtil.i18n(resourceBundle, error))) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, error);
            }
        }
    }
%>

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

<% request.setAttribute("pageName", "enable-totp"); %>

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
        <script src="js/gadget.js"></script>
        <script src="js/qrCodeGenerator.js"></script>
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="login-portal layout totp-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
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
                <div class="ui segment attached segment-with-attached mt-3">
                    <%-- page content --%>
                    <h3 class="ui header text-center">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "enable.totp")%>
                    </h3>
                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                        <div class="ui negative message" id="failed-msg"><%=errorMessage%></div>
                        <div class="ui divider hidden"></div>
                    <% } %>
                    <div class="segment-form">
                        <form class="ui large form mb-0" id="pin_form" name="pin_form" action="<%=commonauthURL%>"  method="POST">
                            <%
                                String loginFailed = request.getParameter("authFailure");
                                if (loginFailed != null && "true".equals(loginFailed)) {
                                    String authFailureMsg = request.getParameter("authFailureMsg");
                                    if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                            %>
                                        <div class="ui negative message"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry")%></div>
                                        <div class="ui divider hidden"></div>
                            <% } }  %>

                            <p class="text-center">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle,
                                        "scan.the.qr.code.using.an.authenticator.app")%>
                            </p>

                            <input type="hidden" id="ENABLE_TOTP" name="ENABLE_TOTP" value="false"/>
                            <input type="hidden" name='ske' id='ske' value='<%=Encode.forHtmlAttribute(request.getParameter("ske"))%>'/>
                            <input type="hidden" name="sessionDataKey" id="sessionDataKey"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>

                            <div class="ui center aligned basic segment middle aligned pl-6">
                                <form name="qrinp">
                                    <input type="numeric" name="ECC" value="1" size="1" style="Display:none" id="ecc">
                                    <canvas id="qrcanv">
                                </form>
                            </div>

                            <div>
                                <div id="checkboxField" class="field mb-5">
                                    <div class="ui checkbox">
                                        <input id="checkbox" type="checkbox"/>
                                        <label for="checkbox"><%=AuthenticationEndpointUtil.i18n(resourceBundle,
                                            "confirm.you.have.scanned.the.qr.code")%></label>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-0">
                                <input type="button" name="continue" id="continue"
                                        value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>"
                                        class="ui primary fluid large button" disabled>
                            </div>
                            <div class="text-center mt-1">
                                <%
                                    String multiOptionURI = request.getParameter("multiOptionURI");
                                    if (multiOptionURI != null &&
                                            AuthenticationEndpointUtil.isValidMultiOptionURI(multiOptionURI) &&
                                            isMultiAuthAvailable(multiOptionURI)) {
                                %>
                                    <a
                                        class="ui primary basic button link-button"
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
                <div class="ui warning bottom attached message text-left display-flex" style="font-size: small;">
                    <i aria-hidden="true" class="warning circle icon"></i>
                    <div class="message-content">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "dont.have.app.download.google.authenticator")%>
                        <a href="https://www.apple.com/us/search/totp?src=globalnav">App Store</a>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "or")%>
                        <a href="https://play.google.com/store/search?q=totp">Google Play</a>
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
            var checkbox = $("#checkbox");
            var continueBtn = $("#continue");
            var pinForm = $("#pin_form");

            checkbox.click(function () {
                if ($(this).is(":checked")) {
                    continueBtn.prop("disabled", false).removeClass("disabled");
                } else {
                    continueBtn.prop("disabled", true).addClass("disabled");
                }
            });

            $(document).ready(function() {
                checkbox.prop('checked',false);
                continueBtn.click(function() {
                    document.getElementById("ENABLE_TOTP").value = 'true';
                    pinForm.submit();
                });
                initiateTOTP();
            });

            function initiateTOTP(){
                var key =  document.getElementById("ske").value;
                if(key != null) {
                    loadQRCode(key);
                }
            }
        </script>
    </body>
</html>
