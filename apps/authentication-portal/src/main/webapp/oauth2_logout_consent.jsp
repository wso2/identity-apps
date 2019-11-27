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

<%@ page import="java.io.File" %>

<%@ taglib prefix="ui" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
    
<%@ include file="localize.jsp" %>
<jsp:directive.include file="init-url.jsp"/>

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

    <h3 class="ui header"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "do.you.want.to.logout")%></h3>
    <form action="<%=oidcLogoutURL%>" method="post" id="oidc_logout_consent_form"
        name="oidc_logout_consent_form">

        <div class="field">
            <button
                type="submit"
                onclick="javascript: approved(); return false;"   
                class="ui primary large button"
                role="button"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "yes")%></button>
            <button
                type="submit"
                onclick="javascript: deny(); return false;"   
                class="ui large button"
                role="button"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "no")%></button>
        </div>
        <input type="hidden" name="consent" id="consent" value="deny"/>
    </form>
</c:set>
<c:set var="bottom">
    <script type="text/javascript">
        function approved() {
            document.getElementById('consent').value = "approve";
            document.getElementById("oidc_logout_consent_form").submit();
        }

        function deny() {
            document.getElementById('consent').value = "deny";
            document.getElementById("oidc_logout_consent_form").submit();
        }
    </script>
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
    <jsp:attribute name="bottomIncludes">${bottom}</jsp:attribute>
    <jsp:body>${body}</jsp:body>
</ui:base>
