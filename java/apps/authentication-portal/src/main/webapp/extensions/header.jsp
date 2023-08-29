<%--
 ~
 ~ Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 Inc. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%-- localize.jsp MUST already be included in the calling script --%>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="java.io.File" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="./branding-preferences.jsp"/>

<%-- Extract the name of the stylesheet--%>
<%
    String themeName = "asgardio";
    File themeDir = new File(request.getSession().getServletContext().getRealPath("/")
        + "/" + "libs/themes/" + themeName + "/");
    String[] fileNames = themeDir.list();
    String themeFileName = "";

    for(String file: fileNames) {
        if(file.endsWith("min.css")) {
            themeFileName = file;
        }
    }
%>

<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<%-- Updates the favicon with the URL resolved in branding-preferences --%>
<link rel="icon" href="<%= StringEscapeUtils.escapeHtml4(faviconURL) %>" type="image/x-icon"/>

<%-- Load the base theme --%>
<link href="libs/themes/asgardio/<%= themeFileName %>" rel="stylesheet">

<%-- Load Default Theme Skeleton --%>
<jsp:include page="./theme-skeleton.jsp"/>

<%-- If an override stylesheet is defined in branding-preferences, applying it... --%>
<% if (overrideStylesheet != null && !StringUtils.equals(layout, "custom-" + tenantForTheming)) { %>
<link rel="stylesheet" href="<%= StringEscapeUtils.escapeHtml4(overrideStylesheet) %>">
<% } %>

<%-- Layout specific styleSheet --%>
<%
    String styleFilePath;
    if (StringUtils.equals(layout, "custom-" + tenantForTheming)) {
        styleFilePath = application.getInitParameter("LayoutStoreURL").replace("${tenantDomain}", tenantForTheming) + "/styles.css";
%>
    <link rel="stylesheet" href="<%= styleFilePath %>">
<%
    } else {
        styleFilePath = "extensions/layouts/" + layout + "/styles.css";
        if (config.getServletContext().getResource(styleFilePath) != null) {
%>
    <link rel="stylesheet" href="<%= styleFilePath %>">
<%
        }
    }
%>

<%-- Updates the site tile with the text resolved in branding-preferences --%>
<title><%= StringEscapeUtils.escapeHtml4(siteTitle) %></title>

<script src="libs/jquery_3.6.0/jquery-3.6.0.min.js"></script>

<style type="text/css">
    .grecaptcha-badge {
        bottom: 55px !important;
    }
    @media only screen and (max-width: 767px) {
        .grecaptcha-badge {
            bottom: 100px !important;
        }
    }
</style>
