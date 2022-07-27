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

<%@page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    String assertionConsumerURL = (String) request.getAttribute(Constants.SAML2SSO.ASSERTION_CONSUMER_URL);
    String samlResp = (String) request.getAttribute(Constants.SAML2SSO.SAML_RESP);
    String relayState = (String) request.getAttribute(Constants.SAML2SSO.RELAY_STATE);

    if (relayState != null) {
        relayState = URLDecoder.decode(relayState, "UTF-8");
        relayState = relayState.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;").
                replaceAll("<", "&lt;").replaceAll(">", "&gt;").replace("\n", "");
    }
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
                <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.are.redirected.back.to")%>
                    <%=Encode.forHtmlContent(assertionConsumerURL)%>.
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "if.the.redirection.fails.please.click")%>.</p>

                <form method="post" action="<%=assertionConsumerURL%>">
                    <div class="align-right buttons">
                        <input type="hidden" name="SAMLResponse" value="<%=Encode.forHtmlAttribute(samlResp)%>"/>
                        <input type="hidden" name="RelayState" value="<%=Encode.forHtmlAttribute(relayState)%>"/>
                        <button class="ui primary large button" type="submit"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "post")%></button>
                    </div>
                </form>
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

    <script type="text/javascript">
        document.forms[0].submit();
    </script>
</body>
</html>
