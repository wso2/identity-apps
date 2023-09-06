<%--
 ~ Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content.
--%>

<%--  
    This template is used to redirect to an external page using the adaptive auth dynamic prompt capability.
    An example prompt usage in adaptive script is shown below:

    prompt("externalRedirect", {
                "redirectURL": "<EXTERNAL_URL>",
            }, {
                onSuccess: function(context) {
                    Log.info("Successfully redirected to external page");
                },
                onFail: function(context, data) {
                    Log.info("Error occurred during the prompt.");
                }
            });

    * "properties" will be appended as query parameters in the redirect URL.
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.*" %>

<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="../includes/localize.jsp" />

<%
    // Read promptId from request
    String promptId = (String) request.getAttribute("promptId");

    // Read the data from request
    Object dataObj = request.getAttribute("data");

    // Extract redirect URL from the request data
    String redirectURL = "";
    Map<String, String> properties = new HashMap<>();

    if (dataObj instanceof Map) {
        Map<String, Object> data = (Map<String, Object>) dataObj;
        redirectURL = (String) data.get("redirectURL");
    }

    StringBuilder queryStringBuilder = new StringBuilder();

    // Append promptID as a query parameter
    queryStringBuilder.append("promptId=").append(promptId);
    // Append query string to redirect URL
    if (redirectURL.contains("?")) {
        redirectURL += "&" + queryStringBuilder.toString();
    } else {
        redirectURL += "?" + queryStringBuilder.toString();
    }
%>

<head>
    <script>
        window.location.href = "<%= redirectURL %>";
    </script>
</head>

<h4><%=AuthenticationEndpointUtil.i18n(resourceBundle, "redirecting")%>...</h4>
<p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "if.you.are.not.redirected")%>, <a href="<%= redirectURL %>"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "click.here")%></a>.</p>
