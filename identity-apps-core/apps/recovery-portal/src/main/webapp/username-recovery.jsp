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

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.base.IdentityRuntimeException" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.ReCaptchaApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.UsernameRecoveryApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Claim" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.ReCaptchaProperties" %>
<%@ page import="org.wso2.carbon.identity.recovery.IdentityRecoveryConstants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    // Add the user-recovery-claim screen to the list to retrieve text branding customizations.
    screenNames.add("username-recovery-claim");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    if (!Boolean.parseBoolean(application.getInitParameter(
            IdentityManagementEndpointConstants.ConfigConstants.ENABLE_EMAIL_NOTIFICATION))) {
        response.sendError(HttpServletResponse.SC_FOUND);
        return;
    }

    String username = request.getParameter("username");

    ReCaptchaApi reCaptchaApi = new ReCaptchaApi();

    try {
        ReCaptchaProperties reCaptchaProperties = reCaptchaApi.getReCaptcha(tenantDomain, true, "ReCaptcha",
                "username-recovery");

        if (reCaptchaProperties != null && reCaptchaProperties.getReCaptchaEnabled()) {
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

    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    String errorCode = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorCode"));

    boolean isFirstNameInClaims = false;
    boolean isLastNameInClaims = false;
    boolean isEmailInClaims = false;
    boolean isMobileInClaims = false;
    boolean isFirstNameRequired = false;
    List<Claim> claims;
    UsernameRecoveryApi usernameRecoveryApi = new UsernameRecoveryApi();
    try {
        claims = usernameRecoveryApi.getClaimsForUsernameRecovery(tenantDomain, true);
    } catch (ApiException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", e.getMessage());
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    if (claims == null || claims.size() == 0) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "No.recovery.supported.claims.found"));
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    String mobileClaimRegex = null;
    String emailClaimRegex = null;
    for (Claim claim : claims) {
        if (StringUtils.equals(claim.getUri(),
                IdentityManagementEndpointConstants.ClaimURIs.FIRST_NAME_CLAIM)) {
            isFirstNameInClaims = true;
            isFirstNameRequired = claim.getRequired();
        }
        if (StringUtils.equals(claim.getUri(), IdentityManagementEndpointConstants.ClaimURIs.LAST_NAME_CLAIM)) {
            isLastNameInClaims = true;
        }
        if (StringUtils.equals(claim.getUri(),
                IdentityManagementEndpointConstants.ClaimURIs.EMAIL_CLAIM)) {
            isEmailInClaims = true;
            emailClaimRegex = Encode.forJava(claim.getValidationRegex());
        }
        if (StringUtils.equals(claim.getUri(),
                IdentityManagementEndpointConstants.ClaimURIs.MOBILE_CLAIM)) {
            isMobileInClaims = true;
            mobileClaimRegex = Encode.forJava(claim.getValidationRegex());
        }
    }

    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));

    boolean reCaptchaEnabled = false;
    if (request.getAttribute("reCaptcha") != null &&
            "TRUE".equalsIgnoreCase((String) request.getAttribute("reCaptcha"))) {
        reCaptchaEnabled = true;
    }
%>

