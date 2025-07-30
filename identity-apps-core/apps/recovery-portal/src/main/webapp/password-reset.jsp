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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ValidationConfigurationRetrievalClient" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URL" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    // Add the password-reset screen to the list to retrieve text branding customizations.
    screenNames.add("password-reset");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    String callback = (String) request.getAttribute(IdentityManagementEndpointConstants.CALLBACK);
    String username = request.getParameter("username");
    String userStoreDomain = request.getParameter("userstoredomain");
    String type = Encode.forJava(request.getParameter("type"));
    String orgId = request.getParameter("orgid");
    String spId = request.getParameter("spId");
    if (StringUtils.isBlank(spId)) {
        spId = (String)request.getAttribute("spId");
    }
    String sp = Encode.forJava(request.getParameter("sp"));
    if (StringUtils.isBlank(sp)) {
        sp = (String)request.getAttribute("sp");
    }
    boolean passwordExpired = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("passwordExpired"));
    String tenantDomainFromQuery = (String) request.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    String ASGARDEO_USERSTORE = "ASGARDEO-USER";
    if (StringUtils.isBlank(tenantDomainFromQuery)) {
        tenantDomainFromQuery = (String) session.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
    }
    if (StringUtils.isBlank(username)) {
        username = (String) request.getAttribute("username");
    }
    if (StringUtils.isBlank(userStoreDomain)) {
        userStoreDomain = (String) request.getAttribute("userstoredomain");
    }
    if (StringUtils.isBlank(callback) &&
        StringUtils.isNotBlank(userStoreDomain) &&
        userStoreDomain.equals(ASGARDEO_USERSTORE)) {
        callback = (String) request.getAttribute(IdentityManagementEndpointConstants.CALLBACK);
    }
    // Get validation configuration.
    ValidationConfigurationRetrievalClient validationConfigurationRetrievalClient = new ValidationConfigurationRetrievalClient();
    JSONObject passwordConfig = null;
    /*
     This variable exists for backward compatibility.If isPasswordInputValidationEnabled is true, the password
     validation will be done via the new input validation listener. Otherwise, it will be done via the old password
     policy validation handler.
    */
    Boolean isPasswordInputValidationEnabled = Boolean.parseBoolean(getServletContext().getInitParameter("isPasswordInputValidationEnabled"));
    try {
        if (isPasswordInputValidationEnabled){
            passwordConfig = validationConfigurationRetrievalClient.getPasswordConfiguration(tenantDomain);
        }
    } catch (Exception e) {
        passwordConfig = null;
    }

    String resetCode = (String) request.getAttribute("resetCode");
    String flowConfirmationCode = request.getParameter("flowConfirmationCode");
    boolean isForgotPasswordFlow = StringUtils.isNotBlank(resetCode);
%>

