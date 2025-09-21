<%--
  ~ Copyright (c) 2014-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.apache.commons.httpclient.HttpURL" %>
<%@ page import="org.apache.commons.httpclient.HttpsURL" %>
<%@ page import="org.apache.cxf.jaxrs.client.JAXRSClientFactory" %>
<%@ page import="org.apache.cxf.jaxrs.provider.json.JSONProvider" %>
<%@ page import="org.apache.cxf.jaxrs.client.WebClient" %>
<%@ page import="org.apache.http.HttpStatus" %>
<%@ page import="org.json.JSONException" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.client.SelfUserRegistrationResource" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.bean.ResendCodeRequestDTO" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.bean.PropertyDTO" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.bean.UserDTO" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="javax.ws.rs.core.Response" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isSelfSignUpEPAvailable" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isRecoveryEPAvailable" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isEmailUsernameEnabled" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL" %>
<%@ page import="org.apache.commons.codec.binary.Base64" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.apache.commons.logging.Log" %>
<%@ page import="org.apache.commons.logging.LogFactory" %>
<%@ page import="java.nio.charset.Charset" %>
<%@ page import="org.wso2.carbon.base.ServerConfiguration" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.EndpointConfigManager" %>
<%@ page import="org.wso2.carbon.identity.core.URLBuilderException" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.AdminAdvisoryDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.AdminAdvisoryDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.user.core.util.UserCoreUtil" %>
<%@ page import="java.io.UnsupportedEncodingException" %>

<jsp:directive.include file="includes/init-loginform-action-url.jsp"/>
<jsp:directive.include file="plugins/basicauth-extensions.jsp"/>

<script>
    function goBack() {
        document.getElementById("restartFlowForm").submit();
    }

    // Handle form submission preventing double submission.
    $(document).ready(function(){
        var usernameInput = $("#usernameUserInput");
        var passwordInput = $("#password");

        // Hides invalid form error message on user input.
        if (usernameInput) {
            usernameInput.on("input", function (e) {
                hideUsernameInvalidMessage();
            });
        }

        // Hides invalid form error message on user input.
        if (passwordInput) {
            passwordInput.on("input", function (e) {
                hidePasswordInvalidMessage();
            });
        }

        $.fn.preventDoubleSubmission = function() {
            $(this).on('submit',function(e){
                var $form = $(this);
                if ($form.data('submitted') === true) {
                    // Previously submitted - don't submit again.
                    e.preventDefault();
                    console.warn("Prevented a possible double submit event");
                } else {
                    e.preventDefault();

                    var userName = document.getElementById("username");
                    var usernameUserInput = document.getElementById("usernameUserInput");
                    var password = document.getElementById("password");
                    var validInput = true;

                    if (usernameUserInput) {
                        var sanitizedUsername = usernameUserInput.value.trim();
                        // Show error message when username is empty.
                        if (sanitizedUsername.length <= 0) {
                            showUsernameInvalidMessage();
                            validInput = false;
                        }

                        userName.value = sanitizedUsername;
                    }

                    if (password) {
                        var sanitizedPassword = password.value.trim();
                        // Show error message when password is empty.
                        if (sanitizedPassword.length <= 0) {
                            showPasswordInvalidMessage();
                            validInput = false;
                        }
                    }

                    // Prevents the form submission if the inputs are invalid.
                    if (!validInput) {
                        return false;
                    }

                    if (userName.value) {
                        $.ajax({
                            type: "GET",
                            url: "<%= Encode.forJavaScriptBlock(loginContextRequestUrl)%>",
                            xhrFields: { withCredentials: true },
                            success: function (data) {
                                if (data && data.status == 'redirect' && data.redirectUrl && data.redirectUrl.length > 0) {
                                    window.location.href = data.redirectUrl;
                                } else if ($form.data('submitted') !== true) {
                                    $form.data('submitted', true);
                                    document.getElementById("loginForm").submit();
                                } else {
                                    console.warn("Prevented a possible double submit event.");
                                }
                            },
                            cache: false
                        });
                    }
                }
            });

            return this;
        };
        $('#loginForm').preventDoubleSubmission();
        $("button").removeClass("loading");
    });

    // Function to show error message when username is empty.
    function showUsernameInvalidMessage() {
        var usernameError = $("#usernameError");
        usernameError.show();
    }

    // Function to show error message when password is empty.
    function showPasswordInvalidMessage() {
        var passwordError = $("#passwordError");
        passwordError.show();
    }

    // Function to hide error message when username is empty.
    function hideUsernameInvalidMessage() {
        var usernameError = $("#usernameError");
        usernameError.hide();
    }

    // Function to hide error message when password is empty.
    function hidePasswordInvalidMessage() {
        var passwordError = $("#passwordError");
        passwordError.hide();
    }

    function showResendReCaptcha() {
        <% 
            String failedUsername = request.getParameter("failedUsername");
            boolean isEmailVerification = IdentityCoreConstants.USER_EMAIL_NOT_VERIFIED_ERROR_CODE.equals(errorCode);
            boolean isEmailOTPVerification = IdentityCoreConstants.USER_EMAIL_OTP_NOT_VERIFIED_ERROR_CODE.equals(errorCode);
        %>
        <% if (StringUtils.isNotBlank(failedUsername)) { %>
            window.location.href = "login.do?resend_username=<%=Encode.forHtml(URLEncoder.encode(failedUsername, UTF_8))%>"
            <% if (isEmailVerification) { %>
            + "&isEmailVerification=true"
            <% } %>
            <% if (isEmailOTPVerification) { %>
            + "&isEmailOTPVerification=true"
            <% } %>
            + "&<%=AuthenticationEndpointUtil.cleanErrorMessages(Encode.forJava(request.getQueryString()))%>";
        <% } %>
    }

    function submitForm() {

        var userName = document.getElementById("username");
        var usernameUserInput = document.getElementById("usernameUserInput");
        var password = document.getElementById("password");
        var validInput = true;

        if (usernameUserInput) {
            var sanitizedUsername = usernameUserInput.value.trim();
            // Show error message when username is empty.
            if (sanitizedUsername.length <= 0) {
                showUsernameInvalidMessage();
                validInput = false;
            }

            userName.value = sanitizedUsername;
        }

        if (password) {
            var sanitizedPassword = password.value.trim();
            // Show error message when password is empty.
            if (sanitizedPassword.length <= 0) {
                showPasswordInvalidMessage();
                validInput = false;
            }
        }

        // Do the form submission if the inputs are valid.
        if (validInput) {
            document.getElementById("loginForm").submit();
        } else {
            // Reset the recaptcha to allow another submission.
            var reCaptchaType = "<%= CaptchaUtil.getReCaptchaType()%>"
            if ("recaptcha-enterprise" == reCaptchaType) {
                grecaptcha.enterprise.reset();
            } else {
                grecaptcha.reset();
            }
        }
    }
