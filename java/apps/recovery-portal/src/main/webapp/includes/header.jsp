<%--
  ~ Copyright (c) 2019-2023, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>

<%-- Localization --%>
<jsp:directive.include file="localize.jsp" />

<%-- Include tenant context --%>
<jsp:directive.include file="../tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="branding-preferences.jsp"/>

<!-- Extract the name of the stylesheet-->
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
<jsp:include page="theme-skeleton.jsp"/>

<%-- If an override stylesheet is defined in branding-preferences, applying it... --%>
<% if (overrideStylesheet != null) { %>
<link rel="stylesheet" href="<%= StringEscapeUtils.escapeHtml4(overrideStylesheet) %>">
<% } %>

<%-- Layout specific style sheet --%>
<%
    String tempStyleFilePath = "";
    if (StringUtils.startsWith(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME)) {
        if (StringUtils.equals(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME + CUSTOM_LAYOUT_NAME_SEPERATOR 
                + tenantRequestingPreferences)) {
            tempStyleFilePath = layoutStoreURL.replace("${tenantDomain}", tenantRequestingPreferences) + "/styles.css";
        } else if (StringUtils.equals(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME + CUSTOM_LAYOUT_NAME_SEPERATOR 
                + tenantRequestingPreferences + CUSTOM_LAYOUT_NAME_SEPERATOR + applicationRequestingPreferences)) {
            tempStyleFilePath = layoutStoreURL.replace("${tenantDomain}", tenantRequestingPreferences) + "/apps/" + applicationRequestingPreferences + "/styles.css";
        }
    } else {
        tempStyleFilePath = "includes/layouts/" + layout + "/styles.css";
    }

    if (config.getServletContext().getResource(tempStyleFilePath) != null) {
        styleFilePath = tempStyleFilePath;
    }
%>
    
<link rel="stylesheet" href="<%= styleFilePath %>">

<%-- Updates the site tile with the text resolved in branding-preferences --%>
<title><%= StringEscapeUtils.escapeHtml4(siteTitle) %></title>

<%-- Downtime banner --%>
<%
    if (config.getServletContext().getResource("extensions/planned-downtime-banner.jsp") != null) {
%>
        <jsp:include page="extensions/planned-downtime-banner.jsp"/>
<%
    }
%>
