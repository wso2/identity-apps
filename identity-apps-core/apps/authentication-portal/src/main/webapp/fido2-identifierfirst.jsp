<%--
  ~ Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="com.google.gson.Gson" %>
<%@ page import="java.io.File" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.client.model.AuthenticationRequestWrapper" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%!
    private boolean isMultiAuthAvailable(String multiOptionURI) {

        boolean isMultiAuthAvailable = true;
        if (multiOptionURI == null || multiOptionURI.equals("null")) {
            isMultiAuthAvailable = false;
        } else {
            int authenticatorIndex = multiOptionURI.indexOf("authenticators=");
            if (authenticatorIndex == -1) {
                isMultiAuthAvailable = false;
            } else {
                String authenticators = multiOptionURI.substring(authenticatorIndex + 15);
                int authLastIndex = authenticators.indexOf("&") != -1 ? authenticators.indexOf("&") : authenticators.length();
                authenticators = authenticators.substring(0, authLastIndex);
                List<String> authList = Arrays.asList(authenticators.split("%3B"));
                if (authList.size() < 2) {
                    isMultiAuthAvailable = false;
                } else if (authList.size() == 2 && authList.contains("backup-code-authenticator%3ALOCAL")) {
                    isMultiAuthAvailable = false;
                }
            }
        }
        return isMultiAuthAvailable;
    }
%>

<%
    Map data = ((AuthenticationRequestWrapper) request).getAuthParams();
    boolean enablePasskeyProgressiveEnrollment = (boolean) data.get("FIDO.EnablePasskeyProgressiveEnrollment");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp" />

<% request.setAttribute("pageName", "fido2-identifierfirst"); %>

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
<body class="login-portal layout authentication-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
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
            <div class="ui segment left aligned">
                <h3 class="ui header ellipsis">
                    <span id="fido-identifier-header">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.title.login")%>
                    </span>
                </h3>
                <form class="ui large form" action="<%=commonauthURL%>" method="post" id="identifierForm">
                    <div class="field">
                        <div class="ui fluid left icon input">
                            <input
                                type="text"
                                id="username"
                                value=""
                                name="username"
                                maxlength="50"
                                tabindex="0"
                                placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "username")%>"
                                required />
                            <i aria-hidden="true" class="user icon"></i>
                        </div>
                        <div class="mt-1 left aligned" id="usernameError" style="display: none;">
                            <i class="red exclamation circle fitted icon"></i>
                            <span class="validation-error-message" id="usernameErrorText">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "username.cannot.be.empty")%>
                            </span>
                        </div>
                        <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute
                            (request.getParameter("sessionDataKey"))%>'/>
                        <input type="hidden" name="scenario" id="scenario" value="INIT_FIDO_AUTH"/>
                        <input type="hidden" name="authType" id="authType" value="idf">
                    </div>
                    <div class="mt-4">
                        <div class="buttons">
                            <button
                                class="ui primary fluid large button"
                                type="button"
                                onclick="validateForm() && identifierForm.submit()"
                            >
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.continue")%>
                            </button>
                        </div>
                        <% if(enablePasskeyProgressiveEnrollment){ %>
                            <div class="ui horizontal divider">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "or")%>
                            </div>
                            <div class="buttons">
                                <button
                                    class="ui secondary fluid large button"
                                    type="button"
                                    onclick="validateForm() && initiatePasskeyCreationFlow()"
                                >
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.register")%>
                                </button>
                            </div>
                        <% } %>
                        <div class="ui divider hidden"></div>
                        <div class="text-center mt-1">
                            <%
                                String multiOptionURI = request.getParameter("multiOptionURI");
                                if (multiOptionURI != null && AuthenticationEndpointUtil.isValidMultiOptionURI(multiOptionURI) &&
                                    isMultiAuthAvailable(multiOptionURI)) {
                            %>
                                <a
                                    class="ui primary basic button link-button"
                                    id="goBackLink"
                                    href='<%=Encode.forHtmlAttribute(multiOptionURI)%>'
                                >
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "choose.other.option")%>
                                </a>
                            <%
                                }
                            %>
                        </div>
                        <input type="hidden" name="multiOptionURI" value='<%=Encode.forHtmlAttribute(multiOptionURI)%>'/>
                    </div>
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
        function validateForm() {
            var username = document.getElementById('username').value;
            var usernameError = document.getElementById('usernameError');

            if(username.trim() === "") {
                usernameError.style.display = "block";
                return false;
            } else {
                usernameError.style.display = "none";
                return true;
            }
        }
        function initiatePasskeyCreationFlow(){
            var form = document.getElementById('identifierForm');
            var scenario = document.getElementById('scenario');
            scenario.value = "INIT_FIDO_ENROLL";
            form.submit();
        }
    </script>
</body>
</html>
