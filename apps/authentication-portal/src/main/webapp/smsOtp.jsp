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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.authenticator.smsotp.SMSOTPConstants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="includes/localize.jsp" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.retry");
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.retry");
            }
            if (errorMessage.equalsIgnoreCase(SMSOTPConstants.TOKEN_EXPIRED_VALUE)) {
                errorMessage = IdentityManagementEndpointUtil.i18n(resourceBundle,"error.code.expired.resend");
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
        <!-- header -->
        <%
            File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
            if (headerFile.exists()) {
        %>
        <jsp:include page="extensions/header.jsp"/>
        <% } else { %>
        <jsp:include page="includes/header.jsp"/>
        <% } %>
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="login-portal layout sms-otp-portal-layout">
        <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
            <layout:component componentName="ProductHeader" >
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
            <layout:component componentName="MainSection" >
                <div class="ui segment">
                    <!-- page content -->
                    <h2><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "auth.with.smsotp")%></h2>
                    <div class="ui divider hidden"></div>
                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                            <div class="ui negative message" id="failed-msg">
                                <%=Encode.forHtmlContent(errorMessage)%>
                            </div>
                            <div class="ui divider hidden"></div>
                    <% } %>
                    <div class="error-msg"></div>
                    <div class="segment-form">
                        <form class="ui large form" id="pin_form" name="pin_form" action="../commonauth"  method="POST">
                            <%
                                String loginFailed = request.getParameter("authFailure");
                                if (loginFailed != null && "true".equals(loginFailed)) {
                                    String authFailureMsg = request.getParameter("authFailureMsg");
                                    if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                            %>
                                <div class="ui visible negative message">
                                    <%=IdentityManagementEndpointUtil.i18n(resourceBundle, "error.retry")%>
                                </div>
                                <div class="ui divider hidden"></div>
                            <% } }  %>
                            <!-- Token Pin -->
                            <% if (request.getParameter("screenvalue") != null) { %>
                            <div class="field">
                                <label for="password">
                                    <%=IdentityManagementEndpointUtil.i18n(resourceBundle, "enter.code.sent.smsotp")%><%=Encode.forHtmlContent(request.getParameter("screenvalue"))%>
                                </label>
                                <input type="password" id='OTPcode' name="OTPcode"
                                        size='30'/>
                            <% } else { %>
                            <div class="field">
                                <label for="password"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "enter.code.sent.smsotp")%></label>
                                <input type="password" id='OTPcode' name="OTPcode"
                                size='30'/>
                            <% } %>
                            </div>
                            <input type="hidden" name="sessionDataKey"
                            value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/><br/>
                            <div class="align-right buttons">
                                <%
                                    if ("true".equals(authenticationFailed)) {
                                        String reSendCode = request.getParameter("resendCode");
                                        if ("true".equals(reSendCode)) {
                                %>
                                    <div id="resendCodeLinkDiv" class="ui button secondary">
                                        <a id="resend"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "resend.code")%></a>
                                    </div>
                                <% } } %>
                                <input
                                    type="button" name="authenticate" id="authenticate"
                                    value="<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "authenticate.button")%>" class="ui primary button"/>
                            </div>
                            <input type='hidden' name='resendCode' id='resendCode' value='false'/>
                        </form>
                    </div>
                </div>
            </layout:component>
            <layout:component componentName="ProductFooter" >
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

        <script type="text/javascript">
        $(document).ready(function() {
            $('#authenticate').click(function() {
                if ($('#pin_form').data("submitted") === true) {
                    console.warn("Prevented a possible double submit event");
                } else {
                    var OTPcode = document.getElementById("OTPcode").value;
                    if (OTPcode == "") {
                        document.getElementById('alertDiv').innerHTML
                            = '<div id="error-msg" class="ui negative message"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "please.enter.code")%></div><div class="ui divider hidden"></div>';
                    } else {
                        $('#pin_form').data("submitted", true);
                        $('#pin_form').submit();
                    }
                }
            });
        });
        $(document).ready(function() {
            $('#resendCodeLinkDiv').click(function() {
                document.getElementById("resendCode").value = "true";
                $('#pin_form').submit();
            });
        });
        </script>
    </body>
</html>
