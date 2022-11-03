<%--
  ~ Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.application.authenticator.totp.TOTPAuthenticatorConstants" %>
<%@ page import="org.wso2.carbon.identity.application.authenticator.totp.util.TOTPUtil" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityCoreConstants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    boolean isTOTPEnrollInSinglePageEnabled = TOTPUtil.isTOTPEnrollInSinglePageEnabled();
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        boolean isErrorMessageFromErrorCodeAdded = false;
        String errorCode = request.getParameter(TOTPAuthenticatorConstants.ERROR_CODE);
        if (errorCode != null) {
            if (errorCode.equals(IdentityCoreConstants.USER_ACCOUNT_LOCKED_ERROR_CODE)) {
                String lockedReason = request.getParameter(TOTPAuthenticatorConstants.LOCKED_REASON);
                if (lockedReason != null) {
                    if (lockedReason.equals(TOTPAuthenticatorConstants.MAX_TOTP_ATTEMPTS_EXCEEDED)) {
                        errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked.incorrect.login.attempts");
                        isErrorMessageFromErrorCodeAdded = true;
                    } else if (lockedReason.equals(TOTPAuthenticatorConstants.ADMIN_INITIATED)) {
                        errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked.admin.initiated");
                        isErrorMessageFromErrorCodeAdded = true;
                    }
                }
            }
        }
        if (!isErrorMessageFromErrorCodeAdded && request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = Encode.forHtmlAttribute(request.getParameter(Constants.AUTH_FAILURE_MSG));
            if (errorMessage.equalsIgnoreCase("authentication.fail.message") ||
                    errorMessage.equalsIgnoreCase("login.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
            }
        }
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

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
        <script src="js/gadget.js"></script>
        <script src="js/qrCodeGenerator.js"></script>
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="login-portal layout totp-portal-layout">
        <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
            <layout:component componentName="ProductHeader" >
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
            <layout:component componentName="MainSection" >
                <div class="ui segment">
                    <%-- page content --%>
                    <h2><%=AuthenticationEndpointUtil.i18n(resourceBundle, "enable.totp")%></h2>
                    <div class="ui divider hidden"></div>
                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                            <div class="ui negative message" id="failed-msg"><%=errorMessage%></div>
                            <div class="ui divider hidden"></div>
                    <% } %>
                    <div class="segment-form">
                        <form class="ui large form" id="pin_form" name="pin_form" action="<%=commonauthURL%>"  method="POST">
                            <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.totp.not.enabled.please.enable")%></p>

                            <input type="hidden" id="ENABLE_TOTP" name="ENABLE_TOTP" value="false"/>
                            <input type="hidden" name='ske' id='ske' value='<%=Encode.forHtmlAttribute(request.getParameter("ske"))%>'/>
                            <input type="hidden" name="sessionDataKey" id="sessionDataKey"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                            <%
                                if (isTOTPEnrollInSinglePageEnabled) {
			                %>
                                <input hidden type="text"  id="token" name="token" />
                            <%
				                }
			                %>
                            <div class="ui center aligned basic segment">
                                    <input type="numeric" name="ECC" value="1" size="1" style="Display:none" id="ecc">
                                    <canvas id="qrcanv">
                            </div>
                            <%
                                if (isTOTPEnrollInSinglePageEnabled) {
                            %>
                            <div class="equal width fields">
                                <div class="field mt-5">
                                    <input
                                        class="text-center p-3"
                                        id="pincode-1"
                                        name="pincode-1"
                                        tabindex="1"
                                        placeholder="·"
                                        maxlength="1"
                                        onkeyup="movetoNext(this, 'pincode-2', null)"
                                        autocomplete="off"
                                        autofocus />
                                </div>
                                <div class="field mt-5">
                                    <input
                                        class="text-center p-3"
                                        id="pincode-2"
                                        name="pincode-2"
                                        tabindex="2"
                                        placeholder="·"
                                        maxlength="1"
                                        onkeyup="movetoNext(this, 'pincode-3', 'pincode-1')"
                                        autocomplete="off" />
                                </div>
                                <div class="field mt-5">
                                    <input
                                        class="text-center p-3"
                                        id="pincode-3"
                                        name="pincode-3"
                                        tabindex="3"
                                        placeholder="·"
                                        maxlength="1"
                                        onkeyup="movetoNext(this, 'pincode-4', 'pincode-2')"
                                        autocomplete="off" />
                                </div>
                                <div class="field mt-5">
                                    <input
                                        class="text-center p-3"
                                        id="pincode-4"
                                        name="pincode-4"
                                        tabindex="4"
                                        placeholder="·"
                                        maxlength="1"
                                        onkeyup="movetoNext(this, 'pincode-5', 'pincode-3')"
                                        autocomplete="off" />
                                </div>
                                <div class="field mt-5">
                                    <input
                                        class="text-center p-3"
                                        id="pincode-5"
                                        name="pincode-5"
                                        tabindex="5"
                                        placeholder="·"
                                        maxlength="1"
                                        onkeyup="movetoNext(this, 'pincode-6', 'pincode-4')"
                                        autocomplete="off" />
                                </div>
                                <div class="field mt-5">
                                    <input
                                        class="text-center p-3"
                                        id="pincode-6"
                                        name="pincode-6"
                                        tabindex="6"
                                        placeholder="·"
                                        maxlength="1"
                                        onkeyup="movetoNext(this, null, 'pincode-5')"
                                        autocomplete="off">
                                </div>
                            </div>
                            <%
                                }
                            %>
                            <div class="align-right buttons">
                                <input type="button" name="cancel" id="cancel" value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "cancel")%>" class="ui button secondary">
                                <input type="button" name="continue" id="continue" value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>" class="ui primary button">
                            </div>
                        </form>
                    </div>
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

        <%
            if (!isTOTPEnrollInSinglePageEnabled) {
        %>
        <div class="ui modal tiny">
            <div class="content">
                <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "confirm.you.have.scanned.the.qr.code")%></p>
            </div>
            <div class="actions">
                <div class="align-right buttons">
                    <input type="button" name="cancelM" id="cancelM" value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "cancel")%>" class="ui button secondary">
                    <input type="button" name="continueM" id="continueM" value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>" class="ui primary button">
                </div>
            </div>
        </div>
        <%
           }
        %>
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
            $(document).ready(function() {
                $('#continue').click(function() {
                    document.getElementById("ENABLE_TOTP").value = 'true';
                    <%
                        if (isTOTPEnrollInSinglePageEnabled) {
                    %>
                        sub();
                        $('#pin_form').submit();
                    <%
                        } else {
                    %>
                    $(".ui.modal").modal("show");
                    <%
                        }
                    %>
                });
                $('#cancel').click(function() {
                    document.getElementById("ENABLE_TOTP").value = 'false';
                    $('#pin_form').submit();
                });
                initiateTOTP();
            });
            function initiateTOTP(){
                var key =  document.getElementById("ske").value;
                if(key != null) {
                    loadQRCode(key);
                }
            }
            $("#continueM").click(function () {
                $('#pin_form').submit();
            });
            $("#cancelM").click(function () {
                $(".ui.modal").modal("hide");
            });

            function sub() {
                var pin1 = document.getElementById("pincode-1").value;
                var pin2 = document.getElementById("pincode-2").value;
                var pin3 = document.getElementById("pincode-3").value;
                var pin4 = document.getElementById("pincode-4").value;
                var pin5 = document.getElementById("pincode-5").value;
                var pin6 = document.getElementById("pincode-6").value;
                var token = pin1 + pin2 + pin3 + pin4 + pin5 + pin6;
                document.getElementById('token').value = token;
            }

            // Handle paste events
            function handlePaste(e) {
                var clipboardData, value;
                // Stop data actually being pasted into element
                e.stopPropagation();
                e.preventDefault();
                // Get pasted data via clipboard API
                clipboardData = e.clipboardData || window.clipboardData;
                value = clipboardData.getData('Text');
                const reg = new RegExp(/^\d+$/);
                if (reg.test(value)) {
                    for (n = 0; n < 6; ++n) {
                        $("#pincode-" + (n+1)).val(value[n]);
                        $("#pincode-" + (n+1)).focus();
                    }
                }
            }

            function movetoNext(current, nextFieldID, previousID) {
                var key = event.keyCode || event.charCode;
                if (nextFieldID != null && current.value.length >= current.maxLength) {
                    document.getElementById(nextFieldID).focus();
                }
                if( key == 8 || key == 46 ) {
                    if ( previousID != null) {
                        document.getElementById(previousID).focus();
                    }
                }
            }

            document.getElementById('pincode-1').addEventListener('paste', handlePaste);

            $('#continue').attr('disabled', true);

            $('#pincode-6').on('keyup', function() {
                if ($('#pincode-1').val() != '' && $('#pincode-2').val() != ''
                        && $('#pincode-3').val() != '' && $('#pincode-4').val() != '' && $('#pincode-5').val() != ''  && $('#pincode-6').val() != '') {
                    $('#continue').attr('disabled', false);
                } else {
                    $('#continue').attr('disabled', true);
                }
            });
        </script>
    </body>
</html>
