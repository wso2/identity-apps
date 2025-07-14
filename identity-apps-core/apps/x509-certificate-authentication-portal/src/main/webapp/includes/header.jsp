<%--
  ~ Copyright (c) 2020-2025, WSO2 LLC. (http://www.wso2.com).
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
<%@ page import="java.io.File" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../tenant-resolve.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="localize.jsp" />

<%-- Branding Preferences --%>
<jsp:directive.include file="branding-preferences.jsp"/>


<%-- Extract the name of the stylesheet--%>
<%
    String themeName = "wso2is";
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
<link href="libs/themes/wso2is/<%= themeFileName %>" rel="stylesheet">

<%-- Load Default Theme Skeleton --%>
<jsp:include page="theme-skeleton.jsp"/>

<%-- If an override stylesheet is defined in branding-preferences, applying it... --%>
<% if (overrideStylesheet != null && !StringUtils.startsWith(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME)) { %>
<link rel="stylesheet" href="<%= StringEscapeUtils.escapeHtml4(overrideStylesheet) %>">
<% } %>

<%-- Layout specific style sheet --%>
<%
    String styleFilePath = "";
    if (StringUtils.startsWith(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME)) {
        if(StringUtils.isNotBlank(cssContent)) {
%>
<style type="text/css"><%= cssContent %></style>
<%
        } else {
            if (StringUtils.equals(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME + CUSTOM_LAYOUT_NAME_SEPERATOR
                    + preferenceResolvedFromResourceName)) {
                styleFilePath = layoutStoreURL.replace("${tenantDomain}", preferenceResolvedFromResourceName) + "/styles.css";
            } else if (StringUtils.equals(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME + CUSTOM_LAYOUT_NAME_SEPERATOR
                    + tenantRequestingPreferences + CUSTOM_LAYOUT_NAME_SEPERATOR + convertApplicationName(applicationRequestingPreferences))) {
                styleFilePath = layoutStoreURL.replace("${tenantDomain}", tenantRequestingPreferences) + "/apps/" + convertApplicationName(applicationRequestingPreferences) + "/styles.css";
            }
        }
    } else {
        styleFilePath = "includes/layouts/" + layout + "/styles.css";
    }

    if (StringUtils.isBlank(cssContent) && (styleFilePath.startsWith("http") || config.getServletContext().getResource(styleFilePath) != null)) {
%>
        <link rel="stylesheet" href="<%= styleFilePath %>">
<%
    }
%>

<%-- Updates the site tile with the text resolved in branding-preferences --%>
<title><%= i18n(resourceBundle, customText, "site.title", __DEPRECATED__siteTitle) %></title>

<%-- Downtime banner --%>
<%
    if (config.getServletContext().getResource("extensions/planned-downtime-banner.jsp") != null) {
%>
        <jsp:include page="/extensions/planned-downtime-banner.jsp"/>
<%
    }
%>

<script src="libs/jquery_3.6.0/jquery-3.6.0.min.js"></script>
