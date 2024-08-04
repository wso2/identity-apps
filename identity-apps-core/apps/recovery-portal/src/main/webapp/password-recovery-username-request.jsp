<%--
  ~ Copyright (c) 2018-2024, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="java.io.File" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%-- Username Label Resolver --%>
<jsp:directive.include file="includes/username-label-resolver.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));

    if (StringUtils.isBlank(tenantDomain)) {
        tenantDomain = IdentityManagementEndpointConstants.SUPER_TENANT;
    }

    Boolean isMultiAttributeLoginEnabledInTenant;
    String allowedAttributes = null;
    try {
        PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
        isMultiAttributeLoginEnabledInTenant = preferenceRetrievalClient.checkMultiAttributeLogin(tenantDomain);
        allowedAttributes = preferenceRetrievalClient.checkMultiAttributeLoginProperty(tenantDomain);
    } catch (PreferenceRetrievalClientException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil
                .i18n(recoveryResourceBundle, "something.went.wrong.contact.admin"));
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    String usernameLabel = "Username";
    String enterUsernameHereText = "Enter.your.username.here";
    if (isMultiAttributeLoginEnabledInTenant) {
        if (allowedAttributes != null) {
            usernameLabel = getUsernameLabel(recoveryResourceBundle, allowedAttributes);
            enterUsernameHereText = "Enter.your.identifier";
        }
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<!doctype html>
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
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="login-portal layout recovery-layout">
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
                <div class="ui segment">
                    <h2>
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Start.password.recovery")%>
                    </h2>
                    <div class="ui negative message"
                        id="error-msg" hidden="hidden">
                    </div>
                    <% if (error) { %>
                    <div class="ui negative message"
                        id="server-error-msg">
                        <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                    </div>
                    <% } %>
                    <p>
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "password.recovery.body")%>
                    </p>
                    <div class="ui divider hidden"></div>

                    <div class="segment-form">
                        <form class="ui large form" action="recoverpassword.do" method="post" id="tenantBasedRecovery">
                            <div class="field">
                                <% if (isMultiAttributeLoginEnabledInTenant) { %>
                                    <label><%=usernameLabel %></label>
                                <% } else { %>
                                    <label>
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, usernameLabel)%>
                                    </label>
                                <% } %>
                                <input id="username" name="username" type="text" tabindex="0" required
                                        placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, enterUsernameHereText)%>">
                                <%
                                    if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
                                %>
                                <input id="tenantDomain" name="tenantDomain" value="<%= Encode.forHtmlAttribute(tenantDomain) %>"
                                    type="hidden">
                                <%
                                    }
                                %>
                                <input id="isSaaSApp" name="isSaaSApp" value="<%= isSaaSApp %>" type="hidden">
                            </div>
                            <div class="ui message info align-center">
                                <small><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "If.you.do.not.specify.tenant.domain.consider.as.super.tenant")%></small>
                            </div>
                            <%
                                String callback = Encode.forHtmlAttribute
                                        (request.getParameter("callback"));
                                if (callback != null) {
                            %>
                            <div>
                                <input type="hidden" name="callback" value="<%=callback %>"/>
                            </div>
                            <div>
                                <input type="hidden" name="isTenantQualifiedUsername" value="true"/>
                            </div>
                            <%
                                }
                            %>
                            <div class="ui divider hidden"></div>
                            <div class="align-right buttons">
                                <button id="registrationSubmit" 
                                        class="ui primary button large fluid" 
                                        type="submit">
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                            "Proceed.password.recovery")%>
                                </button>
                                <div class="mt-1 align-center">
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

        <script>
            function goBack() {
                window.history.back();
            }

            // Handle form submission preventing double submission.
            $(document).ready(function(){
                $.fn.preventDoubleSubmission = function() {
                    $(this).on("submit", function(e){
                        var $form = $(this);

                        if ($form.data("submitted") === true) {
                            // Previously submitted - don't submit again.
                            e.preventDefault();
                            console.warn("Prevented a possible double submit event");
                        } else {
                            e.preventDefault();

                            var userName = document.getElementById("username");
                            userName.value = userName.value.trim();

                            // Mark it so that the next submit can be ignored.
                            $form.data("submitted", true);
                            document.getElementById("tenantBasedRecovery").submit();
                        }
                    });

                    return this;
                };

                $('#tenantBasedRecovery').preventDoubleSubmission();
            });
        </script>

    </body>
</html>