<% request.setAttribute("pageName", "password-reset"); %>

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
                    <%-- content --%>
                    <h2>
                        <% if ("invite".equalsIgnoreCase(type)) { %>
                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Set.Password")%>
                        <% } else { %>
                            <%=i18n(recoveryResourceBundle, customText, "password.reset.heading")%>
                        <% } %>
                    </h2>

                    <% if (error) { %>
                    <div class="ui visible negative message" id="server-error-msg">
                        <%=StringEscapeUtils.unescapeHtml4(IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg))%>
                    </div>
                    <% } %>

                    <% if (passwordExpired) { %>
                    <div class="ui visible negative message" id="server-error-msg">
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Password.Expired")%>
                    </div>
                    <% } %>
                    <div id="ui visible negative message" hidden="hidden"></div>

                    <div class="segment-form">
                        <form novalidate class="ui large form" method="post" action="<%= isForgotPasswordFlow?"passwordrecoveryotp.do":"completepasswordreset.do" %>" id="passwordResetForm">
                            <%
                            if (StringUtils.isNotBlank(spId)) {
                            %>
                            <input id="spId" name="spId" type="hidden" value="<%=Encode.forHtmlAttribute(spId)%>"/>
                            <%
                            }
                            %>
                            <div class="ui negative message" hidden="hidden" id="error-msg"></div>
                            <div id="reset-password-container" class="field mt-5 mb-3">
                                <label>
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "Enter.new.password")%>
                                </label>
                                <div class="ui right icon input addon-wrapper">
                                    <input
                                        id="reset-password"
                                        name="reset-password"
                                        type="password"
                                        required=""
                                        autocomplete="new-password"
                                        aria-describedby="passwordRequirements"
                                    />
                                    <i id="passwordShowHide" class="eye link icon slash"
                                       onclick="passwordShowToggle()"></i>

                                    <%-- Input Description for screen readers --%>
                                    <span id="passwordRequirements" style="display: none;">
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "password.requirements")%>
                                    </span>
                                </div>
                            </div>
                            <div id="password-validation-block">
                                <div id="length-block" class="password-policy-description mb-2" style="display: none;">
                                    <i id="password-validation-neutral-length" class="inverted grey circle icon"></i>
                                    <i id="password-validation-cross-length" style="display: none;" class="red times circle icon"></i>
                                    <i id="password-validation-check-length" style="display: none;" class="green check circle icon"></i>
                                    <p id="length" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "more.than.8.chars")%></p>
                                </div>
                                <div id="case-block" class="password-policy-description mb-2" style="display: none;">
                                    <i id="password-validation-neutral-case" class="inverted grey circle icon"></i>
                                    <i id="password-validation-cross-case" style="display: none;" class="red times circle icon"></i>
                                    <i id="password-validation-check-case" style="display: none;" class="green check circle icon"></i>
                                    <p id="case" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "lowercase.and.uppercase.letter")%></p>
                                </div>
                                <div id="number-block" class="password-policy-description mb-2" style="display: none;">
                                    <i id="password-validation-neutral-number" class="inverted grey circle icon"></i>
                                    <i id="password-validation-cross-number" style="display: none;" class="red times circle icon"></i>
                                    <i id="password-validation-check-number" style="display: none;" class="green check circle icon"></i>
                                    <p id="number" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "at.least.one.number")%></p>
                                </div>
                                <div id="special-chr-block" class="password-policy-description mb-2" style="display: none;">
                                    <i id="password-validation-neutral-special-chr" class="inverted grey circle icon"></i>
                                    <i id="password-validation-cross-special-chr" style="display: none;" class="red times circle icon"></i>
                                    <i id="password-validation-check-special-chr" style="display: none;" class="green check circle icon"></i>
                                    <p id="special-chr" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "at.least.one.special.char")%></p>
                                </div>
                                <div id="unique-chr-block" class="password-policy-description mb-2" style="display: none;">
                                    <i id="password-validation-neutral-unique-chr" class="inverted grey circle icon"></i>
                                    <i id="password-validation-cross-unique-chr" style="display: none;" class="red times circle icon"></i>
                                    <i id="password-validation-check-unique-chr" style="display: none;" class="green check circle icon"></i>
                                    <p id="unique-chr" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "at.least.one.unique.char")%></p>
                                </div>
                                <div id="repeated-chr-block" class="password-policy-description mb-2" style="display: none;">
                                    <i id="password-validation-neutral-repeated-chr" class="inverted grey circle icon"></i>
                                    <i id="password-validation-cross-repeated-chr" style="display: none;" class="red times circle icon"></i>
                                    <i id="password-validation-check-repeated-chr" style="display: none;" class="green check circle icon"></i>
                                    <p id="repeated-chr" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "no.more.than.one.repeated.char")%></p>
                                </div>

                            </div>

                            <%
                                if (StringUtils.isNotBlank(username)) {
                            %>
                            <div>
                                <input type="hidden" name="username" value="<%=Encode.forHtmlAttribute(username) %>"/>
                            </div>
                            <%
                                }
                                if (StringUtils.isNotBlank(callback)) {
                            %>
                            <div>
                                <input type="hidden" name="callback" value="<%=Encode.forHtmlAttribute(callback) %>"/>
                            </div>
                            <%
                                }
                                if (StringUtils.isNotBlank(sp)) {
                            %>
                            <div>
                                <input type="hidden" name="sp" value="<%=Encode.forHtmlAttribute(sp) %>"/>
                            </div>
                            <%
                                }
                                if (StringUtils.isNotBlank(userStoreDomain)) {
                            %>
                            <div>
                                <input type="hidden" name="userstoredomain"
                                       value="<%=Encode.forHtmlAttribute(userStoreDomain)%>"/>
                            </div>
                            <%
                                }
                                if (isForgotPasswordFlow) {
                            %>

                            <div>
                                <input type="hidden" name="channel"
                                value='<%=IdentityManagementEndpointConstants.PasswordRecoveryOptions.SMSOTP%>'/>
                            </div>
                            <div>
                                <input type="hidden" id="recoveryStage" name="recoveryStage"
                                value='RESET'/>
                            </div>
                            <div>
                                <input type="hidden" name="resetCode" value="<%=Encode.forHtmlAttribute(resetCode) %>"/>
                            </div>
                            <div>
                                <input type="hidden" name="flowConfirmationCode" value="<%=Encode.forHtmlAttribute(flowConfirmationCode) %>"/>
                            </div>
                            <%
                                }
                                if (!IdentityTenantUtil.isTenantQualifiedUrlsEnabled() &&
                                            StringUtils.isNotBlank(tenantDomainFromQuery)) {
                            %>
                            <div>
                                <input type="hidden" name="tenantDomainFromQuery" value="<%=Encode.forHtmlAttribute(tenantDomainFromQuery) %>"/>
                            </div>
                            <%
                                }
                                if (StringUtils.isNotBlank(type)) {
                            %>
                            <div>
                                <input type="hidden" name="type" value="<%=Encode.forHtmlAttribute(type) %>"/>
                            </div>
                            <%
                                }
                                if (StringUtils.isNotBlank(orgId)) {
                            %>
                            <div>
                                <input type="hidden" name="orgid" value="<%=Encode.forHtmlAttribute(orgId) %>"/>
                            </div>
                            <%
                                }
                            %>
                           <div id="reset-password2-container" class="field mt-5 mb-3">
                                <label>
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Confirm.password")%>
                                </label>
                                <div class="ui right icon input addon-wrapper">
                                    <input
                                        id="reset-password2"
                                        name="reset-password2"
                                        type="password"
                                        data-match="reset-password"
                                        required=""
                                        autocomplete="new-password"
                                        aria-describedby="passwordMatch"
                                    />
                                    <i id="confirmPasswordShowHide" class="eye link icon slash"
                                       onclick="confirmPasswordShowToggle()"></i>

                                       <%-- Input Description for screen readers --%>
                                    <span id="passwordMatch" style="display: none;">
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "passwords.should.match")%>
                                    </span>
                                </div>
                            </div>
                            <div id="password-validation-block">
                                <div class="password-policy-description">
                                    <i id="password-validation-neutral-match" class="inverted grey circle icon"></i>
                                    <i id="password-validation-cross-match" style="display: none;" class="red times circle icon"></i>
                                    <i id="password-validation-check-match" style="display: none;" class="green check circle icon"></i>
                                    <p class="pl-4">
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "passwords.should.match")%>
                                    </p>
                                </div>
                            </div>
                            <div class="ui divider hidden"></div>

                            <div class="align-right buttons">
                                <button id="submit"
                                    class="ui primary fluid large button"
                                    type="submit"
                                >
                                    <% if ("invite".equalsIgnoreCase(type)) { %>
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Proceed")%>
                                    <% } else { %>
                                        <%=i18n(recoveryResourceBundle, customText, "password.reset.button")%>
                                    <% } %>
                                </button>
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
            var passwordField = $("#reset-password");
            var passwordConfirmField = $("#reset-password2");
            var passwordConfig = <%=passwordConfig%>;
            var lowerCaseLetters = /[a-z]/g;
            var upperCaseLetters = /[A-Z]/g;
            var numbers = /[0-9]/g;
            var specialChr = /[!#$%&'()*+,\-\.\/:;<=>?@[\]^_{|}~]/g;
            var consecutiveChr = /([^])\1+/g;
            const isPasswordInputValidationEnabled = <%=isPasswordInputValidationEnabled%>;

            if (isPasswordInputValidationEnabled) {

                if (!passwordConfig) {
                    passwordConfig = {
                        "minLength": 8,
                        "maxLength": 30,
                        "minNumber": 1,
                        "minUpperCase": 1,
                        "minLowerCase": 1,
                        "minSpecialChr": 0
                    }
                }

                if (passwordConfig.minLength > 0 || passwordConfig.maxLength > 0) {
                    document.getElementById("length").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "must.be.between")%>' +
                        " " + (passwordConfig.minLength ?? 8) +
                        " " + '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "and")%>' +
                        " " + (passwordConfig.maxLength ?? 30) + " " +
                        '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "characters")%>';
                    $("#length-block").css("display", "block");
                }
                if (passwordConfig.minNumber > 0) {
                    document.getElementById("number").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "at.least")%>'
                        + " " + passwordConfig.minNumber + " "
                        + '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "numbers")%>';
                    $("#number-block").css("display", "block");
                }
                if ((passwordConfig.minUpperCase > 0) || passwordConfig.minLowerCase > 0) {
                    let cases = [];
                    if (passwordConfig.minUpperCase > 0) {
                        cases.push(passwordConfig.minUpperCase + " "
                            + '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "uppercase")%>');
                    }
                    if (passwordConfig.minLowerCase > 0) {
                        cases.push(passwordConfig.minLowerCase + " "
                            + '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "lowercase")%>');
                    }
                    document.getElementById("case").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "at.least")%>'
                        + " " + (cases.length > 1
                            ? cases.join(" " + '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "and")%>' + " ")
                            : cases[0]) + " " + '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "character.s")%>';
                    $("#case-block").css("display", "block");
                }
                if (passwordConfig.minSpecialChr > 0) {
                    document.getElementById("special-chr").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "at.least")%>'
                        + " " + passwordConfig.minSpecialChr + " "
                        + '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "special.characters")%>';
                    $("#special-chr-block").css("display", "block");
                }
                if (passwordConfig.minUniqueChr > 0) {
                    document.getElementById("unique-chr").innerHTML = ' <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "at.least")%>'
                        + " " + passwordConfig.minUniqueChr + " "
                        + '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "unique.characters")%>';
                    $("#unique-chr-block").css("display", "block");
                }
                if (passwordConfig.maxConsecutiveChr > 0) {
                    document.getElementById("repeated-chr").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "no.more.than")%>'
                        + " " + passwordConfig.maxConsecutiveChr + " "
                        + '<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "repeated.characters")%>';
                    $("#repeated-chr-block").css("display", "block");
                }
            }

            $(document).ready(function () {

                passwordField.keyup(function() {
                    validatePassword();
                    validateConfirmPassword();
                });

                passwordConfirmField.keyup(function() {
                    validateConfirmPassword();
                });

                passwordField.focusout(function() {
                    displayPasswordCross();
                });

                passwordConfirmField.focusout(function() {
                    displayConfirmPasswordCross();
                });

                $("#passwordResetForm").submit(function (e) {
                    $("#server-error-msg").remove();
                    displayPasswordCross();
                    displayConfirmPasswordCross();

                    return passwordSubmitValidation();
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
                    document.getElementById("reset-password2").setAttribute("type","text");
                } else{
                    password2 = true;
                    document.getElementById("confirmPasswordShowHide").classList.add("slash");
                    document.getElementById("reset-password2").setAttribute("type","password");
                }
            }

            function disableSubmitBtn() {
                if ($("#reset-password-container").hasClass("error") ||
                    $("#reset-password2-container").hasClass("error")) {
                    $("#submit").attr("disabled", true);
                } else {
                    $("#submit").attr("disabled", false);
                }
            }

            /**
             * Util function to validate password
             */
            function validatePassword() {

                if (!isPasswordInputValidationEnabled){
                    return;
                }

                $("#reset-password-container").removeClass("error");

                if ((!passwordConfig.minLength || passwordField.val().length >= passwordConfig.minLength) &&
                    (!passwordConfig.maxLength || passwordField.val().length <= passwordConfig.maxLength)) {
                    $("#password-validation-check-length").css("display", "block");
                    $("#password-validation-neutral-length").css("display", "none");
                    $("#password-validation-cross-length").css("display", "none");
                } else {
                    $("#password-validation-neutral-length").css("display", "block");
                    $("#password-validation-check-length").css("display", "none");
                    $("#password-validation-cross-length").css("display", "none");
                }

                if (checkMatch(passwordField.val(), passwordConfig.minUpperCase, upperCaseLetters) &&
                    checkMatch(passwordField.val(), passwordConfig.minLowerCase, lowerCaseLetters)) {
                    $("#password-validation-check-case").css("display", "block");
                    $("#password-validation-neutral-case").css("display", "none");
                    $("#password-validation-cross-case").css("display", "none");
                } else {
                    $("#password-validation-neutral-case").css("display", "block");
                    $("#password-validation-check-case").css("display", "none");
                    $("#password-validation-cross-case").css("display", "none");
                }

                if (checkMatch(passwordField.val(), passwordConfig.minNumber, numbers)) {
                    $("#password-validation-check-number").css("display", "block");
                    $("#password-validation-neutral-number").css("display", "none");
                    $("#password-validation-cross-number").css("display", "none");
                } else {
                    $("#password-validation-neutral-number").css("display", "block");
                    $("#password-validation-check-number").css("display", "none");
                    $("#password-validation-cross-number").css("display", "none");
                }

                if (checkMatch(passwordField.val(), passwordConfig.minSpecialChr, specialChr)) {
                    $("#password-validation-check-special-chr").css("display", "block");
                    $("#password-validation-neutral-special-chr").css("display", "none");
                    $("#password-validation-cross-special-chr").css("display", "none");
                } else {
                    $("#password-validation-neutral-special-chr").css("display", "block");
                    $("#password-validation-check-special-chr").css("display", "none");
                    $("#password-validation-cross-special-chr").css("display", "none");
                }

                if (checkUniqueCharacter(passwordField.val(), passwordConfig.minUniqueChr)) {
                    $("#password-validation-check-unique-chr").css("display", "block");
                    $("#password-validation-neutral-unique-chr").css("display", "none");
                    $("#password-validation-cross-unique-chr").css("display", "none");
                } else {
                    $("#password-validation-neutral-unique-chr").css("display", "block");
                    $("#password-validation-check-unique-chr").css("display", "none");
                    $("#password-validation-cross-unique-chr").css("display", "none");
                }

                if (checkConsecutiveMatch(passwordField.val(), passwordConfig.maxConsecutiveChr, consecutiveChr)) {
                    $("#password-validation-check-repeated-chr").css("display", "block");
                    $("#password-validation-neutral-repeated-chr").css("display", "none");
                    $("#password-validation-cross-repeated-chr").css("display", "none");
                } else {
                    $("#password-validation-neutral-repeated-chr").css("display", "block");
                    $("#password-validation-check-repeated-chr").css("display", "none");
                    $("#password-validation-cross-repeated-chr").css("display", "none");
                }

                disableSubmitBtn();
            }

            /**
             * Util function to validate confirm password.
             */
            function validateConfirmPassword() {
                $("#reset-password2-container").removeClass("error");

                if (passwordField.val() !== "" && passwordField.val() === passwordConfirmField.val()) {
                    $("#password-validation-check-match").css("display", "block");
                    $("#password-validation-neutral-match").css("display", "none");
                    $("#password-validation-cross-match").css("display", "none");
                } else {
                    $("#password-validation-neutral-match").css("display", "block");
                    $("#password-validation-check-match").css("display", "none");
                    $("#password-validation-cross-match").css("display", "none");
                }

                disableSubmitBtn();
            }

            /**
             * Function to enable cross-marks on unmet criteria when submitting. When isPasswordInputValidationEnabled
             * is false, only the basic password validation will be performed.
             */
            function passwordSubmitValidation() {

                if (!isPasswordInputValidationEnabled){
                    const errorMsg = $("#error-msg");
                    if (!passwordField.val() && passwordField.val().length === 0) {
                        errorMsg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                        "Password.cannot.be.empty")%>");
                        errorMsg.show();
                        $("html, body").animate({scrollTop: errorMsg.offset().top}, 'slow');
                        return false;
                    }

                    return passwordField.val() === passwordConfirmField.val();
                }

                var validPassword = true;

                if ((passwordConfig.minLength && passwordField.val().length < passwordConfig.minLength) ||
                    (passwordConfig.maxLength && passwordField.val().length > passwordConfig.maxLength)) {
                    validPassword = false;
                }

                if (!checkMatch(passwordField.val(), passwordConfig.minUpperCase, upperCaseLetters) ||
                    !checkMatch(passwordField.val(), passwordConfig.minLowerCase, lowerCaseLetters)) {
                    validPassword = false;
                }
                if (!checkMatch(passwordField.val(), passwordConfig.minNumber, numbers)) {
                    validPassword = false;
                }
                if (!checkMatch(passwordField.val(), passwordConfig.minSpecialChr, specialChr)) {
                    validPassword = false;
                }
                if (!checkUniqueCharacter(passwordField.val(), passwordConfig.minUniqueChr)) {
                    validPassword = false;
                }
                if (!checkConsecutiveMatch(passwordField.val(), passwordConfig.maxConsecutiveChr, consecutiveChr)) {
                    validPassword = false;
                }
                if (!(passwordField.val() !== "" && passwordField.val() === passwordConfirmField.val())) {
                    validPassword = false;
                }

                return validPassword;
            }

            function displayPasswordCross() {

                if (!isPasswordInputValidationEnabled){
                    return;
                }
                var displayError = false;

                $("#reset-password-container").removeClass("error");

                if ((!passwordConfig.minLength || passwordField.val().length >= passwordConfig.minLength) &&
                    (!passwordConfig.maxLength || passwordField.val().length <= passwordConfig.maxLength)) {
                    $("#password-validation-check-length").css("display", "block");
                    $("#password-validation-neutral-length").css("display", "none");
                    $("#password-validation-cross-length").css("display", "none");
                } else {
                    $("#password-validation-cross-length").css("display", "block");
                    $("#password-validation-check-length").css("display", "none");
                    $("#password-validation-neutral-length").css("display", "none");

                    displayError = true;
                }

                if (checkMatch(passwordField.val(), passwordConfig.minUpperCase, upperCaseLetters) &&
                    checkMatch(passwordField.val(), passwordConfig.minLowerCase, lowerCaseLetters)) {
                    $("#password-validation-check-case").css("display", "block");
                    $("#password-validation-neutral-case").css("display", "none");
                    $("#password-validation-cross-case").css("display", "none");
                } else {
                    $("#password-validation-cross-case").css("display", "block");
                    $("#password-validation-check-case").css("display", "none");
                    $("#password-validation-neutral-case").css("display", "none");

                    displayError = true;
                }

                if (checkMatch(passwordField.val(), passwordConfig.minNumber, numbers)) {
                    $("#password-validation-check-number").css("display", "block");
                    $("#password-validation-neutral-number").css("display", "none");
                    $("#password-validation-cross-number").css("display", "none");
                } else {
                    $("#password-validation-cross-number").css("display", "block");
                    $("#password-validation-check-number").css("display", "none");
                    $("#password-validation-neutral-number").css("display", "none");

                    displayError = true;
                }
                if (checkMatch(passwordField.val(), passwordConfig.minSpecialChr, specialChr)) {
                    $("#password-validation-check-special-chr").css("display", "block");
                    $("#password-validation-neutral-special-chr").css("display", "none");
                    $("#password-validation-cross-special-chr").css("display", "none");
                } else {
                    $("#password-validation-cross-special-chr").css("display", "block");
                    $("#password-validation-check-special-chr").css("display", "none");
                    $("#password-validation-neutral-special-chr").css("display", "none");

                    displayError = true;
                }
                if (checkUniqueCharacter(passwordField.val(), passwordConfig.minUniqueChr)) {
                    $("#password-validation-check-unique-chr").css("display", "block");
                    $("#password-validation-neutral-unique-chr").css("display", "none");
                    $("#password-validation-cross-unique-chr").css("display", "none");
                } else {
                    $("#password-validation-cross-unique-chr").css("display", "block");
                    $("#password-validation-check-unique-chr").css("display", "none");
                    $("#password-validation-neutral-unique-chr").css("display", "none");

                    displayError = true;
                }
                if (checkConsecutiveMatch(passwordField.val(), passwordConfig.maxConsecutiveChr, consecutiveChr)) {
                    $("#password-validation-check-repeated-chr").css("display", "block");
                    $("#password-validation-neutral-repeated-chr").css("display", "none");
                    $("#password-validation-cross-repeated-chr").css("display", "none");
                } else {
                    $("#password-validation-cross-repeated-chr").css("display", "block");
                    $("#password-validation-check-repeated-chr").css("display", "none");
                    $("#password-validation-neutral-repeated-chr").css("display", "none");

                    displayError = true;
                }

                if (displayError) {
                    $("#reset-password-container").addClass("error");
                }

                disableSubmitBtn();
            }

            /**
             * Function to validate against regex pattern.
             */
            function checkMatch(_password, limit, pattern) {
                if (!limit || (_password.match(pattern)?.length >= limit)) {
                    return true;
                } else {
                    return false;
                }
            }

            /**
             * Function to validate against consecutive character validator.
             */
            function checkConsecutiveMatch(_password, limit, pattern) {

                var _consValid = true;
                if (limit > 0 &&
                    _password.match(pattern) && _password.match(pattern).length > 0) {
                    var list = _password.match(pattern);
                    var longest = list.sort(
                        function(a,b) {
                            return b.length - a.length
                        }
                    )[0];
                    if (longest.length > limit) {
                        _consValid = false;
                    }
                }
                return _consValid;
            }

            /**
             * Function to validate against unique character validator.
             */
            function checkUniqueCharacter(_password, limit) {

                var unique = _password.split("");
                var _unique = new Set(unique);
                if (!limit || (_unique.size >= limit)) {
                    return true;
                } else {
                    return false;
                }
            }

            function displayConfirmPasswordCross() {
                $("#reset-password2-container").removeClass("error");

                if (passwordField.val() !== "" && passwordField.val() === passwordConfirmField.val()) {
                    $("#password-validation-check-match").css("display", "block");
                    $("#password-validation-neutral-match").css("display", "none");
                    $("#password-validation-cross-match").css("display", "none");
                } else {
                    $("#reset-password2-container").addClass("error");
                    $("#password-validation-cross-match").css("display", "block");
                    $("#password-validation-check-match").css("display", "none");
                    $("#password-validation-neutral-match").css("display", "none");
                }

                disableSubmitBtn();
            }
        </script>
    </body>
</html>
