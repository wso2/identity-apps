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

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.authenticator.smsotp.SMSOTPConstants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.authenticator.smsotp.SMSOTPUtils" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="static java.util.Base64.getDecoder" %>

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
                errorMessage = "Enable the SMS OTP in your Profile. Cannot proceed further without SMS OTP authentication.";
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.TOKEN_EXPIRED_VALUE)) {
                errorMessage = "The code entered is expired. Authentication Failed!";
            } else if (errorMessage.equalsIgnoreCase(SMSOTPConstants.SEND_OTP_DIRECTLY_DISABLE_MSG)) {
                errorMessage = "User not found in the directory. Cannot proceed further without SMS OTP authentication.";
            } else if (SMSOTPUtils.useInternalErrorCodes()) {
                String httpCode = URLDecoder.decode(errorMessage, SMSOTPConstants.CHAR_SET_UTF_8);
                errorMessage = SMSOTPConstants.ErrorMessage.getMappedErrorMessage(httpCode);
            }
        }
        if (request.getParameter(SMSOTPConstants.AUTH_FAILURE_INFO) != null) {
            errorInfo = new
                    String(getDecoder().decode(request.getParameter(SMSOTPConstants.AUTH_FAILURE_INFO)));

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
        <jsp:directive.include file="includes/header.jsp"/>
        <% } %>
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body>
        <main class="center-segment">
            <div class="ui container medium center aligned middle aligned">
                <!-- product-title -->
                <%
                    File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                    if (productTitleFile.exists()) {
                %>
                <jsp:include page="extensions/product-title.jsp"/>
                <% } else { %>
                <jsp:directive.include file="includes/product-title.jsp"/>
                <% } %>

                <div class="ui segment">
                    <!-- page content -->
                    <h2>Failed Authentication with SMSOTP</h2>
                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                            <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%></div>
                        <% if (StringUtils.isNotEmpty(errorInfo)){ %>
                            <div class="ui negative message" id="failed-msg-info">
                                <p class="word-break-all"><%=Encode.forHtmlContent(errorInfo)%></p>
                            </div>
                    <% }
                        }
                    %>
                </div>
            </div>
        </main> 

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
