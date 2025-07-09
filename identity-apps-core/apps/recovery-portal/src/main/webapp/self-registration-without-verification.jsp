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

<%@ page import="com.google.gson.Gson" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.cxf.jaxrs.impl.ResponseImpl" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.serviceclient.UserRegistrationClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.serviceclient.beans.Claim" %>
<%@ page import="java.io.File" %>
<%@ page import="javax.ws.rs.core.Response" %>
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


    boolean isFirstNameInClaims = true;
    boolean isFirstNameRequired = true;
    boolean isLastNameInClaims = true;
    boolean isLastNameRequired = true;
    boolean isEmailInClaims = true;
    boolean isEmailRequired = true;

    Claim[] claims = new Claim[0];

    UserRegistrationClient userRegistrationClient = new UserRegistrationClient();
    Response responseForAllClaims = userRegistrationClient.getAllClaims(null);
    if(responseForAllClaims != null && Response.Status.OK.getStatusCode() == responseForAllClaims.getStatus()) {
        String claimsContent = responseForAllClaims.readEntity(String.class);
        Gson gson = new Gson();
        claims = gson.fromJson(claimsContent, Claim[].class);
    }
    if(((ResponseImpl)responseForAllClaims).getHeaders().containsKey("reCaptcha") &&
            Boolean.parseBoolean((String) ((ResponseImpl)responseForAllClaims).getHeaders().get("reCaptcha").get(0))) {
        request.setAttribute("reCaptcha", "true");
        request.setAttribute("reCaptchaKey", ((ResponseImpl)responseForAllClaims).getHeaders().get("reCaptchaKey").get(0));
        request.setAttribute("reCaptchaAPI", ((ResponseImpl)responseForAllClaims).getHeaders().get("reCaptchaAPI").get(0));
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

<% request.setAttribute("pageName", "self-registration-without-verification"); %>

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
                <h3 class="ui header" data-testid="self-registration-without-verification-page-header">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Create.an.account")%>
                </h3>
                <% if (error) { %>
                <div class="ui negative message" id="server-error-msg">
                    <%= IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg) %>
                </div>
                <% } %>
                <div class="ui negative message" id="error-msg" hidden="hidden"></div>

                <div class="ui divider hidden"></div>
                <div class="segment-form">
                    <form class="ui large form" action="processregistration.do" method="post" id="register">
                        <p>
                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Enter.required.fields.to.complete.registration")%>
                        </p>
                        <div class="ui divider hidden"></div>
                        <div>
                            <div id="regFormError" class="ui negative message" style="display:none"></div>
                            <div id="regFormSuc" class="ui positive message" style="display:none"></div>
                            <div class="two fields">
                                <% if (isFirstNameInClaims) { %>
                                <div class="field">
                                    <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "First.name")%>*</label>
                                    <input type="text" name="http://wso2.org/claims/givenname" class="form-control"
                                        <% if (isFirstNameRequired) {%> required <%}%>
                                        placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "First.name")%>*"/>
                                </div>
                                <%}%>
                                <% if (isFirstNameInClaims) { %>
                                <div class="field">
                                    <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Last.name")%>*</label>
                                    <input type="text" name="http://wso2.org/claims/lastname" class="form-control"
                                        <% if (isLastNameRequired) {%> required <%}%>]
                                        placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Last.name")%>*"
                                    />
                                </div>
                                <%}%>
                            </div>
                            <div class="field">
                                <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Username")%>*</label>
                                <input id="username" name="username" type="text"
                                    class="form-control required usrName usrNameLength"
                                    placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Username")%>*"
                                    required
                                />
                            </div>
                            <div class="field">
                                <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Password")%>*</label>
                                <input id="password" name="password" type="password"
                                    class="form-control"
                                    placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Password")%>*"
                                    required
                                />
                            </div>
                            <div class="field">
                                <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Confirm.password")%>*</label>
                                <input id="password2" name="password2" type="password"
                                    data-match="reg-password"
                                    class="form-control"
                                    placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Confirm.password")%>*"
                                    required
                                />
                            </div>
                            <% if (isEmailInClaims) { %>
                            <div class="field">
                                <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                        "Email")%>*
                                </label>
                                <input type="email" name="http://wso2.org/claims/emailaddress" data-claim-uri="http://wso2.org/claims/emailaddress"
                                       class="form-control" data-validate="email"
                                    <% if (isEmailRequired) {%> required <%}%>
                                     placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"Email")%>*"
                                />
                            </div>
                            <%}%>
                            <% for (Claim claim : claims) {
                                if (!StringUtils.equals(claim.getClaimUri(), IdentityManagementEndpointConstants.ClaimURIs.FIRST_NAME_CLAIM) &&
                                    !StringUtils.equals(claim.getClaimUri(), IdentityManagementEndpointConstants.ClaimURIs.LAST_NAME_CLAIM) &&
                                    !StringUtils.equals(claim.getClaimUri(), IdentityManagementEndpointConstants.ClaimURIs.EMAIL_CLAIM) &&
                                    !StringUtils.equals(claim.getClaimUri(), IdentityManagementEndpointConstants.ClaimURIs.CHALLENGE_QUESTION_URI_CLAIM) &&
                                    !StringUtils.equals(claim.getClaimUri(), IdentityManagementEndpointConstants.ClaimURIs.CHALLENGE_QUESTION_1_CLAIM) &&
                                    !StringUtils.equals(claim.getClaimUri(), IdentityManagementEndpointConstants.ClaimURIs.CHALLENGE_QUESTION_2_CLAIM) &&
                                    !claim.isReadOnly()) {
                            %>
                            <div class="field">
                                <% if (claim.isRequired()) { %>
                                <label class="control-label">
                                    <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, claim.getDisplayTag())%>*
                                </label>
                                <% } else { %>
                                <label class="control-label">
                                    <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, claim.getDisplayTag())%>
                                </label>
                                <% } %>
                                <input name="<%= Encode.forHtmlAttribute(claim.getClaimUri()) %>"
                                    data-claim-uri="<%= Encode.forHtmlAttribute(claim.getClaimUri()) %>"
                                    class="form-control"
                                    <% if (claim.isRequired()) {%> required <%}%>
                                    <% if (claim.isRequired()) { %>
                                    placeholder="<%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, claim.getDisplayTag())%>*"
                                    <% } else { %>
                                    placeholder="<%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, claim.getDisplayTag())%>"
                                    <% } %>
                                />
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
                                    data-action="register"
                                    data-sitekey="<%=Encode.forHtmlContent(reCaptchaKey)%>"
                                >
                                </div>
                            </div>
                            <%
                                }
                            %>
                            <div class="field">
                                <input id="isSelfRegistrationWithVerification" type="hidden"
                                       name="isSelfRegistrationWithVerification"
                                       value="false"/>
                            </div>

                            <div class="ui divider hidden"></div>
                            <div class="buttons mt-4">
                                <button id="registrationSubmit"
                                        class="ui primary button large fluid"
                                        type="submit">
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Next")%>
                                </button>
                            </div>
                            <div class="ui divider hidden"></div>
                            <div class="buttons mt-2">
                                <div class="field external-link-container text-small">
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                            "Already.have.an.account")%>
                                    <a href="<%=Encode.forHtmlAttribute(IdentityManagementEndpointUtil.getUserPortalUrl(
                                        application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL)))%>"
                                        id="signInLink" class="font-large">
                                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Sign.in")%>
                                    </a>
                                </div>
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

    <script src="libs/jquery_3.6.0/jquery-3.6.0.min.js"></script>
    <script type="text/javascript">

        function onSubmit(token) {
           $("#register").submit();
        }

        function onCompleted() {
            $('#register').submit();
        }

        $(document).ready(function () {

            $("#register").submit(function (e) {

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

                var unsafeCharPattern = /[<>`\"]/;
                var elements = document.getElementsByTagName("input");
                var invalidInput = false;
                var error_msg = $("#error-msg");

                for (i = 0; i < elements.length; i++) {
                    if (elements[i].type === 'text' && elements[i].value != null
                        && elements[i].value.match(unsafeCharPattern) != null) {
                        error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"For.security.following.characters.restricted")%>");
                        error_msg.show();
                        $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                        invalidInput = true;
                        return false;
                    }
                }
                if (invalidInput) {
                    return false;
                }

                var password = $("#password").val();
                var password2 = $("#password2").val();

                if (password != password2) {
                    error_msg.text("<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                    "Passwords.did.not.match.please.try.again")%>");
                    error_msg.show();
                    $("html, body").animate({scrollTop: error_msg.offset().top}, 'slow');
                    return false;
                }

                return true;
            });
        });
    </script>
</body>
</html>
