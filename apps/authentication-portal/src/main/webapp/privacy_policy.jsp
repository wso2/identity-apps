<%--
  ~ Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ taglib prefix="ui" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
    
<%@ include file="localize.jsp" %>
    
<c:set var="body">
    <div id="app-header" class="ui borderless top fixed app-header menu">
        <div class="ui container">
            <!-- product-title -->
            <%
                File headerFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (headerFile.exists()) {
            %>
                    <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
                    <jsp:directive.include file="includes/product-title.jsp"/>
            <% } %>  
        </div>
    </div>
    
    <div class="app-content" style="padding-top: 62px;">
        <!-- page content -->
        <%
            File privacyPolicyFile = new File(getServletContext().getRealPath("extensions/privacy-policy-content.jsp"));
            if (privacyPolicyFile.exists()) {
        %>
                <jsp:include page="extensions/privacy-policy-content.jsp"/>
        <% } else { %>
                <jsp:directive.include file="includes/privacy-policy-content.jsp"/>
        <% } %>
    </div>
</c:set>
<c:set var="bottom">
    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
            <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
            <jsp:directive.include file="includes/footer.jsp"/>
    <% } %>

    <script type="text/javascript" src="js/u2f-api.js"></script>
    <script type="text/javascript">
        var ToC = "<nav role='navigation' class='table-of-contents'>" + "<h4>On this page:</h4>" + "<ul>";
        var newLine, el, title, link;

        $("#privacyPolicy h2,#privacyPolicy h3").each(function() {
            el = $(this);
            title = el.text();
            link = "#" + el.attr("id");
            if(el.is("h3")){
                newLine = "<li class='sub'>" + "<a href='" + link + "'>" + title + "</a>" + "</li>";
            }else{
                newLine = "<li >" + "<a href='" + link + "'>" + title + "</a>" + "</li>";
            }

            ToC += newLine;
        });

        ToC += "</ul>" + "</nav>";

        $("#toc").append(ToC);
    </script>
</c:set>

<ui:base pageTitle='<%=AuthenticationEndpointUtil.i18n(resourceBundle, "wso2.identity.server")%>'>
    <jsp:attribute name="bottomIncludes">${bottom}</jsp:attribute>
    <jsp:body>${body}</jsp:body>
</ui:base>