<% request.setAttribute("pageName", "username-recovery"); %>

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
<body class="login-portal layout recovery-layout" data-page="<%= request.getAttribute("pageName") %>">
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
                <h2><%=i18n(recoveryResourceBundle, customText, "username.recovery.heading")%></h2>
                <% if (error) { %>
                    <div class="ui visible negative message" id="server-error-msg">
                        <% if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_MULTIPLE_MATCHING_USERS.getCode().equals(errorCode)) {
                        %>
                            <%=i18n(recoveryResourceBundle, customText, "multiple.users.found")%>
                        <% } else if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_NO_USER_FOUND.getCode().equals(errorCode)) {
                        %>
                            <%=i18n(recoveryResourceBundle, customText, "no.user.found")%>
                        <% } else { %>
                            <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                        <% } %>
                    </div>
                <% } %>

                <%=i18n(recoveryResourceBundle, customText, "username.recovery.body")%>

                <div class="ui divider hidden"></div>

                <div class="segment-form">
                    <form novalidate class="ui large form" method="post" action="verify.do" id="recoverDetailsForm">
                        <% if (isFirstNameInClaims || isLastNameInClaims) { %>
                        <div class="two fields">
                            <% if (isFirstNameInClaims) { %>
                            <div class="<%= isFirstNameRequired ? "required field" : "field" %>">
                                <label>
                                    <%=i18n(recoveryResourceBundle, customText, "First.name")%>
                                </label>
                                <input id="first-name" type="text"
                                    <%= isFirstNameRequired ? "required" : "" %>
                                    name="http://wso2.org/claims/givenname"
                                    placeholder="<%=i18n(recoveryResourceBundle, customText, "First.name")%>"
                                />
                                <div class="ui list mb-5 field-validation-error-description" id="error-msg-first-name">
                                    <i class="exclamation circle icon"></i>
                                    <span>
                                        <%=i18n(recoveryResourceBundle, customText, "fill.the.first.name" )%>
                                    </span>
                                </div>
                            </div>
                            <% } %>
                            <% if (isLastNameInClaims) { %>
                            <div class="field">
                                <label>
                                    <%=i18n(recoveryResourceBundle, customText, "Last.name")%>
                                </label>
                                <input id="last-name" type="text" name="http://wso2.org/claims/lastname"
                                    placeholder="<%=i18n(recoveryResourceBundle, customText, "Last.name")%>" />
                            </div>
                            <% } %>
                        </div>
                        <% } %>

                        <%
                            String callback = request.getParameter("callback");

                            if (StringUtils.isBlank(callback)) {
                                callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                                        application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
                            }

                            if (callback != null) {
                        %>
                        <div>
                            <input type="hidden" name="callback" value="<%=Encode.forHtmlAttribute(callback) %>"/>
                        </div>
                        <div>
                            <input type="hidden" name="sp" value="<%=Encode.forHtmlAttribute(request.getParameter("sp"))%>"/>
                            <input type="hidden" name="spId" value="<%=Encode.forHtmlAttribute(request.getParameter("spId"))%>"/>
                        </div>
                        <div>
                            <input type="hidden" name="spId" value="<%=Encode.forHtmlAttribute(request.getParameter("spId"))%>"/>
                        </div>
                        <%
                            }

                            if (isEmailInClaims || isMobileInClaims) { %>
                        <div class="required field">
                            <label for="contact" class="control-label"><%=i18n(recoveryResourceBundle, customText,
                                    "contact")%></label>
                            <input id="contact" type="text" name="contact"
                               placeholder="<%=i18n(recoveryResourceBundle, customText, "contact")%>"
                                    required class="form-control" />
                        </div>
                        <div class="ui list mb-5 field-validation-error-description" id="error-msg-contact">
                            <i class="exclamation circle icon"></i>
                            <span id="error-msg-contact-text">
                            </span>
                        </div>
                        <% } %>

                        <% if (!isSaaSApp && (StringUtils.isNotEmpty(tenantDomain) && !error)) { %>
                        <div>
                            <input id="tenant-domain" type="hidden" name="tenantDomain" value="<%=Encode.forHtmlAttribute(tenantDomain)%>"/>
                        </div>
                        <% } else { %>
                        <div class="required field">
                            <label for="tenant-domain" class="control-label">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Tenant.domain")%>
                            </label>
                            <input id="tenant-domain" type="text" required name="tenantDomain" class="form-control">
                        </div>
                        <% } %>

                        <input type="hidden" id="isUsernameRecovery" name="isUsernameRecovery" value="true"/>
                        <input type="hidden" id="recoveryStage" name="recoveryStage" value="INITIATE"/>

                        <% for (Claim claim : claims) {
                            if (claim.getRequired() &&
                                    !StringUtils.equals(claim.getUri(),
                                            IdentityManagementEndpointConstants.ClaimURIs.FIRST_NAME_CLAIM) &&
                                    !StringUtils.equals(claim.getUri(),
                                            IdentityManagementEndpointConstants.ClaimURIs.LAST_NAME_CLAIM) &&
                                    !StringUtils.equals(claim.getUri(),
                                            IdentityManagementEndpointConstants.ClaimURIs.EMAIL_CLAIM) &&
                                    !StringUtils.equals(claim.getUri(),
                                            IdentityManagementEndpointConstants.ClaimURIs.MOBILE_CLAIM)) {
                        %>

                        <div class="field">
                            <label class="control-label"><%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle,
                                    claim.getDisplayName())%>
                            </label>
                            <input type="text" name="<%= Encode.forHtmlAttribute(claim.getUri()) %>"
                                    class="form-control"/>
                        </div>
                        <%
                                }
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
                                data-action="usernameRecovery"
                                data-sitekey="<%=Encode.forHtmlContent(reCaptchaKey)%>"
                            >
                            </div>
                        </div>
                        <%
                            }
                        %>

                        <div class="ui divider hidden"></div>

                         <div class="mt-0">
                            <button id="recoverySubmit" class="ui primary button large fluid" type="submit">
                                <%=i18n(recoveryResourceBundle, customText, "username.recovery.next.button")%>
                            </button>

                        </div>
                        <div class="mt-1 align-center">
                            <a href="javascript:goBack()" class="ui button secondary large fluid">
                                <%=i18n(recoveryResourceBundle, customText, "username.recovery.cancel.button")%>
                            </a>
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

    <script type="text/javascript">
        function goBack() {
            window.history.back();
        }

        function onCompleted() {
            $("#recoverDetailsForm").submit();
        }

        $(window).on("pageshow", function (event) {
            if (event.originalEvent.persisted) {
                $("#recoverySubmit").removeClass("loading").attr("disabled", false);;
            }
        });

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

                const errorMessageFirstName = $("#error-msg-first-name");
                errorMessageFirstName.hide();

                <% if (isFirstNameInClaims && isFirstNameRequired) { %>
                    const firstName = $("#first-name").val();

                    if (firstName === "") {
                        errorMessageFirstName.show();
                        $("html, body").animate({scrollTop: errorMessageFirstName.offset().top}, "slow");
                        submitButton.removeClass("loading").attr("disabled", false);
                        return false;
                    }
                <% } %>

                const errorMessageContact = $("#error-msg-contact");
                const errorMessageContactText = $("#error-msg-contact-text");

                // Contact input validation.
                const contact = $("#contact").val();
                const mobileClaimRegex = new RegExp("<%=mobileClaimRegex%>");
                const emailClaimRegex = new RegExp("<%=emailClaimRegex%>");

                if (contact === "") {
                    errorMessageContactText.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Contact.cannot.be.empty")%>");
                    errorMessageContact.show();
                    $("html, body").animate({scrollTop: errorMessageContact.offset().top}, "slow");
                    submitButton.removeClass("loading").attr("disabled", false);
                    return false;
                } else if (!contact.match(mobileClaimRegex) && !contact.match(emailClaimRegex)) {
                    errorMessageContactText.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Invalid.contact")%>");
                    errorMessageContact.show();
                    $("html, body").animate({scrollTop: errorMessageContact.offset().top}, "slow");
                    submitButton.removeClass("loading").attr("disabled", false);
                    return false;
                }

                errorMessageFirstName.hide();
                errorMessageContact.hide();
                return true;
            });
        });
    </script>
</body>
</html>
