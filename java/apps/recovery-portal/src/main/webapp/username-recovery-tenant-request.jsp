<%--
  ~ Copyright (c) 2018-2023, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
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
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "large");
%>

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
<body class="login-portal layout recovery-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
            String productTitleFilePath = "extensions/product-title.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productTitleFilePath = customLayoutFileRelativeBasePath + "/product-title.jsp";
            }
            if (!new File(getServletContext().getRealPath(productTitleFilePath)).exists()) {
                productTitleFilePath = "includes/product-title.jsp";
            }
            %>
            <jsp:include page="<%= productTitleFilePath %>" />
        </layout:component>
        <layout:component componentName="MainSection" >
            <%-- content --%>
            <div class="ui segment">
                <h2 class="wr-title uppercase blue-bg padding-double white boarder-bottom-blue margin-none">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Start.username.recovery")%>
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
                    <form class="ui large form" method="post" action="recoverusername.do" id="tenantBasedRecovery">
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
                                    "Proceed.username.recovery")%>
                                </button>
                            </div>
                    </form>
                </div>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
            String productFooterFilePath = "extensions/product-footer.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productFooterFilePath = customLayoutFileRelativeBasePath + "/product-footer.jsp";
            }
            if (!new File(getServletContext().getRealPath(productFooterFilePath)).exists()) {
                productFooterFilePath = "includes/product-footer.jsp";
            }
            %>
            <jsp:include page="<%= productFooterFilePath %>" />
        </layout:component>
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

                if (isTenantQualifiedUrlsEnabled == 'false' && tenantDomain == '') {
                    errorMessage.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Enter.tenant.domain")%>");
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
