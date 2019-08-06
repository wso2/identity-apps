<%--
  ~ Copyright (c) 2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="localize.jsp" %>
<%@include file="init-url.jsp" %>

<%
    String errorCode = request.getParameter("oauthErrorCode");
    String errorMsg = request.getParameter("oauthErrorMsg");
    String regex = "application=";
    String errorMsgContext = errorMsg;
    String errorMsgApp = "";
    String[] error = errorMsg.split(regex);
    if (error.length > 1) {
        errorMsgContext = errorMsg.split(regex)[0] + regex;
        errorMsgApp = errorMsg.split(regex)[1];
    }
%>

<!doctype html>
<html>
<head>
    <jsp:include page="includes/head.jsp" />

    <title><%=AuthenticationEndpointUtil.i18n(resourceBundle, "wso2.identity.server")%></title>
</head>
<body>
    <script type="text/javascript">
        function approved() {
            document.getElementById('consent').value = "approve";
            document.getElementById("oauth2_authz").submit();
        }
        function approvedAlways() {
            document.getElementById('consent').value = "approveAlways";
            document.getElementById("oauth2_authz").submit();
        }
        function deny() {
            document.getElementById('consent').value = "deny";
            document.getElementById("oauth2_authz").submit();
        }
    </script>

    <div class="container-fluid">
        <div class="login-form">
            <style>
                body > div,
                body > div > div,
                body > div > div > div.login-form {
                    height: 100%;
                }
            </style>
            <div class="ui center aligned middle aligned grid" style="height: 100%;">
                <div class="column" style="max-width: 450px;">
                    <div class="ui segment">
                        <div class="product-title">
                            <img src="libs/theme/assets/images/logo.svg"
                                alt="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "business.name")%>"
                                title="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "business.name")%>"
                                class="ui inline image product-logo">
                                <h1 class="product-title-text"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "identity.server")%></h1>
                        </div>
                        <h3 class="ui header">
                            <%
                                if (errorCode != null && errorMsg != null) {
                            %>
                                <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, errorMsgContext)%><%=Encode.forHtml(errorMsgApp)%>
                            <% } else { %>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle,"oauth.processing.error.msg")%></td>
                            <% } %>
                        </h3>
                        <form  action="<%=commonauthURL%>" method="post" id="oauth2_authz" name="oauth2_authz">
                            <div class="field"></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- footer -->
    <footer class="footer" style="display: none;">
        <div class="container-fluid">
            <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "wso2.identity.server")%> | &copy;
                <script>document.write(new Date().getFullYear());</script>
                <a href="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "business.homepage")%>" target="_blank"><i class="icon fw fw-wso2"></i>
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "inc")%>
                </a>. <%=AuthenticationEndpointUtil.i18n(resourceBundle, "all.rights.reserved")%>
            </p>
        </div>
    </footer>

    <script src="libs/jquery_1.11.3/jquery-1.11.3.js"></script>
    <script src="libs/bootstrap_3.3.5/js/bootstrap.min.js"></script>
</body>
</html>
