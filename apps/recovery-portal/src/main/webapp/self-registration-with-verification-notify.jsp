<%--
  ~ Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<jsp:directive.include file="includes/localize.jsp"/>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
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
    <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>
<body>
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader" >

        </layout:component>
        <layout:component componentName="MainSection" >

        </layout:component>
        <layout:component componentName="ProductFooter" >

        </layout:component>
    </layout:main>

    <div class="ui tiny modal notify">
        <div class="header">
            <h4>
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Information")%>
            </h4>
        </div>
        <div class="content">
            <p><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                    "Account.confirmation.sent.to.your.email")%>
            </p>
        </div>
        <div class="actions">
            <button type="button" class="ui primary button cancel" data-dismiss="modal">
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Close")%>
            </button>
        </div>
    </div>

    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
    <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
    <jsp:include page="includes/footer.jsp"/>
    <% } %>

    <script type="application/javascript">
        $(document).ready(function () {
            $('.notify').modal({
                onHide: function () {
                    location.href = "<%=Encode.forJavaScript(IdentityManagementEndpointUtil.getUserPortalUrl(
                            application.getInitParameter(
                                IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL)))%>";
                },
                blurring: true,
                detachable: true,
                closable: false,
                centered: true,
            }).modal("show");

        });
    </script>
</body>
</html>
