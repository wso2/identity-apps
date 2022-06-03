<%--
  ~ Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

    String idp = request.getParameter("idp");
    String authenticator = request.getParameter("authenticator");
    String sessionDataKey = request.getParameter(Constants.SESSION_DATA_KEY);
    
    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
    String authenticationFailed = "false";
    
    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";
        
        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);
            
            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
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
        <%
            } else {
        %>
                <jsp:include page="includes/header.jsp"/>
        <%
            }
        %>

        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="login-portal layout authentication-portal-layout">
        <main class="center-segment">
            <div class="ui container medium center aligned middle aligned">
                <!-- product-title -->
                <%
                    File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                    if (productTitleFile.exists()) {
                %>
                        <jsp:include page="extensions/product-title.jsp"/>
                <%
                    } else {
                %>
                        <jsp:include page="includes/product-title.jsp"/>
                <%
                    }
                %>

                <div class="ui segment">
                    <!-- page content -->
                    <h2>Sign In with Enterprise Login</h2>
                    <div class="ui divider hidden"></div>

                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                            <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%></div>
                            <div class="ui divider hidden"></div>
                    <%
                        }
                    %>

                    <div id="alertDiv"></div>

                    <div class="segment-form">
                        <form class="ui large form" id="pin_form" name="pin_form" action="<%=commonauthURL%>" method="GET">
                            <div class="ui segment">
                                <p>Name of the Organization:</p>
                                <input type="text" id='ORG_NAME' name="org" size='30'/>
                                <input id="idp" name="idp" type="hidden" value="<%=Encode.forHtmlAttribute(idp)%>"/>
                                <input id="authenticator" name="authenticator" type="hidden" value="<%=Encode.forHtmlAttribute(authenticator)%>"/>
				                <input id="sessionDataKey" name="sessionDataKey" type="hidden" value="<%=Encode.forHtmlAttribute(sessionDataKey)%>"/>
                                <div class="ui divider hidden"></div>
                                <div class="align-right buttons">
                                    <button type="submit" class="ui primary large button">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "Submit")%>
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>

        <!-- product-footer -->
        <%
            File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
            if (productFooterFile.exists()) {
        %>
                <jsp:include page="extensions/product-footer.jsp"/>
        <%
            } else {
        %>
                <jsp:include page="includes/product-footer.jsp"/>
        <%
            }
        %>

        <!-- footer -->
        <%
            File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
            if (footerFile.exists()) {
        %>
                <jsp:include page="extensions/footer.jsp"/>
        <%
            } else {
        %>
                <jsp:include page="includes/footer.jsp"/>
        <%
            }
        %>

        <!-- <script type="text/javascript">
            $(document).ready(function() {
                $('#update').click(function() {
                    var orgName = document
                            .getElementById("ORG_NAME").value;
                    if (orgName == "") {
                        document.getElementById('alertDiv').innerHTML
                            = '<div id="error-msg" class="ui negative message"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.enter.email")%></div>'
                              +'<div class="ui divider hidden"></div>';
                    } else {
                        $('#pin_form').submit();
                    }
                });
            });

        </script> -->
    </body>
</html>
