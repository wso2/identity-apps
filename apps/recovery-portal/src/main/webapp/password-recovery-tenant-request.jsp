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
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="java.io.File" %>

<jsp:directive.include file="includes/localize.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
%>

<html>
<head>
    <!-- header -->
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
<!-- page content -->
<main class="center-segment">
    <div class="ui container large center aligned middle aligned">
        <!-- product-title -->
        <%
            File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
            if (productTitleFile.exists()) {
        %>
        <jsp:include page="extensions/product-title.jsp"/>
        <% } else { %>
        <jsp:include page="includes/product-title.jsp"/>
        <% } %>
        <!-- content -->
        <div class="ui segment">
            <h2 class="wr-title uppercase blue-bg padding-double white boarder-bottom-blue margin-none">
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Start.password.recovery")%>
            </h2>
            <% if (error) { %>
                <div class="ui visible negative message" id="server-error-msg">
                    <%= IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg) %>
                </div>
            <% } %>
            <div class="ui negative message" id="error-msg" hidden="hidden"></div>

            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Enter.tenant.here")%>

            <div class="ui divider hidden"></div>

            <div class="segment-form">
                <form class="ui large form" method="post" action="password-recovery-with-claims.jsp"
                      id="tenantBasedRecovery">
                    <%
                        if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
                    %>
                    <input id="tenant-domain" type="text" name="tenantDomain"
                                class="form-control ">
                    <%
                        }
                    %>
                        <%
                            String callback = Encode.forHtmlAttribute
                                    (request.getParameter("callback"));
                            if (callback != null) {
                        %>
                        <div>
                            <input type="hidden" name="callback" value="<%=callback %>"/>
                        </div>
                        <%
                            }
                        %>
                        <div class="ui divider hidden"></div>

                        <div class="align-right buttons">
                            <a href="javascript:goBack()" class="ui button secondary">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Cancel")%>
                            </a>
                            <button id="recoverSubmit"
                                    class="ui primary large button"
                                    type="submit">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                "Proceed.password.recovery")%>
                            </button>
                        </div>
                </form>
            </div>
        </div>
    </div>
</main>


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
            $("#tenantBasedRecovery").submit(function (e) {
                var errorMessage = $("#error-msg");
                errorMessage.hide();
                var tenantDomain = $("#tenant-domain").val();
                var isTenantQualifiedUrlsEnabled = '<%= IdentityTenantUtil.isTenantQualifiedUrlsEnabled() %>';
                var tenantRequiredErrorMessage = '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "Enter.tenant.domain")%>'

                if (isTenantQualifiedUrlsEnabled == 'false' && tenantDomain == '') {
                    errorMessage.text(tenantRequiredErrorMessage);
                    errorMessage.show();
                    $("html, body").animate({scrollTop: errorMessage.offset().top}, 'slow');
                    return false;
                }
                return true;
            });
        });
    </script>
</body>
</html>
