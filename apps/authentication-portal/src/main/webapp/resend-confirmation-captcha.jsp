<%--
  ~ Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<!-- Branding Preferences -->
<jsp:directive.include file="extensions/branding-preferences.jsp"/>

<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%
    String UTF_8 = "UTF-8";
    boolean reCaptchaResendEnabled = false;
    if (request.getParameter("reCaptchaResend") != null && Boolean.parseBoolean(request.getParameter("reCaptchaResend"))) {
        reCaptchaResendEnabled = true;
    }
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

    <%
        if (reCaptchaResendEnabled) {
            String reCaptchaAPI = CaptchaUtil.reCaptchaAPIURL();
    %>
        <script src='<%=(Encode.forJavaScriptSource(reCaptchaAPI))%>'></script>
    <%
        }
    %>

</head>
<body class="login-portal layout authentication-portal-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component name="ProductHeader" >
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
        <layout:component name="MainSection" >
            <div class="ui segment">

                <h3 class="ui header">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "resend.confirmation.page.title")%>
                </h3>

                <form action="login.do?resend_username=<%=Encode.forHtml(URLEncoder.encode(request.getParameter("failedUsername"), UTF_8))%>&<%=AuthenticationEndpointUtil.cleanErrorMessages(Encode.forJava(request.getQueryString()))%>" method="post" id="resendForm">

                    <div><%=AuthenticationEndpointUtil.i18n(resourceBundle, "resend.confirmation.page.message")%></div>

                    <div class="ui divider hidden"></div>

                    <div class="resend-captcha-container ui hidden" id="resend-captcha-container">
                        <%
                             String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
                        %>
                        <div class="field">
                            <div class="text-center>">
                                <div class="g-recaptcha inline"
                                    data-sitekey="<%=Encode.forHtmlContent(reCaptchaKey)%>"
                                    data-testid="login-page-g-recaptcha-resend"
                                >
                                </div>
                            </div>

                            <div class="ui divider hidden"></div>

                            <div class="align-right buttons text-right">
                                <a href="javascript:goBack()" class="ui button secondary">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "Cancel")%>
                                </a>
                                <button id="recoverySubmit"
                                        class="ui primary button"
                                        type="submit">
                                    <%=StringEscapeUtils.escapeHtml4(AuthenticationEndpointUtil.i18n(resourceBundle, "submit"))%>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </layout:component>
        <layout:component name="ProductFooter" >
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

    <script>
        function goBack() {
            window.history.back();
        }

        $(document).ready(function () {
            <% if (reCaptchaResendEnabled) { %>
                $("#resend-captcha-container").show();
            <% } else { %>
                $("#resendForm").submit();
            <% } %>
        });
    </script>

</body>
</html>