</script>

<%!
    private static final String JAVAX_SERVLET_FORWARD_REQUEST_URI = "javax.servlet.forward.request_uri";
    private static final String JAVAX_SERVLET_FORWARD_QUERY_STRING = "javax.servlet.forward.query_string";
    private static final String UTF_8 = "UTF-8";
    private static final String TENANT_DOMAIN = "tenant-domain";
    private static final String ACCOUNT_RECOVERY_ENDPOINT = "/accountrecoveryendpoint";
    private static final String ACCOUNT_RECOVERY_ENDPOINT_RECOVER = "/recoveraccountrouter.do";
    private static final String ACCOUNT_RECOVERY_ENDPOINT_REGISTER = "/register.do";
    private static final String AUTHENTICATION_ENDPOINT_LOGIN = "/authenticationendpoint/login.do";
    private static final String CONSOLE = "Console";
    private Log log = LogFactory.getLog(this.getClass());
%>

<%
    String serviceProviderAppId = request.getParameter("spId");
    String rawSdk = request.getParameter("sessionDataKey");
    String sdkSafe = "";
    if (rawSdk != null && rawSdk.matches("^[a-zA-Z0-9\\-_\\.]+$")) {
        sdkSafe = org.owasp.encoder.Encode.forJavaScript(rawSdk);
    }
%>

