<%--
  ~ Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
<%@page import="org.apache.commons.lang.StringUtils" %>
<%@page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.authenticator.smsotp.SMSOTPConstants" %>
<%@page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="static java.util.Base64.getDecoder" %>
<%@ page import="java.io.File" %>

<jsp:directive.include file="includes/localize.jsp"/>

<%
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = "Authentication Failed! Please Retry";
    String authenticationFailed = "false";
    String errorInfo = null;

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = "Authentication Failed! Please Retry";
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.UNABLE_SEND_CODE_VALUE)) {
                errorMessage = "Unable to send code to your phone number";
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.ERROR_CODE_MISMATCH)) {
                errorMessage = "The code entered is incorrect. Authentication Failed!";
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.ERROR_SMSOTP_DISABLE_MSG)) {
                errorMessage = "Enable the SMS OTP in your Profile.
                Cannot proceed further without SMS OTP authentication.";
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.TOKEN_EXPIRED_VALUE)) {
                errorMessage = "The code entered is expired. Authentication Failed!";
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.SEND_OTP_DIRECTLY_DISABLE_MSG)) {
                errorMessage = "User not found in the directory. Cannot
                proceed further without SMS OTP authentication.";
            }
        }
        if (request.getParameter(SMSOTPConstants.AUTH_FAILURE_INFO) != null) {
            errorInfo = new
                    String(getDecoder().decode(request.getParameter(SMSOTPConstants.AUTH_FAILURE_INFO)));

        }
    }
%>
<!doctype html>
<html>
<head>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:directive.include file="includes/header.jsp"/>
    <% } %>
</head>

<body>
<!-- page content -->
<div class="container-fluid body-wrapper">

    <div class="row">
        <div class="col-md-12">

            <!-- content -->
            <div class="container col-xs-10 col-sm-6 col-md-6 col-lg-4 col-centered wr-content
            wr-login col-centered">
                <div>
                    <h2 class="wr-title blue-bg padding-double white boarder-bottom-blue margin-none">
                        Failed Authentication with SMSOTP &nbsp;&nbsp;</h2>

                </div>
                <div class="boarder-all ">
                    <div class="clearfix"></div>
                    <div class="padding-double login-form">
                        <div id="errorDiv"></div>
                        <%
                            if ("true".equals(authenticationFailed)) {
                        %>
                                <div class="alert alert-danger" id="failed-msg">
                                <%=Encode.forHtmlContent(errorMessage)%></div>
                            <% if (StringUtils.isNotEmpty(errorInfo)){ %>
                               <div class="alert alert-warning" id="failed-msg-info">
                                   <p class="word-break-all"><%=Encode.forHtmlContent(errorInfo)%></p>
                               </div>
                        <% }
                         }
                        %>
                        <div id="alertDiv"></div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <!-- /content -->
            </div>
        </div>
        <!-- /content/body -->
    </div>
</div>

<!-- product-footer -->
    <%
        File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
        if (productFooterFile.exists()) {
    %>
        <jsp:include page="extensions/product-footer.jsp"/>
    <% } else { %>
        <jsp:directive.include file="includes/product-footer.jsp"/>
    <% } %>

    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
        <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
        <jsp:directive.include file="includes/footer.jsp"/>
    <% } %>
</body>
</html>

