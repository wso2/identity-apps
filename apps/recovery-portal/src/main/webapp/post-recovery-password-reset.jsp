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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<jsp:directive.include file="includes/localize.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    String callback = (String) request.getAttribute("callback");
    String username = request.getParameter("username");
    String sessionDataKey = request.getParameter("sessionDataKey");
    String tenantDomain = (String) request.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    if (tenantDomain == null) {
        tenantDomain = (String) session.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    }
    if (username == null) {
        username = (String) request.getAttribute("username");
    }
    if (sessionDataKey == null) {
        sessionDataKey = (String) request.getAttribute("sessionDataKey");
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
        <jsp:directive.include file="includes/header.jsp"/>
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
                <jsp:directive.include file="includes/product-title.jsp"/>
                <% } %>
                <div class="ui segment">
                    <!-- content -->
                    <h2>
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Reset.Password")%>
                    </h2>

                    <% if (error) { %>
                    <div class="ui visible negative message">
                        <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                    </div>
                    <% } %>
                    <div id="ui visible negative message" hidden="hidden"></div>

                    <div class="segment-form">
                        <form class="ui large form" method="post" action="postrecoverypasswordresetcomplete.do" id="passwordResetForm">
                            <div class="ui negative message" hidden="hidden" id="error-msg"></div>
                            <div class="field">
                                <label>
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Enter.new.password")%>
                                </label>
                                <input id="reset-password" name="reset-password" type="password"
                                    required="">
                            </div>

                            <%
                                if (username != null) {
                            %>
                            <div>
                                <input type="hidden" name="username" value="<%=Encode.forHtmlAttribute(username) %>"/>
                            </div>
                            <%
                                }
                            %>

                            <%
                                if (callback != null) {
                            %>
                            <div>
                                <input type="hidden" name="callback" value="<%=Encode.forHtmlAttribute(callback) %>"/>
                            </div>
                            <%
                                }
                            %>

                            <%
                                if (sessionDataKey != null) {
                            %>
                            <div>
                                <input type="hidden" name="sessionDataKey"
                                       value="<%=Encode.forHtmlAttribute(sessionDataKey)%>"/>
                            </div>
                            <%
                                }
                            %>

                            <%
                                if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled() && tenantDomain != null) {
                            %>
                            <div>
                                <input type="hidden" name="tenantdomain" value="<%=Encode.forHtmlAttribute(tenantDomain) %>"/>
                            </div>
                            <%
                                }
                            %>
                            <div class="field">
                                <label>
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Confirm.password")%>
                                </label>
                                <input id="reset-password2" name="reset-password2" type="password"
                                    data-match="reset-password" required="">
                            </div>
                            <div class="ui divider hidden"></div>

                            <div class="align-right buttons">
                                <button id="submit"
                                        class="ui primary button"
                                        type="submit"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                        "Proceed")%>
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
        <jsp:directive.include file="includes/product-footer.jsp"/>
        <% } %>

        <!-- footer -->
        <%
            File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
            if (footerFile.exists()) {
        %>
        <jsp:include page="extensions/footer.jsp"/>
        <% } else { %>
        <jsp:directive.include file="includes/footer.jsp"/>
        <% } %>

        <script type="text/javascript">
            $(document).ready(function () {

                $("#passwordResetForm").submit(function (e) {

                    $("#server-error-msg").remove();
                    var password = $("#reset-password").val();
                    var password2 = $("#reset-password2").val();
                    var error_msg = $("#error-msg");

                    if (!password || 0 === password.length) {
                        error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Password.cannot.be.empty")%>");
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        return false;
                    }

                    if (password !== password2) {
                        error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Passwords.did.not.match.please.try.again")%>");
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        return false;
                    }

                    return true;
                });
            });

        </script>
    </body>
</html>