<%
    Boolean isAdminBannerAllowedInSP = CONSOLE.equals(Encode.forJava(request.getParameter("sp")));
    Boolean isAdminAdvisoryBannerEnabledInTenant = false;
    String adminAdvisoryBannerContentOfTenant = "";

    try {
        if (isAdminBannerAllowedInSP) {
            AdminAdvisoryDataRetrievalClient adminBannerPreferenceRetrievalClient =
                new AdminAdvisoryDataRetrievalClient();
            JSONObject adminAdvisoryBannerConfig = adminBannerPreferenceRetrievalClient
                .getAdminAdvisoryBannerData(tenantDomain);
            isAdminAdvisoryBannerEnabledInTenant = adminAdvisoryBannerConfig.getBoolean("enableBanner");
            adminAdvisoryBannerContentOfTenant = adminAdvisoryBannerConfig.getString("bannerContent");
        }
    } catch (JSONException | AdminAdvisoryDataRetrievalClientException e) {
        log.error("Error in displaying admin advisory banner", e);
    }

    String emailUsernameEnable = application.getInitParameter("EnableEmailUserName");
    Boolean isEmailUsernameEnabled = false;
    String usernameLabel = "username";
    String usernamePlaceHolder = "enter.your.username";

    Boolean isMultiAttributeLoginEnabledInTenant;
    String allowedAttributes;

    if (StringUtils.isNotBlank(emailUsernameEnable)) {
        isEmailUsernameEnabled = Boolean.valueOf(emailUsernameEnable);
    } else {
        isEmailUsernameEnabled = isEmailUsernameEnabled();
    }

    if (Boolean.parseBoolean(application.getInitParameter("IsHostedExternally"))) {
        isMultiAttributeLoginEnabledInTenant = false;
        allowedAttributes = "";
    } else {
        try {
            PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
            isMultiAttributeLoginEnabledInTenant = preferenceRetrievalClient.checkMultiAttributeLogin(tenantForTheming);
            allowedAttributes = preferenceRetrievalClient.checkMultiAttributeLoginProperty(tenantForTheming);
        } catch (PreferenceRetrievalClientException e) {
            request.setAttribute("error", true);
            request.setAttribute("errorMsg", AuthenticationEndpointUtil
                    .i18n(resourceBundle, "something.went.wrong.contact.admin"));
            IdentityManagementEndpointUtil.addErrorInformation(request, e);
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }
    }

    if (isEmailUsernameEnabled == true) {
        usernameLabel = "email.username";
    }

    if (isMultiAttributeLoginEnabledInTenant) {
        if (allowedAttributes != null) {
            usernameLabel = getUsernameLabel(resourceBundle, allowedAttributes);
            usernamePlaceHolder = "enter.your.identifier";
        }
    }

    String resendUsername = request.getParameter("resend_username");
    String spProp = "sp";
    String spIdProp = "spId";
    String sp = Encode.forJava(request.getParameter("sp"));
    String spId = "";
    String recoveryScenarioProp = "RecoveryScenario";
    String emailVerificationScenario = "EMAIL_VERIFICATION";
    String emailOTPVerificationScenario = "EMAIL_VERIFICATION_OTP";
    
    try {
        if (sp.equals("My Account")) {
            spId = "My_Account";
        } else {
            ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
            spId = applicationDataRetrievalClient.getApplicationID(tenantDomain,sp);
        }
    } catch (Exception e) {
        // Ignored and send the default value.
    }

    if (StringUtils.isNotBlank(resendUsername)) {

        ResendCodeRequestDTO selfRegistrationRequest = new ResendCodeRequestDTO();
        UserDTO userDTO = AuthenticationEndpointUtil.getUser(resendUsername);
        userDTO.setTenantDomain(tenantForTheming);
        userDTO.setUsername(UserCoreUtil.removeDomainFromName(resendUsername));
        selfRegistrationRequest.setUser(userDTO);

        List<PropertyDTO> properties = new ArrayList<PropertyDTO>();
        PropertyDTO appProperty = new PropertyDTO();
        appProperty.setKey(spProp);
        appProperty.setValue(sp);
        properties.add(appProperty);

        PropertyDTO spProperty = new PropertyDTO();
        spProperty.setKey(spIdProp);
        spProperty.setValue(spId);
        properties.add(spProperty);

        if (request.getParameter("isEmailVerification") != null
            && Boolean.parseBoolean(request.getParameter("isEmailVerification"))) {
            PropertyDTO recoveryScenarioProperty = new PropertyDTO();
            recoveryScenarioProperty.setKey(recoveryScenarioProp);
            recoveryScenarioProperty.setValue(emailVerificationScenario);
            properties.add(recoveryScenarioProperty);
        } else if (request.getParameter("isEmailOTPVerification") != null
            && Boolean.parseBoolean(request.getParameter("isEmailOTPVerification"))) {
            PropertyDTO recoveryScenarioProperty = new PropertyDTO();
            recoveryScenarioProperty.setKey(recoveryScenarioProp);
            recoveryScenarioProperty.setValue(emailOTPVerificationScenario);
            properties.add(recoveryScenarioProperty);
        }

        selfRegistrationRequest.setProperties(properties);

        String path = config.getServletContext().getInitParameter(Constants.ACCOUNT_RECOVERY_REST_ENDPOINT_URL);
        String proxyContextPath = ServerConfiguration.getInstance().getFirstProperty(IdentityCoreConstants
                .PROXY_CONTEXT_PATH);
        if (proxyContextPath == null) {
            proxyContextPath = "";
        }
        String url;
        if (StringUtils.isNotBlank(EndpointConfigManager.getServerOrigin())) {
            url = IdentityManagementEndpointUtil.getBasePath(tenantDomain, path, false);
        } else {
            url = IdentityUtil.getServerURL(path, true, false);
        }
        url = url.replace(TENANT_DOMAIN, userDTO.getTenantDomain());
        List<JSONProvider> providers = new ArrayList<JSONProvider>();
        JSONProvider jsonProvider = new JSONProvider();
        jsonProvider.setDropRootElement(true);
        jsonProvider.setIgnoreNamespaces(true);
        jsonProvider.setValidateOutput(true);
        jsonProvider.setSupportUnwrapped(true);
        providers.add(jsonProvider);

        String toEncode = EndpointConfigManager.getAppName() + ":" + String
                .valueOf(EndpointConfigManager.getAppPassword());
        byte[] encoding = Base64.encodeBase64(toEncode.getBytes());
        String authHeader = new String(encoding, Charset.defaultCharset());
        String header = "Client " + authHeader;

        SelfUserRegistrationResource selfUserRegistrationResource = JAXRSClientFactory
                .create(url, SelfUserRegistrationResource.class, providers);
        String reCaptchaResponse = request.getParameter("g-recaptcha-response");
        WebClient.client(selfUserRegistrationResource).header("g-recaptcha-response", reCaptchaResponse);
        WebClient.client(selfUserRegistrationResource).header("Authorization", header);
        Response selfRegistrationResponse = selfUserRegistrationResource.regenerateCode(selfRegistrationRequest);
        if (selfRegistrationResponse != null &&  selfRegistrationResponse.getStatus() == HttpStatus.SC_CREATED) {
%>
<div class="ui visible positive message">
    <%=AuthenticationEndpointUtil.i18n(resourceBundle,Constants.ACCOUNT_RESEND_SUCCESS_RESOURCE)%>
</div>
<%
} else {
%>
<div class="ui visible negative message">
    <%=AuthenticationEndpointUtil.i18n(resourceBundle,Constants.ACCOUNT_RESEND_FAIL_RESOURCE)%>
</div>
<%
        }
    }
