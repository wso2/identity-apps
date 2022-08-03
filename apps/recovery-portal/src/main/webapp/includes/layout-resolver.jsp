<%--
  ~ Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>

<%-- Change the layout name to activate another layout --%>
<%
    String layout = "default";
%>

<%-- Activate the "custom" layout if exists --%>
<%
    if (config.getServletContext().getResource("extensions/layouts/custom/body.html") != null) {
        layout = "custom";
    }
%>

<%-- Layout Resolving Part --%>
<%
    String layoutFileRelativePath;
    Map<String, Object> layoutData = new HashMap<String, Object>();

    if (!layout.equals("custom")) {
        if (layout.equals("default")) {
            layoutFileRelativePath = "includes/layouts/" + layout + "/body.html";
        } else {
            layoutFileRelativePath = "extensions/layouts/" + layout + "/body.html";
            if (config.getServletContext().getResource(layoutFileRelativePath) == null) {
                layout = "default";
                layoutFileRelativePath = "includes/layouts/default/body.html";
            }
        }
    } else {
        layoutFileRelativePath = "extensions/layouts/custom/body.html";
    }
%>
