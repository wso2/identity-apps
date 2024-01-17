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

<%@ page import="org.apache.commons.collections.CollectionUtils" %>
<%@ page import="org.apache.commons.collections.MapUtils" %>
<%@ page import="org.apache.commons.lang.ArrayUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.constants.SelfRegistrationStatusCodes" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.ReCaptchaApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.ReCaptchaProperties" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.SelfRegistrationMgtClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.SelfRegistrationMgtClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.UsernameRecoveryApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Claim" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="org.wso2.carbon.utils.multitenancy.MultitenantUtils" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Locale" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.TreeMap" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorCodeFromRequest = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorCode"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    String previousStep = Encode.forHtmlAttribute(request.getParameter("previous_step"));
    SelfRegistrationMgtClient selfRegistrationMgtClient = new SelfRegistrationMgtClient();
    Integer defaultPurposeCatId = null;
    JSONObject usernameValidityResponse;
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    String emailValue = request.getParameter("username");
    String consentPurposeGroupName = "SELF-SIGNUP";
    String consentPurposeGroupType = "SYSTEM";
    String[] missingClaimList = new String[0];
    String[] missingClaimDisplayName = new String[0];
    Map<String, Claim> uniquePIIs = null;
    boolean piisConfigured = false;
    if (request.getParameter(Constants.MISSING_CLAIMS) != null) {
        missingClaimList = request.getParameter(Constants.MISSING_CLAIMS).split(",");
    }
    if (request.getParameter("missingClaimsDisplayName") != null) {
        missingClaimDisplayName = request.getParameter("missingClaimsDisplayName").split(",");
    }
    boolean allowchangeusername = Boolean.parseBoolean(request.getParameter("allowchangeusername"));
    boolean skipSignUpEnableCheck = Boolean.parseBoolean(request.getParameter("skipsignupenablecheck"));
    boolean isPasswordProvisionEnabled = Boolean.parseBoolean(request.getParameter("passwordProvisionEnabled"));
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));
    String callback = Encode.forHtmlAttribute(request.getParameter("callback"));
    String sp = Encode.forHtmlAttribute(request.getParameter("sp"));

    String emailUsernameEnable = application.getInitParameter("EnableEmailUserName");
    if (StringUtils.isNotBlank(emailUsernameEnable) && Boolean.parseBoolean(emailUsernameEnable)) {
        if (StringUtils.countMatches(username, IdentityManagementEndpointConstants.TENANT_DOMAIN_SEPARATOR) == 1) {
            username = username + IdentityManagementEndpointConstants.TENANT_DOMAIN_SEPARATOR + tenantDomain;
        }
    }

    /**
    * For SaaS applications, read the user tenant from parameters.
    */
    String srtenantDomain = request.getParameter("srtenantDomain");
    if (isSaaSApp && StringUtils.isNotBlank(srtenantDomain)) {
        tenantDomain = srtenantDomain;
    }

    if (skipSignUpEnableCheck) {
        consentPurposeGroupName = "JIT";
    }

    String tenantQualifiedUsername = username;
    if (consentPurposeGroupName == "JIT" && username.contains(IdentityManagementEndpointConstants.TENANT_DOMAIN_SEPARATOR) && tenantDomain != null) {
        if (username.split(IdentityManagementEndpointConstants.TENANT_DOMAIN_SEPARATOR).length == 2) {
            tenantQualifiedUsername = username + IdentityManagementEndpointConstants.TENANT_DOMAIN_SEPARATOR + tenantDomain;
        }
    }

    User user = IdentityManagementServiceUtil.getInstance().resolveUser(tenantQualifiedUsername, tenantDomain, isSaaSApp);

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

    if (StringUtils.isBlank(callback)) {
        callback = Encode.forHtmlAttribute(IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain));
    }

    Integer userNameValidityStatusCode = usernameValidityResponse.getInt("code");
    if (!SelfRegistrationStatusCodes.CODE_USER_NAME_AVAILABLE.equalsIgnoreCase(userNameValidityStatusCode.toString())) {
        if (allowchangeusername || !skipSignUpEnableCheck) {
            request.setAttribute("error", true);
            request.setAttribute("errorCode", userNameValidityStatusCode);
            if (usernameValidityResponse.has("message")) {
                if (usernameValidityResponse.get("message") instanceof String) {
                    request.setAttribute("errorMessage", usernameValidityResponse.getString("message"));
                }
            }
            request.getRequestDispatcher("register.do").forward(request, response);
        } else {
            String errorCode = String.valueOf(userNameValidityStatusCode);
            if (SelfRegistrationStatusCodes.ERROR_CODE_INVALID_TENANT.equalsIgnoreCase(errorCode)) {
                errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "invalid.tenant.domain")
                    + " - " + user.getTenantDomain() + ".";
            } else if (SelfRegistrationStatusCodes.ERROR_CODE_USER_ALREADY_EXISTS.equalsIgnoreCase(errorCode)) {
                errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Username")
                    + " '" + username + "' " + IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "username.already.taken.pick.different.username");
            } else if (SelfRegistrationStatusCodes.CODE_USER_NAME_INVALID.equalsIgnoreCase(errorCode)) {
                errorMsg = user.getUsername() + " " + IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "invalid.username.pick.a.valid.username");
            } else if (SelfRegistrationStatusCodes.ERROR_CODE_INVALID_USERSTORE.equalsIgnoreCase(errorCode)) {
                errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "invalid.userstore.domain") + " - " + user.getRealm();
            }
            request.setAttribute("errorMsg", errorMsg + " "
                + IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "please.contact.administrator.to.fix.issue"));
            request.setAttribute("errorCode", errorCode);
            if (!StringUtils.isBlank(username)) {
                request.setAttribute("username", username);
            }
            request.getRequestDispatcher("error.jsp").forward(request, response);
        }
        return;
    }
    String purposes = selfRegistrationMgtClient.getPurposes(user.getTenantDomain(), consentPurposeGroupName,
            consentPurposeGroupType);
    boolean hasPurposes = StringUtils.isNotEmpty(purposes);
    Claim[] claims = new Claim[0];

    /**
     * Change consentDisplayType to "template" inorder to use a custom html template.
     * other Default values are "row" and "tree".
     */
    String consentDisplayType = "row";

    if (hasPurposes) {
        defaultPurposeCatId = selfRegistrationMgtClient.getDefaultPurposeId(user.getTenantDomain());
        uniquePIIs = IdentityManagementEndpointUtil.getUniquePIIs(purposes);
        if (MapUtils.isNotEmpty(uniquePIIs)) {
            piisConfigured = true;
        }
    }

    List<Claim> claimsList;
    UsernameRecoveryApi usernameRecoveryApi = new UsernameRecoveryApi();
    try {
        claimsList = usernameRecoveryApi.claimsGet(user.getTenantDomain(), false);
        uniquePIIs = IdentityManagementEndpointUtil.fillPiisWithClaimInfo(uniquePIIs, claimsList);
        if (uniquePIIs != null) {
            claims = uniquePIIs.values().toArray(new Claim[0]);
        }
        IdentityManagementEndpointUtil.addReCaptchaHeaders(request, usernameRecoveryApi.getApiClient().getResponseHeaders());

    } catch (ApiException e) {
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    /**
    * Temporarily read recapcha status from password recovery endpoint.
    */
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
%>
<%
    boolean reCaptchaEnabled = false;
    if (request.getAttribute("reCaptcha") != null && "TRUE".equalsIgnoreCase((String) request.getAttribute("reCaptcha"))) {
        reCaptchaEnabled = true;
    } else if (request.getParameter("reCaptcha") != null && Boolean.parseBoolean(request.getParameter("reCaptcha"))) {
        reCaptchaEnabled = true;
    }
%>
<%!
    /**
     * Retrieve all county codes and country display names and
     * store into a map where key/value pair is defined as the
     * country code/country display name.
     *
     * @return {Map<string, string>}
     */
    private Map<String, String> getCountryList() {
        String[] countryCodes = Locale.getISOCountries();

        Map<String, String> mapCountries = new TreeMap<>();

        for (String countryCode : countryCodes) {
            Locale locale = new Locale("", countryCode);
            String country_code = locale.getCountry();
            String country_display_name = locale.getDisplayCountry();
            mapCountries.put(country_code, country_display_name);
        }

        return mapCountries;
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
    <script src='<%=(reCaptchaAPI)%>' async defer></script>
    <%
        }
    %>
    <link rel="stylesheet" href="libs/addons/calendar.min.css"/>
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
                <h3 class="ui header" data-testid="self-registration-with-verification-page-header">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Create.account")%>
                </h3>
                <div class="identifier-container mb-2">
                    <img class="ui image mr-1" alt="Username Icon" src="libs/themes/wso2is/assets/images/user.svg">
                    <span id="user-name-label" class="ellipsis" data-position="top left" data-variation="inverted">
                        <%=Encode.forHtmlAttribute(username)%>
                    </span>
                </div>

                <%-- content --%>
                <div class="segment-form">
                    <% if (skipSignUpEnableCheck) { %>
                    <form class="ui large form" action="../commonauth" method="post" id="register" novalidate>
                            <% } else { %>
                        <form class="ui large form" action="processregistration.do" method="post" id="register" novalidate>
                            <% } %>

                            <div class="">
                                <% if (error) { %>
                                <div class="ui negative message" id="server-error-msg">
                                    <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                                </div>
                                <% } %>

                                <div class="ui negative message" id="error-msg" hidden="hidden">
                                </div>
                                <input id="isSaaSApp" name="isSaaSApp" type="hidden"
                                       value="<%=isSaaSApp%>">
                                <% if (isPasswordProvisionEnabled || !skipSignUpEnableCheck) { %>
                                <p>
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Enter.fields.to.cmplete.reg")%>
                                </p>
                            </div>
                            <div class="ui divider hidden"></div>
                            <%-- validation --%>
                            <div>
                                <div id="regFormError" class="ui negative message" style="display:none"></div>
                                <div id="regFormSuc" class="ui positive message" style="display:none"></div>
                                <% Claim firstNamePII =
                                        uniquePIIs.get(IdentityManagementEndpointConstants.ClaimURIs.FIRST_NAME_CLAIM);
                                   Claim lastNamePII =
                                        uniquePIIs.get(IdentityManagementEndpointConstants.ClaimURIs.LAST_NAME_CLAIM);
                                    if (firstNamePII != null) {
                                        String firstNameValue = request.getParameter(IdentityManagementEndpointConstants.ClaimURIs.FIRST_NAME_CLAIM);
                                %>
                                    <div class="two fields">
                                        <div id="firstNameField" class="field">
                                            <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "First.name")%>*</label>
                                            <input id="firstNameUserInput" type="text" name="http://wso2.org/claims/givenname" class="form-control"
                                                <% if (firstNamePII.getRequired() || !piisConfigured) {%> required <%}%>
                                                <% if (skipSignUpEnableCheck && StringUtils.isNotEmpty(firstNameValue)) { %>
                                                value="<%= Encode.forHtmlAttribute(firstNameValue)%>" disabled <% } %>
                                                placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "First.name")%>*"/>
                                            <div class="mt-1" id="firstname-error-msg" hidden="hidden">
                                                <i class="red exclamation circle fitted icon"></i>
                                                <span class="validation-error-message" id="firstname-error-msg-text"></span>
                                            </div>
                                        </div>
                                        <%}%>

                                        <%
                                            if (lastNamePII != null) {
                                                String lastNameValue =
                                                        request.getParameter(IdentityManagementEndpointConstants.ClaimURIs.LAST_NAME_CLAIM);
                                        %>
                                        <div id="lastNameField" class="field">
                                            <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Last.name")%>*</label>
                                            <input id="lastNameUserInput" type="text" name="http://wso2.org/claims/lastname" class="form-control"
                                                <% if (lastNamePII.getRequired() || !piisConfigured) {%> required <%}%>
                                                <% if (skipSignUpEnableCheck && StringUtils.isNotEmpty(lastNameValue)) { %>
                                                value="<%= Encode.forHtmlAttribute(lastNameValue)%>" disabled <% } %>
                                                placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Last.name")%>*"
                                            />
                                            <div class="mt-1" id="lastname-error-msg" hidden="hidden">
                                                <i class="red exclamation circle fitted icon"></i>
                                                <span class="validation-error-message" id="lastname-error-msg-text"></span>
                                            </div>
                                        </div>
                                    </div>

                                <%}%>
                                <div class="field">
                                    <input id="username" name="username" type="hidden"
                                           value="<%=Encode.forHtmlAttribute(username)%>"
                                           class="form-control required usrName usrNameLength">
                                </div>
                                <div class="two fields">
                                    <div id="passwordField" class="required field">
                                        <label for="password" class="control-label">
                                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Password")%>
                                        </label>
                                        <input id="password" name="password" type="password"
                                            class="form-control" required>
                                        <div class="mt-1" id="password-error-msg" hidden="hidden">
                                            <i class="red exclamation circle fitted icon"></i>
                                            <span class="validation-error-message" id="password-error-msg-text"></span>
                                        </div>
                                    </div>
                                    <div id="confirmPasswordField" class="required field">
                                        <label for="password2" class="control-label">
                                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Confirm.password")%>
                                        </label>
                                        <input id="password2" name="password2" type="password" class="form-control"
                                            data-match="reg-password" required>
                                        <div class="mt-1" id="confirm-password-error-msg" hidden="hidden">
                                            <i class="red exclamation circle fitted icon"></i>
                                            <span class="validation-error-message" id="confirm-password-error-msg-text"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-2" id="password-mismatch-error-msg" hidden="hidden">
                                    <i class="red exclamation circle fitted icon"></i>
                                    <span class="validation-error-message" id="password-mismatch-error-msg-text"></span>
                                </div>
                                <% Claim emailNamePII =
                                        uniquePIIs.get(IdentityManagementEndpointConstants.ClaimURIs.EMAIL_CLAIM);
                                    if (emailNamePII != null) {
                                %>
                                <input type="hidden" name="http://wso2.org/claims/emailaddress" class="form-control"
                                    data-validate="email"
                                <% if (MultitenantUtils.isEmailUserName()) { %>
                                    value="<%=  Encode.forHtmlAttribute(user.getUsername())%>" readonly
                                <% } %>
                                    <% if (emailNamePII.getValidationRegex() != null) {
                                            String pattern = Encode.forHtmlContent(emailNamePII.getValidationRegex());
                                            String[] patterns = pattern.split("\\\\@");
                                            String regex = StringUtils.join(patterns, "@");
                                    %>
                                    pattern="<%= regex %>"
                                    <% } %>
                                    <% if (emailNamePII.getRequired() || !piisConfigured) {%> required <%}%>
                                    <% if
                                        (skipSignUpEnableCheck && StringUtils.isNotEmpty(emailValue)) {%>
                                    disabled<%}%>
                                    value="<%= Encode.forHtmlAttribute(emailValue)%>"
                                    placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Email")%>"
                                />
                                <%
                                    }

                                    if (callback != null) {
                                %>
                                <input type="hidden" name="callback" value="<%= callback %>"/>
                                <% for (int index = 0; index < missingClaimList.length; index++) {
                                    String claim = missingClaimList[index];
                                    String claimDisplayName = missingClaimDisplayName[index];
                                    if (!StringUtils
                                            .equals(claim, IdentityManagementEndpointConstants.ClaimURIs.FIRST_NAME_CLAIM)
                                            && !StringUtils
                                            .equals(claim, IdentityManagementEndpointConstants.ClaimURIs.LAST_NAME_CLAIM)
                                            && !StringUtils
                                            .equals(claim, IdentityManagementEndpointConstants.ClaimURIs.EMAIL_CLAIM)) {
                                %>
                                <div class="required field">
                                    <input type="text" name="missing-<%=Encode.forHtmlAttribute(claim)%>"
                                           id="<%=Encode.forHtmlAttribute(claim)%>" class="form-control"
                                           required="required" placeholder=<%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, claimDisplayName)%>>
                                </div>
                                <% }
                                }%>
                                <%
                                    }
                                    List<String> missingClaims = null;
                                    if (ArrayUtils.isNotEmpty(missingClaimList)) {
                                        missingClaims = Arrays.asList(missingClaimList);
                                    }
                                    for (Claim claim : claims) {
                                        if ((CollectionUtils.isEmpty(missingClaims) || !missingClaims.contains(claim.getUri())) &&
                                                !StringUtils.equals(claim.getUri(), IdentityManagementEndpointConstants.ClaimURIs.FIRST_NAME_CLAIM) &&
                                                !StringUtils.equals(claim.getUri(), IdentityManagementEndpointConstants.ClaimURIs.LAST_NAME_CLAIM) &&
                                                !StringUtils.equals(claim.getUri(), IdentityManagementEndpointConstants.ClaimURIs.EMAIL_CLAIM) &&
                                                !StringUtils.equals(claim.getUri(), IdentityManagementEndpointConstants.ClaimURIs.CHALLENGE_QUESTION_URI_CLAIM) &&
                                                !StringUtils.equals(claim.getUri(), IdentityManagementEndpointConstants.ClaimURIs.CHALLENGE_QUESTION_1_CLAIM) &&
                                                !StringUtils.equals(claim.getUri(), IdentityManagementEndpointConstants.ClaimURIs.CHALLENGE_QUESTION_2_CLAIM) &&
                                                !StringUtils.equals(claim.getUri(), "http://wso2.org/claims/groups") &&
                                                !StringUtils.equals(claim.getUri(), "http://wso2.org/claims/role") &&
                                                !StringUtils.equals(claim.getUri(), "http://wso2.org/claims/url") &&
                                                !(claim.getReadOnly() != null ? claim.getReadOnly() : false)) {
                                            String claimURI = claim.getUri();
                                            String claimValue = request.getParameter(claimURI);
                                %>
                                    <div class="field">
                                    <% if (claim.getRequired()) { %>
                                        <label class="control-label">
                                            <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, claim.getDisplayName())%>*
                                        </label>
                                    <% } else { %>
                                        <label class="control-label">
                                            <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, claim.getDisplayName())%>
                                        </label>
                                    <% } %>
                                    <% if(StringUtils.equals(claim.getUri(), "http://wso2.org/claims/country")) {%>
                                        <div class="ui fluid search selection dropdown"  id="country-dropdown"
                                            data-testid="country-dropdown">
                                            <input type="hidden"
                                                name="<%= Encode.forHtmlAttribute(claimURI) %>"
                                                <% if (claim.getRequired()) { %>
                                                required
                                                <% }%>
                                                <% if(skipSignUpEnableCheck && StringUtils.isNotEmpty(claimValue)) {%>
                                                value="<%= Encode.forHtmlAttribute(claimValue)%>" disabled<%}%>
                                            />
                                            <i class="dropdown icon"></i>
                                            <div class="default text">Enter Country</div>
                                            <div class="menu">
                                                <c:forEach items="<%=getCountryList()%>" var="country">
                                                    <div class="item" data-value="${country.value}">
                                                        <i class="${country.key.toLowerCase()} flag"></i>
                                                        ${country.value}
                                                    </div>
                                                </c:forEach>
                                            </div>
                                        </div>
                                    <% } else if (StringUtils.equals(claim.getUri(), "http://wso2.org/claims/dob")) { %>
                                        <div class="ui calendar" id="date_picker">
                                            <div class="ui input right icon" style="width: 100%;">
                                                <i class="calendar icon"></i>
                                                <input type="text"
                                                    autocomplete="off"
                                                    name="<%= Encode.forHtmlAttribute(claimURI) %>"
                                                    id="birthOfDate"
                                                    placeholder="Enter Birth Date"
                                                <% if(skipSignUpEnableCheck && StringUtils.isNotEmpty(claimValue)) {%>
                                                    value="<%= Encode.forHtmlAttribute(claimValue)%>" disabled<%}%>
                                                />
                                            </div>
                                        </div>
                                    <% } else { %>
                                        <input type="text" name="<%= Encode.forHtmlAttribute(claimURI) %>"
                                            class="form-control"
                                            <% if (claim.getValidationRegex() != null) { %>
                                                pattern="<%= Encode.forHtmlContent(claim.getValidationRegex()) %>"
                                            <% } %>
                                            <% if (StringUtils.equals(claim.getUri(), "http://wso2.org/claims/mobile")) { %>
                                                    id="mobileNumber"
                                        <% }%>
                                            <% if (claim.getRequired()) { %>
                                                required
                                                placeholder="<%=IdentityManagementEndpointUtil.i18nBase64(
                                                    recoveryResourceBundle, claim.getDisplayName())%>*"
                                            <% } else { %>
                                                placeholder="<%=IdentityManagementEndpointUtil.i18nBase64(
                                                    recoveryResourceBundle, claim.getDisplayName())%>"
                                            <% }%>
                                            <% if(skipSignUpEnableCheck && StringUtils.isNotEmpty(claimValue)) {%>
                                           value="<%= Encode.forHtmlAttribute(claimValue)%>" disabled<%}%>
                                        />
                                    <% } %>
                                    </div>
                                <%
                                        }
                                    }
                                %>

                            </div>
                            <% } else { %>
                            <div>
                                <div class="field">
                                    <label class="control-label">
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "username")%>
                                    </label>
                                    <input type="text" class="form-control"
                                           value="<%=Encode.forHtmlAttribute(username)%>" disabled>
                                </div>
                                <%
                                    for (Claim claim : claims) {
                                        String claimUri = claim.getUri();
                                        String claimValue = request.getParameter(claimUri);

                                        if (StringUtils.isNotEmpty(claimValue)) { %>
                                <div class="field">
                                    <label class="control-label">
                                        <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, claim.getDisplayName())%>
                                    </label>
                                    <input type="text" class="form-control"
                                           value="<%= Encode.forHtmlAttribute(claimValue)%>" disabled>
                                </div>
                                <% }
                                }%>
                            </div>
                            <% } %>
                            <% if (skipSignUpEnableCheck) { %>
                            <div class="field">
                                <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute
                                        (request.getParameter("sessionDataKey"))%>'/>
                            </div>
                            <div class="field">
                                <input type="hidden" name="policy" value='<%=Encode.forHtmlAttribute
                                        (IdentityManagementServiceUtil.getInstance().getServiceContextURL().replace("/services",
                                        "/authenticationendpoint/privacy_policy.do"))%>'/>
                            </div>
                            <% }

                                if (hasPurposes) {
                            %>
                            <div class="ui divider hidden"></div>
                            <div class="ui secondary left aligned segment">
                                <p>
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                        "Need.consent.for.following.purposes")%>
                                    <span>
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                            "I.consent.to.use.them")%>
                                    </span>
                                    <%
                                        if (consentDisplayType == "template") {
                                    %>
                                    <%--User Consents from Template--%>
                                        <div class="consent-statement"></div>
                                    <%--End User Consents from Template--%>
                                    <% } else if (consentDisplayType == "tree") { %>
                                    <%--User Consents Tree--%>
                                        <div id="tree-table"></div>
                                    <%--End User Consents Tree--%>
                                    <%
                                    } else if (consentDisplayType == "row") {
                                    %>
                                    <%--User Consents Row--%>
                                        <div id="row-container"></div>
                                    <%--End User Consents Row--%>
                                    <%
                                        }
                                    %>
                                </p>
                            </div>
                            <%
                                }
                            %>
                            <div class="field">
                                <%
                                    if (reCaptchaEnabled) {
                                        String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
                                %>
                                <div class="ui divider hidden"></div>
                                <div class="field">
                                    <div class="g-recaptcha"
                                        data-sitekey="<%=Encode.forHtmlAttribute(reCaptchaKey)%>"
                                        data-theme="light"
                                    >
                                    </div>
                                </div>
                                <%
                                    }
                                %>
                                <div class="ui divider hidden"></div>
                                <div>
                                    <%--Terms/Privacy Policy--%>
                                    <div id="termsCheckboxField" class="field">
                                        <div class="ui checkbox">
                                            <input id="termsCheckbox" type="checkbox"/>
                                            <label><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                                    "I.confirm.that.read.and.understood")%>
                                                <a href="<%= StringEscapeUtils.escapeHtml4(privacyPolicyURL) %>" target="policy-pane">
                                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Privacy.policy")%>
                                                </a></label>
                                        </div>
                                    </div>
                                    <%--End Terms/Privacy Policy--%>
                                </div>
                                <div class="ui divider hidden"></div>
                                <div class="buttons mt-4">
                                    <button id="registrationSubmit"
                                            class="ui primary button large fluid"
                                            type="submit" disabled>
                                        <%=i18n(recoveryResourceBundle, customText, "sign.up.button")%>
                                    </button>
                                </div>
                                <% if (!skipSignUpEnableCheck) { %>
                                    <div class="ui divider hidden"></div>
                                    <div class="buttons mt-2">
                                        <div class="field external-link-container text-small">
                                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                                    "Already.have.an.account")%>
                                            <a href="<%= callback %>">
                                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Sign.in")%>
                                            </a>
                                        </div>
                                    </div>
                                <% } %>
                                <div class="field">
                                    <input id="isSelfRegistrationWithVerification" type="hidden"
                                           name="isSelfRegistrationWithVerification"
                                           value="true"/>
                                    <%
                                        if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
                                    %>
                                    <input id="tenantDomain" name="tenantDomain" type="hidden"
                                           value="<%= Encode.forHtmlAttribute(user.getTenantDomain()) %>"/>
                                    <%
                                        }
                                    %>
                                    <%
                                        if (isSaaSApp) {
                                    %>
                                    <input id="srtenantDomain" name="srtenantDomain" type="hidden"
                                        value="<%=Encode.forHtmlAttribute(user.getTenantDomain())%>"/>
                                    <%
                                        }
                                    %>
                                    <%
                                        if (StringUtils.isNotBlank(sp)) {
                                    %>
                                    <input id="sp" name="sp" type="hidden"
                                        value="<%=sp%>"/>
                                    <%
                                        }
                                    %>
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

    <div id="attribute_selection_validation" class="ui modal tiny">
        <div class="header">
            <h4>
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Consent.selection")%>
            </h4>
        </div>
        <div class="content">
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "You.need.consent.all.claims")%>
        </div>
        <div class="actions">
            <button type="button" class="ui primary button" data-dismiss="modal">
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Ok")%>
            </button>
        </div>
    </div>


    <div id="mandetory_pii_selection_validation" class="ui tiny modal">
        <div class="header">
            <h4>
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Consent.selection")%>
            </h4>
        </div>
        <div class="content">
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Need.to.select.all.mandatory.attributes")%>
        </div>
        <div class="actions">
            <button type="button" class="ui primary button cancel" data-dismiss="modal">
                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Ok")%>
            </button>
        </div>
    </div>

    <script type="text/javascript" src="libs/handlebars.min-v4.7.6.js"></script>
    <script type="text/javascript" src="libs/jstree/dist/jstree.min.js"></script>
    <script type="text/javascript" src="libs/jstree/src/jstree-actions.js"></script>
    <script type="text/javascript" src="js/consent_template_1.js"></script>
    <script type="text/javascript" src="js/consent_template_2.js"></script>
    <script type="text/javascript">
        var registrationDataKey = "registrationData";
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

        // Fires on form field click or keyup.
        $('#register').bind('keyup click', function () {
            // Enable/disable submit button based on form validation.
            changeSubmitButtonStatus();
        });

        // Fires when firstname field lose focus.
        $('#firstNameUserInput').bind('blur keyup', function () {
            showFirstNameValidationStatus();
        });

        // Fires when lastname field lose focus.
        $('#lastNameUserInput').bind('blur keyup', function () {
            showLastNameValidationStatus();
        });

        // Fires when password field lose focus.
        $('#password').bind('blur keyup', function () {
            showPasswordValidationStatus();
        });

        // Fires when confirm password field lose focus.
        $('#password2').bind('blur keyup', function () {
            showConfirmPasswordValidationStatus();
        });

        function goBack() {
            window.history.back();
        }

        $(document).ready(function () {
            <%
                if (error){
            %>
                var registrationData = sessionStorage.getItem(registrationDataKey);
                sessionStorage.removeItem(registrationDataKey);

                if (registrationData){
                    var fields = JSON.parse(registrationData);

                    if (fields.length > 0) {
                        fields.forEach(function(field) {
                            document.getElementsByName(field.name)[0].value = field.value;
                        })
                    }
                }
            <%
                }
            %>

            var container;
            var allAttributes = [];
            var canSubmit;

            var agreementChk = $(".agreement-checkbox input");
            var registrationBtn = $("#registrationSubmit");
            var countryDropdown = $("#country-dropdown");

            if (agreementChk.length > 0) {
                registrationBtn.prop("disabled", true).addClass("disabled");
            }
            agreementChk.click(function () {
                if ($(this).is(":checked")) {
                    registrationBtn.prop("disabled", false).removeClass("disabled");
                } else {
                    registrationBtn.prop("disabled", true).addClass("disabled");
                }
            });

            countryDropdown.dropdown('hide');
            $("> input.search", countryDropdown).attr("role", "presentation");

            $("#date_picker").calendar({
                type: 'date',
                formatter: {
                    date: function (date, settings) {
                        var EMPTY_STRING = "";
                        var DATE_SEPARATOR = "-";
                        var STRING_ZERO = "0";
                        if (!date) return EMPTY_STRING;
                            var day = date.getDate() + EMPTY_STRING;
                        if (day.length < 2) {
                            day = STRING_ZERO + day;
                        }
                        var month = (date.getMonth() + 1) + EMPTY_STRING;
                        if (month.length < 2) {
                            month = STRING_ZERO + month;
                        }
                        var year = date.getFullYear();
                        return year + DATE_SEPARATOR + month + DATE_SEPARATOR + day;
                    }
                }
            });

            $(".form-info").popup();

            $("#register").submit(function (e) {
                var unsafeCharPattern = /[<>`\"]/;
                var elements = document.getElementsByTagName("input");
                var invalidInput = false;
                var error_msg = $("#error-msg");
                var server_error_msg = $("#server-error-msg");
                if (server_error_msg.text() !== null && server_error_msg.text().trim() !== ""  ) {
                    $("#error-msg").hide();
                    error_msg = $("#server-error-msg");
                }

                for (i = 0; i < elements.length; i++) {
                    if (elements[i].type === 'text' && elements[i].value != null && elements[i].value.trim() !== ""
                    && elements[i].value.length > 250)  {
                        error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "maxium.length.cannot.exceed")%>");
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        invalidInput = true;
                        return false;
                    }
                    if (elements[i].type === 'text' && elements[i].value != null
                        && elements[i].value.match(unsafeCharPattern) != null) {
                        error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                            "For.security.following.characters.restricted")%>");
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        invalidInput = true;
                        return false;
                    } else if (elements[i].type === 'text' && elements[i].required && elements[i].value.trim() === "") {
                        error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                            "For.required.fields.cannot.be.empty")%>");
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        invalidInput = true;
                        return false;
                    }
                }

                var mobileNumber = document.getElementById("mobileNumber").value;
                if (mobileNumber != null && mobileNumber.trim() !== ""){
                    const mobilePattern = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})?[-. )]*(\d{3})?[-. ]*(\d{4,6})(?: *x(\d+))?\s*$/;
                    if (!mobilePattern.test(mobileNumber)) {
                        error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "mobile.number.format.error")%>")
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        invalidInput = true;
                        return false;
                    }
                }

                var birthOfDate = document.getElementById("birthOfDate").value;
                if (birthOfDate != null && birthOfDate.trim() !== ""){
                    const dobPattern = /^\d{4}-\d{2}-\d{2}$/;
                    if (!dobPattern.test(birthOfDate)) {
                        error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "dob.must.in.correct.format")%>")
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        invalidInput = true;
                        return false;
                    }
                }

                if (invalidInput) {
                    return false;
                }

                if(!$("#termsCheckbox")[0].checked){
                        error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                            "Confirm.Privacy.Policy")%>");
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        return false;
                }

                <%
                if(reCaptchaEnabled) {
                %>
                var resp = $("[name='g-recaptcha-response']")[0].value;
                if (resp.trim() == '') {
                    error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Please.select.reCaptcha")%>");
                    error_msg.show();
                    $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                    return false;
                }
                <%
                }
                %>

                <%
                if (hasPurposes) {
                %>
                var self = this;
                var receipt;
                e.preventDefault();
                <%
                if (consentDisplayType == "template") {
                %>
                receipt = addReciptInformationFromTemplate();
                <%
                } else if (consentDisplayType == "tree") {
                %>
                receipt = addReciptInformation(container);
                <%
                } else if (consentDisplayType == "row")  {
                %>
                receipt = addReciptInformationFromRows();
                <%
                }
                %>

                $('<input />').attr('type', 'hidden')
                    .attr('name', "consent")
                    .attr('value', JSON.stringify(receipt))
                    .appendTo('#register');
                if (canSubmit) {
                    self.submit();
                }

                <%
                }
                %>

                var data = $("#register").serializeArray();
                var filteredData = data.filter(function(row) {
                    return !(row.name === "password" || row.name === "password2");
                });

                sessionStorage.setItem(registrationDataKey, JSON.stringify(filteredData));

                return true;
            });


            function compareArrays(arr1, arr2) {
                return $(arr1).not(arr2).length == 0 && $(arr2).not(arr1).length == 0
            }

            String.prototype.replaceAll = function (str1, str2, ignore) {
                return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
            };

            Handlebars.registerHelper('grouped_each', function (every, context, options) {
                var out = "", subcontext = [], i;
                if (context && context.length > 0) {
                    for (i = 0; i < context.length; i++) {
                        if (i > 0 && i % every === 0) {
                            out += options.fn(subcontext);
                            subcontext = [];
                        }
                        subcontext.push(context[i]);
                    }
                    out += options.fn(subcontext);
                }
                return out;
            });

            <%
            if (hasPurposes) {
                if(consentDisplayType == "template") {
                    %>
            renderReceiptDetailsFromTemplate(<%= Encode.forJava(purposes) %>);
            <%
                } else if (consentDisplayType == "tree") {
            %>
            renderReceiptDetails(<%= Encode.forJava(purposes)%>);
            <%
                } else if (consentDisplayType == "row"){
            %>
            renderReceiptDetailsFromRows(<%= Encode.forJava(purposes)%>);
            <%
                }
            }
            %>

            function renderReceiptDetails(data) {

                var treeTemplate =
                    '<div id="html1">' +
                    '<ul><li class="jstree-open" data-jstree=\'{"icon":"icon-book"}\'>All' +
                    '<ul>' +
                    '{{#purposes}}' +
                    '<li data-jstree=\'{"icon":"icon-book"}\' purposeid="{{purposeId}}" mandetorypurpose={{mandatory}}>' +
                    '{{purpose}}{{#if mandatory}}<span class="required_consent">*</span>{{/if}} {{#if description}}<img src="images/info.png" class="form-info" data-toggle="tooltip" data-content="{{description}}" data-placement="right"/>{{/if}}<ul>' +
                    '{{#piiCategories}}' +
                    '<li data-jstree=\'{"icon":"icon-user"}\' piicategoryid="{{piiCategoryId}}" mandetorypiicatergory={{mandatory}}>{{#if displayName}}{{displayName}}{{else}}{{piiCategory}}{{/if}}{{#if mandatory}}<span class="required_consent">*</span>{{/if}}</li>' +
                    '</li>' +
                    '{{/piiCategories}}' +
                    '</ul>' +
                    '{{/purposes}}' +
                    '</ul></li>' +
                    '</ul>' +
                    '</div>';

                var tree = Handlebars.compile(treeTemplate);
                var treeRendered = tree(data);

                $("#tree-table").html(treeRendered);

                container = $("#html1").jstree({
                    plugins: ["table", "sort", "checkbox", "actions"],
                    checkbox: {"keep_selected_style": false},
                });

                container.bind('hover_node.jstree', function () {
                    var bar = $(this).find('.jstree-wholerow-hovered');
                    bar.css('height',
                        bar.parent().children('a.jstree-anchor').height() + 'px');
                });

                container.on('ready.jstree', function (event, data) {
                    var $tree = $(this);
                    $($tree.jstree().get_json($tree, {
                        flat: true
                    }))
                        .each(function (index, value) {
                            var node = container.jstree().get_node(this.id);
                            allAttributes.push(node.id);
                        });
                    container.jstree('open_all');
                });

            }

            function addReciptInformation(container) {
                // var oldReceipt = receiptData.receipts;
                var newReceipt = {};
                var services = [];
                var service = {};
                var mandatoryPiis = [];
                var selectedMandatoryPiis = [];

                var selectedNodes = container.jstree(true).get_selected('full', true);
                var undeterminedNodes = container.jstree(true).get_undetermined('full', true);
                var allTreeNodes = container.jstree(true).get_json('#', {flat: true});

                $.each(allTreeNodes, function (i, val) {
                    if (typeof (val.li_attr.mandetorypiicatergory) != "undefined" &&
                        val.li_attr.mandetorypiicatergory == "true") {
                        mandatoryPiis.push(val.li_attr.piicategoryid);
                    }
                });

                $.each(selectedNodes, function (i, val) {
                    if (val.hasOwnProperty('li_attr')) {
                        selectedMandatoryPiis.push(selectedNodes[i].li_attr.piicategoryid);
                    }
                });

                var allMandatoryPiisSelected = mandatoryPiis.every(function (val) {
                    return selectedMandatoryPiis.indexOf(val) >= 0;
                });

                if (!allMandatoryPiisSelected) {
                    $("#mandetory_pii_selection_validation").modal({blurring: true}).modal("show");
                    canSubmit = false;
                } else {
                    canSubmit = true;
                }

                if (!selectedNodes || selectedNodes.length < 1) {
                    //revokeReceipt(oldReceipt.consentReceiptID);
                    return;
                }
                selectedNodes = selectedNodes.concat(undeterminedNodes);
                var relationshipTree = unflatten(selectedNodes); //Build relationship tree
                var purposes = relationshipTree[0].children;
                var newPurposes = [];

                for (var i = 0; i < purposes.length; i++) {
                    var purpose = purposes[i];
                    var newPurpose = {};
                    newPurpose["purposeId"] = purpose.li_attr.purposeid;
                    newPurpose['piiCategory'] = [];
                    newPurpose['purposeCategoryId'] = [<%=defaultPurposeCatId%>];

                    var piiCategory = [];
                    var categories = purpose.children;
                    for (var j = 0; j < categories.length; j++) {
                        var category = categories[j];
                        var c = {};
                        c['piiCategoryId'] = category.li_attr.piicategoryid;
                        piiCategory.push(c);
                    }
                    newPurpose['piiCategory'] = piiCategory;
                    newPurposes.push(newPurpose);
                }
                service['purposes'] = newPurposes;
                services.push(service);
                newReceipt['services'] = services;

                return newReceipt;
            }

            function addReciptInformationFromTemplate() {
                var newReceipt = {};
                var services = [];
                var service = {};
                var newPurposes = [];

                $('.consent-statement input[type="checkbox"], .consent-statement strong label')
                    .each(function (i, element) {
                        var checked = $(element).prop('checked');
                        var isLable = $(element).is("lable");
                        var newPurpose = {};
                        var piiCategories = [];
                        var isExistingPurpose = false;

                        if (!isLable && checked) {
                            var purposeId = element.data("purposeid");

                            if (newPurposes.length != 0) {
                                for (var i = 0; i < newPurposes.length; i++) {
                                    var selectedPurpose = newPurposes[i];
                                    if (selectedPurpose.purposeId == purposeId) {
                                        newPurpose = selectedPurpose;
                                        piiCategories = newPurpose.piiCategory;
                                        isExistingPurpose = true;
                                    }
                                }
                            }
                        }

                        var newPiiCategory = {};

                        newPurpose["purposeId"] = element.data("purposeid");
                        newPiiCategory['piiCategoryId'] = element.data("piicategoryid");
                        piiCategories.push(newPiiCategory);
                        newPurpose['piiCategory'] = piiCategories;
                        newPurpose['purposeCategoryId'] = [<%=defaultPurposeCatId%>];
                        if (!isExistingPurpose) {
                            newPurposes.push(newPurpose);
                        }
                    });
                service['purposes'] = newPurposes;
                services.push(service);
                newReceipt['services'] = services;

                return newReceipt;
            }

            function addReciptInformationFromRows() {
                var newReceipt = {};
                var services = [];
                var service = {};
                var newPurposes = [];
                var mandatoryPiis = [];
                var selectedMandatoryPiis = [];

                $('#row-container input[type="checkbox"]').each(function (i, checkbox) {
                    var checkboxLabel = $(checkbox).next();
                    var checked = $(checkbox).prop('checked');
                    var newPurpose = {};
                    var piiCategories = [];
                    var isExistingPurpose = false;

                    if (checkboxLabel.data("mandetorypiicatergory")) {
                        mandatoryPiis.push(checkboxLabel.data("piicategoryid"));
                    }

                    if (checked) {
                        var purposeId = checkboxLabel.data("purposeid");
                        selectedMandatoryPiis.push(checkboxLabel.data("piicategoryid"));
                        if (newPurposes.length != 0) {
                            for (var i = 0; i < newPurposes.length; i++) {
                                var selectedPurpose = newPurposes[i];
                                if (selectedPurpose.purposeId == purposeId) {
                                    newPurpose = selectedPurpose;
                                    piiCategories = newPurpose.piiCategory;
                                    isExistingPurpose = true;
                                }
                            }
                        }
                        var newPiiCategory = {};

                        newPurpose["purposeId"] = checkboxLabel.data("purposeid");
                        newPiiCategory['piiCategoryId'] = checkboxLabel.data("piicategoryid");
                        piiCategories.push(newPiiCategory);
                        newPurpose['piiCategory'] = piiCategories;
                        newPurpose['purposeCategoryId'] = [<%=defaultPurposeCatId%>];
                        if (!isExistingPurpose) {
                            newPurposes.push(newPurpose);
                        }
                    }
                });
                service['purposes'] = newPurposes;
                services.push(service);
                newReceipt['services'] = services;

                var allMandatoryPiisSelected = mandatoryPiis.every(function (val) {
                    return selectedMandatoryPiis.indexOf(val) >= 0;
                });

                if (!allMandatoryPiisSelected) {
                    $("#mandetory_pii_selection_validation").modal({blurring: true}).modal("show");
                    canSubmit = false;
                } else {
                    canSubmit = true;
                }

                return newReceipt;
            }

            function unflatten(arr) {
                var tree = [],
                    mappedArr = {},
                    arrElem,
                    mappedElem;

                // First map the nodes of the array to an object -> create a hash table.
                for (var i = 0, len = arr.length; i < len; i++) {
                    arrElem = arr[i];
                    mappedArr[arrElem.id] = arrElem;
                    mappedArr[arrElem.id]['children'] = [];
                }

                for (var id in mappedArr) {
                    if (mappedArr.hasOwnProperty(id)) {
                        mappedElem = mappedArr[id];
                        // If the element is not at the root level, add it to its parent array of children.
                        if (mappedElem.parent && mappedElem.parent != "#" && mappedArr[mappedElem['parent']]) {
                            mappedArr[mappedElem['parent']]['children'].push(mappedElem);
                        }
                        // If the element is at the root level, add it to first level elements array.
                        else {
                            tree.push(mappedElem);
                        }
                    }
                }
                return tree;
            }

            function renderReceiptDetailsFromTemplate(receipt) {
                /*
                 *   Available when consentDisplayType is set to "template"
                 *   customConsentTempalte1 is from the js file which is loaded as a normal js resource
                 *   also try customConsentTempalte2 located at assets/js/consent_template_2.js
                 */
                var templateString = customConsentTempalte1;
                var purp, purpose, piiCategory, piiCategoryInputTemplate;
                $(receipt.purposes).each(function (i, e) {
                    purp = e.purpose;
                    purpose = "{{purpose:" + purp + "}}";
                    var purposeInputTemplate = '<strong data-id="' + purpose + '">' + purp + '</strong>';
                    templateString = templateString.replaceAll(purpose, purposeInputTemplate);
                    $(e.piiCategories).each(function (i, ee) {
                        piiCategory = "{{pii:" + purp + ":" + ee.displayName + "}}";
                        var piiCategoryMin = piiCategory.replace(/\s/g, '');
                        if (ee.mandatory == true) {
                            piiCategoryInputTemplate = '<strong><label id="' + piiCategoryMin + '" data-id="' +
                                piiCategory + '" data-piiCategoryId="' + ee.piiCategoryId + '" data-purposeId="' +
                                e.purposeId + '" data-mandetoryPiiCategory="' + ee.mandatory + '">' + ee.displayName +
                                '<span class="required_consent">*</span></label></strong>';
                        } else {
                            piiCategoryInputTemplate = '<span><label for="' + piiCategoryMin + '"><input type="checkbox" id="' + piiCategoryMin + '" data-id="' +
                                piiCategory + '" data-piiCategoryId="' + ee.piiCategoryId + '" data-purposeId="' + e.purposeId + '"' +
                                'data-mandetoryPiiCategory="' + ee.mandatory + '" name="" value="">' + ee.displayName + '</label></span>';
                        }
                        templateString = templateString.replaceAll(piiCategory, piiCategoryInputTemplate);
                    });
                });

                $(".consent-statement").html(templateString);
            }

            function renderReceiptDetailsFromRows(data) {
                var rowTemplate =
                    '{{#purposes}}' +
                    '<div class="ui bulleted list">' +
                    '<div class="item"><span>{{purpose}} {{#if description}}<i id="description" class="info circle icon" data-variation="inverted" data-content="{{description}}" data-placement="right"/>{{/if}}</span></div></div>' +
                    '<div class="ui form">' +
                    '{{#grouped_each 2 piiCategories}}' +
                    '{{#each this }}' +
                    '<div class="{{#if mandatory}}required{{/if}} field">'+
                    '<div class="ui checkbox">' +
                    '<input type="checkbox" name="switch" id="consent-checkbox-{{../../purposeId}}-{{piiCategoryId}}" {{#if mandatory}}required{{/if}} />' +
                    '<label for="consent-checkbox-{{../../purposeId}}-{{piiCategoryId}}" data-piicategoryid="{{piiCategoryId}}" data-mandetorypiicatergory="{{mandatory}}" data-purposeid="{{../../purposeId}}">' +
                    '<span>{{#if displayName}}{{displayName}}{{else}}{{piiCategory}}{{/if}}'+
                    '</label></div>' +
                    '</div>'+
                    '{{/each}}' +
                    '{{/grouped_each}}' +
                    '</div></div>' +
                    '{{/purposes}}';

                var rows = Handlebars.compile(rowTemplate);
                var rowsRendered = rows(data);

                $("#row-container").html(rowsRendered);
                $("#description").popup();
            }

        });

        function showFirstNameValidationStatus() {
            var firstNameUserInput = document.getElementById("firstNameUserInput");
            var firstname_error_msg = $("#firstname-error-msg");
            var firstname_error_msg_text = $("#firstname-error-msg-text");
            var firstname_field= $("#firstNameField");

            if ( firstNameUserInput.value.trim() === "" )  {
                firstname_error_msg_text.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "required")%>");
                firstname_error_msg.show();
                $("html, body").animate({scrollTop: firstname_error_msg.offset().top}, 'slow');
                firstname_field.addClass("error");
            } else {
                // When firstname is accepted.
                firstname_error_msg.hide();
                firstname_field.removeClass("error");
            }
        }

        function showLastNameValidationStatus() {
            var lastNameUserInput = document.getElementById("lastNameUserInput");
            var lastname_error_msg = $("#lastname-error-msg");
            var lastname_error_msg_text = $("#lastname-error-msg-text");
            var lastname_field= $("#lastNameField");

            if ( lastNameUserInput.value.trim() === "" )  {
                lastname_error_msg_text.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "required")%>");
                lastname_error_msg.show();
                $("html, body").animate({scrollTop: lastname_error_msg.offset().top}, 'slow');
                lastname_field.addClass("error");
            } else {
                // When lastname is accepted.
                lastname_error_msg.hide();
                lastname_field.removeClass("error");
            }
        }

        function showPasswordValidationStatus() {
            var passwordInput = document.getElementById("password");
            var password_error_msg = $("#password-error-msg");
            var password_error_msg_text = $("#password-error-msg-text");
            var password_field= $("#passwordField");

            if ( passwordInput.value.trim() == "" )  {
                password_error_msg_text.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "required")%>");
                password_error_msg.show();
                $("html, body").animate({scrollTop: password_error_msg.offset().top}, 'slow');
                password_field.addClass("error");
            } else {
                // When password is accepted.
                password_error_msg.hide();
                password_field.removeClass("error");
            }
        }

        function showConfirmPasswordValidationStatus() {
            var passwordInput = document.getElementById("password");
            var confirmPasswordInput = document.getElementById("password2");
            var confirm_password_error_msg = $("#confirm-password-error-msg");
            var confirm_password_error_msg_text = $("#confirm-password-error-msg-text");
            var password_mismatch_error_msg = $("#password-mismatch-error-msg");
            var password_mismatch_error_msg_text = $("#password-mismatch-error-msg-text");
            var confirm_password_field= $("#confirmPasswordField");

            if ( confirmPasswordInput.value.trim() == "" )  {
                confirm_password_error_msg_text.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "required")%>");
                confirm_password_error_msg.show();
                $("html, body").animate({scrollTop: confirm_password_error_msg.offset().top}, 'slow');
                confirm_password_field.addClass("error");
            } else {
                // When confirm password is accepted.
                confirm_password_error_msg.hide();
                confirm_password_field.removeClass("error");
            }

            if ( confirmPasswordInput.value.trim() !== "" && confirmPasswordInput.value.trim() !== passwordInput.value.trim() )  {
                password_mismatch_error_msg_text.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Passwords.did.not.match.please.try.again")%>");
                password_mismatch_error_msg.show();
                $("html, body").animate({scrollTop: confirm_password_error_msg.offset().top}, 'slow');
                password_field.addClass("error");
                confirm_password_field.addClass("error");
            } else {
                // When passwords match.
                password_mismatch_error_msg.hide();
                confirm_password_field.removeClass("error");
                password_field.removeClass("error");
            }

        }

        function validateNameFields() {
            var firstNameUserInput = document.getElementById("firstNameUserInput");
            var lastNameUserInput = document.getElementById("lastNameUserInput");

            if ( (!!firstNameUserInput &&  firstNameUserInput.value.trim() == "")
                || ( !!lastNameUserInput && lastNameUserInput.value.trim() == ""))  {
                return false;
            }

            return true;
        }

        function validatePasswordFields() {
            var isPasswordProvisionEnabled = <%=isPasswordProvisionEnabled%>;
            if (!isPasswordProvisionEnabled) {
                return true;
            }
            var passwordInput = document.getElementById("password");
            var confirmPasswordInput = document.getElementById("password2");

            if ( (!!passwordInput &&  passwordInput.value.trim() == "")
                || (!!confirmPasswordInput && confirmPasswordInput.value.trim() == "")
                || (confirmPasswordInput.value.trim() !== passwordInput.value.trim()))  {
                return false;
            }

            return true;
        }

        function changeSubmitButtonStatus() {
            var agreementChk = $("#termsCheckbox");
            var registrationBtn = $("#registrationSubmit");
            var termsCheckboxField = $("#termsCheckboxField");

            // Checking for empty name fields.
            if (validateNameFields() && validatePasswordFields()) {
                // Checking for consent checkbox status.
                if (agreementChk.is(":checked")) {
                    registrationBtn.prop("disabled", false).removeClass("disabled");
                } else {
                    registrationBtn.prop("disabled", true).addClass("disabled");
                }
            } else {
                registrationBtn.prop("disabled", true).addClass("disabled");
            }
        }
    </script>
    <script src="libs/addons/calendar.min.js"></script>
</body>
</html>