%>

<% if (StringUtils.equals(request.getParameter("errorCode"), IdentityCoreConstants.USER_ACCOUNT_LOCKED_ERROR_CODE) &&
    StringUtils.equals(request.getParameter("remainingAttempts"), "0")) {
    if (StringUtils.equals(request.getParameter("lockedReason"), "AdminInitiated")) { %>
        <div class="ui visible negative message" lockedReasonid="error-msg" data-testid="login-page-error-message">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked.admin.initiated")%>
        </div>
    <% } else { %>
        <div class="ui visible negative message" lockedReasonid="error-msg" data-testid="login-page-error-message">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked.incorrect.login.attempts")%>
        </div>
    <% }
} else if (Boolean.parseBoolean(loginFailed) &&
        !errorCode.equals(IdentityCoreConstants.USER_ACCOUNT_NOT_CONFIRMED_ERROR_CODE) && !errorCode.equals(IdentityCoreConstants.USER_EMAIL_NOT_VERIFIED_ERROR_CODE)
            && !errorCode.equals(IdentityCoreConstants.USER_EMAIL_OTP_NOT_VERIFIED_ERROR_CODE)) {
    if (StringUtils.equals(request.getParameter("errorCode"),
            IdentityCoreConstants.ADMIN_FORCED_USER_PASSWORD_RESET_VIA_EMAIL_LINK_ERROR_CODE) &&
            StringUtils.equals(request.getParameter("t"), "carbon.super") &&
            StringUtils.isNotBlank(supportEmail)) { %>
<div class="ui visible negative message" id="error-msg" data-testid="login-page-error-message">
    <%= AuthenticationEndpointUtil.i18n(resourceBundle, "password.reset.pending.super.tenant").replace("{supportEmail}",supportEmail) %>
</div>
<% } else { %>
<div class="ui visible negative message" id="error-msg" data-testid="login-page-error-message">
    <%= AuthenticationEndpointUtil.i18n(resourceBundle, Encode.forJava(errorMessage)) %>
</div>
<% }
} else if ((Boolean.TRUE.toString()).equals(request.getParameter("authz_failure"))){%>
<div class="ui visible negative message" id="error-msg" data-testid="login-page-error-message">
    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unauthorized.to.login")%>
</div>
<% } else { %>
    <div class="ui visible negative message" style="display: none;" id="error-msg" data-testid="login-page-error-message"></div>
<% } %>

<% if (Boolean.parseBoolean(loginFailed) && errorCode.equals(IdentityCoreConstants.USER_ACCOUNT_NOT_CONFIRMED_ERROR_CODE) && request.getParameter("resend_username") == null) { %>
    <div class="ui visible warning message" id="error-msg" data-testid="login-page-error-message">

        <h5 class="ui heading"><strong><%= AuthenticationEndpointUtil.i18n(resourceBundle, "no.confirmation.mail.heading") %></strong></h5>

        <%= AuthenticationEndpointUtil.i18n(resourceBundle, Encode.forJava(errorMessage)) %>

        <div class="ui divider hidden"></div>

        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "no.confirmation.mail")%>

        <a id="registerLink"
            href="javascript:showResendReCaptcha();"
            data-testid="login-page-resend-confirmation-email-link"
        >
            <%=StringEscapeUtils.escapeHtml4(AuthenticationEndpointUtil.i18n(resourceBundle, "resend.mail"))%>
        </a>
    </div>
    <div class="ui divider hidden"></div>
    <%
        if (reCaptchaResendEnabled) {
            String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
    %>
        <div class="field">
            <div class="g-recaptcha"
                data-sitekey="<%=Encode.forHtmlAttribute(reCaptchaKey)%>"
                data-testid="register-page-g-recaptcha"
                data-bind="registerLink"
                data-callback="showResendReCaptcha"
                data-theme="light"
                data-tabindex="-1"
            >
            </div>
        </div>
    <%
        }
    %>
