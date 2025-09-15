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
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.client.model.AuthenticationRequestWrapper" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%
    String isKeyExist = request.getParameter("keyExist");

    Map data = ((AuthenticationRequestWrapper) request).getAuthParams();
    boolean enablePasskeyProgressiveEnrollment = (boolean) data.get("FIDO.EnablePasskeyProgressiveEnrollment");
%>

<%!
    private static final String MY_ACCOUNT = "/myaccount";
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp" />

<% request.setAttribute("pageName", "fido2-passkey-status"); %>

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
            <div class="ui segment">

                <h3 class="ui header">
                    <%
                    if ("true".equals(isKeyExist)) {
                    %>
                        <span id="fido-key-exist-header">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.title.passkey.exist")%>
                        </span>

                    <% } else { %>
                        <span id="fido-reg-consent-header">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.title.passkey.not.found")%>
                        </span>
                    <% } %>
                </h3>
                <div class="ui two column left aligned stackable grid">
                    <%
                    if ("true".equals(isKeyExist)) {
                    %>
                        <div id="fido-key-exist-content" class="middle aligned row">
                            <div class="sixteen wide column">
                                <p>
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.info.passkey.exist")%>
                                </p>
                                <div class="mt-4">
                                    <div class="buttons">
                                        <button class="ui primary fluid large button" type="button" onclick="authenticationFlow()">
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.login")%>
                                        </button>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <div class="buttons">
                                        <button class="ui secondary fluid large button" type="button" onclick="cancelFlow()">
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.cancel")%>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <% } else {%>
                        <div id="fido-reg-consent-content" class="middle aligned row">
                            <div class="sixteen wide column">
                                <p>
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.info.passkey.not.found")%>
                                    <% if(!enablePasskeyProgressiveEnrollment){ %>
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.registration.option.info")%>
                                        <a target="_blank" id="my-account-link">My Account.</a>
                                    <% } %>
                                </p>
                                <% if(enablePasskeyProgressiveEnrollment){ %>
                                    <div class="mt-4">
                                        <div class="buttons">
                                            <button class="ui primary fluid large button" type="button" onclick="passkeyEnrollmentFlow()"
                                                data-testid="login-page-fido-register-button">
                                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.register")%>
                                            </button>
                                        </div>
                                    </div>
                                <% } %>
                                <div class="mt-3">
                                    <div class="column buttons">
                                        <button class="ui secondary fluid large button" type="button" onclick="cancelFlow()">
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.cancel")%>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <% } %>
                </div>

                <form method="POST" action="<%=commonauthURL%>" id="form" onsubmit="return false;">
                    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                    <input type="hidden" name="scenario" id="scenario" value="tmp val"/>
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

    <script type="text/javascript" src="js/u2f-api.js"></script>
    <script type="text/javascript" src="libs/base64js/base64js-1.3.0.min.js"></script>
    <script type="text/javascript" src="libs/base64url.js"></script>

    <%
        String myaccountUrl = application.getInitParameter("MyAccountURL");
        if (StringUtils.isEmpty(myaccountUrl)) {
            myaccountUrl = ServiceURLBuilder.create().addPath(MY_ACCOUNT).build().getAbsolutePublicURL();
        }
    %>

    <script type="text/javascript">
        $(document).ready(function () {

            $("#my-account-link").attr("href", '<%=myaccountUrl%>');
        });
    </script>

    <script type="text/javascript">
        function cancelFlow(){
            var form = document.getElementById('form');
            var scenario = document.getElementById('scenario');
            scenario.value = "CANCEL_FIDO_AUTH";
            form.submit();
        }

        function passkeyEnrollmentFlow(){
            var form = document.getElementById('form');
            var scenario = document.getElementById('scenario');
            scenario.value = "INIT_FIDO_ENROLL" ;
            form.submit();
        }

        function authenticationFlow(){
            var form = document.getElementById('form');
            var scenario = document.getElementById('scenario');
            scenario.value = "INIT_FIDO_AUTH" ;
            form.submit();
        }
    </script>
</body>
</html>
