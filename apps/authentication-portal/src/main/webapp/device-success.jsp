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
            <div class="ui segment left aligned">
                <div class="field">
                    <%if(request.getParameter("app_name") != null) { %>
                        <div class="ui positive message">
                            <div class="header">
                                Successful
                            </div>
                            <p>Login successful for application:
                                <%= request.getParameter("app_name")%>.Please close the browser and
                                return to your device.</p>
                        </div>
                    <% } else { %>
                        <div class="ui negative message">
                            <div class="header">
                                Authentication Error!
                            </div>
                        <p>Something went wrong during authentication process. Please sign in again.</p>
                        </div>
                    <% } %>
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
