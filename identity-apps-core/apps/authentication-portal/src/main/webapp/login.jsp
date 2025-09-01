<%--
  ~ Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.apache.commons.collections.CollectionUtils" %>
<%@ page import="org.apache.commons.httpclient.HttpURL" %>
<%@ page import="org.apache.commons.httpclient.HttpsURL" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.EndpointConfigManager" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityCoreConstants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS_MSG" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.CONFIGURATION_ERROR" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.AUTHENTICATION_MECHANISM_NOT_CONFIGURED" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.ENABLE_AUTHENTICATION_WITH_REST_API" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page import="org.wso2.carbon.CarbonConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.AuthenticatorDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.AuthenticatorDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.CommonDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.IdentityProviderDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.IdentityProviderDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.apache.commons.collections.MapUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.client.model.AuthenticationRequestWrapper" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Include registration portal URL resolver --%>
<jsp:directive.include file="util/dynamic-portal-url-resolver.jsp"/>

<%
    // Add the login screen to the list to retrieve text branding customizations.
    screenNames.add("login");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<jsp:directive.include file="includes/username-label-resolver.jsp"/>

<%!
    private static final String FIDO_AUTHENTICATOR = "FIDOAuthenticator";
    private static final String MAGIC_LINK_AUTHENTICATOR = "MagicLinkAuthenticator";
    private static final String IWA_AUTHENTICATOR = "IwaNTLMAuthenticator";
    private static final String IS_SAAS_APP = "isSaaSApp";
    private static final String BASIC_AUTHENTICATOR = "BasicAuthenticator";
    private static final String IDENTIFIER_EXECUTOR = "IdentifierExecutor";
    private static final String JWT_BASIC_AUTHENTICATOR = "JWTBasicAuthenticator";
    private static final String X509_CERTIFICATE_AUTHENTICATOR = "x509CertificateAuthenticator";
    private static final String GOOGLE_AUTHENTICATOR = "GoogleOIDCAuthenticator";
    private static final String GITHUB_AUTHENTICATOR = "GithubAuthenticator";
    private static final String FACEBOOK_AUTHENTICATOR = "FacebookAuthenticator";
    private static final String OIDC_AUTHENTICATOR = "OpenIDConnectAuthenticator";
    private static final String SSO_AUTHENTICATOR_NAME = "SSO";
    private static final String MICROSOFT_IDP = "Microsoft";
    private static final String ENTERPRISE_USER_LOGIN_AUTHENTICATOR = "EnterpriseIDPAuthenticator";
    private static final String ENTERPRISE_USER_LOGIN_ORG = "EnterpriseIDP_Org";
    private static final String ENTERPRISE_USER_LOGIN_IDP = "EnterpriseIDP";
    private static final String USER_TYPE_ORGANIZATION = "org";
    private static final String USER_TYPE_ASGARDEO = "asg";
    private static final String BACKUP_CODE_AUTHENTICATOR = "backup-code-authenticator";
    private static final String SMS_OTP_AUTHENTICATOR = "sms-otp-authenticator";
    private static final String EMAIL_OTP_AUTHENTICATOR = "email-otp-authenticator";
    private static final String TOTP_AUTHENTICATOR = "totp";
    private static final String PUSH_NOTIFICATION_AUTHENTICATOR = "push-notification-authenticator";
    private static final String ENTERPRISE_LOGIN_KEY = "isEnterpriseLoginEnabled";
    private static final String ENTERPRISE_API_RELATIVE_PATH = "/api/asgardeo-enterprise-login/v1/business-user-login/";
    private static final String CUSTOM_LOCAL_AUTHENTICATOR_PREFIX = "custom-";
%>

<%
    String promptAccountLinking = "";
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String forwardedQueryString = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING);
    String appName = Encode.forUriComponent(request.getParameter("sp"));
    String userType = request.getParameter("utype");
    String consoleURL = application.getInitParameter("ConsoleURL");

    String isHostedExternally = application.getInitParameter("IsHostedExternally");

    if ((StringUtils.equals("WSO2_LOGIN_FOR_CONSOLE",appName)
            && !StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT))) {
        idpAuthenticatorMapping.put(ENTERPRISE_USER_LOGIN_ORG,ENTERPRISE_USER_LOGIN_AUTHENTICATOR);
    }


    // Redirect to business user login page for tenanted access.
    boolean enterpriseUserloginEnabled = false;
    if (StringUtils.equals("Console",  appName)
            && !StringUtils.equals(IdentityManagementEndpointConstants.SUPER_TENANT, userTenantDomain)
            && !StringUtils.equals(null, userTenantDomain)
            && !StringUtils.equals(userType, USER_TYPE_ASGARDEO)) {

        try {

            // TODO: need to use the "com.wso2.identity.asgardeo.enterprise.login.EnterpriseLoginRetrievalClient" client to retrieve value.
            // EnterpriseLoginRetrievalClient enterpriseLoginRetrievalClient = new EnterpriseLoginRetrievalClient();
            // enterpriseUserloginEnabled = enterpriseLoginRetrievalClient.isEnterpriseLoginEnabled(userTenantDomain);

            if (CarbonConstants.ENABLE_LEGACY_AUTHZ_RUNTIME != null && CarbonConstants.ENABLE_LEGACY_AUTHZ_RUNTIME) {
                CommonDataRetrievalClient commonDataRetrievalClient = new CommonDataRetrievalClient();
                enterpriseUserloginEnabled = commonDataRetrievalClient.checkBooleanProperty(ENTERPRISE_API_RELATIVE_PATH + userTenantDomain,
                                                                  null, ENTERPRISE_LOGIN_KEY, false, false);
            }
        } catch (Exception e) {
            // Ignored and send the default value.
        }

    }

    if (enterpriseUserloginEnabled) {
        %>
          <script type="text/javascript">
            document.location = "<%=oauth2AuthorizeURL%>?idp=<%=ENTERPRISE_USER_LOGIN_IDP%>" +
                    "&authenticator=<%=ENTERPRISE_USER_LOGIN_AUTHENTICATOR%>" +
                    "&fidp=EnterpriseIDP" + "&org=<%=userTenantDomain%>" +
                    "&code_challenge_method=<%=Encode.forUriComponent(request.getParameter("code_challenge_method"))%>" +
                    "&code_challenge=<%=Encode.forUriComponent(request.getParameter("code_challenge"))%>" +
                    "&response_type=<%=Encode.forUriComponent(request.getParameter("response_type"))%>" +
                    "&client_id=<%=Encode.forUriComponent(request.getParameter("client_id"))%>" +
                    "&scope=<%=Encode.forUriComponent(request.getParameter("scope"))%>" +
                    "&redirect_uri=<%=Encode.forUriComponent(request.getParameter("redirect_uri"))%>" +
                    "&response_mode=<%=Encode.forUriComponent(request.getParameter("response_mode"))%>";
          </script>
        <%
    }

    String errorMessage = "authentication.failed.please.retry";
    String errorCode = "";
    if(request.getParameter(Constants.ERROR_CODE)!=null){
        errorCode = request.getParameter(Constants.ERROR_CODE) ;
    }
    String loginFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        loginFailed = "true";
        String error = request.getParameter(Constants.AUTH_FAILURE_MSG);
        // Check the error is not null and whether there is a corresponding value in the resource bundle.
        if (!(StringUtils.isBlank(error)) &&
                !error.equalsIgnoreCase(AuthenticationEndpointUtil.i18n(resourceBundle, error))) {
            errorMessage = error;
        }
    }
