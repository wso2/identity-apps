<%--
  ~ Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
<%@ page import="org.wso2.carbon.identity.authenticator.smsotp.SMSOTPConstants" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

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
            if (errorMessage.equalsIgnoreCase(SMSOTPConstants.TOKEN_EXPIRED_VALUE)) {
                errorMessage = "The code entered is expired. Click Resend Code to continue.";
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
<body>
<!-- page content -->
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

        <!-- content -->
        <div class="container col-xs-10 col-sm-6 col-md-6 col-lg-4 col-centered wr-content wr-login col-centered">
            <div>
                <h3 class="ui header">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "smsotp.title")%>
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
                            <%=Encode.forHtmlContent(errorMessage)%>
                        </div>
                    <% } %>
                    <div id="alertDiv"></div>
                    <form id="pin_form" name="pin_form" action="../../commonauth"  method="POST" class="ui form">
                            <%
                                String loginFailed = request.getParameter("authFailure");
                                if (loginFailed != null && "true".equals(loginFailed)) {
                                    String authFailureMsg = request.getParameter("authFailureMsg");
                                    if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                            %>
                                        <div class="alert alert-error">Authentication Failed! Please Retry</div>
                            <% } }  %>
                                     <!-- Token Pin -->
                                     <% if (request.getParameter("screenvalue") != null) { %>
                                      <div class="field">
                                       <h5 for="password">
                                       <%=AuthenticationEndpointUtil.i18n(resourceBundle, "smsotp.label")%>
                                       <%=Encode.forHtmlContent(request.getParameter("screenvalue"))%>
                                       </h5>
                                       <input type="password" id='OTPcode' name="OTPcode" size='30'
                                       placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle,
                                       "smsotp.placeholder")%>"/>
                                       </div>
                                       <% } else { %>
                                       <div class="field">
                                       <h5 for="password">
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "smsotp.label")%>
                                       </h5>
                                       <input type="password" id='OTPcode' name="OTPcode" size='30'
                                       placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle,
                                       "smsotp.placeholder")%>"/>
                                       <% } %>
                                     </div>
                                     <input type="hidden" name="sessionDataKey"
                                        value=<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>/>
                                        <br/>
                                     <div> <input type="button" name="authenticate" id="authenticate"
                                        value=<%=AuthenticationEndpointUtil.i18n(resourceBundle, "smsotp.button")%>
                                         class="ui right floated primary button"></div>
                                         <div id="resendCodeLinkDiv" style="display:inline-block; float:left">
                                             <a id="resend">Resend Code</a>
                                          </div>
                                     <%
                                         if ("true".equals(authenticationFailed)) {
                                         String reSendCode = request.getParameter("resendCode");
                                         if ("true".equals(reSendCode)) {
                                     %>
                                         <div id="resendCodeLinkDiv" class="column align-right buttons">
                                            <a id="resend">Resend Code</a>
                                         </div>
                                     <% } } %>
                        <input type='hidden' name='resendCode' id='resendCode' value='false'/>
                    </form>
                   <div class="clearfix"></div>
                </div>
            </div>
            <!-- /content -->
        </div>
        </div>
        <!-- /content/body -->
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

<script type="text/javascript">
    $(document).ready(function() {
        $('#authenticate').click(function(event) {
            event.preventDefault();
            if ($('#pin_form').data("submitted") === true) {
                console.warn("Prevented a possible double submit event");
            } else {
                var OTPcode = document.getElementById("OTPcode").value;
                if (OTPcode == "") {
                    document.getElementById('alertDiv').innerHTML
                        = '<div id="error-msg" class="ui visible negative message">Please enter the code!</div><br/>';
                } else {
                    $('#pin_form').data("submitted", true);
                    $('#pin_form').submit();
                }
            }
        });
    });
    $(document).ready(function() {
        $('#resendCodeLinkDiv').click(function(event) {
            event.preventDefault();
            document.getElementById("resendCode").value = "true";
            $('#pin_form').submit();
        });
    });
</script>
</body>
</html>