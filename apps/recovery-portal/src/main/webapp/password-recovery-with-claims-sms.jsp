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

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.io.File" %>

<jsp:directive.include file="includes/localize.jsp"/>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    String callback = IdentityManagementEndpointUtil.getStringValue(request.getParameter("callback"));
    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL));
    }
    String sessionDataKey = (String) request.getAttribute("sessionDataKey");
    String username = (String) request.getAttribute("username");
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
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
<body class="login-portal layout recovery-layout">
    <main class="center-segment">
        <div class="ui container medium center aligned middle aligned">
            <!-- product-title -->
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
            <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
            <jsp:include page="includes/product-title.jsp"/>
            <% } %>
            <div class="ui segment">
                <!-- page content -->
                <h3 class="ui header">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Submit.sms.otp")%>
                </h3>
                <% if (error) { %>
                <div class="ui visible negative message" id="server-error-msg">
                    <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                </div>
                <% } %>
                <div class="ui negative message" id="error-msg" hidden="hidden"></div>

                <div class="ui divider hidden"></div>
                <div class="segment-form">
                    <form class="ui large form" method="post" action="verify.do" id="smsOtpSubmitForm">
                        <div class="field">
                            <label>
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Confirmation.code")%>
                            </label>
                            <input id="confirmation" name="confirmation" type="text" tabindex="0" required>
                            <input type="hidden" id="isPWRecovery" name="isPasswordRecoverySMSConfirmation" value="true">
                            <input type="hidden" name="callback" value="<%=Encode.forHtmlAttribute(callback) %>"/>
                            <input type="hidden" name="tenantDomain" value="<%=Encode.forHtmlAttribute(tenantDomain) %>"/>
                            <input type="hidden" name="sessionDataKey" value="<%=Encode.forHtmlAttribute(sessionDataKey) %>"/>
                            <input type="hidden" name="username" value="<%=Encode.forHtmlAttribute(username) %>"/>
                        </div>
                        <div class="ui divider hidden"></div>
                        <div class="align-left ui link-text">
                            <a id="registerLink"
                               href="verify.do?tenantDomain=<%=Encode.forHtmlAttribute(tenantDomain)%>&callback=<%=Encode.
                               forHtmlAttribute(URLEncoder.encode(callback, "UTF-8"))%>&sessionDataKey=<%=Encode.
                               forHtmlAttribute(sessionDataKey)%>&username=<%=Encode.
                               forHtmlAttribute(username)%>&isResendPasswordRecovery=true">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Resend.confirmation")%>
                            </a>
                        </div>
                        <div class="ui divider hidden"></div>
                        <div class="align-right buttons">
                            <a href="javascript:goBack()" class="ui button link-button">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Cancel")%>
                            </a>
                            <button id="OTPSubmit"
                                    class="ui primary button"
                                    type="submit">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Submit")%>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
    <!-- /content/body -->
    <!-- product-footer -->
    <%
        File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
        if (productFooterFile.exists()) {
    %>
    <jsp:include page="extensions/product-footer.jsp"/>
    <% } else { %>
    <jsp:include page="includes/product-footer.jsp"/>
    <% } %>
    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
    <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
    <jsp:include page="includes/footer.jsp"/>
    <% } %>

    <script type="text/javascript">
        function goBack() {
            window.history.back();
        }

        $(document).ready(function () {
            $("#smsOtpSubmitForm").submit(function (e) {
                var errorMessage = $("#error-msg");
                errorMessage.hide();
                return true;
            });
        });
    </script>
</body>
</html>