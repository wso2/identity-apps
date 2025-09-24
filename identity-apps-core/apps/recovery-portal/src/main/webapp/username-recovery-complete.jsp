<%--
  ~ Copyright (c) 2016-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.IdentityRecoveryException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URISyntaxException" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    // Add the user-recovery-success screen to the list to retrieve text branding customizations.
    screenNames.add("username-recovery-success");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String EMAIL = "EMAIL";
    String callback = request.getParameter("callback");
    String username = request.getParameter("username");
    String recoveryChannelType = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("recoveryChannelType"));

    String successMessageTitle;
    String successMessageDescrition;

    if (StringUtils.equals(recoveryChannelType, EMAIL)){
        successMessageTitle = "username.recovery.email.success.heading";
        successMessageDescrition = "username.recovery.email.success.body";
    } else {
        successMessageTitle = "username.recovery.sms.success.heading";
        successMessageDescrition = "username.recovery.sms.success.body";
    }

    boolean isValidCallBackURL = true;

    try {
        isValidCallBackURL = AuthenticationEndpointUtil.isSchemeSafeURL(callback);

        if (isValidCallBackURL && StringUtils.isNotBlank(callback)) {
            ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
            String applicationAccessUrl = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain, spAppName);

            if (StringUtils.isNotBlank(applicationAccessUrl)) {
                // If the application access URL is present, only then allow the callback to be that URL.
                isValidCallBackURL = StringUtils.equals(callback, applicationAccessUrl);
            } else {
                // If the application access URL is not present, callback should be a valid multi option URL.
                String encodedCallback = IdentityManagementEndpointUtil.getURLEncodedCallback(callback);
                isValidCallBackURL = AuthenticationEndpointUtil.isValidMultiOptionURI(encodedCallback);
            }
        }
    } catch (Exception e) {
        isValidCallBackURL = false;
    }
%>

<% request.setAttribute("pageName", "username-recovery-complete"); %>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isResponsePage", true);
    layoutData.put("isSuccessResponse", true);
%>

<!doctype html>
<html lang="en-US">
<head>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>
<body  class="login-portal layout" data-response-type="success" data-page="<%= request.getAttribute("pageName") %>">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader" >
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
        <layout:component componentName="MainSection" >
            <div class="ui green segment mt-3 attached">
                <h3 class="ui header text-center slogan-message mt-4 mb-6" data-testid="username-recovery-notify-page-header">
                    <%=i18n(recoveryResourceBundle, customText, successMessageTitle)%>
                </h3>
                <p class="portal-tagline-description">
                    <%=i18n(recoveryResourceBundle, customText, successMessageDescrition)%>
                    <br><br>
                    <%
                        if (StringUtils.isNotBlank(callback) && isValidCallBackURL) {
                    %>
                        <br/><br/>
                        <i class="caret left icon primary"></i>
                        <a href="<%= Encode.forHtml(callback)%>">
                            <%=i18n(recoveryResourceBundle, customText, "username.recovery.success.action")%>
                        </a>
                    <% } %>
                </p>
                <p class="ui portal-tagline-description" data-testid="username-recovery-support-message">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "for.further.assistance.write.to")%>
                    <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>"
                    data-testid="username-recovery-resend-support-email"
                    target="_blank">
                    <span class="orange-text-color button">
                        <%= StringEscapeUtils.escapeHtml4(supportEmail) %>
                    </span>
                    </a>
                </p>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter" >
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
