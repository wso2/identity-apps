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

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="ui" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
    
<%@ include file="localize.jsp" %>
<jsp:directive.include file="init-url.jsp"/>

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
    
<c:set var="bodyContent">
    <!-- product-title -->
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
        if (headerFile.exists()) {
    %>
            <jsp:include page="extensions/product-title.jsp"/>
    <% } else { %>
            <jsp:directive.include file="includes/product-title.jsp"/>
    <% } %>

    <div class="ui visible negative message">
        <%
            if (errorCode != null && errorMsg != null) {
        %>
            <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, errorMsgContext)%><%=Encode.forHtml(errorMsgApp)%>
        <% } else { %>
            <%=AuthenticationEndpointUtil.i18n(resourceBundle,"oauth.processing.error.msg")%></td>
        <% } %>
    </div>
    <form  action="<%=commonauthURL%>" method="post" id="oauth2_authz" name="oauth2_authz"></form>
</c:set>
<c:set var="footer">
    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
            <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
            <jsp:directive.include file="includes/footer.jsp"/>
    <% } %>
</c:set>

<c:set var="body">
    <ui:loginWrapper>
        <jsp:attribute name="footerContent">${footer}</jsp:attribute>
        <jsp:body>${bodyContent}</jsp:body>
    </ui:loginWrapper>
</c:set>

<ui:base pageTitle='<%=AuthenticationEndpointUtil.i18n(resourceBundle, "wso2.identity.server")%>'>
    <jsp:body>${body}</jsp:body>
</ui:base>