%>
<%
    boolean hasFederatedOptions = false;
    boolean hasLocalLoginOptions = false;
    boolean isBackChannelBasicAuth = false;
    List<String> localAuthenticatorNames = new ArrayList<String>();
    List<String> registeredLocalAuthenticators = Arrays.asList(
        BACKUP_CODE_AUTHENTICATOR, TOTP_AUTHENTICATOR, EMAIL_OTP_AUTHENTICATOR,
        MAGIC_LINK_AUTHENTICATOR,SMS_OTP_AUTHENTICATOR,
        IDENTIFIER_EXECUTOR,JWT_BASIC_AUTHENTICATOR,BASIC_AUTHENTICATOR,
        IWA_AUTHENTICATOR,X509_CERTIFICATE_AUTHENTICATOR,FIDO_AUTHENTICATOR,
        PUSH_NOTIFICATION_AUTHENTICATOR
   );


    if (idpAuthenticatorMapping != null && idpAuthenticatorMapping.get(Constants.RESIDENT_IDP_RESERVED_NAME) != null) {
        String authList = idpAuthenticatorMapping.get(Constants.RESIDENT_IDP_RESERVED_NAME);
        if (authList != null) {
            localAuthenticatorNames = Arrays.asList(authList.split(","));
        }
    }

    String multiOptionURIParam = "";
    if (localAuthenticatorNames.size() > 1 || idpAuthenticatorMapping != null && idpAuthenticatorMapping.size() > 1) {
        String baseURL;
        // Check whether authentication endpoint is hosted externally.
        if (Boolean.parseBoolean(isHostedExternally)) {
            String requestURI = request.getRequestURI();
            if (StringUtils.isNotBlank(requestURI)) {
                requestURI = requestURI.startsWith("/") ? requestURI : "/" + requestURI;
                requestURI = requestURI.endsWith("/") ? requestURI.substring(0, requestURI.length() - 1) : requestURI;
            }
            baseURL = requestURI;
        } else {
            try {
                baseURL = ServiceURLBuilder.create().addPath(request.getRequestURI()).build().getRelativePublicURL();
            } catch (URLBuilderException e) {
                request.setAttribute(STATUS, AuthenticationEndpointUtil.i18n(resourceBundle, "internal.error.occurred"));
                request.setAttribute(STATUS_MSG, AuthenticationEndpointUtil.i18n(resourceBundle, "error.when.processing.authentication.request"));
                request.getRequestDispatcher("error.do").forward(request, response);
                return;
            }
        }

        // Build the query string using the parameter map since the query string can contain fewer parameters
        // due to parameter filtering.
        Map<String, String[]> queryParamMap = request.getParameterMap();
        Map<String, Object> authParamMap = ((AuthenticationRequestWrapper) request).getAuthParams();

        // Remove `waitingConfigs` auth param from the query map since `internalWait` prompt related auth params
        // doesn't need to be added to the multi-option uri.
        if (authParamMap != null && !authParamMap.isEmpty() && queryParamMap != null && !queryParamMap.isEmpty()) {
            if (authParamMap.containsKey("waitingConfigs") && authParamMap.containsKey("waitingType")) {
                queryParamMap.remove("waitingConfigs");
            }
        }
        String queryParamString = AuthenticationEndpointUtil.resolveQueryString(queryParamMap);
        multiOptionURIParam = "&multiOptionURI=" + Encode.forUriComponent(baseURL + queryParamString);
    }

    // Since the BACKUP_CODE_AUTHENTICATOR acts as a recovery option, redirects to relevent authenticator
    if (localAuthenticatorNames.size() == 2
        && localAuthenticatorNames.contains(BACKUP_CODE_AUTHENTICATOR)) {
            if (localAuthenticatorNames.contains(TOTP_AUTHENTICATOR)) {
                String directTo = commonauthURL + "?idp=LOCAL&authenticator=" + TOTP_AUTHENTICATOR + "&sessionDataKey="
                    + Encode.forUriComponent(request.getParameter("sessionDataKey")) + multiOptionURIParam;
                response.sendRedirect(directTo);

                return;
            } else if (localAuthenticatorNames.contains(EMAIL_OTP_AUTHENTICATOR)) {
                String directTo = commonauthURL + "?idp=LOCAL&authenticator=" + EMAIL_OTP_AUTHENTICATOR + "&sessionDataKey="
                    + Encode.forUriComponent(request.getParameter("sessionDataKey")) + multiOptionURIParam;
                response.sendRedirect(directTo);

                return;
            } else if (localAuthenticatorNames.contains(SMS_OTP_AUTHENTICATOR)) {
                String directTo = commonauthURL + "?idp=LOCAL&authenticator=" + SMS_OTP_AUTHENTICATOR + "&sessionDataKey="
                    + Encode.forUriComponent(request.getParameter("sessionDataKey")) + multiOptionURIParam;
                response.sendRedirect(directTo);

                return;
            }
    }
%>
<%
    boolean reCaptchaEnabled = false;
    if (request.getParameter("reCaptcha") != null && Boolean.parseBoolean(request.getParameter("reCaptcha"))) {
        reCaptchaEnabled = true;
    }

    boolean reCaptchaResendEnabled = false;
    if (request.getParameter("reCaptchaResend") != null && Boolean.parseBoolean(request.getParameter("reCaptchaResend"))) {
        reCaptchaResendEnabled = true;
    }
%>
<%
    String inputType = request.getParameter("inputType");
    String username = null;
    String usernameIdentifier = null;

    if (isIdentifierFirstLogin(inputType)) {
        if (request.getParameter(Constants.USERNAME) != null) {
            username = request.getParameter(Constants.USERNAME);
            usernameIdentifier = request.getParameter(Constants.USERNAME);
            promptAccountLinking = request.getParameter(Constants.PROMPT_FOR_ACCOUNT_LINKING);
        } else {
            String redirectURL = "error.do";
            response.sendRedirect(redirectURL);
            return;
        }
    }

    if (isLoginHintAvailable(inputType)) {
        if (request.getParameter(Constants.LOGIN_HINT) != null) {
            username = request.getParameter(Constants.LOGIN_HINT);
            usernameIdentifier = request.getParameter(Constants.LOGIN_HINT);
        } else {
            String redirectURL = "error.do";
            response.sendRedirect(redirectURL);
            return;
        }
    }

    // Login context request url.
    String sessionDataKey = Encode.forUriComponent(request.getParameter("sessionDataKey"));
    String authenticators = Encode.forUriComponent(request.getParameter("authenticators"));
    String loginContextRequestUrl = logincontextURL + "?sessionDataKey=" + sessionDataKey + "&application="
            + appName + "&authenticators=" + authenticators;
    if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
        // We need to send the tenant domain as a query param only in non tenant qualified URL mode.
        loginContextRequestUrl += "&tenantDomain=" + tenantDomain;
    }

    String t = request.getParameter("t");
    String ut = request.getParameter("ut");

    if (StringUtils.isNotBlank(t)) {
        loginContextRequestUrl += "&t=" + Encode.forUriComponent(t);
    }
    if (StringUtils.isNotBlank(ut)) {
        loginContextRequestUrl += "&ut=" + Encode.forUriComponent(ut);
    }

    if (StringUtils.isNotBlank(usernameIdentifier)) {
        if (usernameIdentifier.split("@").length == 2
            && (StringUtils.equals(usernameIdentifier.split("@")[1], IdentityManagementEndpointConstants.SUPER_TENANT)
            || StringUtils.equals(usernameIdentifier.split("@")[1], userTenantDomain))) {

            usernameIdentifier = usernameIdentifier.split("@")[0];
        }

        if (usernameIdentifier.split("@").length > 2
            && !StringUtils.equals(usernameIdentifier.split("@")[1], IdentityManagementEndpointConstants.SUPER_TENANT)) {

            usernameIdentifier = usernameIdentifier.split("@")[0] + "@" + usernameIdentifier.split("@")[1];
        }
    }