<% } else if (Boolean.parseBoolean(loginFailed) && errorCode.equals(IdentityCoreConstants.USER_EMAIL_NOT_VERIFIED_ERROR_CODE) && request.getParameter("resend_username") == null) { %>
    <div class="ui visible warning message" id="error-msg" data-testid="login-page-error-message">

        <h5 class="ui heading"><strong><%= AuthenticationEndpointUtil.i18n(resourceBundle, "no.email.confirmation.mail.heading") %></strong></h5>

        <%= AuthenticationEndpointUtil.i18n(resourceBundle, Encode.forJava(errorMessage)) %>

        <div class="ui divider hidden"></div>

        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "generic.no.confirmation.mail")%>

        <a id="registerLink"
            href="javascript:showResendReCaptcha();"
            data-testid="login-page-resend-confirmation-email-link"
        >
            <%=StringEscapeUtils.escapeHtml4(AuthenticationEndpointUtil.i18n(resourceBundle, "resend.mail"))%>
        </a>
    </div>
    <div class="ui divider hidden"></div>
    <%
        if (reCaptchaResendEnabled) {
            String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
    %>
        <div class="field">
            <div class="g-recaptcha"
                data-sitekey="<%=Encode.forHtmlAttribute(reCaptchaKey)%>"
                data-testid="register-page-g-recaptcha"
                data-bind="registerLink"
                data-callback="showResendReCaptcha"
                data-theme="light"
                data-tabindex="-1"
            >
            </div>
        </div>
    <%
        }
    %>
<% } else if (Boolean.parseBoolean(loginFailed) && errorCode.equals(IdentityCoreConstants.USER_EMAIL_OTP_NOT_VERIFIED_ERROR_CODE) && request.getParameter("resend_username") == null) { %>
    <div class="ui visible warning message" id="error-msg" data-testid="login-page-error-message">
        
        <h5 class="ui heading"><strong><%= AuthenticationEndpointUtil.i18n(resourceBundle, "no.email.confirmation.mail.heading") %></strong></h5>
        
        <%= AuthenticationEndpointUtil.i18n(resourceBundle, Encode.forJava(errorMessage)) %>
        
        <div class="ui divider hidden"></div>
        
        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "generic.no.confirmation.mail.otp")%>
        
        <a id="registerLink"
            href="javascript:showResendReCaptcha();"
            data-testid="login-page-resend-confirmation-email-link"
        >
            <%=StringEscapeUtils.escapeHtml4(AuthenticationEndpointUtil.i18n(resourceBundle, "resend.mail"))%>
        </a>
    </div>
    <div class="ui divider hidden"></div>
    <%
        if (reCaptchaResendEnabled) {
            String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
    %>
        <div class="field">
            <div class="g-recaptcha"
                data-sitekey="<%=Encode.forHtmlAttribute(reCaptchaKey)%>"
                data-testid="register-page-g-recaptcha"
                data-bind="registerLink"
                data-callback="showResendReCaptcha"
                data-theme="light"
                data-tabindex="-1"
            >
            </div>
        </div>
    <%
        }
    %>
<%
    }
%>
<% if (isAdminAdvisoryBannerEnabledInTenant) { %>
    <div class="ui warning message" data-componentid="login-page-admin-session-advisory-banner">
        <%=Encode.forHtmlContent(adminAdvisoryBannerContentOfTenant)%>
    </div>
<% } %>

