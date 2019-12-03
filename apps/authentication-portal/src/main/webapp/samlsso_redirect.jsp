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

<%@include file="includes/localize.jsp" %>

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
            <div class="ui segment">
                <!-- product-title -->
                <%
                    File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                    if (productTitleFile.exists()) {
                %>
                    <jsp:include page="extensions/product-title.jsp"/>
                <% } else { %>
                    <jsp:directive.include file="includes/product-title.jsp"/>
                <% } %>

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
        document.forms[0].submit();
    </script>
</body>
</html>
