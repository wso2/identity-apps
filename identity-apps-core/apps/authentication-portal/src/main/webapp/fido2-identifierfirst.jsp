<%--
  ~ Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isEmailUsernameEnabled" %>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%
    String emailUsernameEnable = application.getInitParameter("EnableEmailUserName");
    Boolean isEmailUsernameEnabled;
    String usernameLabel = "username";

    if (StringUtils.isNotBlank(emailUsernameEnable)) {
        isEmailUsernameEnabled = Boolean.valueOf(emailUsernameEnable);
    } else {
        isEmailUsernameEnabled = isEmailUsernameEnabled();
    }

    if (isEmailUsernameEnabled == true) {
        usernameLabel = "email.username";
    }
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp" />

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

    <%-- analytics --%>
    <%
        File analyticsFile = new File(getServletContext().getRealPath("extensions/analytics.jsp"));
        if (analyticsFile.exists()) {
    %>
        <jsp:include page="extensions/analytics.jsp"/>
    <% } else { %>
        <jsp:include page="includes/analytics.jsp"/>
    <% } %>
</head>
<body class="login-portal layout authentication-portal-layout">
    <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
        <jsp:include page="extensions/timeout.jsp"/>
    <% } else { %>
        <jsp:include page="util/timeout.jsp"/>
    <% } %>

    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
                <%
                    if (StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT)) {
                %>
                    <div class="product-title">
                        <jsp:include page="extensions/product-title.jsp"/>
                    </div>
                <% } else { %>
                    <jsp:include page="extensions/product-title.jsp"/>
                <% } %>
            <% } else { %>
                <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="MainSection">
            <div class="ui segment">
                <h3 class="ui header ellipsis">
                    <span id="fido-identifier-header">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.title.login" )%>
                    </span>
                </h3>

                <form class="ui large form" action="<%=commonauthURL%>" method="post" id="identifierForm" >

                    <div class="ui visible negative message" style="display: none;" id="error-msg"></div>

                    <div class="field">
                        <div class="ui fluid left icon input">
                            <input
                                type="text"
                                id="username"
                                value=""
                                name="username"
                                maxlength="50"
                                tabindex="0"
                                placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, usernameLabel)%>"
                                required />
                            <i aria-hidden="true" class="user icon"></i>
                        </div>
                    </div>
                    <div class="mt-0">
                        <div class="column buttons">
                            <button
                                class="ui primary fluid large button"
                                type="submit"
                            >
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.continue")%>
                            </button>
                        </div>
                        <div class="ui divider hidden"></div>
                        <div class="column buttons">
                            <button
                                onclick="initiatePasskeyCreationFlow()"
                                class="ui secondary fluid large button"
                                id="registerLink"
                                role="button"
                            >
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.register" )%>
                            </button>
                        </div>
                    </div>
                    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute
                        (request.getParameter("sessionDataKey"))%>'/>
                    <input type="hidden" name="scenario" id="scenario" value="IDF_INIT_FIDO_AUTH"/>
                </form>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter">
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

    <script>
        function initiatePasskeyCreationFlow(){
            var form = document.getElementById('identifierForm');
            var scenario = document.getElementById('scenario');
            scenario.value = "IDF_INIT_FIDO_ENROL";
            form.submit();
        }
    </script>
</body>
</html>

