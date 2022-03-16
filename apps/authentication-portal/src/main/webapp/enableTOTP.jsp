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
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

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
                errorMessage = Encode.forHtmlAttribute(request.getParameter(Constants.AUTH_FAILURE_MSG));

                 if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                    errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
                }
            }
        }
    %>

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
            <script src="js/gadget.js"></script>
            <script src="js/qrCodeGenerator.js"></script>
            <!--[if lt IE 9]>
            <script src="js/html5shiv.min.js"></script>
            <script src="js/respond.min.js"></script>
            <![endif]-->
        </head>

        <body class="login-portal layout totp-portal-layout">
            <main class="center-segment">
                <div class="ui container medium center aligned middle aligned">
                    <!-- product-title -->
                    <%
                        File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                        if (productTitleFile.exists()) {
                    %>
                    <jsp:include page="extensions/product-title.jsp"/>
                    <% } else { %>
                    <jsp:include page="includes/product-title.jsp"/>
                    <% } %>

                    <div class="ui segment">
                        <!-- page content -->
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
                                <%
                                    String loginFailed = request.getParameter("authFailure");
                                    if (loginFailed != null && "true".equals(loginFailed)) {
                                        String authFailureMsg = request.getParameter("authFailureMsg");
                                        if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                                %>
                                            <div class="ui negative message"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry")%></div>
                                            <div class="ui divider hidden"></div>
                                <% } }  %>

                                <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.totp.not.enabled.please.enable")%></p>

                                <input type="hidden" id="ENABLE_TOTP" name="ENABLE_TOTP" value="false"/>
                                <input type="hidden" name='ske' id='ske' value='<%=Encode.forHtmlAttribute(request.getParameter("ske"))%>'/>
                                <input type="hidden" name="sessionDataKey" id="sessionDataKey"
                                    value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>

                                <div class="ui center aligned basic segment">
                                    <form name="qrinp">
                                        <input type="numeric" name="ECC" value="1" size="1" style="Display:none" id="ecc">
                                        <canvas id="qrcanv">
                                    </form>
                                </div>

                                <div class="align-right buttons">
                                    <input type="button" name="cancel" id="cancel" value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "cancel")%>" class="ui button secondary">
                                    <input type="button" name="continue" id="continue" value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>" class="ui primary button">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

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

            <!-- product-footer -->
            <%
                File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                if (productFooterFile.exists()) {
            %>
            <jsp:include page="extensions/product-footer.jsp"/>
            <% } else { %>
            <jsp:include page="includes/product-footer.jsp"/>
            <% } %>

            <!-- footer -->
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
                        $(".ui.modal").modal("show");
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
            </script>
        </body>
    </html>