<form class="ui large form" action="<%= Encode.forHtmlAttribute(loginFormActionURL) %>" method="post" id="loginForm">
    <%
        if (loginFormActionURL.equals(samlssoURL) || loginFormActionURL.equals(oauth2AuthorizeURL)) {
    %>
    <input id="tocommonauth" name="tocommonauth" type="hidden" value="true">
    <%
        }
    %>

    <% if(Boolean.parseBoolean(request.getParameter("passwordReset"))) {
    %>
        <div class="ui visible positive message" data-testid="password-reset-success-message">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "Updated.the.password.successfully")%>
        </div>
   <% } %>
    <% if (!isIdentifierFirstLogin(inputType) && !isLoginHintAvailable(inputType)) { %>
            <div class="field m-0">
                <% String loginInputLabel=i18n(resourceBundle, customText, "login.identifier.input.label" , "", false); %>
                    <% if (StringUtils.isNotBlank(loginInputLabel)) { %>
                        <label>
                            <%= loginInputLabel %>
                        </label>
                        <% } else if (isMultiAttributeLoginEnabledInTenant) { %>
                            <label>
                                <%= usernameLabel %>
                            </label>
                            <% } else { %>
                                <label>
                                    <%= AuthenticationEndpointUtil.i18n(resourceBundle, usernameLabel) %>
                                </label>
                                <% } %>
                <div class="ui fluid left icon input">
                <input
                    type="text"
                    id="usernameUserInput"
                    value=""
                    name="usernameUserInput"
                    placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, usernamePlaceHolder)%>"
                    data-testid="login-page-username-input"
                    aria-required="true"
                >
                <i aria-hidden="true" class="user fill icon"></i>
                <input id="username" name="username" type="hidden" value="<%=Encode.forHtmlAttribute(username)%>">
            </div>
        </div>
        <div class="mt-1" id="usernameError" style="display: none;">
            <i class="red exclamation circle fitted icon"></i>
            <span class="validation-error-message" id="usernameErrorText">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "username.cannot.be.empty")%>
            </span>
        </div>
    <% } else { %>
        <input id="username" name="username" type="hidden" data-testid="login-page-username-input" value="<%=Encode.forHtmlAttribute(username)%>">
    <% } %>
        <div class="field mt-3 mb-0">
            <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "password")%></label>
            <div class="ui fluid left icon input addon-wrapper">
                <input
                    type="password"
                    id="password"
                    name="password"
                    value=""
                    autocomplete="off"
                    placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.your.password")%>"
                    data-testid="login-page-password-input"
                    aria-required="true"
                >
                <i aria-hidden="true" class="lock icon"></i>
                <i id="password-eye" class="eye icon right-align password-toggle slash" onclick="showPassword()"></i>
            </div>
        </div>
        <div class="mt-1" id="passwordError" style="display: none;">
            <i class="red exclamation circle fitted icon"></i>
            <span class="validation-error-message" id="passwordErrorText">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "password.cannot.be.empty")%>
            </span>
        </div>

    <%
        String recoveryEPAvailable = application.getInitParameter("EnableRecoveryEndpoint");
        String enableSelfSignUpEndpoint = application.getInitParameter("EnableSelfSignUpEndpoint");
        Boolean isRecoveryEPAvailable = false;
        Boolean isSelfSignUpEPAvailable = false;
        String identityMgtEndpointContext = "";
        String accountRegistrationEndpointURL = "";
        String urlEncodedURL = "";
        String urlParameters = "";

        if (StringUtils.isNotBlank(recoveryEPAvailable)) {
            isRecoveryEPAvailable = Boolean.valueOf(recoveryEPAvailable);
        } else {
            isRecoveryEPAvailable = isRecoveryEPAvailable();
        }

        if (StringUtils.isNotBlank(enableSelfSignUpEndpoint)) {
            isSelfSignUpEPAvailable = Boolean.valueOf(enableSelfSignUpEndpoint);
        } else {
            isSelfSignUpEPAvailable = isSelfSignUpEPAvailable();
        }

        if (isRecoveryEPAvailable || isSelfSignUpEPAvailable) {
            String urlWithoutEncoding = null;
            try {
                ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
                urlWithoutEncoding = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain, sp);
            } catch (ApplicationDataRetrievalClientException e) {
                //ignored and fallback to login page url
            }

            if (StringUtils.isBlank(urlWithoutEncoding)) {
                String scheme = request.getScheme();
                String serverName = request.getServerName();
                int serverPort = request.getServerPort();
                String uri = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_REQUEST_URI);
                String paramStr = URLDecoder.decode(((String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING)), UTF_8);
                if ((scheme == "http" && serverPort == HttpURL.DEFAULT_PORT) || (scheme == "https" && serverPort == HttpsURL.DEFAULT_PORT)) {
                    urlWithoutEncoding = scheme + "://" + serverName + uri + "?" + paramStr;
                } else {
                    urlWithoutEncoding = scheme + "://" + serverName + ":" + serverPort + uri + "?" + paramStr;
                }
            }
            urlWithoutEncoding = IdentityManagementEndpointUtil.replaceUserTenantHintPlaceholder(
                    urlWithoutEncoding, userTenantDomain);

            urlEncodedURL = URLEncoder.encode(urlWithoutEncoding, UTF_8);
            urlParameters = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING);

            identityMgtEndpointContext = application.getInitParameter("IdentityManagementEndpointContextURL");
            if (StringUtils.isBlank(identityMgtEndpointContext)) {
                try {
                    identityMgtEndpointContext = ServiceURLBuilder.create().addPath(ACCOUNT_RECOVERY_ENDPOINT).build()
                            .getAbsolutePublicURL();
                } catch (URLBuilderException e) {
                    request.setAttribute(STATUS, AuthenticationEndpointUtil.i18n(resourceBundle, CONFIGURATION_ERROR));
                    request.setAttribute(STATUS_MSG, AuthenticationEndpointUtil
                            .i18n(resourceBundle, ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL));
                    request.getRequestDispatcher("error.do").forward(request, response);
                    return;
                }
            }

            accountRegistrationEndpointURL = application.getInitParameter("AccountRegisterEndpointURL");
            if (StringUtils.isBlank(accountRegistrationEndpointURL)
                    || !(StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT))) {
                accountRegistrationEndpointURL = identityMgtEndpointContext + ACCOUNT_RECOVERY_ENDPOINT_REGISTER;
            }

            // For self sign-up build the normal callback URL.
            String srURI;

            if (Boolean.parseBoolean(application.getInitParameter("IsHostedExternally"))) {
                srURI = application.getInitParameter("IdentityManagementEndpointLoginURL");
            } else {
                srURI = ServiceURLBuilder.create().addPath(AUTHENTICATION_ENDPOINT_LOGIN).build().getAbsolutePublicURL();
            }
            String srprmstr = URLDecoder.decode(((String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING)), UTF_8);
            String srURLWithoutEncoding = srURI + "?" + srprmstr;
            srURLEncodedURL= URLEncoder.encode(srURLWithoutEncoding, UTF_8);

        }
    %>

    <div class="buttons mt-2">
        <% if (isRecoveryEPAvailable && (isUsernameRecoveryEnabledInTenant || isPasswordRecoveryEnabledInTenant || dynamicPortalPWEnabled)) { %>
        <div class="field external-link-container text-small">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "forgot.username.password")%>
            <% if (!isIdentifierFirstLogin(inputType) && !isLoginHintAvailable(inputType) && isUsernameRecoveryEnabledInTenant) { %>
            <a
                id="usernameRecoverLink"
                href="<%=StringEscapeUtils.escapeHtml4(getRecoverAccountUrl(identityMgtEndpointContext, urlEncodedURL, true, urlParameters))%>"
                data-testid="login-page-username-recovery-button"
            >
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "forgot.username")%>
            </a>
        <% } %>

        <% if (!isIdentifierFirstLogin(inputType) && !isLoginHintAvailable(inputType)
               && isUsernameRecoveryEnabledInTenant
               && (isPasswordRecoveryEnabledInTenant || dynamicPortalPWEnabled)) { %>
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "forgot.username.password.or")%>
        <% } %>

        <% if ((isPasswordRecoveryEnabledInTenant && isPasswordRecoveryEnabledInTenantPreferences) || dynamicPortalPWEnabled) { %>
            <a
                id="passwordRecoverLink"
                  <% if(StringUtils.isNotBlank(passwordRecoveryOverrideURL)) { %>
                  href="<%=StringEscapeUtils.escapeHtml4(passwordRecoveryOverrideURL)%>"
                  <% } else if(dynamicPortalPWEnabled) { %>
                  href="<%= StringEscapeUtils.escapeHtml4(getDynamicPasswordRecoveryUrl(serviceProviderAppId)) %>"
                  <% } else { %>
                  href="<%=StringEscapeUtils.escapeHtml4(getRecoverAccountUrlWithUsername(identityMgtEndpointContext, urlEncodedURL, false, urlParameters, usernameIdentifier))%>"
                  <% } %>
                data-testid="login-page-password-recovery-button"
                <% if (StringUtils.equals("true", promptAccountLinking)) { %>
                    target="_blank" rel="noopener noreferrer"
                <% } %>
                  <% if (dynamicPortalPWEnabled) { %>
                      onclick="handleDynamicPortalRedirection()"
                  <% } %>
            >
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "forgot.password")%>
            </a>
            <% } %>
            <%= resourceBundle.containsKey("question.mark") ? resourceBundle.getString("question.mark") : "?" %>
        </div>
        <% } %>
    </div>

    <div class="ui divider hidden"></div>

    <div class="field external-link-container text-small">
        <div class="ui checkbox">
            <input
                type="checkbox"
                id="chkRemember"
                name="chkRemember"
                data-testid="login-page-remember-me-checkbox"
            >
            <label for="chkRemember"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "remember.me")%></label>
        </div>
    </div>
    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute
            (request.getParameter("sessionDataKey"))%>'/>

    <div class="mt-0">
        <div class="buttons">
            <button
                type="submit"
                class="ui primary loading fluid large button"
                role="button"
                data-testid="login-page-continue-login-button"
                id="sign-in-button"
                <%= reCaptchaEnabled ? "disabled" : "" %>
                onclick="handleClickSignIn()"
            >
                <%= i18n(resourceBundle, customText, "login.button") %>
            </button>
        </div>
    </div>

    <% if (isSelfSignUpEPAvailable
        && !isIdentifierFirstLogin(inputType)
        && !isLoginHintAvailable(inputType)
        && ( (isSelfSignUpEnabledInTenant && isSelfSignUpEnabledInTenantPreferences)
            || (dynamicPortalSREnabled && !isIdentifierFirstLogin(inputType) && !CONSOLE.equals(sp)) ) ) { %>
        <div class="mt-4 mb-4">
            <div class="mt-3 external-link-container text-small">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "dont.have.an.account")%>
                <a
                    <% if(StringUtils.isNotBlank(selfSignUpOverrideURL)) { %>
                    href="<%=i18nLink(userLocale, selfSignUpOverrideURL)%>"
                    <% } else { %>
                        href="<%= StringEscapeUtils.escapeHtml4(
                                getRegistrationPortalUrl(accountRegistrationEndpointContextURL, srURLEncodedURL, urlParameters)) %>"
                    <% } %>
                    target="_self"
                    class="clickable-link"
                    rel="noopener noreferrer"
                    id="registerLink"
                    data-testid="login-page-create-account-button"
                    style="cursor: pointer;"
                    <% if (dynamicPortalSREnabled) { %>
                        onclick="handleDynamicPortalRedirection()"
                    <% } %>
                >
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "register")%>
                </a>
            </div>
        </div>
    <% } %>
    <% if (isIdentifierFirstLogin(inputType) && !StringUtils.equals("true", promptAccountLinking)) { %>
        <div class="field external-link-container text-small mt-4">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "not.you")%>
            <a
                id="backLink"
                class="clickable-link"
                tabindex="0"
                onclick="goBack()"
                onkeypress="javascript: if (window.event.keyCode === 13) goBack()"
                data-testid="login-page-back-button">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.different.account")%>
            </a>
        </div>
    <% } %>

    <%!
        private String getRecoverAccountUrl(String identityMgtEndpointContext, String urlEncodedURL,
                boolean isUsernameRecovery, String urlParameters) {

            return identityMgtEndpointContext + ACCOUNT_RECOVERY_ENDPOINT_RECOVER + "?" + urlParameters
                    + "&isUsernameRecovery=" + isUsernameRecovery + "&callback=" + Encode
                    .forHtmlAttribute(urlEncodedURL);
        }

        private String getRecoverAccountUrlWithUsername(String identityMgtEndpointContext, String urlEncodedURL,
                boolean isUsernameRecovery, String urlParameters, String username) {

            if (StringUtils.isNotBlank(username)) {
            	try {
	        	username = URLEncoder.encode(username, UTF_8);
	        } catch (UnsupportedEncodingException e) {
	     		// Skip and fall back to un-encoded username
	        }

               urlParameters = urlParameters + "&username=" + Encode.forHtmlAttribute(username);
            }

            return identityMgtEndpointContext + ACCOUNT_RECOVERY_ENDPOINT_RECOVER + "?" + urlParameters
                    + "&isUsernameRecovery=" + isUsernameRecovery + "&callback=" + Encode
                    .forHtmlAttribute(urlEncodedURL);
        }
    %>

    <%
        if (reCaptchaEnabled) {
            String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
    %>
        <div class="field">
            <div class="g-recaptcha"
                data-sitekey="<%=Encode.forHtmlAttribute(reCaptchaKey)%>"
                data-testid="login-page-g-recaptcha"
                data-bind="sign-in-button"
                data-callback="submitForm"
                data-theme="light"
                data-tabindex="-1"
            >
            </div>
        </div>
    <%
        }
    %>
