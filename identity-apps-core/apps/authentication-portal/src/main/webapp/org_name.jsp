<%--
  ~ Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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
<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String idp = request.getParameter("idp");
    String authenticator = request.getParameter("authenticator");
    String sessionDataKey = request.getParameter(Constants.SESSION_DATA_KEY);

    String errorMessage = i18n(resourceBundle, customText, "error.retry");
    String authenticationFailed = "false";

    // Log the actual error for localized error fallbacks
    boolean isErrorFallbackLocale = !userLocale.toLanguageTag().equals("en_US");

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = i18n(resourceBundle, customText, "error.retry");
            } else if (errorMessage.equalsIgnoreCase("invalid.organization.name")) {
                errorMessage = i18n(resourceBundle, customText, "invalid.organization.name");
            } else if (isErrorFallbackLocale) {
                errorMessage = i18n(resourceBundle, customText,"error.retry");
            }
        }
    }
    boolean isOrgDiscoveryEnabled = Boolean.parseBoolean(request.getParameter("orgDiscoveryEnabled"));
%>

<% request.setAttribute("pageName", "org-name"); %>

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

    <body class="login-portal layout authentication-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
        <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
            <layout:component componentName="ProductHeader">
                <%-- product-title --%>
                <%
                    File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                    if (productTitleFile.exists()) {
                %>
                        <jsp:include page="extensions/product-title.jsp"/>
                <%
                    } else {
                %>
                        <jsp:include page="includes/product-title.jsp"/>
                <%
                    }
                %>
            </layout:component>
            <layout:component componentName="MainSection">
                <div class="ui segment">
                    <%-- page content --%>
                    <h2><%= i18n(resourceBundle, customText, "sign.in.with") %> <%= StringUtils.isNotBlank(idp) ? Encode.forHtmlContent(idp) : i18n(resourceBundle, customText, "organization.login") %></h2>
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
                        <div class="field m-0 text-left required">
                            <label><%= i18n(resourceBundle, customText, "organization.name") %></label>
                        </div>
                        <input type="text" id='ORG_NAME' name="org" size='30'/>
                        <div class="mt-1" id="emptyOrganizationNameError" style="display: none;">
                            <i class="red exclamation circle fitted icon"></i>
                            <span class="validation-error-message" id="emptyOrganizationNameErrorText">
                                <%= i18n(resourceBundle, customText, "organization.name.cannot.be.empty") %>
                            </span>
                        </div>
                        <input id="prompt" name="prompt" type="hidden" value="orgDiscovery">
                        <input id="idp" name="idp" type="hidden" value="<%=Encode.forHtmlAttribute(idp)%>"/>
                        <input id="authenticator" name="authenticator" type="hidden" value="<%=Encode.forHtmlAttribute(authenticator)%>"/>
                        <input id="sessionDataKey" name="sessionDataKey" type="hidden" value="<%=Encode.forHtmlAttribute(sessionDataKey)%>"/>
                        <div class="ui divider hidden"></div>
                        <input type="submit" id="submitButton" onclick="submitOrgName(); return false;"
                            value="<%= i18n(resourceBundle, customText, "submit") %>"
                            class="ui primary large fluid button" />
                        <div class="mt-1 align-center">
                            <a href="javascript:goBack()" class="ui button secondary large fluid">
                                <%= i18n(resourceBundle, customText, "cancel") %>
                            </a>
                        </div>
                        <% if (isOrgDiscoveryEnabled) { %>
                            <div class="ui horizontal divider"><%= i18n(resourceBundle, customText, "or")%></div>
                            <div class="social-login blurring social-dimmer">
                                <input type="submit" id="discoveryButton" onclick="promptDiscovery();" class="ui primary basic button link-button"
                                    value="<%= i18n(resourceBundle, customText, "provide.email.address")%>">
                            </div>
                        <% } %>
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
                <%
                    } else {
                %>
                        <jsp:include page="includes/product-footer.jsp"/>
                <%
                    }
                %>
            </layout:component>
            <layout:dynamicComponent filePathStoringVariableName="pathOfDynamicComponent">
                <jsp:include page="${pathOfDynamicComponent}" />
            </layout:dynamicComponent>
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
        <script type="text/javascript">

            function goBack() {
                window.history.back();
            }

            function promptDiscovery() {
                document.getElementById("ORG_NAME").disabled = true;
                document.getElementById("pin_form").submit();
            }

            function submitOrgName() {
                // Show error message when organization name is empty.
                if (document.getElementById("ORG_NAME").value.length <= 0) {
                    showEmptyOrganizationNameErrorMessage();
                    return;
                }

                document.getElementById("prompt").remove();
                document.getElementById("pin_form").submit();
            }

            // Function to show error message when organization name is empty.
            function showEmptyOrganizationNameErrorMessage() {
                var emptyOrganizationNameError = $("#emptyOrganizationNameError");
                emptyOrganizationNameError.show();
            }
        </script>
    </body>
</html>
