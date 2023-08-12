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

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="branding-preferences.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="localize.jsp" />

<%-- footer --%>
<footer class="footer" style="text-align: center">
    <div class="container-fluid">
        <%
            if (!StringUtils.isBlank(copyrightText)) {
        %>
            <span></span>
            <p><%= StringEscapeUtils.escapeHtml4(copyrightText) %></p>
        <%
            } else {
        %>
            <p><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "wso2.identity.server")%> &copy;
                <script>document.write(new Date().getFullYear());</script>
            </p>
        <%
            }
        %>
    </div>
</footer>
