<%--
  ~ Copyright (c) 2016-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

<%@ page import="org.apache.commons.collections.map.HashedMap" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.NotificationApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Property" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.RecoveryInitiatingRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URISyntaxException" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String username = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("username"));
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));
    User user = IdentityManagementServiceUtil.getInstance().resolveUser(username, tenantDomain, isSaaSApp);

    NotificationApi notificationApi = new NotificationApi();

    RecoveryInitiatingRequest recoveryInitiatingRequest = new RecoveryInitiatingRequest();
    recoveryInitiatingRequest.setUser(user);
    String callback = (String) request.getAttribute("callback");
    String sessionDataKey = (String) request.getAttribute("sessionDataKey");
    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
    }
    List<Property> properties = new ArrayList<Property>();
    Property property = new Property();
    property.setKey("callback");
    property.setValue(URLEncoder.encode(callback, "UTF-8"));
    properties.add(property);
    Property sessionDataKeyProperty = new Property();
    sessionDataKeyProperty.setKey("sessionDataKey");
    sessionDataKeyProperty.setValue(sessionDataKey);
    properties.add(sessionDataKeyProperty);
    recoveryInitiatingRequest.setProperties(properties);

    try {
        Map<String, String> requestHeaders = new HashedMap();
        if (request.getParameter("g-recaptcha-response") != null) {
            requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
        }
        notificationApi.recoverPasswordPost(recoveryInitiatingRequest, null, null, requestHeaders);
    } catch (ApiException e) {
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
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
<body>
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader" >

        </layout:component>
        <layout:component componentName="MainSection" >

        </layout:component>
        <layout:component componentName="ProductFooter" >

        </layout:component>
    </layout:main>

    <div class="ui tiny modal notify">
        <div class="header">
            <h4>
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Information")%>
            </h4>
        </div>
        <div class="content">
            <p>
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Password.recovery.information.sent.to.the.email.registered.with.account")%>
                &nbsp; <%=Encode.forHtml(username)%>
            </p>
        </div>
        <div class="actions">
            <button type="button" class="ui primary button cancel" data-dismiss="modal">
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Close")%>
            </button>
        </div>
    </div>

    <%-- footer --%>
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
    <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
    <jsp:include page="includes/footer.jsp"/>
    <% } %>

    <% String invalidCallbackErrorMessageText = IdentityManagementEndpointUtil
        .i18n(recoveryResourceBundle, "invalid.callback.url.found.in.the.request"); %>

    <script type="application/javascript">
        $(document).ready(function () {
            $(".notify").modal({
                blurring: true,
                closable: false,
                onHide: function () {
                    <%
                    try {
                        if (callback != null) {
                    %>
                        location.href = "<%= IdentityManagementEndpointUtil.getURLEncodedCallback(callback)%>";
                    <%
                    }
                    } catch (URISyntaxException e) {
                        request.setAttribute("error", true);
                        request.setAttribute("errorMsg", invalidCallbackErrorMessageText);
                        request.getRequestDispatcher("error.jsp").forward(request, response);
                        return;
                    }
                    %>
                }
            }).modal("show");
        });
    </script>
</body>
</html>
