<%--
  ~ Copyright (c) 2016-2026, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
  --%>

<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.TenantDataManager" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ValidationConfigurationRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
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

    String errorMessage = "Authentication Failed! Please Retry";
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = "Authentication Failed! Please Retry";
            }
        }
    }
%>

<html>
<head>
    <!-- header -->
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
        <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
        <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>

<body class="login-portal layout authentication-portal-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
            <!-- product-title -->
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
            <div class="ui segment">
                <!-- content -->
                <h3 class="ui header">
                    Change your password
                </h3>

                <%
                    if ("true".equals(authenticationFailed)) {
                %>
                <div class="ui visible negative message" id="server-error-msg">
                    <%=errorMessage%>
                </div>
                <% } %>

                <div id="ui visible negative message" hidden="hidden"></div>

                <div class="ui divider hidden"></div>

                <div class="segment-form">
                    <form id="pin_form" class="ui large form" name="pin_form" action="<%=commonauthURL%>"  method="POST">

                        <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>

                        <div class="ui negative message" hidden="hidden" id="error-msg"></div>
                        <div class="field">
                            <label for="currentPassword">
                                Current Password
                            </label>
                            <input id="currentPassword" name="currentPassword" type="password" tabindex="0" placeholder="Current Password" autocomplete="off">
                        </div>

                        <div class="field" id="reset-password-container">
                            <label for="newPassword">
                                New Password
                            </label>
                            <div class="ui right icon input addon-wrapper">
                                <input id="newPassword" name="newPassword" type="password" placeholder="New Password" autocomplete="off">
                                <i id="passwordShowHide" class="eye link icon slash"
                                        onclick="passwordShowToggle()"></i>
                            </div>
                        </div>
                        <div id="password-validation-block">
                            <div id="length-block" class="password-policy-description mb-2" style="display: none;">
                                <i id="password-validation-neutral-length" class="inverted grey circle icon"></i>
                                <i id="password-validation-cross-length" style="display: none;" class="red times circle icon"></i>
                                <i id="password-validation-check-length" style="display: none;" class="green check circle icon"></i>
                                <p id="length" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "more.than.8.chars")%></p>
                            </div>
                            <div id="case-block" class="password-policy-description mb-2" style="display: none;">
                                <i id="password-validation-neutral-case" class="inverted grey circle icon"></i>
                                <i id="password-validation-cross-case" style="display: none;" class="red times circle icon"></i>
                                <i id="password-validation-check-case" style="display: none;" class="green check circle icon"></i>
                                <p id="case" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "lowercase.and.uppercase.letter")%></p>
                            </div>
                            <div id="number-block" class="password-policy-description mb-2" style="display: none;">
                                <i id="password-validation-neutral-number" class="inverted grey circle icon"></i>
                                <i id="password-validation-cross-number" style="display: none;" class="red times circle icon"></i>
                                <i id="password-validation-check-number" style="display: none;" class="green check circle icon"></i>
                                <p id="number" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "at.least.one.number")%></p>
                            </div>
                            <div id="special-chr-block" class="password-policy-description mb-2" style="display: none;">
                                <i id="password-validation-neutral-special-chr" class="inverted grey circle icon"></i>
                                <i id="password-validation-cross-special-chr" style="display: none;" class="red times circle icon"></i>
                                <i id="password-validation-check-special-chr" style="display: none;" class="green check circle icon"></i>
                                <p id="special-chr" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "at.least.one.special.char")%></p>
                            </div>
                            <div id="unique-chr-block" class="password-policy-description mb-2" style="display: none;">
                                <i id="password-validation-neutral-unique-chr" class="inverted grey circle icon"></i>
                                <i id="password-validation-cross-unique-chr" style="display: none;" class="red times circle icon"></i>
                                <i id="password-validation-check-unique-chr" style="display: none;" class="green check circle icon"></i>
                                <p id="unique-chr" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "at.least.one.unique.char")%></p>
                            </div>
                            <div id="repeated-chr-block" class="password-policy-description mb-2" style="display: none;">
                                <i id="password-validation-neutral-repeated-chr" class="inverted grey circle icon"></i>
                                <i id="password-validation-cross-repeated-chr" style="display: none;" class="red times circle icon"></i>
                                <i id="password-validation-check-repeated-chr" style="display: none;" class="green check circle icon"></i>
                                <p id="repeated-chr" class="pl-4"><%=IdentityManagementEndpointUtil.i18n(resourceBundle, "no.more.than.one.repeated.char")%></p>
                            </div>
                        </div>

                        <div class="field" id="reset-password2-container">
                            <label for="repeatPassword">
                                Repeat Password
                            </label>
                            <div class="ui right icon input addon-wrapper">
                                <input id="repeatPassword" name="newPasswordConfirmation" type="password" class="form-control" placeholder="Repeat Password" autocomplete="off">
                                <i id="confirmPasswordShowHide" class="eye link icon slash"
                                        onclick="confirmPasswordShowToggle()"></i>
                            </div>
                        </div>
                        <div id="password-validation-block">
                            <div class="password-policy-description">
                                <i id="password-validation-neutral-match" class="inverted grey circle icon"></i>
                                <i id="password-validation-cross-match" style="display: none;" class="red times circle icon"></i>
                                <i id="password-validation-check-match" style="display: none;" class="green check circle icon"></i>
                                <p class="pl-4">
                                    Both passwords should match
                                </p>
                            </div>
                        </div>

                        <div class="ui divider hidden"></div>

                        <div class="align-right buttons">
                            <button id="recoverySubmit" class="ui primary button" type="submit" onclick="$('#loading').show();">
                                Change password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </layout:component>
        <!-- /content/body -->
        <!-- product-footer -->
        <layout:component componentName="ProductFooter">
            <%
                File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                if (productFooterFile.exists()) {
            %>
                <jsp:include page="extensions/product-footer.jsp"/>
            <% } else { %>
                <jsp:include page="includes/product-footer.jsp"/>
            <% } %>
        </layout:component>
    </layout:main>

    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
        <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
        <jsp:include page="includes/footer.jsp"/>
    <% } %>
    <script type="text/javascript">
        var passwordField = $("#newPassword");
        var passwordConfirmField = $("#repeatPassword");
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
                    "minSpecialChr": 1
                }
            }

            if (passwordConfig.minLength > 0 || passwordConfig.maxLength > 0) {
                document.getElementById("length").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "must.be.between")%>' +
                    " " + (passwordConfig.minLength ?? 8) +
                    " " + '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "and")%>' +
                    " " + (passwordConfig.maxLength ?? 30) + " " +
                    '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "characters")%>';
                $("#length-block").css("display", "block");
            }
            if (passwordConfig.minNumber > 0) {
                document.getElementById("number").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "at.least")%>'
                    + " " + passwordConfig.minNumber + " "
                    + '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "numbers")%>';
                $("#number-block").css("display", "block");
            }
            if ((passwordConfig.minUpperCase > 0) || passwordConfig.minLowerCase > 0) {
                let cases = [];
                if (passwordConfig.minUpperCase > 0) {
                    cases.push(passwordConfig.minUpperCase + " "
                        + '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "uppercase")%>');
                }
                if (passwordConfig.minLowerCase > 0) {
                    cases.push(passwordConfig.minLowerCase + " "
                        + '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "lowercase")%>');
                }
                document.getElementById("case").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "at.least")%>'
                    + " " + (cases.length > 1
                        ? cases.join(" " + '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "and")%>' + " ")
                        : cases[0]) + " " + '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "character.s")%>';
                $("#case-block").css("display", "block");
            }
            if (passwordConfig.minSpecialChr > 0) {
                document.getElementById("special-chr").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "at.least")%>'
                    + " " + passwordConfig.minSpecialChr + " "
                    + '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "special.characters")%>';
                $("#special-chr-block").css("display", "block");
            }
            if (passwordConfig.minUniqueChr > 0) {
                document.getElementById("unique-chr").innerHTML = ' <%=IdentityManagementEndpointUtil.i18n(resourceBundle, "at.least")%>'
                    + " " + passwordConfig.minUniqueChr + " "
                    + '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "unique.characters")%>';
                $("#unique-chr-block").css("display", "block");
            }
            if (passwordConfig.maxConsecutiveChr > 0) {
                document.getElementById("repeated-chr").innerHTML = '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "no.more.than")%>'
                    + " " + passwordConfig.maxConsecutiveChr + " "
                    + '<%=IdentityManagementEndpointUtil.i18n(resourceBundle, "repeated.characters")%>';
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

            $("#pin_form").submit(function (e) {
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
                document.getElementById("newPassword").setAttribute("type","text");
            } else{
                password1 = true;
                document.getElementById("passwordShowHide").classList.add("slash");
                document.getElementById("newPassword").setAttribute("type","password");
            }
        }

        function confirmPasswordShowToggle(){
            if(password2) {
                password2 = false;
                document.getElementById("confirmPasswordShowHide").classList.remove("slash");
                document.getElementById("repeatPassword").setAttribute("type","text");
            } else{
                password2 = true;
                document.getElementById("confirmPasswordShowHide").classList.add("slash");
                document.getElementById("repeatPassword").setAttribute("type","password");
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

        function displayPasswordCross() {

            if (!isPasswordInputValidationEnabled){
                return;
            }
            var displayError = false;

            $("#reset-password-container").removeClass("error");

            // Prevent validation from happening when the password is empty
            if (passwordField.val().length <= 0) {
                return false;
            }

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
        }

        function displayConfirmPasswordCross() {
            $("#reset-password2-container").removeClass("error");

            // Prevent validation from happening when the password is empty
            if (passwordConfirmField.val().length <= 0) {
                return false;
            }

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
        }

        /**
         * Function to enable cross-marks on unmet criteria when submitting. When isPasswordInputValidationEnabled
         * is false, only the basic password validation will be performed.
         */
        function passwordSubmitValidation() {

            if (!isPasswordInputValidationEnabled){
                const errorMsg = $("#error-msg");
                if (!passwordField.val() && passwordField.val().length === 0) {
                    errorMsg.text("Password cannot be empty.");
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
    </script>
</body>
</html>
