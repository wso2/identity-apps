<%--
  ~ Copyright (c) 2016-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="java.io.File" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.ReCaptchaApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.ReCaptchaProperties" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@ page import="org.wso2.carbon.utils.multitenancy.MultitenantUtils" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isEmailUsernameEnabled" %>

<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    // Add the password-recovery screen to the list to retrieve text branding customizations.
    screenNames.add("password-recovery");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%-- Username Label Resolver --%>
<jsp:directive.include file="includes/username-label-resolver.jsp"/>

<%
    final String SMSOTP = "SMSOTP";
    final String EMAIL = "EMAIL";
    final String SECURITY_QUESTIONS = "SECURITY_QUESTIONS";
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    boolean isTenantQualifiedUsername = Boolean.parseBoolean(request.getParameter("isTenantQualifiedUsername"));
    String username = StringUtils.isNotEmpty(request.getParameter("username"))
        ? Encode.forHtmlAttribute(request.getParameter("username"))
        : "";
    if (isTenantQualifiedUsername) {
        tenantDomain = MultitenantUtils.getTenantDomain(username);
        username = MultitenantUtils.getTenantAwareUsername(username);
    }
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));
    String selectedOption= EMAIL;
    if (SMSOTP.equalsIgnoreCase(request.getParameter("selectedOption"))) {
        selectedOption = SMSOTP;
    }
    String sp = request.getParameter("sp");
    String spId = request.getParameter("spId");

    String rawQueryString = request.getQueryString();
    String urlQuery = Encode.forHtmlAttribute(rawQueryString == null ? "" : rawQueryString);

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

    // Retrieve application access url to redirect user back to the application.
    String applicationAccessURLWithoutEncoding = null;

    try {
        ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
        applicationAccessURLWithoutEncoding = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain,
            Encode.forJava(sp));
        applicationAccessURLWithoutEncoding = IdentityManagementEndpointUtil.replaceUserTenantHintPlaceholder(
                                                                applicationAccessURLWithoutEncoding, userTenantDomain);
    } catch (ApplicationDataRetrievalClientException e) {
        // Ignored and fallback to login page url.
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
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
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

    Boolean isQuestionBasedPasswordRecoveryEnabledByTenant = false;
    Boolean isSMSRecoveryAvailable = false;
    Boolean isEmailLinkBasedPasswordRecoveryEnabledByTenant = false;
    Boolean isEmailOtpBasedPasswordRecoveryEnabledByTenant = false;
    Boolean isMultiAttributeLoginEnabledInTenant = false;
    String allowedAttributes = null;
    try {
        PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
        isQuestionBasedPasswordRecoveryEnabledByTenant =
            preferenceRetrievalClient.checkQuestionBasedPasswordRecovery(tenantDomain) &&
            Boolean.parseBoolean(IdentityUtil.getProperty("Connectors.ChallengeQuestions.Enabled"));
        isEmailLinkBasedPasswordRecoveryEnabledByTenant =
            preferenceRetrievalClient.checkEmailLinkBasedPasswordRecovery(tenantDomain);
        isEmailOtpBasedPasswordRecoveryEnabledByTenant = 
            preferenceRetrievalClient.checkEmailOTPBasedPasswordRecovery(tenantDomain);
        isSMSRecoveryAvailable = preferenceRetrievalClient.checkSMSOTPBasedPasswordRecovery(tenantDomain);
        isMultiAttributeLoginEnabledInTenant = preferenceRetrievalClient.checkMultiAttributeLogin(tenantDomain);
        allowedAttributes = preferenceRetrievalClient.checkMultiAttributeLoginProperty(tenantDomain);
    } catch (PreferenceRetrievalClientException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil
                        .i18n(recoveryResourceBundle, "something.went.wrong.contact.admin"));
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }
    Boolean isEmailRecoveryAvailable = isEmailNotificationEnabled && 
        (isEmailLinkBasedPasswordRecoveryEnabledByTenant || isEmailOtpBasedPasswordRecoveryEnabledByTenant);
    String emailUsernameEnable = application.getInitParameter("EnableEmailUserName");
    Boolean isEmailUsernameEnabled = false;
    Boolean isEmailAsUsernameEnabled = MultitenantUtils.isEmailUserName();
    boolean hideUsernameFieldWhenEmailAsUsernameIsEnabled = Boolean.parseBoolean(config.getServletContext().getInitParameter(
        "HideUsernameWhenEmailAsUsernameEnabled"));

    String usernameLabel = i18n(recoveryResourceBundle, customText, "Username");
    String usernamePlaceHolder = "Enter.your.username.here";

    if ((StringUtils.isNotBlank(emailUsernameEnable) && Boolean.parseBoolean(emailUsernameEnable)) 
            || (isEmailAsUsernameEnabled && hideUsernameFieldWhenEmailAsUsernameIsEnabled)) {
        usernameLabel = i18n(recoveryResourceBundle, customText, "email.username");
        usernamePlaceHolder = "enter.your.email";
    } else if (isMultiAttributeLoginEnabledInTenant) {
        if (allowedAttributes != null) {
            usernameLabel = getUsernameLabel(recoveryResourceBundle, allowedAttributes);
            usernamePlaceHolder = "Enter.your.identifier";
        }
    }
