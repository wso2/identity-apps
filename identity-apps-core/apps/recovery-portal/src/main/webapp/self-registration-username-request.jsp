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
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.constants.SelfRegistrationStatusCodes" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.ReCaptchaApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.ReCaptchaProperties" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.Enumeration" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));
    boolean skipSignUpEnableCheck = Boolean.parseBoolean(request.getParameter("skipsignupenablecheck"));
    String username = request.getParameter("username");
    User user = IdentityManagementServiceUtil.getInstance().resolveUser(username, tenantDomain, isSaaSApp);
    Object errorCodeObj = request.getAttribute("errorCode");
    Object errorMsgObj = request.getAttribute("errorMsg");
    String callback = Encode.forHtmlAttribute(request.getParameter("callback"));
    String errorCode = null;
    String errorMsg = null;

    if (errorCodeObj != null) {
        errorCode = errorCodeObj.toString();
    }
    if (SelfRegistrationStatusCodes.ERROR_CODE_INVALID_TENANT.equalsIgnoreCase(errorCode)) {
        errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "invalid.tenant.domain") + " - " + user.getTenantDomain();
    } else if (SelfRegistrationStatusCodes.ERROR_CODE_USER_ALREADY_EXISTS.equalsIgnoreCase(errorCode)) {
        errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Username")
            + " '" + username + "' " + IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "already.taken.username");
    } else if (SelfRegistrationStatusCodes.ERROR_CODE_SELF_REGISTRATION_DISABLED.equalsIgnoreCase(errorCode)) {
        errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "self.registration.disabled.for.tenant")
            + " - " + user.getTenantDomain();
    } else if (SelfRegistrationStatusCodes.CODE_USER_NAME_INVALID.equalsIgnoreCase(errorCode)) {
        if (request.getAttribute("errorMessage") != null) {
            errorMsg = (String) request.getAttribute("errorMessage");
        } else {
            errorMsg = user.getUsername() + " " + IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "invalid.user.name.pick.valid.username");
        }
    } else if (StringUtils.equalsIgnoreCase(SelfRegistrationStatusCodes.ERROR_CODE_INVALID_EMAIL_USERNAME,
            errorCode)) {
        errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "invalid.username.should.be.in.email.format");
    } else if (SelfRegistrationStatusCodes.ERROR_CODE_INVALID_USERSTORE.equalsIgnoreCase(errorCode)) {
        errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "invalid.userstore.domain") + " - " + user.getRealm();
    } else if (errorMsgObj != null) {
        errorMsg = errorMsgObj.toString();
    }

    ReCaptchaApi reCaptchaApi = new ReCaptchaApi();
        try {
            ReCaptchaProperties reCaptchaProperties = reCaptchaApi.getReCaptcha(tenantDomain, true, "ReCaptcha",
                "self-registration");
            if (reCaptchaProperties.getReCaptchaEnabled()) {
                Map<String, List<String>> headers = new HashMap<>();
                headers.put("reCaptcha", Arrays.asList(String.valueOf(true)));
                headers.put("reCaptchaAPI", Arrays.asList(reCaptchaProperties.getReCaptchaAPI()));
                headers.put("reCaptchaKey", Arrays.asList(reCaptchaProperties.getReCaptchaKey()));
                IdentityManagementEndpointUtil.addReCaptchaHeaders(request, headers);
            }
        } catch (ApiException e) {
            request.setAttribute("error", true);
            request.setAttribute("errorMsg", e.getMessage());
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<%
    boolean reCaptchaEnabled = false;
    if (request.getAttribute("reCaptcha") != null && "TRUE".equalsIgnoreCase((String) request.getAttribute("reCaptcha"))) {
        reCaptchaEnabled = true;
    } else if (request.getParameter("reCaptcha") != null && Boolean.parseBoolean(request.getParameter("reCaptcha"))) {
        reCaptchaEnabled = true;
    }
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
    <%
        if (reCaptchaEnabled) {
            String reCaptchaAPI = CaptchaUtil.reCaptchaAPIURL();
    %>
    <script src='<%=(reCaptchaAPI)%>'></script>
    <%
        }
    %>
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
                <h3 class="ui header">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Initiate.sign.up")%>
                </h3>

                <div class="ui negative message" id="error-msg" hidden="hidden"></div>
                <% if (error) { %>
                <div class="ui negative message" id="server-error-msg">
                    <%= IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg) %>
                </div>
                <% } %>
                <%-- validation --%>

                <div class="ui divider hidden"></div>
                <div class="segment-form">
                    <form class="ui large form" action="signup.do" method="post" id="register">

                        <div class="field">
                            <label for="username">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "Enter.your.username.here")%>
                            </label>
                            <input id="username" name="username" type="text" required
                                <% if(skipSignUpEnableCheck) {%> value="<%=Encode.forHtmlAttribute(username)%>" <%}%>>
                        </div>

                        <% if (isSaaSApp) { %>
                        <p class="ui tiny compact info message">
                            <i class="icon info circle"></i>
                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "If.you.specify.tenant.domain.you.registered.under.super.tenant")%>
                        </p>
                        <% } %>

                        <input id="callback" name="callback" type="hidden" value="<%=callback%>"
                               class="form-control" required>

                        <% Map<String, String[]> requestMap = request.getParameterMap();
                            for (Map.Entry<String, String[]> entry : requestMap.entrySet()) {
                                String key = Encode.forHtmlAttribute(entry.getKey());
                                String value = Encode.forHtmlAttribute(entry.getValue()[0]);
                                if (StringUtils.equalsIgnoreCase("reCaptcha", key)) {
                                    continue;
                                } %>
                        <div class="field">
                            <input id="<%= key%>" name="<%= key%>" type="hidden"
                                   value="<%=value%>" class="form-control">
                        </div>
                        <% } %>
                        <%
                            if (reCaptchaEnabled) {
                                String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
                        %>
                        <div class="field">
                            <div class="g-recaptcha"
                                data-size="invisible"
                                data-callback="onCompleted"
                                data-action="register"
                                data-sitekey="<%=Encode.forHtmlContent(reCaptchaKey)%>"
                            >
                            </div>
                        </div>
                        <%
                            }
                        %>
                        <div class="ui divider hidden"></div>

                        <div class="align-right buttons">
                            <a href="javascript:goBack()" class="ui button secondary">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Cancel")%>
                            </a>
                            <button id="registrationSubmit" class="ui primary button" type="submit">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                        "Proceed.to.self.register")%>
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

    <script>
        var $registerForm = $("#register");

        // Reloads the page if the page is loaded by going back in history.
        // Fixes issues with Firefox.
        window.addEventListener( "pageshow", function ( event ) {
            var historyTraversal = event.persisted ||
                                ( typeof window.performance != "undefined" &&
                                    window.performance.navigation.type === 2 );

            if ( historyTraversal ) {
                if($registerForm){
                    $registerForm.data("submitted", false);
                }
            }
        });

        function onCompleted() {
            $('#register').submit();
        }

        function goBack() {
            window.history.back();
        }

        // Handle form submission preventing double submission.
        $(document).ready(function(){
            $.fn.preventDoubleSubmission = function() {
                $(this).on("submit", function(e){
                    var $form = $(this);
                    $("#error-msg").hide();
                    $("#server-error-msg").hide();
                    $("#error-msg").text("");

                    if ($form.data("submitted") === true) {
                        // Previously submitted - don't submit again.
                        e.preventDefault();
                        console.warn("Prevented a possible double submit event");
                    } else {
                        e.preventDefault();
                        <%
                            if (reCaptchaEnabled) {
                        %>
                        if (!grecaptcha.getResponse()) {
                            grecaptcha.execute();
                            return;
                        }
                        <%
                            }
                        %>

                        var userName = document.getElementById("username");
                        var normalizedUsername = userName.value.trim();
                        userName.value = normalizedUsername;

                        if (normalizedUsername) {
                            if (!/^[^/].*[^@]$/g.test(normalizedUsername)) {
                                $("#error-msg").text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "username.pattern.violated")%>");
                                $("#error-msg").show();
                                $("#username").val("");
                                return;
                            }
                        }

                        // Mark it so that the next submit can be ignored.
                        $form.data("submitted", true);
                        document.getElementById("register").submit();
                    }
                });

                return this;
            };

            $registerForm.preventDoubleSubmission();
        });
    </script>

</body>
</html>
