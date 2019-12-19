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

<%@page import="org.owasp.encoder.Encode" %>
<%@page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
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

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

             if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = "Authentication Failed! Please Retry";
            }
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
<body onload="getLoginDiv()">
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
            <!-- page content -->
            <div class="ui segment">
            <!-- content -->
            <div class="container col-xs-10 col-sm-6 col-md-6 col-lg-4 col-centered wr-content
            wr-login col-centered">
                <div>
                    <h3 class="ui header">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mobile.update.title")%>
                    </h3>
                </div>
                <br/>
                <div class="boarder-all ">
                    <div class="clearfix"></div>
                    <div class="padding-double login-form">
                        <div id="errorDiv"></div>
                        <%
                            if ("true".equals(authenticationFailed)) {
                        %>
                                <div class="alert alert-danger" id="failed-msg">
                                <%=Encode.forHtmlContent(errorMessage)%></div>
                        <% } %>
                        <div id="alertDiv"></div>
                        <form id="pin_form" name="pin_form" action="../../commonauth"  method="POST" class="ui form">
                            <div id="loginTable1" class="identity-box">
                                <%
                                    String loginFailed = request.getParameter("authFailure");
                                    if (loginFailed != null && "true".equals(loginFailed)) {
                                        String authFailureMsg = request.getParameter("authFailureMsg");
                                        if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                                %>
                                            <div class="alert alert-error">Authentication Failed! Please Retry</div>
                                <% } }  %>
                                         <!-- Token Pin -->
                                         <div class="field">
                                            <h5 for="password">
                                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mobile.update.label")%>
                                            </h5>
                                            <input type="text" id='MOBILE_NUMBER' name="MOBILE_NUMBER" size='30'
                                            placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "mobile.update.placeholder")%>"/>
                                         </div>
                                         <input type="hidden" name="sessionDataKey"
                                            value='<%=Encode.forHtmlAttribute(request.getParameter
                                            ("sessionDataKey"))%>'/>
                                         <br><div>
                                              <input type="button" name="update" id="update"
                                              value=<%=AuthenticationEndpointUtil.i18n(resourceBundle, "mobile.update.button")%>
                                              class="ui primary button">
                                         </div>
                            </div>
                        </form>
                       <div class="clearfix"></div>
                    </div>
                </div>
                <!-- /content -->
               </div>
        </div>
        <!-- /content/body -->
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
<script src="libs/jquery_3.4.1/jquery-3.4.1.js"></script>
<script src="libs/bootstrap_3.4.1/js/bootstrap.min.js"></script>
 <script type="text/javascript">
    $(document).ready(function() {
        $('#update').click(function() {
            var mobileNumber = document.getElementById("MOBILE_NUMBER").value;
            if (mobileNumber == "") {
                document.getElementById('alertDiv').innerHTML
                = '<div id="error-msg" class="ui visible negative message">Please enter the mobile number!</div><br/>';
            } else {
                $('#pin_form').submit();
            }
        });
    });
    </script>
</body>
</html>