%>

<%-- Appending locale to self sign up override URL and password recovery override URL --%>
<%
    String localeString = userLocale.toLanguageTag();

    if (!StringUtils.isBlank(selfSignUpOverrideURL)) {
        if (selfSignUpOverrideURL.contains("?")) {
            selfSignUpOverrideURL = selfSignUpOverrideURL.concat("&ui_locales=" + localeString);
        } else {
            selfSignUpOverrideURL = selfSignUpOverrideURL.concat("?ui_locales=" + localeString);
        }
    }
    passwordRecoveryOverrideURL = getRecoveryPortalUrl(passwordRecoveryOverrideURL, recoveryPortalOverrideURL, localeString, forwardedQueryString);
%>

<%
    String identityMgtEndpointContextURL = application.getInitParameter("IdentityManagementEndpointContextURL");
    String accountRegistrationEndpointContextURL = application.getInitParameter("AccountRegisterEndpointURL");
    String srURLEncodedURL = "";
    Boolean isSelfSignUpEnabledInTenant;
    Boolean isUsernameRecoveryEnabledInTenant;
    Boolean isPasswordRecoveryEnabledInTenant;

    // Check whether authentication endpoint is hosted externally.
    if (Boolean.parseBoolean(isHostedExternally)) {
        isSelfSignUpEnabledInTenant = false;
        isUsernameRecoveryEnabledInTenant = false;
        isPasswordRecoveryEnabledInTenant = false;
    } else {
        try {
            PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
            isSelfSignUpEnabledInTenant = preferenceRetrievalClient.checkSelfRegistration(userTenant);
            if (isSelfSignUpEnabledInTenant && StringUtils.equals("Console", appName)) {
                isSelfSignUpEnabledInTenant = false;
            }
            isUsernameRecoveryEnabledInTenant = preferenceRetrievalClient.checkUsernameRecovery(userTenant);
            isPasswordRecoveryEnabledInTenant = preferenceRetrievalClient.checkPasswordRecovery(userTenant);
        } catch (PreferenceRetrievalClientException e) {
            request.setAttribute("error", true);
            request.setAttribute("errorMsg", AuthenticationEndpointUtil
                            .i18n(resourceBundle, "something.went.wrong.contact.admin"));
            IdentityManagementEndpointUtil.addErrorInformation(request, e);
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }
    }

    if (isSelfSignUpEnabledInTenant && isSelfSignUpEnabledInTenantPreferences) {
        if (StringUtils.isBlank(identityMgtEndpointContextURL)) {
            try {
                identityMgtEndpointContextURL = ServiceURLBuilder.create().addPath(ACCOUNT_RECOVERY_ENDPOINT).build()
                        .getAbsolutePublicURL();
            } catch (URLBuilderException e) {
                request.setAttribute(STATUS, AuthenticationEndpointUtil.i18n(resourceBundle, CONFIGURATION_ERROR));
                request.setAttribute(STATUS_MSG, AuthenticationEndpointUtil
                        .i18n(resourceBundle, ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL));
                request.getRequestDispatcher("error.do").forward(request, response);
                return;
            }
        }
        if (StringUtils.isBlank(accountRegistrationEndpointContextURL)
                || !(StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT))) {
            accountRegistrationEndpointContextURL = identityMgtEndpointContextURL + ACCOUNT_RECOVERY_ENDPOINT_REGISTER;
        }
        // For self sign-up build the normal callback URL.
        String srURI;

        if (Boolean.parseBoolean(isHostedExternally)) {
            srURI = application.getInitParameter("IdentityManagementEndpointLoginURL");
        } else {
            srURI = ServiceURLBuilder.create().addPath(AUTHENTICATION_ENDPOINT_LOGIN).build().getAbsolutePublicURL();
        }
        String srprmstr = URLDecoder.decode(((String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING)), UTF_8);
        String srURLWithoutEncoding = srURI + "?" + srprmstr;
        srURLEncodedURL= URLEncoder.encode(srURLWithoutEncoding, UTF_8);
    }
%>

<%
    String insightsAppIdentifier = Encode.forJavaScriptBlock(request.getParameter("client_id"));
    String insightsTenantIdentifier = userTenant;

    if (!Boolean.parseBoolean(request.getParameter(IS_SAAS_APP))) {
        insightsAppIdentifier = "business-app";
    }
    else if (!StringUtils.isEmpty(insightsAppIdentifier)) {
        insightsAppIdentifier = StringUtils.lowerCase(insightsAppIdentifier).replace("_", "-");
    }

    String restrictedBrowsersForGOT = "";
    if (StringUtils.isNotBlank(EndpointConfigManager.getGoogleOneTapRestrictedBrowsers())) {
        restrictedBrowsersForGOT = EndpointConfigManager.getGoogleOneTapRestrictedBrowsers();
    }
%>

<% request.setAttribute("pageName", "sign-in"); %>

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

    <%-- analytics --%>
    <%
        File analyticsFile = new File(getServletContext().getRealPath("extensions/analytics.jsp"));
        if (analyticsFile.exists()) {
    %>
        <jsp:include page="extensions/analytics.jsp"/>
    <% } else { %>
        <jsp:include page="includes/analytics.jsp"/>
    <% } %>

    <%
        boolean genericReCaptchaEnabled = CaptchaUtil.isGenericRecaptchaEnabledAuthenticator("IdentifierExecutor");
        if (reCaptchaEnabled || reCaptchaResendEnabled || genericReCaptchaEnabled) {
            String reCaptchaAPI = CaptchaUtil.reCaptchaAPIURL();
    %>
        <script src='<%=(reCaptchaAPI)%>'></script>
    <%
        }
    %>

</head>

