<%--
  ~ Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.user.core.util.UserCoreUtil" %>
<%@ page import="org.wso2.carbon.utils.multitenancy.MultitenantUtils" %>

<%-- Include tenant context --%>
<jsp:directive.include file="/tenant-resolve.jsp"/>

<%
    String username = Encode.forJava(request.getParameter("username"));
    String userTenantHint = (Encode.forJava(request.getParameter("t")) != "null") ? Encode.forJava(request.getParameter("t")) : null;
    if (StringUtils.isNotBlank(userTenantHint)) {
        username = MultitenantUtils.getTenantAwareUsername(username);
        username = UserCoreUtil.addTenantDomainToEntry(username, userTenantHint);
    } else {
        username = UserCoreUtil.addTenantDomainToEntry(username, userTenant);
    }
    request.setAttribute("resolvedUsername", username);
%>
