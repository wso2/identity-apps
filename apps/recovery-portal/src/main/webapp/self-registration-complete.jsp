<%--
  ~ Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~  WSO2 Inc. licenses this file to you under the Apache License,
  ~  Version 2.0 (the "License"); you may not use this file except
  ~  in compliance with the License.
  ~  You may obtain a copy of the License at
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
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.net.MalformedURLException" %>
<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>
<jsp:directive.include file="includes/localize.jsp"/>
<jsp:directive.include file="tenant-resolve.jsp"/>
<%
    boolean isEmailNotificationEnabled = false;
    String callback = (String) request.getAttribute("callback");
    String username = request.getParameter("username");
    String userStoreDomain = request.getParameter("userstoredomain");
    String sessionDataKey = null;
    String fullyQualifiedUsername = username;
    boolean hasAutoLoginCookie = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("isAutoLoginEnabled"));

    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
    }
    String confirm = (String) request.getAttribute("confirm");
    String confirmLiteReg = (String) request.getAttribute("confirmLiteReg");

    isEmailNotificationEnabled = Boolean.parseBoolean(application.getInitParameter(
            IdentityManagementEndpointConstants.ConfigConstants.ENABLE_EMAIL_NOTIFICATION));
    boolean isSessionDataKeyPresent = false;
    if (userStoreDomain != null) {
        fullyQualifiedUsername = userStoreDomain + "/" + username + "@" + tenantDomain;
    }

    // Check for query params in callback URL.
    if (callback.contains("?")) {
        String queryParams = callback.substring(callback.indexOf("?") + 1);
        String[] parameterList = queryParams.split("&");
        Map<String, String> queryMap = new HashMap<>();
        for (String param : parameterList) {
            String key = param.substring(0, param.indexOf("="));
            String value = param.substring(param.indexOf("=") + 1);
            queryMap.put(key, value);
        }
        sessionDataKey = queryMap.get("sessionDataKey");
        if (StringUtils.isNotBlank(sessionDataKey)) {
            isSessionDataKeyPresent = true;
        }
    }
%>

<!doctype html>
<html>
<head>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>
<body>
<% if (StringUtils.isNotBlank(confirmLiteReg) && confirmLiteReg.equals("true")) {
    response.sendRedirect(callback);
} else { %>
<div class="ui tiny modal notify">
    <div class="header">
        <h4>
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Information")%>
        </h4>
    </div>
    <div class="content">
        <% if (StringUtils.isNotBlank(confirm) && confirm.equals("true")) {%>
        <p><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Successfully.confirmed")%>
        </p>
        <%
        } else {
            if (isEmailNotificationEnabled) {
        %>
        <p><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Confirmation.sent.to.mail")%>
        </p>
        <% } else {%>
        <p><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "User.registration.completed.successfully")%>
        </p>
        <%
                }
            }
        %>
    </div>
    <div class="actions">
        <button type="button" class="ui primary button cancel" data-dismiss="modal">
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Close")%>
        </button>
    </div>
    <form id="callbackForm" name="callbackForm" method="post" action="/commonauth">
        <%
            if (username != null) {
        %>
        <div>
            <input type="hidden" name="username" value="<%=Encode.forHtmlAttribute(fullyQualifiedUsername)%>"/>
        </div>
        <%
            }
        %>
        <div>
            <input type="hidden" name="sessionDataKey" value="<%=Encode.forHtmlAttribute(sessionDataKey)%>"/>
        </div>
    </form>
</div>
<% }%>

<!-- footer -->
<%
    File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
    if (footerFile.exists()) {
%>
<jsp:include page="extensions/footer.jsp"/>
<% } else { %>
<jsp:include page="includes/footer.jsp"/>
<% } %>

<script type="application/javascript">
    $(document).ready(function () {
        $('.notify').modal({
            onHide: function () {
                <%
                    try {
                        if (hasAutoLoginCookie && isSessionDataKeyPresent)  {
                %>
                document.callbackForm.submit();
                <%
                    } else {
                %>
                location.href = "<%= IdentityManagementEndpointUtil.encodeURL(callback)%>";
                <%
                        }
                } catch (MalformedURLException e) {
                    request.setAttribute("error", true);
                    request.setAttribute("errorMsg", "Invalid callback URL found in the request.");
                    request.getRequestDispatcher("error.jsp").forward(request, response);
                    return;
                }
                %>
            },
            blurring: true,
            detachable: true,
            closable: false,
            centered: true,
        }).modal("show");
    });
</script>
</body>
</html>
