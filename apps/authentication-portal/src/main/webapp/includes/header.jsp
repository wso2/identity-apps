<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
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

<%@ include file="localize.jsp" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="java.io.File" %>

<!-- Branding Preferences -->
<jsp:directive.include file="../extensions/branding-preferences.jsp"/>

<!-- Extract the name of the stylesheet-->
<%
    String themeName = "default";
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

<link rel="icon" href="libs/themes/default/assets/images/branding/favicon.ico" type="image/x-icon"/>
<link href="libs/themes/default/<%= themeFileName %>" rel="stylesheet">

<!-- Layout specific style sheet -->
<%
    String styleFilePath = "extensions/layouts/" + layout + "/styles.css";
    if (config.getServletContext().getResource(styleFilePath) != null) {
%>
    <link rel="stylesheet" href="<%= styleFilePath %>">
<% } %>

<title><%=AuthenticationEndpointUtil.i18n(resourceBundle, "wso2.identity.server")%></title>

<script src="libs/jquery_3.6.0/jquery-3.6.0.min.js"></script>
