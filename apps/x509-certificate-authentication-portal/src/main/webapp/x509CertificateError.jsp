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

<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.TenantDataManager" %>
<%@ page import="java.util.ResourceBundle" %>

<fmt:bundle basename="org.wso2.carbon.identity.application.authentication.endpoint.i18n.Resources">
    <%
        String BUNDLE = "org.wso2.carbon.identity.application.authentication.endpoint.i18n.Resources";
        ResourceBundle resourceBundle = ResourceBundle.getBundle(BUNDLE, request.getLocale());
        request.getSession().invalidate();
        Map<String, String> idpAuthenticatorMapping = null;
        if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
            idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
        }

        String errorCode = resourceBundle.getString("unknown.error.code");
        String authenticationFailed = "false";
        String errorMessage = resourceBundle.getString("unknown.error.message");

        if (Boolean.parseBoolean(request.getParameter("authFailure"))) {
            authenticationFailed = "true";

            if (request.getParameter("errorCode") != null) {
                errorCode = request.getParameter("errorCode");

                if (errorCode.equalsIgnoreCase("18013")) {
                    errorMessage = resourceBundle.getString("certificateNotFound.error.message");
                } else if (errorCode.equalsIgnoreCase("18003")) {
                    errorMessage = resourceBundle.getString("userNotFound.error.message");
                } else if (errorCode.equalsIgnoreCase("20015")) {
                    errorMessage = resourceBundle.getString("userNamesConflict.error.message");
                } else if (errorCode.equalsIgnoreCase("17001")) {
                    errorMessage = resourceBundle.getString("userNotFoundInUserStore.error.message");
                } else if (errorCode.equalsIgnoreCase("18015")) {
                    errorMessage = resourceBundle.getString("not.valid.certificate");
                } else if (errorCode.equalsIgnoreCase("17003")) {
                    errorMessage = resourceBundle.getString("fail.validation.certificate");
                } else if (errorCode.equalsIgnoreCase("17004")) {
                    errorMessage = resourceBundle.getString(
                            "x509certificateauthenticator.alternativenames.regex.multiplematches.code.17004.error.message");
                } else if (errorCode.equalsIgnoreCase("17005")) {
                    errorMessage = resourceBundle
                            .getString("x509certificateauthenticator.alternativenames.regex.nomatches.code.17005.error.message");
                } else if (errorCode.equalsIgnoreCase("17006")) {
                    errorMessage = resourceBundle
                            .getString("x509certificateauthenticator.subjectdn.regex.multiplematches.code.17006.error.message");
                } else if (errorCode.equalsIgnoreCase("17007")) {
                    errorMessage = resourceBundle
                            .getString("x509certificateauthenticator.subjectdn.regex.nomatches.code.17007.error.message");
                } else if (errorCode.equalsIgnoreCase("17008")) {
                    errorMessage = resourceBundle
                            .getString("x509certificateauthenticator.alternativenames.notfound.code.17008.error.message");
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
            <jsp:directive.include file="includes/header.jsp"/>
            <% } %>
            <script src="js/scripts.js"></script>
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
                        <h2>Failed Authentication with X509Certificate</h2>
                        <%
                            if ("true".equals(authenticationFailed)) {
                        %>
                                <div class="ui negative message" id="failed-msg"><%=errorMessage%></div>
                        <% } %>
                        <div id="alertDiv"></div>
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
</fmt:bundle>
