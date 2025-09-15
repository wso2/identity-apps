<%--
  ~ Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
if (IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {

    request.getRequestDispatcher("password-recovery-with-claims.jsp").forward(request, response);
}
%>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
%>

<% request.setAttribute("pageName", "password-recovery-tenant-request"); %>

<html lang="en-US">
<head>
    <%-- header --%>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
        <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
        <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>
<body class="login-portal layout recovery-layout" data-page="<%= request.getAttribute("pageName") %>">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
            <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
            <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="MainSection" >
            <%-- content --%>
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
                        <input id="tenant-domain" type="text" name="tenantDomain" class="form-control align-center"
                                placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Tenant.domain")%>">
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
                            <button id="recoverSubmit"
                                    class="ui primary large button fluid"
                                    type="submit">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                "Proceed.password.recovery")%>
                            </button>
                            <div class="mt-2 align-center">
                                <a href="javascript:goBack()" class="ui button secondary large fluid">
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Cancel")%>
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
                File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                if (productFooterFile.exists()) {
            %>
                <jsp:include page="extensions/product-footer.jsp"/>
            <% } else { %>
                <jsp:include page="includes/product-footer.jsp"/>
            <% } %>
        </layout:component>
        <layout:dynamicComponent filePathStoringVariableName="pathOfDynamicComponent">
            <jsp:include page="${pathOfDynamicComponent}" />
        </layout:dynamicComponent>
    </layout:main>

    <%-- footer --%>
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
