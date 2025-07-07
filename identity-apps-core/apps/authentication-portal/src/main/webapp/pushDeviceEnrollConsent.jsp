<%--
  ~ Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.local.auth.push.authenticator.util.AuthenticatorUtils" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

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
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = Encode.forHtmlAttribute(request.getParameter(Constants.AUTH_FAILURE_MSG));

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
            }
        }
    }
%>

<% request.setAttribute("pageName", "push-device-enroll-consent"); %>

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

        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="login-portal layout authentication-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
        <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
            <jsp:include page="extensions/timeout.jsp"/>
        <% } else { %>
            <jsp:include page="util/timeout.jsp"/>
        <% } %>

        <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>">
            <layout:component componentName="ProductHeader">
                <%-- product-title --%>
                <%
                    File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                    if (productTitleFile.exists()) {
                %>
                <jsp:include page="extensions/product-title.jsp"/>
                <% } else { %>
                <jsp:include page="includes/product-title.jsp"/>
                <% } %>
            </layout:component>

            <layout:component componentName="MainSection">
                <div class="ui segment">
                    <%-- page content --%>
                    <h2>
                       <%= i18n(resourceBundle, customText, "push.device.not.registered") %>
                    </h2>
                    <div class="ui divider hidden"></div>
                    <div class="segment-form">
                        <form class="ui large form" id="form" name="form" action="<%=commonauthURL%>" method="POST">
                            <div class="field">
                                <p class="text-center">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "push.device.not.found.description")%>
                                </p>
                            </div>

                            <div class="ui divider hidden"></div>

                            <input type="hidden" name="sessionDataKey"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                            <input id="multiOptionURI" type="hidden" name="multiOptionURI"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("multiOptionURI"))%>' />
                            <input type='hidden' name='scenario' id='scenario' value=''/>

                            <div class="buttons">
                                <button type="button"
                                        class="ui primary fluid large button"
                                        id="register">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "push.register.button")%>
                                </button>
                                <button type="button"
                                        class="ui fluid large button secondary mt-2"
                                        id="cancel">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "push.register.cancel")%>
                                </button>
                                <%
                                    String multiOptionURI = request.getParameter("multiOptionURI");
                                    if (isMultiAuthAvailable(multiOptionURI) && AuthenticationEndpointUtil.isSchemeSafeURL(multiOptionURI)) {
                                %>
                                    <div class="ui divider hidden"></div>
                                    <a
                                        class="ui fluid primary basic button link-button"
                                        id="goBackLink"
                                        href='<%=Encode.forHtmlAttribute(multiOptionURI)%>'
                                    >
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "choose.other.option")%>
                                    </a>
                                <% } %>
                            </div>
                        </form>

                    </div>
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
        <% } else { %>
        <jsp:include page="includes/footer.jsp"/>
        <% } %>

        <script type="text/javascript">
            $(document).ready(function () {
                $('#register').click(function () {
                    document.getElementById("scenario").value = "INIT_PUSH_ENROLL";
                    $('#form').submit();
                });
            });

            $(document).ready(function () {
                $('#cancel').click(function () {
                    document.getElementById("scenario").value = "CANCEL_PUSH_ENROLL";
                    $('#form').submit();
                });
            });
        </script>
    </body>
</html>
