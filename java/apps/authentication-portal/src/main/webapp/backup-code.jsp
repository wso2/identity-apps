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
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.framework.util.FrameworkConstants" %>
<%@ page import="org.wso2.carbon.identity.application.authenticator.backupcode.constants.BackupCodeAuthenticatorConstants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityCoreConstants" %>
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

<% request.getSession().invalidate(); String queryString=request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }
    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";
        boolean isErrorMessageFromErrorCodeAdded = false;
        String errorCode = request.getParameter(FrameworkConstants.ERROR_CODE);
        if (errorCode != null) {
            if (errorCode.equals(IdentityCoreConstants.USER_ACCOUNT_LOCKED_ERROR_CODE)) {
                String lockedReason = request.getParameter(FrameworkConstants.LOCK_REASON);
                if (lockedReason != null) {
                    if (lockedReason.equals(BackupCodeAuthenticatorConstants.MAX_ATTEMPTS_EXCEEDED)) {
                        errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked.incorrect.login.attempts");
                        isErrorMessageFromErrorCodeAdded = true;
                    } else if (lockedReason.equals(BackupCodeAuthenticatorConstants.ADMIN_INITIATED)) {
                        errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked.admin.initiated");
                        isErrorMessageFromErrorCodeAdded = true;
                    }
                }
            }
        }
        if (!isErrorMessageFromErrorCodeAdded && request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = Encode.forHtmlAttribute(request.getParameter(Constants.AUTH_FAILURE_MSG));
            if (errorMessage.equalsIgnoreCase("authentication.fail.message") || errorMessage.equalsIgnoreCase("login.fail.message")) {
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
        <% File headerFile=new File(getServletContext().getRealPath("extensions/header.jsp"));
            if (headerFile.exists()) {
        %>
        <jsp:include page="extensions/header.jsp" />
        <% } else { %>
        <jsp:include page="includes/header.jsp" />
        <% } %>

        <script src="js/scripts.js"></script>
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->

        <script>
            // Handle form submission preventing double submission.
            $(document).ready(function () {
                $.fn.preventDoubleSubmission = function () {
                    $(this).on('submit', function (e) {
                        var $form = $(this);
                        if ($form.data('submitted') === true) {
                            // Previously submitted - don't submit again.
                            e.preventDefault();
                            console.warn("Prevented a possible double submit event");
                        } else {
                            // Mark it so that the next submit can be ignored.
                            $form.data('submitted', true);
                        }
                    });

                    return this;
                };
                $('#backupCodeForm').preventDoubleSubmission();
            });
        </script>

    </head>
    <body class="login-portal layout backup-code-portal-layout">
        <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
            <jsp:include page="extensions/timeout.jsp" />
        <% } else { %>
            <jsp:include page="util/timeout.jsp" />
        <% } %>

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
                    <h2><%=AuthenticationEndpointUtil.i18n(resourceBundle, "auth.backup.code")%></h2>
                    <div class="uii divider hidden"></div>
                    <% if ("true".equals(authenticationFailed)) { %>
                        <div class="ui negative message" id="failed-msg"><%=errorMessage%></div>
                        <div class="ui divider hidden"></div>
                    <% } %>

                    <input id="username" type="hidden" value='<%=Encode.forHtmlAttribute(request.getParameter("username"))%>'>
                    <div class="segment-form">
                        <form action="<%=commonauthURL%>" method="post" id="backupCodeForm" class="ui large form">
                            <p id="instruction"></p>
                            <div class="field">
                                <input type="text" name="BackupCode" class="form-control" placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "verification.code")%>">
                            </div>
                            <input id="sessionDataKey" type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>' />
                            <div class="ui divider hidden"></div>
                            <div class="ui two column stackable grid">
                                <div class="six wide column mobile center aligned tablet right aligned computer right aligned buttons tablet no-margin-right-last-child computer no-margin-right-last-child">
                                    <input type="submit" value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "authenticate")%>" class="ui primary button">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="ui divider hidden"></div>
                    <%
                        String multiOptionURI=request.getParameter("multiOptionURI");
                        if (multiOptionURI != null && AuthenticationEndpointUtil.isValidURL(multiOptionURI)) { %>
                            <a class="ui button secondary" id="goBackLink" href='<%=Encode.forHtmlAttribute(multiOptionURI)%>'>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "choose.other.option")%>
                            </a>
                    <%  } %>
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
        <jsp:include page="extensions/footer.jsp" />
        <% } else { %>
        <jsp:include page="includes/footer.jsp" />
        <% } %>
    </body>
</html>
