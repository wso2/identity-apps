<%--
  ~ Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.apache.cxf.jaxrs.client.JAXRSClientFactory" %>
<%@ page import="org.apache.cxf.jaxrs.provider.json.JSONProvider" %>
<%@ page import="org.apache.cxf.jaxrs.client.WebClient" %>
<%@ page import="org.apache.http.HttpStatus" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="javax.ws.rs.core.Response" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL" %>
<%@ page import="org.apache.commons.codec.binary.Base64" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="java.nio.charset.Charset" %>
<%@ page import="org.wso2.carbon.identity.core.URLBuilderException" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS_MSG" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.CONFIGURATION_ERROR" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%-- Include registration portal URL resolver --%>
<jsp:directive.include file="util/dynamic-portal-url-resolver.jsp"/>

<%!
    private static final String JAVAX_SERVLET_FORWARD_REQUEST_URI = "javax.servlet.forward.request_uri";
    private static final String JAVAX_SERVLET_FORWARD_QUERY_STRING = "javax.servlet.forward.query_string";
    private static final String UTF_8 = "UTF-8";
    private static final String ACCOUNT_RECOVERY_ENDPOINT = "/accountrecoveryendpoint";
    private static final String ACCOUNT_RECOVERY_ENDPOINT_REGISTER = "/register.do";
%>

<%
    String attemptedUser = "";
    String attemptedUserEmail = "";
    String attemptedIdp = "";
    if (request.getParameter(Constants.ATTEMPTED_USER) != null) {
        attemptedUser = request.getParameter(Constants.ATTEMPTED_USER);
        attemptedUserEmail = request.getParameter(Constants.ATTEMPTED_USER_EMAIL);
        attemptedIdp = request.getParameter(Constants.ATTEMPTED_IDP);
    }
%>

<%
    String stat = request.getParameter("status");
    String statusMessage = request.getParameter("statusMsg");
    String sp = Encode.forJava(request.getParameter("sp"));
    String applicationAccessURLWithoutEncoding = null;
    if (stat == null || statusMessage == null) {
        stat = AuthenticationEndpointUtil.i18n(resourceBundle, "authentication.error");
        statusMessage =  AuthenticationEndpointUtil.i18n(resourceBundle,
                "something.went.wrong.during.authentication");
    } else {
        stat = AuthenticationEndpointUtil.customi18n(resourceBundle, stat);
        statusMessage = AuthenticationEndpointUtil.customi18n(resourceBundle, statusMessage);
    }
    session.invalidate();

    try {
        ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
        applicationAccessURLWithoutEncoding = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain,
                sp);
        applicationAccessURLWithoutEncoding = IdentityManagementEndpointUtil.replaceUserTenantHintPlaceholder(
                                                                applicationAccessURLWithoutEncoding, userTenantDomain);
    } catch (ApplicationDataRetrievalClientException e) {
        // Ignored and fallback to login page url.
    }
%>

<%
    String identityMgtEndpointContext = "";
    String accountRegistrationEndpointURL = "";
    String urlEncodedURL = "";
    String urlParameters = "";
    String scheme = request.getScheme();
    String serverName = request.getServerName();
    int serverPort = request.getServerPort();
    String uri = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_REQUEST_URI);
    String prmstr = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING);
    String urlWithoutEncoding = scheme + "://" +serverName + ":" + serverPort + uri + "?" + prmstr;

    urlEncodedURL = URLEncoder.encode(urlWithoutEncoding, UTF_8);
    urlParameters = prmstr;

    identityMgtEndpointContext = application.getInitParameter("IdentityManagementEndpointContextURL");
    if (StringUtils.isBlank(identityMgtEndpointContext)) {
        try {
            identityMgtEndpointContext = ServiceURLBuilder.create().addPath(ACCOUNT_RECOVERY_ENDPOINT).build()
                    .getAbsolutePublicURL();
        } catch (URLBuilderException e) {
            request.setAttribute(STATUS, AuthenticationEndpointUtil.i18n(resourceBundle, CONFIGURATION_ERROR));
            request.setAttribute(STATUS_MSG, AuthenticationEndpointUtil
                    .i18n(resourceBundle, ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL));
            request.getRequestDispatcher("error.do").forward(request, response);
            return;
        }
    }

    if (isDynamicPortalEnabled) {
        accountRegistrationEndpointURL = identityMgtEndpointContext + ACCOUNT_RECOVERY_ENDPOINT_REGISTER;
    } else {
        accountRegistrationEndpointURL = application.getInitParameter("AccountRegisterEndpointURL");
        if (StringUtils.isBlank(accountRegistrationEndpointURL)) {
            accountRegistrationEndpointURL = identityMgtEndpointContext + ACCOUNT_RECOVERY_ENDPOINT_REGISTER;
        }
    }
%>

<% request.setAttribute("pageName", "user-not-found"); %>

<!DOCTYPE html>

<html>

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
    </head>

    <body class="login-portal layout recovery-layout" data-page="<%= request.getAttribute("pageName") %>">
        <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
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
                    <div class="account-not-found-message">
                        <% if (attemptedUser == null || attemptedUser == "") {
                        %>
                            <h3 class="ui header">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "account.not.found")%>
                            </h3>
                            <p style="text-align:left;"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "we.did.not.receive.your.email.address")%>
                             <%=AuthenticationEndpointUtil.i18n(resourceBundle, "please.use.a.social.account.with.email.available.to.sign.in")%>
                            </p>
                            <div class="ui divider hidden"></div>
                        <% } else { %>
                            <h3 class="ui header"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "account.not.found")%></h3>
                            <p style="text-align:left;"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "we.cannot.find.an.account.associated.with")%>
                            <b><%= Encode.forHtml(attemptedUser) %></b>.
                            </p>
                            <div class="ui divider hidden"></div>
                        <% }
                        %>

                        <button
                            id="btn-submit"
                            class="ui primary fluid large button"
                            type="button"
                            value="submit"
                            onclick="window.location.href='<%=getRegistrationPortalUrl(accountRegistrationEndpointURL, urlEncodedURL, urlParameters)%>';"
                        >
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "go.to.sign.up")%>
                        </button>
                        </br>

                        <a
                            class="clickable-link"
                            href="<%= IdentityManagementEndpointUtil.getURLEncodedCallback(applicationAccessURLWithoutEncoding) %>">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "back.to.sign.in")%>
                        </a>
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
    </body>
</html>
