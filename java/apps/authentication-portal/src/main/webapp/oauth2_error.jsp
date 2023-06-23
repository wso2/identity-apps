<%--
  ~ Copyright (c) 2014-2023, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

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

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<!doctype html>
<html lang="en-US">
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
                <div class="ui visible negative message">
                    <%
                        String i18nErrorMapping = AuthenticationEndpointUtil.getErrorCodeToi18nMapping(
                            errorCode, errorMsgContext);
                        // Check the error is not null and whether there is a corresponding value in the resource bundle.
                        if (errorCode != null && errorMsg != null &&
                            !("incorrect.error.mapping").equals(i18nErrorMapping)) {
                    %>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, i18nErrorMapping)%>
                        <%=Encode.forHtml(errorMsgApp)%>
                    <% } else { %>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle,"oauth.processing.error.msg")%>
                    <% } %>
                </div>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
            File productFooterFile = new File("");
            String productFooterFilePath = null;
            
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productFooterFile = new File(getServletContext().getRealPath(customLayoutFileRelativeBasePath + "/product-footer.jsp"));
            }

            if (productFooterFile.exists()) {
                productFooterFilePath = customLayoutFileRelativeBasePath + "/product-footer.jsp";
            } else {
                productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                if (productFooterFile.exists()) {
                    productFooterFilePath = "extensions/product-footer.jsp";
                } else {
                    productFooterFilePath = "includes/product-footer.jsp";
                }
            }
            %>
            <jsp:include page="<%= productFooterFilePath %>" />
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


</body>
</html>
