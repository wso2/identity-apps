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
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    String errorCode = StringUtils.EMPTY;
    if (request.getParameter("error") != null) {
        errorCode = request.getParameter("error");
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
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
<body class="login-portal layout authentication-portal-layout" onload="loadFunc()">
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
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "device.flow.sign.in")%>
                </h3>

                <div class="segment-form">
                    <% if (errorCode != "") { %>
                    <div class="ui visible negative message" lockedReasonid="error-msg" data-testid="login-page-error-message">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, errorCode)%>
                    </div>
                <% } %>
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
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>
                            </button>
                        </div>
                    </form>
                </div>
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
        var userCode;

        function loadFunc() {
            const urlParams = new URLSearchParams(window.location.search);

            userCode = urlParams.get('user_code');
            document.getElementById("user_code").value = userCode;
        }
    </script>
</body>
</html>
