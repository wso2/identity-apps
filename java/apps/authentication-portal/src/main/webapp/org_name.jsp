<%--
  ~ Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<%@ include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String idp = request.getParameter("idp");
    String authenticator = request.getParameter("authenticator");
    String sessionDataKey = request.getParameter(Constants.SESSION_DATA_KEY);

    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
    String authenticationFailed = "false";

    // Log the actual error for localized error fallbacks
    boolean isErrorFallbackLocale = !userLocale.toLanguageTag().equals("en_US");

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
            } else if (errorMessage.equalsIgnoreCase("Invalid Organization Name")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "invalid.organization.name");
            } else if (isErrorFallbackLocale) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
            }
        }
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<html lang="en-US">
    <head>
        <%-- header --%>
        <%
            File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
            if (headerFile.exists()) {
        %>
                <jsp:include page="extensions/header.jsp"/>
        <%
            } else {
        %>
                <jsp:include page="includes/header.jsp"/>
        <%
            }
        %>

        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
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
                    <%-- page content --%>
                    <h2><%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> <%= StringUtils.isNotBlank(idp) ? Encode.forHtmlContent(idp) : AuthenticationEndpointUtil.i18n(resourceBundle, "organization.login") %></h2>
                    <div class="ui divider hidden"></div>

                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                            <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%></div>
                            <div class="ui divider hidden"></div>
                    <%
                        }
                    %>

                    <div id="alertDiv"></div>


                    <form class="ui large form" id="pin_form" name="pin_form" action="<%=commonauthURL%>" method="GET">
                        <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "organization.name")%>:</p>
                        <input type="text" id='ORG_NAME' name="org" size='30'/>
                        <input id="idp" name="idp" type="hidden" value="<%=Encode.forHtmlAttribute(idp)%>"/>
                        <input id="authenticator" name="authenticator" type="hidden" value="<%=Encode.forHtmlAttribute(authenticator)%>"/>
                        <input id="sessionDataKey" name="sessionDataKey" type="hidden" value="<%=Encode.forHtmlAttribute(sessionDataKey)%>"/>
                        <div class="ui divider hidden"></div>
                        <div class="align-right buttons">
                            <button type="submit" class="ui primary large button">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "submit")%>
                            </button>
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
        <%
            } else {
        %>
                <jsp:include page="includes/footer.jsp"/>
        <%
            }
        %>
    </body>
</html>
