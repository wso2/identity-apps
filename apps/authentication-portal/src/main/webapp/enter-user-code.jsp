<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@include file="includes/localize.jsp" %>

<!doctype html>
<html>
<head>
    <!-- header -->
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:directive.include file="includes/header.jsp"/>
    <% } %>
</head>
<body onload="loadFunc()">
    <main class="center-segment">
        <div class="ui container medium center aligned middle">
    
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
                <h3 class="ui header">
                    Device Flow Sign In
                </h3>
                
                <div class="segment-form">
                    <form class="ui large form" action="../oauth2/device" method="post" id="loginForm">
                        <div class="field">
                            <div class="ui fluid left icon input">
                                <input
                                        type="text"
                                        id="user_code"
                                        value=""
                                        name="user_code"
                                        tabindex="0"
                                        placeholder="user code"
                                        required>
                                <i aria-hidden="true" class="user icon"></i>
                            </div>
                        </div>
                        <div class="column align-right buttons">
                            <button
                                    type="submit"
                                    onclick="submitCredentials(event)"
                                    class="ui primary large button"
                                    role="button">
                                Continue
                            </button>
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
        var userCode;
    
        function loadFunc() {
            const urlParams = new URLSearchParams(window.location.search);
            
            userCode = urlParams.get('user_code');
            document.getElementById("user_code").value = userCode;
        }
    </script>
</body>
</html>
