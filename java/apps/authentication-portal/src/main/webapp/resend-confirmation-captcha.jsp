<%--
  ~ Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

<%-- Localization --%>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String UTF_8 = "UTF-8";
    boolean reCaptchaResendEnabled = false;
    if (request.getParameter("reCaptchaResend") != null && Boolean.parseBoolean(request.getParameter("reCaptchaResend"))) {
        reCaptchaResendEnabled = true;
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
        <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
            String productTitleFilePath = "extensions/product-title.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productTitleFilePath = customLayoutFileRelativeBasePath + "/product-title.jsp";
            }
            if (!new File(getServletContext().getRealPath(productTitleFilePath)).exists()) {
                productTitleFilePath = "includes/product-title.jsp";
            }
            %>
            <jsp:include page="<%= productTitleFilePath %>" />
        </layout:component>
        <layout:component componentName="MainSection" >
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
        <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
            String productFooterFilePath = "extensions/product-footer.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productFooterFilePath = customLayoutFileRelativeBasePath + "/product-footer.jsp";
            }
            if (!new File(getServletContext().getRealPath(productFooterFilePath)).exists()) {
                productFooterFilePath = "includes/product-footer.jsp";
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

    <% String pleaseSelectRecaptchaText = AuthenticationEndpointUtil.i18n(resourceBundle, "please.select.recaptch"); %>

    <script>
        function goBack() {
            window.history.back();
        }

        $(document).ready(function () {
            <% if (reCaptchaResendEnabled) { %>
                var errorMessage = $("#error-msg");
                errorMessage.hide();

                $( "#recoverySubmit" ).click(function() {
                    var reCaptchaResponse = $("[name='g-recaptcha-response']")[0].value;

                    if (reCaptchaResponse.trim() == '') {
                        errorMessage.text("<%=pleaseSelectRecaptchaText%>");
                        errorMessage.show();
                        return false;
                    }
                });
                $("#resend-captcha-container").show();
            <% } else { %>
                $("#resendForm").submit();
            <% } %>
        });
    </script>

</body>
</html>
