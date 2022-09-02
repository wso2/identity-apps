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
<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    String[] profiles = request.getParameterValues("profile");
    String[] claimTags = request.getParameterValues("claimTag");
    String[] claimValues = request.getParameterValues("claimValue");
    String openidreturnto = request.getParameter("openid.return_to");
    String openididentity = request.getParameter("openid.identity");
    if (openidreturnto != null && openidreturnto.indexOf("?") > 0) {
        openidreturnto = openidreturnto.substring(0, openidreturnto.indexOf("?"));
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "large");
%>

<!doctype html>
<html>
<head>
    <%-- header --%>
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
        <layout:component componentName="ProductHeader" >
            <%-- product-title --%>
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
                <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
                <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="MainSection" >
            <div class="ui segment">
                <h3 class="ui header">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "openid.user.claims")%>
                </h3>

                <form action="<%=openidServerURL%>" id="profile" name="profile" class="segment-form">
                    <div class="field">
                        <% if (claimTags != null && claimTags.length > 0) { %>
                        <table class="ui celled table">
                            <tr>
                                <th><%=AuthenticationEndpointUtil.i18n(resourceBundle, "claim.uri")%></th>
                                <th><%=AuthenticationEndpointUtil.i18n(resourceBundle, "claim.value")%></th>
                            </tr>
                            <%
                                for (int i = 0; i < claimTags.length; i++) {
                                    String claimTag = claimTags[i];
                                    if ("MultiAttributeSeparator" .equals(claimTag)) {
                                        continue;
                                    }
                            %>
                            <tr>
                                <td><%=Encode.forHtmlContent(claimTag)%></td>
                                <td><%=Encode.forHtmlContent(claimValues[i])%></td>
                            </tr>
                            <% } %>
                        </table>
                        <% } %>
                    </div>

                    <div class="buttons right aligned">
                        <input type="button" class="ui primary large button" id="approve" name="approve"
                                onclick="javascript: approved(); return false;"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,
                                    "approve")%>"/>
                        <input type="button" class="ui large button" id="chkApprovedAlways"
                                onclick="javascript: approvedAlways();"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,
                                    "approve.always")%>"/>
                        <input type="hidden" id="hasApprovedAlways" name="hasApprovedAlways"
                                value="false"/>
                        <%
                            if (AuthenticationEndpointUtil.isValidURL(openidreturnto)) {
                        %>
                            <input class="ui large button" type="reset"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"cancel")%>"
                                    onclick="javascript:document.location.href='<%=Encode.forJavaScript(openidreturnto)%>'"/>
                        <%
                            }
                        %>
                    </div>
                </form>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter" >
            <%-- product-footer --%>
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

    <%-- footer --%>
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
        <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
        <jsp:include page="includes/footer.jsp"/>
    <% } %>

    <script type="text/javascript">
        function submitProfileSelection() {
            document.profileSelection.submit();
        }

        function approved() {
            document.getElementById("hasApprovedAlways").value = "false";
            document.profile.submit();
        }

        function approvedAlways() {
            document.getElementById("hasApprovedAlways").value = "true";
            document.profile.submit();
        }
    </script>
</body>
</html>
