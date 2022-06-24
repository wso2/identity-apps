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

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>

<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%! private static final String INVALID_MESSAGE_MESSAGE =
        "The message was not recognized by the SAML 2.0 SSO Provider. Please check the logs for more details";
    private static final String EXCEPTION_MESSAGE = "Please try login again.";
    private static final String INVALID_MESSAGE_STATUS = "Not a valid SAML 2.0 Request Message!";
    private static final String EXCEPTION_STATUS = "Error when processing the authentication request!";
%>
<%
    String stat = request.getParameter(Constants.STATUS);
    String statusMessage = request.getParameter(Constants.STATUS_MSG);

    String errorStat = stat;
    String errorMsg = statusMessage;

    boolean unrecognizedStatus = true;
    if (EXCEPTION_STATUS.equals(stat) || INVALID_MESSAGE_STATUS.equals(stat)) {
        errorStat = "error.when.processing.authentication.request";
        unrecognizedStatus = false;
    }

    boolean unrecognizedStatusMsg = true;
    if (EXCEPTION_MESSAGE.equals(statusMessage) || INVALID_MESSAGE_MESSAGE.equals(statusMessage)) {
        errorMsg = "please.try.login.again";
        unrecognizedStatusMsg = false;
    }

    if (stat == null || statusMessage == null || unrecognizedStatus || unrecognizedStatusMsg) {
        errorStat = "authentication.error";
        errorMsg = "something.went.wrong.during.authentication";
    }
    session.invalidate();
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "large");
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
        <layout:component componentName="ProductHeader" >
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
        <layout:component componentName="MainSection" >
            <div class="ui segment">
                <h2><%=AuthenticationEndpointUtil.i18n(resourceBundle, "saml.sso")%></h2>
                <h4><%=AuthenticationEndpointUtil.i18n(resourceBundle, errorStat)%></h4>
                <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, errorMsg)%></p>
                <div class="ui divider hidden"></div>
                <%-- <jsp:include page="includes/error-tracking-reference.jsp">
                    <jsp:param name="align" value="centered"/>
                </jsp:include> --%>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter" >
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
</body>
</html>