</form>

<form action="<%= Encode.forHtmlAttribute(loginFormActionURL) %>" method="post" id="restartFlowForm">
    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
    <input type="hidden" name="restart_flow" value='true'/>
    <input id="tocommonauth" name="tocommonauth" type="hidden" value="true">
</form>

<%
    String clientId = Encode.forHtmlAttribute(request.getParameter("client_id"));
%>

<script type="text/javascript">
    var insightsAppIdentifier = "<%=clientId%>";
    var insightsTenantIdentifier = "<%=userTenant%>";
    var isResendUserNameAvailable = "<%=StringUtils.isNotBlank(resendUsername)%>";

    // Removes the resend_user param to prevent sending confirmation mail on page reload.
    if (isResendUserNameAvailable === "true") {
        const url = new URL(window.location.href);
        url.searchParams.delete('resend_username');
        window.history.pushState(null, window.document.title, "login.do?" + url.searchParams.toString());
    }

    if (insightsAppIdentifier == "MY_ACCOUNT") {
        insightsAppIdentifier = "my-account";
    } else if (insightsAppIdentifier == "CONSOLE") {
        insightsAppIdentifier = "console";
    } else if (insightsTenantIdentifier !== "<%=org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME%>") {
        insightsAppIdentifier = "business-app";
    }

    trackEvent("page-visit-authentication-portal", {
        "app": insightsAppIdentifier,
        "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
    });

    function handleClickSignIn() {
        trackEvent("authentication-portal-basicauth-click-sign-in", {
            "app": insightsAppIdentifier,
            "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
        });
    }

    function handleDynamicPortalRedirection() {
        localStorage.setItem("sessionDataKey", "<%= sdkSafe %>");
    }

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