<body class="login-portal layout authentication-portal-layout" onload="checkSessionKey()" data-page="<%= request.getAttribute("pageName") %>">

    <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
        <jsp:include page="extensions/timeout.jsp"/>
    <% } else { %>
        <jsp:include page="util/timeout.jsp"/>
    <% } %>

    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>">
        <layout:component componentName="ProductHeader">
            <%
                if (StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT) &&
                StringUtils.equals("true", promptAccountLinking)) {
            %>
                    <div class="theme-icon inline auto transparent product-logo portal-logo">
                        <img src="libs/themes/default/assets/images/illustrations/login-illustration.svg" alt="Logo" />
                    </div>
            <% } %>
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
        <layout:component componentName="MainSection">
            <div class="ui segment segment-layout">
                <h3 class="ui header">
                    <%  if (Boolean.parseBoolean(promptAccountLinking)) { %>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "account.linking") %>
                    <% } else if (isIdentifierFirstLogin(inputType) || isLoginHintAvailable(inputType)) { %>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "welcome") %>
                    <% } else { %>
                        <%= i18n(resourceBundle, customText, "login.heading") %>
                    <% } %>
                </h3>

                <%  if (Boolean.parseBoolean(promptAccountLinking)) { %>
                    <p class="account-linking ui-label">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "account.linking.proceed") %>
                    </p>
                <% } %>

                <% if (isIdentifierFirstLogin(inputType) || isLoginHintAvailable(inputType)) {

                    // Remove userstore domain from the username.
                    String[] usernameSplitItems = usernameIdentifier.split("/");
                    String sanitizeUserName = usernameSplitItems[usernameSplitItems.length - 1];
                %>
                <div class="identifier-container">
                    <img
                        class="ui image mr-1"
                        alt="Username Icon"
                        role="presentation"
                        src="libs/themes/default/assets/images/user.svg">
                    <span id="user-name-label"
                            class="ellipsis"
                            data-position="top left"
                            data-variation="inverted"
                            data-content="<%=Encode.forHtmlAttribute(sanitizeUserName)%>">
                        <%=Encode.forHtmlContent(sanitizeUserName)%>
                    </span>
                </div>
                <% } %>

                <div class="segment-form">
                    <%
                        if (localAuthenticatorNames.size() > 0) {
                            if (localAuthenticatorNames.contains(IDENTIFIER_EXECUTOR)) {
                            hasLocalLoginOptions = true;
                    %>
                        <%@ include file="identifierauth.jsp" %>
                    <%
                        } else if (localAuthenticatorNames.contains(JWT_BASIC_AUTHENTICATOR) ||
                            localAuthenticatorNames.contains(BASIC_AUTHENTICATOR)) {
                            hasLocalLoginOptions = true;
                            boolean includeBasicAuth = true;
                            if (localAuthenticatorNames.contains(JWT_BASIC_AUTHENTICATOR)) {
                                if (Boolean.parseBoolean(application.getInitParameter(ENABLE_AUTHENTICATION_WITH_REST_API))) {
                                    isBackChannelBasicAuth = true;
                                } else {
                                    String redirectURL = "error.do?" + STATUS + "=" + CONFIGURATION_ERROR + "&" +
                                            STATUS_MSG + "=" + AUTHENTICATION_MECHANISM_NOT_CONFIGURED;
                                    response.sendRedirect(redirectURL);
                                    return;
                                }
                            } else if (localAuthenticatorNames.contains(BASIC_AUTHENTICATOR)) {
                                isBackChannelBasicAuth = false;
                            if (TenantDataManager.isTenantListEnabled() && Boolean.parseBoolean(request.getParameter(IS_SAAS_APP))) {
                                includeBasicAuth = false;
                    %>
                                <%@ include file="tenantauth.jsp" %>
                    <%
                            }
                        }
                                if (includeBasicAuth) {
                                    %>
                                        <%@ include file="basicauth.jsp" %>
                                    <%
                                }
                            }
                        }
                    %>
                    <%if (idpAuthenticatorMapping != null &&
                            idpAuthenticatorMapping.get(Constants.RESIDENT_IDP_RESERVED_NAME) != null) { %>

                    <%} %>
                    <%
                        if ((hasLocalLoginOptions && localAuthenticatorNames.size() > 1) || (!hasLocalLoginOptions)
                                || (hasLocalLoginOptions && idpAuthenticatorMapping != null && idpAuthenticatorMapping.size() > 1)) {
                    %>
                    <% if (localAuthenticatorNames.contains(BASIC_AUTHENTICATOR) ||
                            localAuthenticatorNames.contains(IDENTIFIER_EXECUTOR)) { %>
                    <div class="ui horizontal divider">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "or")%>
                    </div>
                    <% } %>
                    <div class="field">
                        <div class="ui vertical ui center aligned segment form">
                            <%
                                int iconId = 0;
                                if (idpAuthenticatorMapping != null) {
                                    boolean isEnterpriseUserLogin = false;
                                    boolean isOrgEnterpriseUserLogin = false;
                                for (Map.Entry<String, String> idpEntry : idpAuthenticatorMapping.entrySet()) {
                                    iconId++;
                                    if (!idpEntry.getKey().equals(Constants.RESIDENT_IDP_RESERVED_NAME)) {
                                        String idpName = idpEntry.getKey();
                                        String idpDisplayName = idpName;
                                        boolean isHubIdp = false;
                                        boolean isGoogleIdp = false;
                                        boolean isGitHubIdp = false;
                                        boolean isFacebookIdp = false;
                                        boolean isMicrosoftIdp = false;
                                        boolean isGoogleOneTap = true;

                                        String GOOGLE_CLIENT_ID = "";
                                        String GOOGLE_CALLBACK_URL = "";
                                        boolean GOOGLE_ONE_TAP_ENABLED = false;

                                        if ("Asgardeo Platform IDP".equals(idpName)) {
                                            idpDisplayName = "Asgardeo";
                                        }
                                        if (idpName.endsWith(".hub")) {
                                            isHubIdp = true;
                                            idpName = idpName.substring(0, idpName.length() - 4);
                                        }
                                        if (GOOGLE_AUTHENTICATOR.equals(idpEntry.getValue())) {
                                            isGoogleIdp = true;
                                            IdentityProviderDataRetrievalClient identityProviderDataRetrievalClient =
                                                new IdentityProviderDataRetrievalClient();
                                            List<String> configKeys = new ArrayList<>();
                                            configKeys.add("ClientId");
                                            configKeys.add("callbackUrl");
                                            configKeys.add("IsGoogleOneTapEnabled");

                                            try {
                                                Map<String,String> idpConfigMap =
                                                    identityProviderDataRetrievalClient.getFederatedIdpConfigs(
                                                        tenantDomain, GOOGLE_AUTHENTICATOR, idpName, configKeys);
                                                if (MapUtils.isNotEmpty(idpConfigMap)) {
                                                    GOOGLE_CLIENT_ID = idpConfigMap.get("ClientId");
                                                    GOOGLE_CALLBACK_URL = idpConfigMap.get("callbackUrl");
                                                    GOOGLE_ONE_TAP_ENABLED = Boolean.parseBoolean(idpConfigMap.get("IsGoogleOneTapEnabled"));
                                                }
                                            } catch (IdentityProviderDataRetrievalClientException e) {
                                                // Exception is ignored.
                                            }
                                        }
                                        if (StringUtils.equals(idpEntry.getValue(),GITHUB_AUTHENTICATOR)) {
                                            isGitHubIdp = true;
                                        }
                                        if (StringUtils.equals(idpEntry.getValue(), FACEBOOK_AUTHENTICATOR)) {
                                            isFacebookIdp = true;
                                        }
                                        if (StringUtils.equals(idpEntry.getValue(), OIDC_AUTHENTICATOR)) {
                                            if (StringUtils.equals(idpName, MICROSOFT_IDP)) {
                                                isMicrosoftIdp = true;
                                            }
                                        }
                                        if (StringUtils.equals(idpEntry.getValue(), ENTERPRISE_USER_LOGIN_AUTHENTICATOR)) {
                                            if (StringUtils.equals(userTenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT) ||
                                                    StringUtils.equals(userTenantDomain, null)) {
                                                continue;
                                            } else if (StringUtils.equals(idpName, ENTERPRISE_USER_LOGIN_ORG)) {
                                                isOrgEnterpriseUserLogin = true;
                                            } else {
                                                isEnterpriseUserLogin = true;
                                            }
                                            continue;
                                        }
                                        if (isHubIdp || isGitHubIdp || isGoogleIdp || isFacebookIdp || isMicrosoftIdp) {
                                            hasFederatedOptions = true;
                                        }
                                        // Uses the `IdentityProviderDataRetrievalClient` to get the IDP image.
                                        // TODO: Use this approach for Google, GitHub etc. since it's not scalable.
                                        // Might Need to fix E2E suite as well.
                                        String imageURL = "libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";
                                        try {
                                            IdentityProviderDataRetrievalClient identityProviderDataRetrievalClient = new IdentityProviderDataRetrievalClient();
                                            imageURL = identityProviderDataRetrievalClient.getIdPImage(tenantDomain, idpName);
                                        } catch (IdentityProviderDataRetrievalClientException e) {
                                            // Exception is ignored and the default `imageURL` value will be used as a fallback.
                                        }
                                        // If any IdP's name starts with `Sign in with`, then we need to remove the `Sign in with` part.
                                        // If not, the UI will look weird with labels like `Sign in with Sign In With Google`.
                                        String EXTERNAL_CONNECTION_PREFIX = "sign in with";
                                        if (StringUtils.startsWithIgnoreCase(idpDisplayName, EXTERNAL_CONNECTION_PREFIX)) {
                                            idpDisplayName = idpDisplayName.substring(EXTERNAL_CONNECTION_PREFIX.length());
                                        }
                                        // If IdP name is "SSO", need to handle as special case.
                                        if (StringUtils.equalsIgnoreCase(idpName, SSO_AUTHENTICATOR_NAME)) {
                                            imageURL = "libs/themes/default/assets/images/identity-providers/sso.svg";
                                        }
                            %>
                                <% if (isHubIdp) { %>
                                    <div class="field">
                                        <button class="ui labeled icon button fluid isHubIdpPopupButton" id="icon-<%=iconId%>">
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> <strong><%=Encode.forHtmlContent(idpDisplayName)%></strong>
                                        </button>
                                        <div class="ui flowing popup transition hidden isHubIdpPopup">
                                            <h5 class="font-large"><%=AuthenticationEndpointUtil.i18n(resourceBundle,"sign.in.with")%>
                                                <%=Encode.forHtmlContent(idpDisplayName)%></h5>
                                            <div class="content">
                                                <form class="ui form">
                                                    <div class="field">
                                                        <input id="domainName" class="form-control" type="text"
                                                            placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "domain.name")%>">
                                                    </div>
                                                    <input type="button" class="ui button primary"
                                                        onClick="javascript: myFunction('<%=idpName%>','<%=idpEntry.getValue()%>','domainName')"
                                                        value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"go")%>"/>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <br>
                                <% } else if (isGoogleIdp) { %>
                                    <div class="social-login blurring social-dimmer">
                                        <div class="field" id="googleSignIn">
                                            <button
                                                type="button"
                                                class="ui button"
                                                data-testid="login-page-sign-in-with-google"
                                                onclick="handleNoDomain(this,
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpName))%>',
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getValue()))%>')"
                                            >
                                                <img
                                                    class="ui image"
                                                    src="libs/themes/default/assets/images/identity-providers/google-idp-illustration.svg"
                                                    alt="Google Login icon"
                                                    role="presentation">
                                                <span><%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> <%=Encode.forHtmlContent(idpDisplayName)%></span>
                                            </button>
                                        </div>
                                    </div>

                                    <% if (GOOGLE_ONE_TAP_ENABLED) { %>

                                        <script src="https://accounts.google.com/gsi/client" defer></script>

                                        <form action="<%=GOOGLE_CALLBACK_URL%>" method="post" id="googleOneTapForm" style="display: none;">
                                            <input type="hidden" name="state" value="<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>"/>
                                            <input type="hidden" name="idp" value="<%=idpName%>"/>
                                            <input type="hidden" name="authenticator"  value="<%=idpEntry.getValue()%>"/>
                                            <input type="hidden" name="one_tap_enabled"  value="true"/>
                                            <input type="hidden" name="internal_submission"  value="true"/>
                                            <input type="hidden" name="credential" id="credential"/>
                                        </form>

                                        <script>
                                            document.addEventListener("DOMContentLoaded", function() {

                                                google.accounts.id.initialize({
                                                    client_id: "<%=Encode.forJavaScriptAttribute(GOOGLE_CLIENT_ID)%>",
                                                    cancel_on_tap_outside: false,
                                                    nonce: "<%=Encode.forJavaScriptAttribute(request.getParameter("sessionDataKey"))%>",
                                                    callback: handleCredentialResponse
                                                });
                                                google.accounts.id.prompt();
                                            });
                                        </script>
                                    <%} %>
                                    <br>
                                <% } else if (isGitHubIdp) { %>
                                    <div class="social-login blurring social-dimmer">
                                        <div class="field">
                                                <button type="button"
                                                        class="ui button"
                                                        data-testid="login-page-sign-in-with-github"
                                                        onclick="handleNoDomain(this,
                                                            '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpName))%>',
                                                            '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getValue()))%>')"
                                                >
                                                <img
                                                    class="ui image"
                                                    src="libs/themes/default/assets/images/identity-providers/github-idp-illustration.svg"
                                                    alt="Github login icon"
                                                    role="presentation">
                                                <span><%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> <%=Encode.forHtmlContent(idpDisplayName)%></span>
                                            </button>
                                        </div>
                                    </div>
                                    <br>
                                <% } else if (isFacebookIdp) { %>
                                    <div class="social-login blurring social-dimmer">
                                        <div class="field">
                                                <button
                                                type="button"
                                                class="ui button"
                                                data-testid="login-page-sign-in-with-facebook"
                                                onclick="handleNoDomain(this,
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpName))%>',
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getValue()))%>')"
                                                >
                                                <img
                                                    class="ui image"
                                                    src="libs/themes/default/assets/images/identity-providers/facebook-idp-illustration.svg"
                                                    alt="Facebook login icon"
                                                    role="presentation">
                                                <span><%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> <%=Encode.forHtmlContent(idpDisplayName)%></span>
                                            </button>
                                        </div>
                                    </div>
                                    <br>
                                <% } else if (isMicrosoftIdp) { %>
                                    <div class="social-login blurring social-dimmer">
                                    <div class="field">
                                        <button
                                                type="button"
                                                class="ui button"
                                                data-testid="login-page-sign-in-with-microsoft"
                                                onclick="handleNoDomain(this,
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpName))%>',
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getValue()))%>')"
                                        >
                                                <img
                                                    class="ui image"
                                                    src="libs/themes/default/assets/images/identity-providers/microsoft-idp-illustration.svg"
                                                    alt="Microsoft login icon"
                                                    role="presentation">
                                                <span><%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> <%=Encode.forHtmlContent(idpDisplayName)%></span>
                                        </button>
                                        </div>
                                    </div>
                                    <br>
                                    <% } else {

                                        String logoPath = imageURL;

                                        if (imageURL == null || imageURL.isEmpty()) {
                                            logoPath = "libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";
                                        }

                                        if ("Asgardeo Platform IDP".equals(idpName)) {
                                            logoPath = "libs/themes/wso2is/assets/images/identity-providers/asgardeo.svg";
                                        }

                                        if (!imageURL.isEmpty() && imageURL.contains("assets/images/logos/")) {
                                            String[] imageURLSegements = imageURL.split("/");
                                            String logoFileName = imageURLSegements[imageURLSegements.length - 1];

                                            logoPath = "libs/themes/default/assets/images/identity-providers/" + logoFileName;
                                        }
                                    %>
                                    <div class="social-login blurring social-dimmer">
                                        <div class="field">
                                            <button
                                                id="icon-<%=iconId%>"
                                                type="button"
                                                class="ui button"
                                                data-testid='login-page-sign-in-with-<%=Encode.forHtmlAttribute(idpName)%>'
                                                onclick="handleNoDomain(this,
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpName))%>',
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getValue()))%>')"
                                                >
                                                    <img
                                                        role="presentation"
                                                        alt="sign-in-with-<%=Encode.forHtmlAttribute(idpName)%> icon"
                                                        class="ui image"
                                                        src="<%=Encode.forHtmlAttribute(logoPath)%>">
                                                    <span><%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> <%=Encode.forHtmlContent(idpDisplayName)%></span>
                                            </button>
                                        </div>
                                    </div>
                                    <br>
                                <% } %>
                            <% } else if (localAuthenticatorNames.size() > 0) {
                                if (localAuthenticatorNames.contains(IWA_AUTHENTICATOR)) {
                            %>
                            <div class="field">
                                <button class="ui blue labeled icon button fluid"
                                    onclick="handleNoDomain(this,
                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                        'IWAAuthenticator')"
                                    id="icon-<%=iconId%>"
                                    title="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> IWA">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> <strong>IWA</strong>
                                </button>
                            </div>
                            <%
                                }
                                if (localAuthenticatorNames.contains(X509_CERTIFICATE_AUTHENTICATOR)) {
                            %>
                            <div class="social-login blurring social-dimmer">
                                <div class="field">
                                    <button class="ui secondary button" onclick="handleNoDomain(this,
                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                        'x509CertificateAuthenticator')" id="icon-<%=iconId%>"
                                        title="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> X509 Certificate"
                                    >
                                        <img
                                            class="ui image"
                                            src="libs/themes/default/assets/images/icons/x509-authenticator-icon.svg"
                                            alt="Magic Link Logo"
                                            role="presentation"
                                        />
                                        <span>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> x509 Certificate
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <br />
                            <%
                                }
                                if (localAuthenticatorNames.contains(FIDO_AUTHENTICATOR)) {
                            %>
                            <div class="social-login blurring social-dimmer">
                                <div class="field">
                                    <button class="ui button" onclick="handleNoDomain(this,
                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                        'FIDOAuthenticator')" id="icon-<%=iconId%>"
                                        title="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.authenticator" )%>"
                                        data-componentid="login-page-sign-in-with-fido"
                                    >
                                        <img
                                            class="ui image"
                                            src="libs/themes/default/assets/images/authenticators/fido-passkey-black.svg"
                                            alt="Fido Logo"
                                            role="presentation" />
                                        <span>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with" )%>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "fido.authenticator" )%>
                                        </span>

                                    </button>
                                </div>
                            </div>
                            <br />
                            <%
                                }
                                    if (localAuthenticatorNames.contains(MAGIC_LINK_AUTHENTICATOR)) {
                            %>
                            <div class="social-login blurring social-dimmer">
                                <div class="field">
                                    <button class="ui secondary button" onclick="handleNoDomain(this,
                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                        '<%=MAGIC_LINK_AUTHENTICATOR%>')" id="icon-<%=iconId%>"
                                        title="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "magic.link" )%>"
                                        data-componentid="login-page-sign-in-with-magic-link">
                                        <img
                                            class="ui image"
                                            src="libs/themes/default/assets/images/icons/magic-link-icon.svg"
                                            alt="Magic Link Logo"
                                            role="presentation" />
                                        <span>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with" )%>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "magic.link" )%>
                                        </span>

                                    </button>
                                </div>
                            </div>
                            <br />
                            <%
                                }
                                if (localAuthenticatorNames.contains("totp")) {
                            %>
                                <div class="social-login blurring social-dimmer">
                                <div class="field">
                                        <button
                                            type="button"
                                            id="icon-<%=iconId%>"
                                            class="ui button secondary"
                                            data-testid="login-page-sign-in-with-totp"
                                            onclick="handleNoDomain(this,
                                                '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                                'totp')"
                                        >
                                        <img
                                            class="ui image"
                                            src="libs/themes/default/assets/images/icons/outline-icons/clock-outline.svg"
                                            alt="TOTP Logo"
                                            role="presentation">
                                        <span>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "totp")%>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <br>
                            <%
                                }
                                if (localAuthenticatorNames.contains("sms-otp-authenticator")) {
                            %>
                                <div class="social-login blurring social-dimmer">
                                <div class="field">
                                        <button
                                            type="button"
                                            id="icon-<%=iconId%>"
                                            class="ui button"
                                            data-testid="login-page-sign-in-with-sms-otp-authenticator"
                                            onclick="handleNoDomain(this,
                                                '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                                'sms-otp-authenticator')"
                                        >
                                        <img class="ui image" src="libs/themes/default/assets/images/icons/sms-icon.svg">
                                        <span>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sms.otp")%>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <br>
                            <%
                                        }
                                if (localAuthenticatorNames.contains("email-otp-authenticator")) {
                            %>
                                <div class="social-login blurring social-dimmer">
                                <div class="field">
                                        <button
                                            type="button"
                                            id="icon-<%=iconId%>"
                                            class="ui button secondary"
                                            data-testid="login-page-sign-in-with-email-otp"
                                            onclick="handleNoDomain(this,
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                                    'email-otp-authenticator')"
                                        >
                                        <img
                                            class="ui image"
                                            src="libs/themes/default/assets/images/icons/solid-icons/email-solid.svg"
                                            alt="Email OTP Logo"
                                            role="presentation">
                                        <span>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "email.otp")%>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <br>
                            <%
                                        }
                                if (localAuthenticatorNames.contains("push-notification-authenticator")) {
                            %>
                                <div class="social-login blurring social-dimmer">
                                <div class="field">
                                        <button
                                            type="button"
                                            id="icon-<%=iconId%>"
                                            class="ui button secondary"
                                            data-testid="login-page-sign-in-with-push-notification"
                                            onclick="handleNoDomain(this,
                                                    '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                                    'push-notification-authenticator')"
                                        >
                                        <img
                                            class="ui image"
                                            src="libs/themes/default/assets/images/icons/push.svg"
                                            alt="Push Notification Logo"
                                            role="presentation">
                                        <span>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%>
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "push.notification")%>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <br>
                            <%
                                        }
                                for (String localAuthenticator : localAuthenticatorNames) {
                                    if (registeredLocalAuthenticators.contains(localAuthenticator)) {
                                        continue;
                                    }

                                    if (localAuthenticator.startsWith(CUSTOM_LOCAL_AUTHENTICATOR_PREFIX)) {

                                        String customLocalAuthenticatorImageURL = "libs/themes/default/assets/images/authenticators/custom-authenticator.svg";
                                        String customLocalAuthenticatorDisplayName = localAuthenticator;
                                        Map<String, String> authenticatorConfigMap = new HashMap<>();
                                        try {
                                            AuthenticatorDataRetrievalClient authenticatorDataRetrievalClient = new AuthenticatorDataRetrievalClient();
                                            authenticatorConfigMap = authenticatorDataRetrievalClient.getAuthenticatorConfig(tenantDomain, localAuthenticator);
                                        } catch (AuthenticatorDataRetrievalClientException e) {
                                            // Exception is ignored and the default values will be used as a fallback.
                                        }

                                        if (MapUtils.isNotEmpty(authenticatorConfigMap) && authenticatorConfigMap.containsKey("definedBy")
                                            && authenticatorConfigMap.get("definedBy").equals("USER")) {

                                            if (authenticatorConfigMap.containsKey("image")) {
                                                customLocalAuthenticatorImageURL = authenticatorConfigMap.get("image");
                                            }
                                            customLocalAuthenticatorDisplayName = authenticatorConfigMap.get("displayName");
                            %>
                                <div class="social-login blurring social-dimmer">
                                    <div class="field">
                                            <button
                                                type="button"
                                                id="icon-<%=iconId%>"
                                                class="ui button secondary"
                                                data-testid="login-page-sign-in-with-<%=Encode.forHtmlAttribute(localAuthenticator)%>"
                                                onclick="handleNoDomain(this,
                                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(localAuthenticator))%>')"
                                            >
                                            <img
                                                class="ui image"
                                                src="<%=Encode.forHtmlAttribute(customLocalAuthenticatorImageURL)%>"
                                                alt="<%=Encode.forHtmlAttribute(localAuthenticator)%> Logo"
                                                role="presentation">
                                            <span>
                                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%>
                                                <%=Encode.forHtmlAttribute(customLocalAuthenticatorDisplayName)%>
                                            </span>
                                            </button>
                                    </div>
                                </div>
                            <br>
                            <br>
                            <%
                                            continue;
                                        }
                                    }
                            %>
                                <div class="social-login blurring social-dimmer">
                                    <div class="field">
                                            <button
                                                type="button"
                                                id="icon-<%=iconId%>"
                                                class="ui button secondary"
                                                data-testid="login-page-sign-in-with-<%=localAuthenticator%>"
                                                onclick="handleNoDomain(this,
                                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(idpEntry.getKey()))%>',
                                                        '<%=localAuthenticator%>')"
                                            >
                                            <img
                                                class="ui image"
                                                src="libs/themes/default/assets/images/authenticators/<%=localAuthenticator%>.svg"
                                                alt="<%=localAuthenticator%> Logo"
                                                role="presentation">
                                            <span>
                                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%>
                                                <%=localAuthenticator%>
                                            </span>
                                            </button>
                                    </div>
                            </div>
                            <br>
                            <%
                                }
                                    }
                                }
                                if (isOrgEnterpriseUserLogin) { %>
                                        <div class="social-login blurring social-dimmer">
                                            <div class="field">
                                                <button
                                                    id="org-continue-button"
                                                    type="button"
                                                    class="ui button"
                                                    data-testid='login-page-sign-in-with-<%=Encode.forHtmlContent(ENTERPRISE_USER_LOGIN_ORG)%>'
                                                    onclick="handleOrgEnterpriseIdp(this,
                                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(ENTERPRISE_USER_LOGIN_ORG))%>',
                                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(ENTERPRISE_USER_LOGIN_AUTHENTICATOR))%>',
                                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(userTenantDomain))%>')"
                                                    >
                                                        <img class="ui image" src="libs/themes/wso2is/assets/images/branding/asgardeo-trifacta.svg">
                                                        <span>
                                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue.with")%>
                                                            <%=Encode.forHtmlContent("Asgardeo")%>
                                                        </span>
                                                </button>
                                            </div>
                                        </div>
                                    <% } else if (isEnterpriseUserLogin && StringUtils.equals(userType, USER_TYPE_ASGARDEO)) { %>
                                        <div class="social-login blurring social-dimmer">
                                            <div class="field">
                                                <button
                                                    id="asgardeo-continue-button"
                                                    type="button"
                                                    class="ui button"
                                                    data-testid='login-page-sign-in-with-<%=Encode.forHtmlContent(ENTERPRISE_USER_LOGIN_IDP)%>'
                                                    onclick="handleEnterpriseIdp(this,
                                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(ENTERPRISE_USER_LOGIN_IDP))%>',
                                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(ENTERPRISE_USER_LOGIN_AUTHENTICATOR))%>',
                                                        '<%=Encode.forJavaScriptAttribute(Encode.forUriComponent(userTenantDomain))%>')"
                                                    >
                                                        <img class="ui image" src="libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg">
                                                        <span>
                                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue.with")%>
                                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "organization")%>
                                                        </span>
                                                </button>
                                            </div>
                                        </div>
                                    <% }
                            } %>
                            </div>
                        </div>
                    <% } %>

                    <%
                    String clientId = Encode.forHtmlAttribute(request.getParameter("client_id"));
                    String urlParameters = "";
                    if (
                        !isSelfSignUpEnabledInTenant
                        && StringUtils.isNotBlank(application.getInitParameter("AccountRegisterEndpointURL"))
                        && (
                            StringUtils.equals("CONSOLE",clientId)
                            || (
                                StringUtils.equals("MY_ACCOUNT",clientId)
                                && StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT)
                            )
                        )
                        && !StringUtils.equals("true", promptAccountLinking)) {
                            String recoveryEPAvailable = application.getInitParameter("EnableRecoveryEndpoint");
                            String enableSelfSignUpEndpoint = application.getInitParameter("EnableSelfSignUpEndpoint");
                            Boolean isRecoveryEPAvailable = false;
                            Boolean isSelfSignUpEPAvailable = false;
                            String urlEncodedURL = "";
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
                                if (StringUtils.equals("business-app", insightsAppIdentifier)) {
                                    String scheme = request.getScheme();
                                    String serverName = request.getServerName();
                                    int serverPort = request.getServerPort();
                                    String uri = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_REQUEST_URI);
                                    String prmstr = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING);
                                    String urlWithoutEncoding = scheme + "://" +serverName + ":" + serverPort + uri + "?" + prmstr;
                                    if ((scheme == "http" && serverPort == HttpURL.DEFAULT_PORT) || (scheme == "https" && serverPort == HttpsURL.DEFAULT_PORT)) {
                                        urlWithoutEncoding = scheme + "://" + serverName + uri + "?" + prmstr;
                                    }
                                    urlEncodedURL = URLEncoder.encode(urlWithoutEncoding, UTF_8);
                                    urlParameters = prmstr;
                                } else {
                                    urlParameters = "utm_source=" + insightsAppIdentifier;
                                }
                                if (StringUtils.isBlank(accountRegistrationEndpointContextURL)) {
                                    accountRegistrationEndpointContextURL = identityMgtEndpointContextURL + ACCOUNT_RECOVERY_ENDPOINT_REGISTER;
                                }
                            }
                        %>
                            <div class="mt-4 mb-4">
                                <div class="mt-3 external-link-container text-small">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "dont.have.an.account")%>
                                    <a
                                        onclick="handleSignupClick()"
                                        href="<%=getRegistrationPortalUrl(accountRegistrationEndpointContextURL, urlEncodedURL, urlParameters)%>"
                                        target="_self"
                                        class="clickable-link"
                                        rel="noopener noreferrer"
                                        data-testid="login-page-early-signup-link"
                                        style="cursor: pointer;"
                                    >
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "register")%>
                                    </a>
                                </div>
                            </div>
                        <% }
                        if (
                            !StringUtils.equals("CONSOLE",clientId)
                            && !StringUtils.equals("MY_ACCOUNT",clientId) && !hasLocalLoginOptions && hasFederatedOptions &&
                            isSelfSignUpEnabledInTenant && isSelfSignUpEnabledInTenantPreferences
                        ) {
                                urlParameters = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING);
                        %>
                                <div class="ui horizontal divider">
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "or")%>
                                </div>
                                <div class="mt-0">
                                <div class="buttons">
                                    <button
                                        type="button"
                                        <% if(StringUtils.isNotBlank(selfSignUpOverrideURL)) { %>
                                        onclick="window.location.href='<%=i18nLink(userLocale, selfSignUpOverrideURL)%>';"
                                        <% } else { %>
                                        onclick="window.location.href='<%=StringEscapeUtils.escapeHtml4(getRegistrationPortalUrl(accountRegistrationEndpointContextURL, srURLEncodedURL, urlParameters))%>';"
                                        <% } %>
                                        class="ui large fluid button secondary"
                                        id="registerLink"
                                        role="button"
                                        data-testid="login-page-create-account-button"
                                    >
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "create.an.account")%>
                                    </button>
                                </div>
                            </div>
                        <% } %>
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

    <script src="util/string-utils.js"></script>

    <script>

        <% if (Boolean.parseBoolean(request.getParameter("isSelfRegistration"))) { %>
                $(".ui.segment").hide();
                window.location = "<%=getRegistrationPortalUrl(accountRegistrationEndpointContextURL, srURLEncodedURL, (String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING))%>";
        <% } %>

        function handleCredentialResponse(response) {
            $('#credential').val(response.credential);
            $('#googleOneTapForm').submit();
        }

        var passwordField = $("#password");
        var usernameField = $("#usernameUserInput");

        var insightsAppIdentifier = "<%=insightsAppIdentifier%>";
        var insightsTenantIdentifier = "<%=insightsTenantIdentifier%>";

        function checkSessionKey() {
            $.ajax({
                type: "GET",
                url: "<%= Encode.forJavaScriptBlock(loginContextRequestUrl)%>",
                xhrFields: { withCredentials: true },
                success: function (data) {
                    if (data && data.status == 'redirect' && data.redirectUrl && data.redirectUrl.length > 0) {
                        window.location.href = data.redirectUrl;
                    }
                },
                cache: false
            });
        }

        // show password function
        function showPassword() {
            if (passwordField.attr("type") === 'text') {
                passwordField.attr("type", "password")
                document.getElementById("password-eye").classList.add("slash");
            } else {
                passwordField.attr("type", "text")
                document.getElementById("password-eye").classList.remove("slash");
            }
        }

        function getParameterByName(name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return "";
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        $(document).ready(function () {
            var label = $("#user-name-label");
            var NATIVE_ELEMENT = 0;
            /**
             * Below condition will trigger the label popup based on the
             * text overflown property. Basically, if the text is overflown
             * we will attach the popup to the label. Otherwise we don't.
             *
             * Note that we are immediately evaluating this expression on
             * document ready state. This is because, when the user gets to
             * this page the email address / username is uneditable and is
             * represented in a label format. So, we don't need to periodically
             * check the label length changes.
             *
             * {@code NATIVE_ELEMENT} is used to access the native element
             * of the queried jquery element. There's a another variant called
             * $.get(index) but it is slow compared to computed index access.
             */
            if (label && label[NATIVE_ELEMENT]) {
                if (label[NATIVE_ELEMENT].offsetWidth < label[NATIVE_ELEMENT].scrollWidth)
                    label.popup({lastResort: "top left"});
            }

            $('.main-link').click(function () {
                $('.main-link').next().hide();
                $(this).next().toggle('fast');
                var w = $(document).width();
                var h = $(document).height();
                $('.overlay').css("width", w + "px").css("height", h + "px").show();
            });

            $('.overlay').click(function () {
                $(this).hide();
                $('.main-link').next().hide();
            });

            $('.ui.dimmer').dimmer({
                on: 'hover',
                duration : {
                    show : 500,
                    hide : 500
                }
            });

            <%
                if(reCaptchaEnabled) {
            %>
                var error_msg = $("#error-msg");

                $("#loginForm").submit(function (e) {
                    var resp = $("[name='g-recaptcha-response']")[0].value;
                    if (resp.trim() == '') {
                        error_msg.text("<%=AuthenticationEndpointUtil.i18n(resourceBundle,"please.select.recaptcha")%>");
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        return false;
                    }
                    return true;
                });
            <%
                }
            %>

            passwordField.focusin();
            usernameField.focusin();
        });

        function myFunction(key, value, name) {
            var object = document.getElementById(name);
            var domain = object.value;


            if (domain != "") {
                document.location = "<%=commonauthURL%>?idp=" + key + "&authenticator=" + value +
                        "&sessionDataKey=<%=Encode.forUriComponent(request.getParameter("sessionDataKey"))%>&domain=" +
                        domain;
            } else {
                document.location = "<%=commonauthURL%>?idp=" + key + "&authenticator=" + value +
                        "&sessionDataKey=<%=Encode.forUriComponent(request.getParameter("sessionDataKey"))%>";
            }
        }

        function handleNoDomain(elem, key, value) {
            var linkClicked = "link-clicked";
            if ($(elem).hasClass(linkClicked)) {
                console.warn("Preventing multi click.")
            } else {
                trackEvent("authentication-portal-click-sign-in-with", {
                    "type": StringUtils.kebabCase(value),
                    "app": insightsAppIdentifier,
                    "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
                });

                $(elem).addClass(linkClicked);

                var baseLocation = "<%=commonauthURL%>?idp=" + key + "&authenticator=" + value +
                    "&sessionDataKey=<%=Encode.forUriComponent(request.getParameter("sessionDataKey"))%>";

                if ("<%=Encode.forJavaScript(username)%>" !== "null" && "<%=Encode.forJavaScript(username)%>".length > 0) {
                    document.location = baseLocation + "&username=" + "<%=Encode.forUriComponent(username)%>" + "<%=multiOptionURIParam%>";
                } else {
                    document.location = baseLocation + "<%=multiOptionURIParam%>";
                }
            }
        }

        function handleEnterpriseIdp(elem, key, value, tenant) {
            var linkClicked = "link-clicked";
            if ($(elem).hasClass(linkClicked)) {
                console.warn("Preventing multi click.")
            } else {
                trackEvent("authentication-portal-click-sign-in-with", {
                    "type": StringUtils.kebabCase(value),
                    "app": insightsAppIdentifier,
                    "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
                });

                $(elem).addClass(linkClicked);
                document.location = "<%=oauth2AuthorizeURL%>?idp=" + key + "&authenticator=" + value +
                    "&fidp=EnterpriseIDP" + "&org=" + tenant +
                    "&code_challenge_method=<%=Encode.forUriComponent(request.getParameter("code_challenge_method"))%>" +
                    "&code_challenge=<%=Encode.forUriComponent(request.getParameter("code_challenge"))%>" +
                    "&response_type=<%=Encode.forUriComponent(request.getParameter("response_type"))%>" +
                    "&client_id=<%=Encode.forUriComponent(request.getParameter("client_id"))%>" +
                    "&scope=<%=Encode.forUriComponent(request.getParameter("scope"))%>" +
                    "&redirect_uri=<%=Encode.forUriComponent(request.getParameter("redirect_uri"))%>" +
                    "&response_mode=<%=Encode.forUriComponent(request.getParameter("response_mode"))%>";
            }
        }

        function handleOrgEnterpriseIdp(elem, key, value, tenant) {
            var linkClicked = "link-clicked";
            if ($(elem).hasClass(linkClicked)) {
                console.warn("Preventing multi click.")
            } else {
                trackEvent("authentication-portal-click-sign-in-with", {
                    "type": StringUtils.kebabCase(value),
                    "app": insightsAppIdentifier,
                    "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
                });

                $(elem).addClass(linkClicked);
                document.location = "<%=consoleURL%>" + "/t/" + tenant + "?utype=<%=USER_TYPE_ASGARDEO%>";
            }
        }

        window.onunload = function(){};

        function changeUsername (e) {
            document.getElementById("changeUserForm").submit();
        }

        $('.isHubIdpPopupButton').popup({
            popup: '.isHubIdpPopup',
            on: 'click',
            position: 'top left',
            delay: {
                show: 300,
                hide: 800
            }
        });

        function handleSignupClick() {
            trackEvent("authentication-portal-click-signup", {
                "app": insightsAppIdentifier,
                "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
            });
        }
    </script>

    <%!
        private boolean isIdentifierFirstLogin(String inputType) {
            return "idf".equalsIgnoreCase(inputType);
        }

        private boolean isLoginHintAvailable(String inputType) {
            return "login_hint".equalsIgnoreCase(inputType);
        }
    %>
</body>
</html>
