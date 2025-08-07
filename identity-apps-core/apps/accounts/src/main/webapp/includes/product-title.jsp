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

<%@ page import="org.apache.commons.text.StringEscapeUtils" %>

<%-- Include tenant context --%>
<jsp:directive.include file="init-url.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="localize.jsp" />

<%-- Branding Preferences --%>
<jsp:directive.include file="branding-preferences.jsp"/>

<div class="theme-icon inline auto transparent product-logo portal-logo">
  <img src="<%= StringEscapeUtils.escapeHtml4(logoURL) %>" id="product-logo" alt="<%= StringEscapeUtils.escapeHtml4(logoAlt) %>" />
</div>
