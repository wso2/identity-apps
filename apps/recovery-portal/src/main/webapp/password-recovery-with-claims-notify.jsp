<%--
  ~ Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URISyntaxException" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>

<jsp:directive.include file="includes/localize.jsp"/>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    String resendCode = (String) request.getSession().getAttribute("resendCode");
    String callback = IdentityManagementEndpointUtil.getStringValue(request.getParameter("callback"));
    String sessionDataKey = (String) request.getAttribute("sessionDataKey");
    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL));
    }
    if (StringUtils.isBlank(tenantDomain)) {
        tenantDomain = IdentityManagementEndpointConstants.SUPER_TENANT;
    }
    boolean disableResend = Boolean.parseBoolean(request.getParameter("disableResend"));
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
<div class="ui tiny modal notify">
    <div class="header">
        <h4>
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Information")%>
        </h4>
    </div>
    <div class="content">
        <p>
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                    "Password.recovery.information.sent.to.the.email.registered.with.account")%>
        </p>
    </div>
    <div class="actions">
        <%
            if (StringUtils.isNotBlank(resendCode) && !disableResend) {
        %>
        <form method="post" action="verify.do" id="resendConfirmationForm">
            <input type="hidden" name="isResendPasswordRecovery" value="true"/>
            <input type="hidden" name="callback" value="<%=Encode.forHtmlAttribute(callback) %>"/>
            <input type="hidden" name="tenantDomain" value="<%=Encode.forHtmlAttribute(tenantDomain)%>"/>
            <input type="hidden" name="sessionDataKey" value="<%=Encode.forHtmlAttribute(sessionDataKey)%>"/>
            <div class="align-right buttons">
                <button id="recoverySubmit" class="ui button link-button" data-dismiss="modal">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Resend.confirmation")%>
                </button>
                <button type="button" class="ui primary button cancel" data-dismiss="modal">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Close")%>
                </button>
            </div>
        </form>
        <%
            }
            else {
        %>
        <button type="button" class="ui primary button cancel" data-dismiss="modal">
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Close")%>
        </button>
        <%
            }
        %>
    </div>
</div>

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
        function goBack() {
            window.history.back();
        }

        $(document).ready(function () {
            $(".notify").modal({
                blurring: true,
                closable: false,
                onHide: function () {
                    <%
                    try {
                        if (callback != null) {
                    %>
                        location.href = "<%= IdentityManagementEndpointUtil.getURLEncodedCallback(callback)%>";
                    <%
                    }
                    } catch (URISyntaxException e) {
                        request.setAttribute("error", true);
                        request.setAttribute("errorMsg", "Invalid callback URL found in the request.");
                        request.getRequestDispatcher("error.jsp").forward(request, response);
                        return;
                    }
                    %>
                }
            }).modal("show");
        });
    </script>
</body>
</html>