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

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.ReCaptchaApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.ReCaptchaProperties" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.*" %>
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
    String username = request.getParameter("username");
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));

    if (StringUtils.isBlank(tenantDomain)) {
        tenantDomain = IdentityManagementEndpointConstants.SUPER_TENANT;
    }

    // The user could have already been resolved and sent here.
    // Trying to resolve tenant domain from user to handle saas scenario.
    if (isSaaSApp &&
            StringUtils.isNotBlank(username) &&
            !IdentityTenantUtil.isTenantQualifiedUrlsEnabled() &&
            StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)) {

        tenantDomain = IdentityManagementServiceUtil.getInstance().getUser(username).getTenantDomain();
    }

    ReCaptchaApi reCaptchaApi = new ReCaptchaApi();
    try {
        ReCaptchaProperties reCaptchaProperties = reCaptchaApi.getReCaptcha(tenantDomain, true, "ReCaptcha",
                "password-recovery");

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

    boolean isEmailNotificationEnabled = false;

    isEmailNotificationEnabled = Boolean.parseBoolean(application.getInitParameter(
            IdentityManagementEndpointConstants.ConfigConstants.ENABLE_EMAIL_NOTIFICATION));

    boolean reCaptchaEnabled = false;

    if (request.getAttribute("reCaptcha") != null &&
            "TRUE".equalsIgnoreCase((String) request.getAttribute("reCaptcha"))) {
        reCaptchaEnabled = true;
    }

    Boolean isQuestionBasedPasswordRecoveryEnabledByTenant;
    Boolean isNotificationBasedPasswordRecoveryEnabledByTenant;
    Boolean isMultiAttributeLoginEnabledInTenant;
    try {
        PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
        isQuestionBasedPasswordRecoveryEnabledByTenant = preferenceRetrievalClient.checkQuestionBasedPasswordRecovery(tenantDomain);
        isNotificationBasedPasswordRecoveryEnabledByTenant = preferenceRetrievalClient.checkNotificationBasedPasswordRecovery(tenantDomain);
        isMultiAttributeLoginEnabledInTenant = preferenceRetrievalClient.checkMultiAttributeLogin(tenantDomain);
    } catch (PreferenceRetrievalClientException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil
                        .i18n(recoveryResourceBundle, "something.went.wrong.contact.admin"));
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    String enterUsernameHereText = "Enter.your.username.here";
    if (isMultiAttributeLoginEnabledInTenant) {
        enterUsernameHereText = "Enter.your.user.identifier.here";
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
                <%-- page content --%>
                <h3 class="ui header">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Recover.password")%>
                </h3>
                <% if (error) { %>
                <div class="ui visible negative message" id="server-error-msg">
                    <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                </div>
                <% } %>
                <div class="ui negative message" id="error-msg" hidden="hidden"></div>

                <div class="ui divider hidden"></div>
                <div class="segment-form">
                    <form class="ui large form" method="post" action="verify.do" id="recoverDetailsForm">
                        <%
                            if (StringUtils.isNotEmpty(username) && !error) {
                        %>
                        <div class="field">
                            <label for="username">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, enterUsernameHereText)%>
                            </label>
                            <input id="username" name="username" value="<%=Encode.forHtmlAttribute(username)%>" type="text" tabindex="0" required>
                            <%
                                if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
                            %>
                            <input id="tenantDomain" name="tenantDomain" value="<%= tenantDomain %>" type="hidden">
                            <%
                                }
                            %>
                            <input id="isSaaSApp" name="isSaaSApp" value="<%= isSaaSApp %>" type="hidden">
                        </div>
                        <%
                        } else {
                        %>

                        <div class="field">
                            <label for="username">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, enterUsernameHereText)%>
                            </label>
                            <input id="username" name="username" type="text" tabindex="0" required>
                            <%
                                if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
                            %>
                            <input id="tenantDomain" name="tenantDomain" value="<%= tenantDomain %>" type="hidden">
                            <%
                                }
                            %>
                            <input id="isSaaSApp" name="isSaaSApp" value="<%= isSaaSApp %>" type="hidden">
                        </div>

                        <%
                            }
                        %>

                        <%
                            if (isEmailNotificationEnabled && isNotificationBasedPasswordRecoveryEnabledByTenant
                                                    && isQuestionBasedPasswordRecoveryEnabledByTenant ) {
                        %>
                        <div class="ui secondary segment" style="text-align: left;">
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="recoveryOption" value="EMAIL" checked/>
                                    <label><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Recover.with.mail")%>
                                    </label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="recoveryOption" value="SECURITY_QUESTIONS"/>
                                    <label><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Recover.with.question")%>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <% } else if (isNotificationBasedPasswordRecoveryEnabledByTenant){ %>
                        <div class="field">
                            <input type="hidden" name="recoveryOption" value="EMAIL"/>
                        </div>
                        <% } else { %>
                        <div class="field">
                            <input type="hidden" name="recoveryOption" value="SECURITY_QUESTIONS"/>
                        </div>
                        <% } %>

                        <%
                            String callback = request.getParameter("callback");
                            if (callback != null) {
                        %>
                        <div>
                            <input type="hidden" name="callback" value="<%=Encode.forHtmlAttribute(callback) %>"/>
                        </div>
                        <%
                            }
                        %>

                        <%
                            String sessionDataKey = request.getParameter("sessionDataKey");
                            if (sessionDataKey != null) {
                        %>
                        <div>
                            <input type="hidden" name="sessionDataKey"
                                   value="<%=Encode.forHtmlAttribute(sessionDataKey) %>"/>
                        </div>
                        <%
                            }
                        %>
                        <%
                            if (isSaaSApp && StringUtils.isNotBlank(userTenant)) {
                        %>
                        <div>
                            <input type="hidden" name="t"
                                   value="<%=Encode.forHtmlAttribute(userTenant) %>"/>
                        </div>
                        <%
                            }
                        %>

                        <%
                            if (reCaptchaEnabled) {
                                String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
                        %>
                        <div class="field">
                            <div class="g-recaptcha"
                                data-size="invisible"
                                data-callback="onCompleted"
                                data-action="passwordRecovery"
                                data-sitekey="<%=Encode.forHtmlContent(reCaptchaKey)%>"
                                data-tabindex="-1"
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
                            <button id="recoverySubmit"
                                    class="ui primary button"
                                    type="submit">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Submit")%>
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

        function onCompleted() {
            $("#recoverDetailsForm").submit();
        }

        $(document).ready(function () {

            $("#recoverDetailsForm").submit(function (e) {

                <%
                    if (reCaptchaEnabled) {
                %>
                if (!grecaptcha.getResponse()) {
                    e.preventDefault();
                    grecaptcha.execute();

                    return true;
                }
                <%
                    }
                %>

                // Prevent clicking multiple times, and notify the user something
                // is happening in the background.
                const submitButton = $("#recoverySubmit");
                submitButton.addClass("loading").attr("disabled", true);

                const errorMessage = $("#error-msg");
                errorMessage.hide();

                let userName = document.getElementById("username");
                userName.value = userName.value.trim();

                // Validate User Name
                const firstName = $("#username").val();

                if (firstName === "") {
                    errorMessage.text("Please fill the first name.");
                    errorMessage.show();
                    $("html, body").animate({scrollTop: errorMessage.offset().top}, "slow");
                    submitButton.removeClass("loading").attr("disabled", false);
                    return false;
                }

                return true;
            });
        });

        // Removing the recaptcha UI from the keyboard tab order
        Array.prototype.forEach.call(document.getElementsByClassName('g-recaptcha'), function (element) {
            //Add a load event listener to each wrapper, using capture.
            element.addEventListener('load', function (e) {
                //Get the data-tabindex attribute value from the wrapper.
                var tabindex = e.currentTarget.getAttribute('data-tabindex');
                //Check if the attribute is set.
                if (tabindex) {
                    //Set the tabIndex on the iframe.
                    e.target.tabIndex = "-1";
                }
            }, true);
        });

    </script>
</body>
</html>