%>

<% request.setAttribute("pageName", "password-recovery"); %>

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
    <style type="text/css">
        .grecaptcha-badge {
            bottom: 55px !important;
        }
        @media only screen and (max-width: 767px) {
            .grecaptcha-badge {
                bottom: 100px !important;
            }
        }
    </style>
    <%
        }
    %>
</head>
<body class="login-portal layout recovery-layout" data-page="<%= request.getAttribute("pageName") %>">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>"
        data="<%= layoutData %>" >
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
                <%-- page content --%>
                <h3 class="ui header m-0" data-testid="password-recovery-page-header">
                    <%=i18n(recoveryResourceBundle, customText, "password.recovery.heading")%>
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
                        if (StringUtils.isNotBlank(sp)) {
                        %>
                            <input id="sp" name="sp" type="hidden" value="<%=Encode.forHtmlAttribute(sp)%>"/>
                        <%
                        }
                        %>
                        <%
                        if (StringUtils.isNotEmpty(username) && !error) {
                        %>
                        <div class="field mb-5">
                            <%=i18n(recoveryResourceBundle, customText, "password.recovery.body")%>
                        </div>
                        <div class="field">
                            <label for="username">
                                <%=usernameLabel %>
                            </label>
                            <div class="ui fluid left icon input">
                                <input
                                    placeholder="<%=AuthenticationEndpointUtil.i18n(
                                        recoveryResourceBundle, usernamePlaceHolder)%>"
                                    id="usernameUserInput"
                                    name="usernameUserInput"
                                    value="<%=Encode.forHtmlAttribute(username)%>"
                                    type="text"
                                    tabindex="0"
                                    required
                                >
                                <i aria-hidden="true" class="user fill icon"></i>
                            </div>
                            <input id="username" name="username" type="hidden">
                            <%
                                if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
                            %>
                            <input id="tenantDomain" name="tenantDomain"
                                value="<%= Encode.forHtmlAttribute(tenantDomain) %>" type="hidden">
                            <%
                                }
                            %>
                            <input id="isSaaSApp" name="isSaaSApp" value="<%= isSaaSApp %>" type="hidden">
                        </div>
                        <%
                        } else {
                        %>
                        <div class="field mb-5">
                            <%=i18n(recoveryResourceBundle, customText, "password.recovery.body")%>
                        </div>
                        <div class="field">
                            <label for="username">
                                <%=usernameLabel %>
                            </label>
                            <div class="ui fluid left icon input">
                                <% String identifierPlaceholder=i18n(recoveryResourceBundle, customText,
                                    "password.recovery.identifier.input.placeholder" , "" , false); %>
                                <% if (StringUtils.isNotBlank(identifierPlaceholder)) { %>
                                    <input placeholder="<%=identifierPlaceholder%>" id="usernameUserInput"
                                        name="usernameUserInput" type="text" tabindex="0" required>
                                <% } else { %>
                                    <input
                                        placeholder="<%=AuthenticationEndpointUtil.i18n(
                                            recoveryResourceBundle, usernamePlaceHolder)%>"
                                        id="usernameUserInput"
                                        name="usernameUserInput"
                                        type="text"
                                        tabindex="0"
                                        required
                                    >
                                <% } %>
                                <i aria-hidden="true" class="user fill icon"></i>
                            </div>
                            <input id="username" name="username" type="hidden">
                            <%
                                if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
                            %>
                            <input id="tenantDomain" name="tenantDomain"
                                value="<%= Encode.forHtmlAttribute(tenantDomain) %>" type="hidden">
                            <%
                                }
                            %>
                            <input id="isSaaSApp" name="isSaaSApp" value="<%= isSaaSApp %>" type="hidden">
                        </div>

                        <%
                            }
                        %>
                        <div class="ui list mb-5 field-validation-error-description" id="error-msg-invalid-email">
                                <i class="exclamation circle icon"></i>
                                <span id="error-message"><%=IdentityManagementEndpointUtil.i18n
                                    (recoveryResourceBundle,"Please.enter.valid.email")%>
                                </span>
                        </div>

                        <%
                            Boolean multipleRecoveryOptionsAvailable =
                                (isEmailRecoveryAvailable && isSMSRecoveryAvailable)
                                || (isEmailRecoveryAvailable && isQuestionBasedPasswordRecoveryEnabledByTenant)
                                || (isSMSRecoveryAvailable && isQuestionBasedPasswordRecoveryEnabledByTenant);
                            if (multipleRecoveryOptionsAvailable) {
                        %>
                        <div class="segment" style="text-align: left;"
                            data-testid="password-recovery-page-multi-option-radio">
                            <%
                                if (isEmailRecoveryAvailable) {
                                    String emailSendLabel = isEmailOtpBasedPasswordRecoveryEnabledByTenant
                                                                ? "send.email.otp" 
                                                                : "send.email.link";
                            %>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="recoveryOption" value="<%=EMAIL%>"
                                        <%=EMAIL.equals(selectedOption)?"checked":""%>/>
                                    <label><%=i18n(recoveryResourceBundle, customText, emailSendLabel)%>
                                    </label>
                                </div>
                            </div>
                            <%
                                }
                                if (isSMSRecoveryAvailable) {
                            %>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="recoveryOption" value="<%=SMSOTP%>"
                                        <%=SMSOTP.equals(selectedOption)?"checked":""%>/>
                                    <label><%=i18n(recoveryResourceBundle, customText, "send.code.via.sms")%>
                                </div>
                            </div>
                            <%
                                }
                                if (isQuestionBasedPasswordRecoveryEnabledByTenant) {
                            %>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="recoveryOption" value="<%=SECURITY_QUESTIONS%>"
                                        <%=SECURITY_QUESTIONS.equals(selectedOption)?"checked":""%>/>
                                    <label>
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                            "Recover.with.question")%>
                                    </label>
                                </div>
                            </div>
                            <%
                                }
                            %>
                        </div>
                        <% } else if (isEmailRecoveryAvailable){ %>
                            <input type="hidden" name="recoveryOption" value="<%=EMAIL%>"/>
                        <% } else if (isSMSRecoveryAvailable){ %>
                            <input type="hidden" name="recoveryOption" value="<%=SMSOTP%>"/>
                        <% } else { %>
                            <input type="hidden" name="recoveryOption" value="<%=SECURITY_QUESTIONS%>"/>
                        <% } %>

                        <input type="hidden" name="recoveryStage" value="INITIATE"/>
                        <input type="hidden" name="channel" value=""/>
                        <% if (StringUtils.isNotBlank(sp)) { %>
                            <input type="hidden" name="sp" value="<%=Encode.forHtmlAttribute(sp) %>"/>
                        <% } %>
                        <% if (StringUtils.isNotBlank(spId)) { %>
                            <input type="hidden" name="spId" value="<%=Encode.forHtmlAttribute(spId) %>"/>
                        <% } %>
                        <input type="hidden" name="urlQuery" value="<%=urlQuery %>"/>
                        <input type="hidden" name="isMultiRecoveryOptionsAvailable"
                            value="<%=multipleRecoveryOptionsAvailable %>"/>
                        <input type="hidden" name="isEmailOtpBasedPasswordRecoveryEnabledByTenant"
                            value="<%=isEmailOtpBasedPasswordRecoveryEnabledByTenant %>"/>

                        <%
                            String callback = request.getParameter("callback");
                            if (callback != null) {
                        %>
                            <input type="hidden" name="callback" value="<%=Encode.forHtmlAttribute(callback) %>"/>
                        <%
                            }
                        %>

                        <%
                            String sessionDataKey = request.getParameter("sessionDataKey");
                            if (sessionDataKey != null) {
                        %>
                            <input type="hidden" name="sessionDataKey"
                                value="<%=Encode.forHtmlAttribute(sessionDataKey) %>"/>
                        <%
                            }
                        %>

                        <%
                            if (isSaaSApp && StringUtils.isNotBlank(userTenant)) {
                        %>
                            <input type="hidden" name="t"
                                value="<%=Encode.forHtmlAttribute(userTenant) %>"/>
                        <%
                            }
                        %>

                        <%
                            if (StringUtils.isNotBlank(applicationAccessURLWithoutEncoding)) {
                        %>
                            <input type="hidden" name="accessUrl"
                                    value="<%=Encode.forHtmlAttribute(applicationAccessURLWithoutEncoding) %>"/>
                        <%
                            }
                        %>
                        <div class="mt-4">
                            <%
                                String submitButtoni18nText =
                                    multipleRecoveryOptionsAvailable ? "password.recovery.button.multi" :
                                    ( isEmailOtpBasedPasswordRecoveryEnabledByTenant ?
                                        "password.recovery.button.email.otp" :
                                    ( isEmailLinkBasedPasswordRecoveryEnabledByTenant ? 
                                        "password.recovery.button.email.link" :
                                    ( isQuestionBasedPasswordRecoveryEnabledByTenant ? "Recover.with.question" :
                                    ( isSMSRecoveryAvailable ? "password.recovery.button.smsotp" :
                                    "Submit"))));
                            %>
                            <button id="recoverySubmit"
                                    class="ui primary button large fluid"
                                    type="submit">
                                    <%=i18n(recoveryResourceBundle, customText, submitButtoni18nText)%>
                            </button>
                        </div>
                        <div class="mt-1 align-center">
                            <a href="javascript:goBack()" class="ui button secondary large fluid">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Cancel")%>
                            </a>
                        </div>
                        <%
                            if (reCaptchaEnabled) {
                                String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
                        %>
                        <div class="field">
                            <div class="g-recaptcha"
                                data-sitekey=
                                        "<%=Encode.forHtmlAttribute(reCaptchaKey)%>"
                                data-bind="recoverySubmit"
                                data-callback="submitFormReCaptcha"
                                data-theme="light"
                                data-tabindex="-1"
                            >
                            </div>
                        </div>
                        <%
                            }
                        %>
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

        function submitFormReCaptcha() {
            var subVal = submitForm();
            if (subVal) {
                document.getElementById("recoverDetailsForm").submit();
            }
        }

        function submitForm() {
            // Prevent clicking multiple times, and notify the user something
            // is happening in the background.
            const submitButton = $("#recoverySubmit");
            submitButton.addClass("loading").attr("disabled", true);

            if (!validateForm()) {
                submitButton.removeClass("loading").attr("disabled", false);

                return false;
            }

            return true;
        }

        function validateForm() {
            if (!validateUsername()) {

                return false;
            }

            // Validate reCaptcha
            <% if (reCaptchaEnabled) { %>
                const errorMessage = $("#error-msg");
                const reCaptchaResponse = $("[name='g-recaptcha-response']")[0].value;

                if (reCaptchaResponse.trim() === "") {
                    errorMessage.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Please.select.reCaptcha")%>");
                    errorMessage.show();
                    $("html, body").animate({scrollTop: errorMessage.offset().top}, "slow");

                    return false;
                }
            <% } %>

            return true;
        }

        function validateUsername() {
            const errorMessage = $("#error-msg-invalid-email");
            const invalidEmailErrorMsg = "<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Please.enter.valid.email")%>";
            const emptyUsernameErrorMsg = "<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Please.enter.your.username")%>";
            const emptyUserIdentifierMsg = "<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Please.enter.your.identifier")%>";
            let errorMsgContent = document.getElementById("error-message");

            let userName = document.getElementById("username");
            const usernameUserInput = document.getElementById("usernameUserInput");
            if (usernameUserInput) {
                userName.value = usernameUserInput.value.trim();
            }

            if ($("#username").val() === "") {
                errorMsgContent.innerHTML =
                    <%=isMultiAttributeLoginEnabledInTenant? "emptyUserIdentifierMsg" : "emptyUsernameErrorMsg"%>;
                errorMessage.show();
                submitBtnState( { disabled: true } );

                return false;
            }

            var emailRegex = /^(?=.{3,50}$)[\u00C0-\u00FFA-Za-z0-9_-]+(((\+(?!\.))|\.)[\u00C0-\u00FFA-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,10})$/;
            <%
            if (StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)) {
            %>
                emailRegex = /^(?=.{3,50}$)[\u00C0-\u00FFA-Za-z0-9_-]+(\.[\u00C0-\u00FFA-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,10})$/;
            <%
            }
            %>
            var userEmailAddress = $("#usernameUserInput").val();

            if (!userEmailAddress){
                errorMsgContent.innerHTML = invalidEmailErrorMsg;
                errorMessage.show();
                submitBtnState( { disabled: true } );

                return false;
            }

            errorMessage.hide();
            $("#recoverySubmit").attr("disabled", false);

            return true;
        }

        function submitBtnState(options) {
            const disabled = options.disabled;
            $("#recoverySubmit").attr("disabled", disabled);
        }

        $(document).ready(function () {

            const usernameInput = $("#usernameUserInput").val();
            if (!usernameInput || usernameInput.trim().length === 0) {
                submitBtnState( { disabled: true } );
            } else {
                submitBtnState( { disabled: false } );
            }

            $("#usernameUserInput").on("input", function(event) {
                validateUsername();
            });

            $("#recoverDetailsForm")
                .on("submit", submitForm)
                .keyup(validateUsername)
                .blur(validateUsername);
        });

        $(window).on("pageshow", function (event) {
            if (event.originalEvent.persisted) {
                // The page was restored from bfcache.
                $("#recoverySubmit").removeClass("loading");
                const usernameInput = $("#usernameUserInput").val();
                if (!usernameInput || usernameInput.trim().length === 0) {
                    submitBtnState( { disabled: true } );
                } else {
                    submitBtnState( { disabled: false } );
                }
            }
        });

        // Removing the recaptcha UI from the keyboard tab order
        Array.prototype.forEach.call(document.getElementsByClassName("g-recaptcha"), function (element) {
            //Add a load event listener to each wrapper, using capture.
            element.addEventListener("load", function (e) {
                //Get the data-tabindex attribute value from the wrapper.
                var tabindex = e.currentTarget.getAttribute("data-tabindex");
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
