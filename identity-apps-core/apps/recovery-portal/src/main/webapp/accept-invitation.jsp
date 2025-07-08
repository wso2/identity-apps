<%--
  ~ Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.net.HttpURLConnection, java.net.URL, java.io.BufferedReader, java.io.InputStreamReader" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="java.io.File" %>
<%@ page import="javax.ws.rs.HttpMethod" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    // URL of the REST API you want to call
    String apiUrl = IdentityManagementEndpointUtil.getBasePath(IdentityManagementEndpointConstants.SUPER_TENANT,
                    "/api/server/v1/guests/invitation/accept", false);
    String confCode = request.getParameter("code");
    String acceptApiResponse = "";

    // Some mail providers send a HEAD request to verify invite links, which can invalidate them.
    // To prevent this, HEAD requests to this page are ignored.
    String httpMethod = request.getMethod();
    if (StringUtils.equals(httpMethod, HttpMethod.HEAD)) {
        response.setStatus(response.SC_OK);
        return;
    }

    try {
        // Create a URL object with the API URL
        URL url = new URL(apiUrl);

        // Open a connection to the URL
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        // Set the HTTP request method to POST
        connection.setRequestMethod("POST");

        // Set the request content type (e.g., JSON)
        connection.setRequestProperty("Content-Type", "application/json");

        // Enable input/output streams for sending and receiving data
        connection.setDoOutput(true);
        connection.setDoInput(true);

        // Define the request body content (e.g., JSON data)
        String requestBody = "{\"confirmationCode\":\"" + confCode + "\"}";

        // Write the request body data to the connection's output stream
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = requestBody.getBytes("UTF-8");
            os.write(input, 0, input.length);
        }

        // Get the response code from the server
        int responseCode = connection.getResponseCode();

        // Check if the response code is successful (e.g., 200 OK)
        if (responseCode == 204) {
            acceptApiResponse="SUCCESS";
        } else {
            acceptApiResponse="FAIL";
        }

        // Close the connection
        connection.disconnect();
    } catch (Exception e) {
        acceptApiResponse="FAIL";
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isResponsePage", true);
    if(acceptApiResponse.equalsIgnoreCase("SUCCESS")) {
        layoutData.put("isSuccessResponse", true);
    } else {
        layoutData.put("isErrorResponse", true);
    }
    layoutData.put("isAcceptInvitationPage", true);
%>

<%
    String responseType = "error";
    if(acceptApiResponse.equalsIgnoreCase("SUCCESS")) {
        responseType = "success";
    }
%>

<% request.setAttribute("pageName", "accept-invitation"); %>

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
<body class="login-portal layout" data-response-type="<%= responseType %>" data-page="<%= request.getAttribute("pageName") %>">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader" >
            <%-- product-title --%>
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
                <jsp:include page="extensions/product-title.jsp"/>
            <%  } else { %>
                <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="MainSection" >
            <% if(acceptApiResponse.equalsIgnoreCase("SUCCESS")) { %>
                <div class="ui green segment mt-3 attached">
                    <h3 class="ui header text-center slogan-message mt-4 mb-6" data-componentid="user-invitation-accept-page-header">
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"invitation.accepted")%>
                    </h3>
                    <p class="portal-tagline-description">
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "invitation.accepted.message")%>.
                        <br/><br/>
                    </p>
                </div>
            <% } else { %>
                <div class="ui orange segment mt-3 attached">
                    <h3 class="ui header text-center slogan-message mt-4 mb-6" data-componentid="user-invitation-accept-page-header">
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"invitation.not.active")%>
                    </h3>
                    <p class="portal-tagline-description">
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "invitation.not.active.message")%>.
                        <br/><br/>
                    </p>
                </div>
            <% } %>
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
