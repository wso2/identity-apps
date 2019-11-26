<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
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

<%@ tag description="Master Page Template" pageEncoding="UTF-8"%>

<%@ attribute name="pageTitle" required="true" %>
<%@ attribute name="pageOnLoadFunction" required="false" %>
<%@ attribute name="topIncludes" fragment="true" required="false" %>
<%@ attribute name="bottomIncludes" fragment="true" required="false" %>

<!doctype html>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="icon" href="libs/theme/assets/images/favicon.ico" type="image/x-icon"/>
    <link href="libs/theme/wso2-default.min.css" rel="stylesheet">
    
    <title>${pageTitle}</title>
    
    <style>
        body > div.container-fluid,
        body > div.container-fluid > div.login-form {
            height: 100%;
        }
    </style>
    
    <jsp:invoke fragment="topIncludes" />
</head>
<body onload="${pageOnLoadFunction}">
    <div class="container-fluid">
        <jsp:doBody />          
    </div>

    <script src="libs/jquery_3.4.1/jquery-3.4.1.js"></script>
    <script src="libs/theme/semantic.min.js"></script>

    <jsp:invoke fragment="bottomIncludes" />
</body>
</html>
