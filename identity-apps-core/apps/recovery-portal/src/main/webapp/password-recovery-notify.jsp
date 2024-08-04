<%--
  ~ Copyright (c) 2016-2023, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
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

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    String username = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("username"));
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));
    String accessUrl = request.getParameter("accessUrl");
    String modifiedAccessUrl = accessUrl;
    if (isSaaSApp) {
    	modifiedAccessUrl = IdentityManagementEndpointUtil.getUserPortalUrl(accessUrl, tenantDomain);
    }
    User user = IdentityManagementServiceUtil.getInstance().resolveUser(StringEscapeUtils.unescapeJava(username), tenantDomain, isSaaSApp);

    String sp = request.getParameter("sp");
    String spId = "";

    if (!StringUtils.isBlank(sp)) {
        try {
            if (sp.equals("My Account")) {
                spId = "My_Account";
            } else if (sp.equals("Console")) {
                spId = "Console";
            } else {
                ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
                spId = applicationDataRetrievalClient.getApplicationID(tenantDomain,sp);
            }
        } catch (Exception e) {
            spId = "";
        }
    }

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
    Property appProperty = new Property();
    appProperty.setKey("spId");
    appProperty.setValue(spId);
    properties.add(appProperty);
    Property appSpProperty = new Property();
    appSpProperty.setKey("sp");
    appSpProperty.setValue(sp);
    properties.add(appSpProperty);
    Property appIsAccessUrlAvailableProperty = new Property();
    appIsAccessUrlAvailableProperty.setKey("isAccessUrlAvailable");
    appIsAccessUrlAvailableProperty.setValue(String.valueOf(StringUtils.isNotBlank(modifiedAccessUrl)));
    properties.add(appIsAccessUrlAvailableProperty);
 
    recoveryInitiatingRequest.setProperties(properties);

    try {
        Map<String, String> requestHeaders = new HashedMap();
        if (request.getParameter("g-recaptcha-response") != null) {
            requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
        }
        notificationApi.recoverPasswordPost(recoveryInitiatingRequest, null, null, requestHeaders);
        request.setAttribute("accessUrl", modifiedAccessUrl);
        request.getRequestDispatcher("password-reset-success.jsp").forward(request, response);
    } catch (ApiException e) {
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }
%>

<!doctype html>
<html lang="en-US">
<head>
</head>
<body>
</body>
</html>
