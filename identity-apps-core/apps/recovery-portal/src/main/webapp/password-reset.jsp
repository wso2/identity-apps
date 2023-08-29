<%--
  ~ Copyright (c) 2016-2023, WSO2 LLC. (https://www.wso2.com).
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
    String callback = (String) request.getAttribute(IdentityManagementEndpointConstants.CALLBACK);
    String username = request.getParameter("username");
    String userStoreDomain = request.getParameter("userstoredomain");
    String type = request.getParameter("type");
    String tenantDomainFromQuery = (String) request.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    if (tenantDomainFromQuery == null) {
        tenantDomainFromQuery = (String) session.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    }
    if (username == null) {
        username = (String) request.getAttribute("username");
    }
    if (userStoreDomain == null) {
        userStoreDomain = (String) request.getAttribute("userstoredomain");
    }

%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<!doctype html>
<html lang="en-US">
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
                <div class="ui segment">
                    <%-- content --%>
                    <h2>
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Reset.Password")%>
                    </h2>

                    <% if (error) { %>
                    <div class="ui visible negative message" id="server-error-msg">
                        <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                    </div>
                    <% } %>
                    <div id="ui visible negative message" hidden="hidden"></div>

                    <div class="segment-form">
                        <form class="ui large form" method="post" action="completepasswordreset.do" id="passwordResetForm">
                            <div class="ui negative message" hidden="hidden" id="error-msg"></div>
                            <div class="field">
                                <label for="reset-password">
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "Enter.new.password")%>
                                </label>
                                <div class="ui right icon input">
                                    <input
                                        id="reset-password"
                                        name="reset-password"
                                        type="password"
                                        required=""
                                    />
                                    <i id="passwordShowHide" class="eye link icon slash"
                                       onclick="passwordShowToggle()"></i>
                                </div>
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
                                if (userStoreDomain != null) {
                            %>
                            <div>
                                <input type="hidden" name="userstoredomain"
                                       value="<%=Encode.forHtmlAttribute(userStoreDomain)%>"/>
                            </div>
                            <%
                                }
                            %>

                            <%
                                if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled() && tenantDomainFromQuery != null) {
                            %>
                            <div>
                                <input type="hidden" name="tenantDomainFromQuery" value="<%=Encode.forHtmlAttribute(tenantDomainFromQuery) %>"/>
                            </div>
                            <%
                                }
                            %>

                            <%
                                if (type != null) {
                            %>
                            <div>
                                <input type="hidden" name="type" value="<%=Encode.forHtmlAttribute(type) %>"/>
                            </div>
                            <%
                                }
                            %>

                           <div class="field">
                                <label for="confirm-password">
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Confirm.password")%>
                                </label>
                                <div class="ui right icon input">
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        data-match="reset-password"
                                        required=""
                                    />
                                    <i id="confirmPasswordShowHide" class="eye link icon slash"
                                       onclick="confirmPasswordShowToggle()"></i>
                                </div>
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
            $(document).ready(function () {

                $("#passwordResetForm").submit(function (e) {

                    $("#server-error-msg").remove();
                    var password = $("#reset-password").val();
                    var password2 = $("#confirm-password").val();
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

            var password1 = true;
            var password2 = true;

            function passwordShowToggle(){
                if(password1) {
                    password1 = false;
                    document.getElementById("passwordShowHide").classList.remove("slash");
                    document.getElementById("reset-password").setAttribute("type","text");
                } else{
                    password1 = true;
                    document.getElementById("passwordShowHide").classList.add("slash");
                    document.getElementById("reset-password").setAttribute("type","password");
                }
            }

            function confirmPasswordShowToggle(){
                if(password2) {
                    password2 = false;
                    document.getElementById("confirmPasswordShowHide").classList.remove("slash");
                    document.getElementById("confirm-password").setAttribute("type","text");
                } else{
                    password2 = true;
                    document.getElementById("confirmPasswordShowHide").classList.add("slash");
                    document.getElementById("confirm-password").setAttribute("type","password");
                }
            }
        </script>
    </body>
</html>
