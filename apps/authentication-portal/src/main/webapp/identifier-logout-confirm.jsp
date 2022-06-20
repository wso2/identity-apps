<%--
  ~ Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~  WSO2 Inc. licenses this file to you under the Apache License,
  ~  Version 2.0 (the "License"); you may not use this file except
  ~  in compliance with the License.
  ~  You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
  --%>

<%@page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<!-- Branding Preferences -->
<jsp:directive.include file="extensions/branding-preferences.jsp"/>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isLargeContainer", true);
%>

<!doctype html>
<html>
<head>
    <!-- header -->
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
        <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
        <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>
<body class="login-portal layout authentication-portal-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component name="ProductHeader" >
            <!-- product-title -->
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
                <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
                <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component name="MainSection" >
            <div class="ui segment">
                <h3 class="ui header">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "login")%>
                </h3>

                <form form action="<%=commonauthURL%>" method="post" id="identifier_logout_confirm_form"
                    name="identifier_logout_confirm_form" class="segment-form">

                    <div class="feild">
                        <p>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "log.in.as").replace("{0}", Encode.forHtml(request.getParameter("username")))%>
                        </p>
                    </div>

                    <div class="buttons right aligned">
                        <input type="button" class="ui primary large button" id="continue" name="continue"
                            onclick="javascript: continueFlow(); return false;"
                            value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"continue")%>" />
                        <input class="ui primary button" type="reset"
                            value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "not.you")%>"
                            onclick="javascript: resetFlow(); return false;" />
                        <input type="hidden" name="sessionDataKey"
                            value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                        <input type="hidden" name="identifier_consent" id="identifier_consent" value="continue"/>
                    </div>
                </form>
            </div>
        </layout:component>
        <layout:component name="ProductFooter" >
            <!-- product-footer -->
            <%
                File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                if (productFooterFile.exists()) {
            %>
                <jsp:include page="extensions/product-footer.jsp"/>
            <% } else { %>
                <jsp:include page="includes/product-footer.jsp"/>
            <% } %>
        </layout:component>
    </layout:main>

    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
        <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
        <jsp:include page="includes/footer.jsp"/>
    <% } %>

    <script type="text/javascript">

        function continueFlow() {
            document.getElementById('identifier_consent').value = "continue";
            document.getElementById("identifier_logout_confirm_form").submit();
        }

        function resetFlow() {
            document.getElementById('identifier_consent').value = "reset";
            document.getElementById("identifier_logout_confirm_form").submit();
        }

    </script>
</body>
</html>
