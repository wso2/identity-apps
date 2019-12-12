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

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

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
<body>
    <main class="center-segment">
        <div class="ui container large center aligned middle aligned">

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
                        <input class="ui large button" type="reset"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"cancel")%>"
                                onclick="javascript:document.location.href='<%=Encode.forJavaScript(openidreturnto)%>'"/>
                    </div>
                </form>
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
