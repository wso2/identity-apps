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

<%@ page import="org.apache.commons.collections.map.HashedMap" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.core.SameSiteCookie" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>
<%@ page import="org.wso2.carbon.identity.mgt.constants.SelfRegistrationStatusCodes" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.SelfRegistrationMgtClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.SelfRegistrationMgtClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.SelfRegisterApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.UsernameRecoveryApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.*" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="org.wso2.carbon.identity.base.IdentityRuntimeException" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.Base64" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="javax.servlet.http.Cookie" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.JsonObject" %>
<%@ page import="org.apache.commons.logging.Log" %>
<%@ page import="org.apache.commons.logging.LogFactory" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    // Add the sign-up screen to the list to retrieve text branding customizations.
    screenNames.add("sign-up");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    Log log = LogFactory.getLog(this.getClass());
    String ERROR_MESSAGE = "errorMsg";
    String ERROR_CODE = "errorCode";
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    String SELF_REGISTRATION_WITH_VERIFICATION_PAGE = "self-registration-with-verification.jsp";
    String SELF_REGISTRATION_WITHOUT_VERIFICATION_PAGE = "* self-registration-without-verification.jsp";
    String passwordPatternErrorCode = "20035";
    String usernamePatternErrorCode = "20045";
    String duplicateClaimValueErrorCode = "60007";
    String usernameAlreadyExistsErrorCode = "20030";
    String AUTO_LOGIN_COOKIE_NAME = "ALOR";
    String AUTO_LOGIN_COOKIE_DOMAIN = "AutoLoginCookieDomain";
    String AUTO_LOGIN_FLOW_TYPE = "SELF_SIGNUP";
    PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
    Boolean isAutoLoginEnable = preferenceRetrievalClient.checkAutoLoginAfterSelfRegistrationEnabled(tenantDomain);
    Boolean isSelfRegistrationLockOnCreationEnabled = preferenceRetrievalClient.checkSelfRegistrationLockOnCreation(tenantDomain);
    Boolean isShowUsernameUnavailabilityEnabled = preferenceRetrievalClient.checkSelfRegistrationShowUsernameUnavailability(tenantDomain);
    Boolean isAccountVerificationEnabled = preferenceRetrievalClient.checkSelfRegistrationSendConfirmationOnCreation(tenantDomain);

    boolean isSelfRegistrationWithVerification =
            Boolean.parseBoolean(request.getParameter("isSelfRegistrationWithVerification"));
    boolean allowchangeusername = Boolean.parseBoolean(request.getParameter("allowchangeusername"));
    String userLocaleForClaim = request.getHeader("Accept-Language");
    String username = Encode.forJava(request.getParameter("username"));
    String password = request.getParameter("password");
    String sessionDataKey = request.getParameter("sessionDataKey");
    String sp = Encode.forJava(request.getParameter("sp"));
    String spId = "";
    String applicationAccessUrl = "";
    JSONObject usernameValidityResponse;
    SelfRegistrationMgtClient selfRegistrationMgtClient = new SelfRegistrationMgtClient();
    String callback = request.getParameter("callback");
    String consent = request.getParameter("consent");
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));
    boolean skipSignUpEnableCheck = Boolean.parseBoolean(request.getParameter("skipsignupenablecheck"));
    String policyURL = privacyPolicyURL;
    String tenantAwareUsername = "";
    boolean isDetailedResponseEnabled = Boolean.parseBoolean(application.getInitParameter("isSelfRegistrationDetailedApiResponseEnabled"));

    if (error) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", errorMsg);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    try {
        if (sp.equals("My Account")) {
            spId = "My_Account";
        } else {
            ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
            spId = applicationDataRetrievalClient.getApplicationID(tenantDomain, sp);
            applicationAccessUrl = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain, sp);
        }
    } catch (Exception e) {
        spId = (StringUtils.isBlank(spId) || (request.getParameter("spId") != "null" ))?
                    Encode.forJava(request.getParameter("spId")) :
                    "";
    }

    Boolean isValidCallBackURL = false;
    try {
        if (StringUtils.isNotBlank(applicationAccessUrl)) {
            // Honour accessUrl over callback url.
            callback = applicationAccessUrl;
            isValidCallBackURL = true;
        } else if (StringUtils.isNotBlank(callback)) {
            isValidCallBackURL = preferenceRetrievalClient.checkIfSelfRegCallbackURLValid(tenantDomain,callback);
        }
    } catch (PreferenceRetrievalClientException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil
            .i18n(recoveryResourceBundle, "something.went.wrong.contact.admin"));
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    try {
        if (StringUtils.isNotBlank(callback) && !isValidCallBackURL) {
            request.setAttribute("error", true);
            request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "Callback.url.format.invalid"));
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }
    } catch (IdentityRuntimeException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", e.getMessage());
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    if (StringUtils.isNotEmpty(consent)) {
        consent = IdentityManagementEndpointUtil.buildConsentForResidentIDP
                (username, consent, "USA",
                        IdentityManagementEndpointConstants.Consent.COLLECTION_METHOD_SELF_REGISTRATION,
                        IdentityManagementEndpointConstants.Consent.LANGUAGE_ENGLISH, policyURL,
                        IdentityManagementEndpointConstants.Consent.EXPLICIT_CONSENT_TYPE,
                        true, false, IdentityManagementEndpointConstants.Consent.INFINITE_TERMINATION);
    }

    /**
    * For SaaS application read from user tenant from parameters.
    */
    String srtenantDomain = request.getParameter("srtenantDomain");
    if (StringUtils.isNotBlank(srtenantDomain)) {
        tenantDomain = srtenantDomain;
    }

    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
        application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
    }

    User user = IdentityManagementServiceUtil.getInstance().resolveUser(username, tenantDomain, isSaaSApp);

    if (StringUtils.isEmpty(username)) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Pick.username"));
        request.getRequestDispatcher("register.do").forward(request, response);
        return;
    }

    if (Boolean.parseBoolean(application.getInitParameter("useUserNameWithDomainForSelfSignUpNameCheck"))
            && StringUtils.isBlank(user.getRealm())) {
        String userDomain = application.getInitParameter("DefaultBusinessUserStore").toString();
        user.setUsername(IdentityManagementEndpointUtil.getFullQualifiedUsername(username,tenantDomain,userDomain));
        user.setRealm(userDomain);
        user.setTenantDomain(tenantDomain);
    }

    try {
        usernameValidityResponse = selfRegistrationMgtClient.checkUsernameValidityStatus(user, skipSignUpEnableCheck);
    } catch (SelfRegistrationMgtClientException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil
                .i18n(recoveryResourceBundle, "Something.went.wrong.while.registering.user") + Encode
                .forHtmlContent(username) + IdentityManagementEndpointUtil
                .i18n(recoveryResourceBundle, "Please.contact.administrator"));

        if (allowchangeusername) {
            request.getRequestDispatcher("register.do").forward(request, response);
        } else {
            IdentityManagementEndpointUtil.addErrorInformation(request, e);
            if (!StringUtils.isBlank(username)) {
                request.setAttribute("username", username);
            }
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }
        return;
    }

    Integer userNameValidityStatusCode = usernameValidityResponse.getInt("code");
    String errorCode = String.valueOf(userNameValidityStatusCode);

    if (!SelfRegistrationStatusCodes.CODE_USER_NAME_AVAILABLE.equalsIgnoreCase(userNameValidityStatusCode.toString())) {
        if (allowchangeusername) {
            request.setAttribute("error", true);
            request.setAttribute("errorCode", userNameValidityStatusCode);
            if (usernameValidityResponse.has("message") &&
                usernameValidityResponse.get("message") instanceof String) {
                request.setAttribute("errorMessage", usernameValidityResponse.getString("message"));
            }
            request.getRequestDispatcher("register.do").forward(request, response);
        } else if (!skipSignUpEnableCheck
            && SelfRegistrationStatusCodes.ERROR_CODE_USER_ALREADY_EXISTS.equalsIgnoreCase(errorCode)) {
            if (isAccountVerificationEnabled && !isShowUsernameUnavailabilityEnabled) {
                request.setAttribute("callback", callback);
                if (StringUtils.isNotBlank(srtenantDomain)) {
                    request.setAttribute("srtenantDomain", srtenantDomain);
                }
                request.setAttribute("sessionDataKey", sessionDataKey);
                request.getRequestDispatcher("self-registration-complete.jsp").forward(request, response);
            } else {
                request.setAttribute("error", true);
                request.setAttribute("errorCode", userNameValidityStatusCode);
                request.getRequestDispatcher("register.do").forward(request, response);
            }
            return;
        } else {
            if (SelfRegistrationStatusCodes.ERROR_CODE_INVALID_TENANT.equalsIgnoreCase(errorCode)) {
                errorMsg = i18n(recoveryResourceBundle, customText, "invalid.tenant.domain") +
                    " - " + user.getTenantDomain() + ".";
            } else if (SelfRegistrationStatusCodes.ERROR_CODE_USER_ALREADY_EXISTS.equalsIgnoreCase(errorCode)) {
                errorMsg = i18n(recoveryResourceBundle, customText, "Username") +
                    " " + username + " " + i18n(recoveryResourceBundle, customText, "is.already.taken");
            } else if (SelfRegistrationStatusCodes.CODE_USER_NAME_INVALID.equalsIgnoreCase(errorCode)) {
                // If there is a custom error message configured in Resources.properties file or in
                // Branding preferences, sign.up.username.validation.error.message will use that message
                String i18nUsernameValidationErrorMessage = i18n(recoveryResourceBundle, customText,
                    "sign.up.username.validation.error.message");

                if (StringUtils.isNotBlank(i18nUsernameValidationErrorMessage) &&
                    !i18nUsernameValidationErrorMessage.equals("sign.up.username.validation.error.message")) {
                    errorMsg = i18nUsernameValidationErrorMessage;
                } else {
                    // If there is no i18n entry for the error message, check if there is a custom error message
                    // UsernameJavaRegExViolationErrorMsg configured in deployment.toml
                    // Else, use the default error message
                    if (usernameValidityResponse.has("message") &&
                        usernameValidityResponse.get("message") instanceof String &&
                        StringUtils.isNotBlank(usernameValidityResponse.getString("message"))) {
                        errorMsg = usernameValidityResponse.getString("message");
                    } else {
                        errorMsg = user.getUsername() + " " + i18n(recoveryResourceBundle, customText,
                            "invalid.username.pick.a.valid.username");
                    }
                }
            } else {
                // Generic error message for other error codes
                errorMsg = errorMsg + i18n(recoveryResourceBundle, customText,
                    "please.contact.administrator.to.fix.issue");
            }
            request.setAttribute("errorMsg", errorMsg);
            request.setAttribute("errorCode", errorCode);
            if (!StringUtils.isBlank(username)) {
                request.setAttribute("username", username);
            }
            request.getRequestDispatcher("error.jsp").forward(request, response);
        }
        return;
    }
    if (StringUtils.isBlank(username)) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "Username.cannot.be.empty"));
        if (isSelfRegistrationWithVerification) {
            request.getRequestDispatcher("self-registration-with-verification.jsp").forward(request, response);
        } else {
            request.getRequestDispatcher("* self-registration-without-verification.jsp").forward(request, response);
        }
    }

    if (StringUtils.isBlank(password)) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "Password.cannot.be.empty"));
        if (isSelfRegistrationWithVerification) {
            request.getRequestDispatcher("self-registration-with-verification.jsp").forward(request, response);
        } else {
            request.getRequestDispatcher("* self-registration-without-verification.jsp").forward(request, response);
        }
    }

    session.setAttribute("username", username);

    if (StringUtils.isBlank(user.getRealm())
            && !StringUtils.isBlank(application.getInitParameter("DefaultBusinessUserStore"))) {
        user.setRealm(application.getInitParameter("DefaultBusinessUserStore"));
        user.setTenantDomain(tenantDomain);
    }

    Claim[] claims = new Claim[0];

    List<Claim> claimsList;
    UsernameRecoveryApi usernameRecoveryApi = new UsernameRecoveryApi();
    try {
        claimsList = usernameRecoveryApi.claimsGet(user.getTenantDomain(), true, "selfRegistration");
        if (claimsList != null) {
            claims = claimsList.toArray(new Claim[claimsList.size()]);
        }
    } catch (ApiException e) {
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }


    List<Claim> userClaimList = new ArrayList<Claim>();
    try {

        for (Claim claim : claims) {
            if (StringUtils.isNotBlank(request.getParameter(claim.getUri()))) {
                Claim userClaim = new Claim();
                userClaim.setUri(claim.getUri());
                userClaim.setValue(request.getParameter(claim.getUri()));
                userClaimList.add(userClaim);

            } else if (claim.getUri().trim().equals(IdentityUtil.getClaimUriLocale())
                    && StringUtils.isNotBlank(userLocaleForClaim)) {

                Claim localeClaim = new Claim();
                localeClaim.setUri(claim.getUri());
                localeClaim.setValue(userLocaleForClaim.split(",")[0].replace('-', '_'));
                userClaimList.add(localeClaim);

            }
        }

        SelfRegistrationUser selfRegistrationUser = new SelfRegistrationUser();
        selfRegistrationUser.setUsername(username);
        selfRegistrationUser.setTenantDomain(user.getTenantDomain());
        selfRegistrationUser.setRealm(user.getRealm());
        selfRegistrationUser.setPassword(password);
        selfRegistrationUser.setClaims(userClaimList);

        List<Property> properties = new ArrayList<Property>();
        Property sessionKey = new Property();
        sessionKey.setKey("callback");
        sessionKey.setValue(URLEncoder.encode(callback, "UTF-8"));

        Property consentProperty = new Property();
        consentProperty.setKey("consent");
        consentProperty.setValue(consent);

        Property spProperty = new Property();
        spProperty.setKey("sp");
        spProperty.setValue(sp);

        Property spIdProperty = new Property();
        spIdProperty.setKey("spId");
        spIdProperty.setValue(spId);

        Property appIsAccessUrlAvailableProperty = new Property();
        appIsAccessUrlAvailableProperty.setKey("isAccessUrlAvailable");
        appIsAccessUrlAvailableProperty.setValue(String.valueOf(StringUtils.isNotBlank(applicationAccessUrl)));
        properties.add(appIsAccessUrlAvailableProperty);

        properties.add(sessionKey);
        properties.add(consentProperty);
        properties.add(spProperty);
        properties.add(spIdProperty);
        properties.add(appIsAccessUrlAvailableProperty);

        SelfUserRegistrationRequest selfUserRegistrationRequest = new SelfUserRegistrationRequest();
        selfUserRegistrationRequest.setUser(selfRegistrationUser);
        selfUserRegistrationRequest.setProperties(properties);

        Map<String, String> requestHeaders = new HashedMap();
        if (request.getParameter("g-recaptcha-response") != null) {
            requestHeaders.put("g-recaptcha-response", request.getParameter("g-recaptcha-response"));
        }

        SelfRegisterApi selfRegisterApi = new SelfRegisterApi();
        String responseContent = selfRegisterApi.mePostCall(selfUserRegistrationRequest, requestHeaders);
        if (IdentityManagementEndpointConstants.PENDING_APPROVAL.equals(responseContent)) {
            request.setAttribute("pendingApproval", "true");
        }

        // Extract userId from response if available
        String userId = "";
        if (isDetailedResponseEnabled && StringUtils.isNotBlank(responseContent)) {
            try {
                Gson gson = new Gson();
                JsonObject jsonResponse = gson.fromJson(responseContent, JsonObject.class);
                if (jsonResponse.has("userId")) {
                    userId = jsonResponse.get("userId").getAsString();
                }
            } catch (Exception e) {
                log.error("Error extracting userId from successful user registration response", e);
            }
        }

        // Add auto login cookie.
        if (isAutoLoginEnable && !isSelfRegistrationLockOnCreationEnabled) {
            if (StringUtils.isNotEmpty(user.getRealm())) {
                tenantAwareUsername = user.getRealm() + "/" + username + "@" + user.getTenantDomain();
            } else {
                tenantAwareUsername = username + "@" + user.getTenantDomain();
            }
            String hostName = ServiceURLBuilder.create().build().getProxyHostName();
            String cookieDomain = IdentityUtil.getRootDomain(hostName);

            JSONObject contentValueInJson = new JSONObject();
            contentValueInJson.put("username", tenantAwareUsername);
            contentValueInJson.put("createdTime", System.currentTimeMillis());
            contentValueInJson.put("flowType", AUTO_LOGIN_FLOW_TYPE);
            if (StringUtils.isNotBlank(cookieDomain)) {
                contentValueInJson.put("domain", cookieDomain);
            }
            String content = contentValueInJson.toString();

            JSONObject cookieValueInJson = new JSONObject();
            cookieValueInJson.put("content", content);
            String signature = Base64.getEncoder().encodeToString(IdentityUtil.signWithTenantKey(content, user.getTenantDomain()));
            cookieValueInJson.put("signature", signature);
            String cookieValue = Base64.getEncoder().encodeToString(cookieValueInJson.toString().getBytes());

            IdentityManagementEndpointUtil.setCookie(request, response, AUTO_LOGIN_COOKIE_NAME, cookieValue,
                300, SameSiteCookie.NONE, "/", cookieDomain);
            request.setAttribute("isAutoLoginEnabled", true);
        }
        request.setAttribute("callback", callback);
        if (StringUtils.isNotBlank(srtenantDomain)) {
            request.setAttribute("srtenantDomain", srtenantDomain);
        }
        if (isDetailedResponseEnabled && StringUtils.isNotBlank(userId)) {
            request.setAttribute("userId", userId);
        }
        request.setAttribute("sessionDataKey", sessionDataKey);
        request.getRequestDispatcher("self-registration-complete.jsp").forward(request, response);

    } catch (Exception e) {
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        String errorCode1 = (String) request.getAttribute("errorCode");
        String errorMsg1 = (String) request.getAttribute("errorMsg");
        if (passwordPatternErrorCode.equals(errorCode1) || duplicateClaimValueErrorCode.equals(errorCode1)) {
            String i18Resource = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, errorCode1);
            if (!i18Resource.equals(errorCode1)) {
                request.setAttribute(ERROR_MESSAGE, i18Resource);
            }
            if (isSelfRegistrationWithVerification) {
                request.getRequestDispatcher(SELF_REGISTRATION_WITH_VERIFICATION_PAGE).forward(request,
                        response);
            } else {
                request.getRequestDispatcher(SELF_REGISTRATION_WITHOUT_VERIFICATION_PAGE).forward(request,
                        response);
            }
            return;
        } else if (usernamePatternErrorCode.equals(errorCode1)) {
            String i18Resource = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, errorCode1);
            if (!i18Resource.equals(errorCode1)) {
                request.setAttribute(ERROR_MESSAGE, i18Resource);
            }
            request.getRequestDispatcher("register.do").forward(request, response);
            return;
        } else if (isAccountVerificationEnabled && !isShowUsernameUnavailabilityEnabled && usernameAlreadyExistsErrorCode.equals(errorCode1)) {
            request.setAttribute("callback", callback);
            if (StringUtils.isNotBlank(srtenantDomain)) {
                request.setAttribute("srtenantDomain", srtenantDomain);
            }
            request.setAttribute("sessionDataKey", sessionDataKey);
            request.getRequestDispatcher("self-registration-complete.jsp").forward(request, response);
        } else {
            if (!StringUtils.isBlank(username)) {
                request.setAttribute("username", username);
            }
            request.getRequestDispatcher("error.jsp").forward(request, response);
        }
    }
%>

<html lang="en-US">
<head>
    <title></title>
</head>
<body>

</body>
</html>
