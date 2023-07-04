<%--
  ~ Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    ReCaptchaApi reCaptchaApi = new ReCaptchaApi();
    String username = request.getParameter("username");

    if (StringUtils.isNotEmpty(tenantDomain)) {
        try {
            IdentityTenantUtil.getTenantId(tenantDomain);
        } catch (IdentityRuntimeException e) {
            request.setAttribute("error", true);
            request.setAttribute("errorMsg", e.getMessage());
            request.getRequestDispatcher("password-recovery-tenant-request.jsp").forward(request, response);
            return;
        }
    }

    try {
        ReCaptchaProperties reCaptchaProperties = reCaptchaApi.getReCaptcha(tenantDomain, true, "ReCaptcha",
                "password-recovery");

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

    boolean isFirstNameInClaims = false;
    boolean isLastNameInClaims = false;
    boolean isEmailInClaims = false;
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
        if (!StringUtils.isBlank(username)) {
            request.setAttribute("username", username);
        }
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    for (Claim claim : claims) {
        if (IdentityManagementEndpointConstants.ClaimURIs.FIRST_NAME_CLAIM.equals(claim.getUri())) {
            isFirstNameInClaims = true;
        }
        else if (IdentityManagementEndpointConstants.ClaimURIs.LAST_NAME_CLAIM.equals(claim.getUri())) {
            isLastNameInClaims = true;
        }
        else if (IdentityManagementEndpointConstants.ClaimURIs.EMAIL_CLAIM.equals(claim.getUri()))  {
            isEmailInClaims = true;
        }
    }

    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));

    boolean reCaptchaEnabled = false;
    if (request.getAttribute("reCaptcha") != null &&
            "TRUE".equalsIgnoreCase((String) request.getAttribute("reCaptcha"))) {
        reCaptchaEnabled = true;
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "large");
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
                <h2><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Recover.password")%></h2>
                <% if (error) { %>
                <div class="ui visible negative message" id="server-error-msg">
                    <%= IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg) %>
                </div>
                <% } %>
                <div class="ui negative message" id="error-msg" hidden="hidden"></div>

                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Enter.detail.to.recover.pwd")%>

                <div class="ui divider hidden"></div>

                <div class="segment-form">
                    <form class="ui large form" method="post" action="password-recovery-with-claims-options.jsp" id="recoverDetailsForm">
                        <div class="field">
                            <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "Username")%></label>
                            <input id="username" type="text" name="username" class="form-control claims">
                        </div>
                        <% if (isFirstNameInClaims || isLastNameInClaims) { %>
                        <div class="field">
                            <label><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "name")%></label>
                            <div class="two fields">
                                <% if (isFirstNameInClaims) { %>
                                <div class="field">
                                    <input id="first-name" type="text" name="http://wso2.org/claims/givenname"
                                           placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                                "First.name")%>" class="form-control claims"/>
                                </div>
                                <% } %>
                                <% if (isLastNameInClaims) { %>
                                <div class="field">
                                    <input id="last-name" type="text" name="http://wso2.org/claims/lastname"
                                           placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                                "Last.name")%>" class="form-control claims"/>
                                </div>
                                <% } %>
                            </div>
                        </div>
                        <% }
                            String sessionDataKey = request.getParameter("sessionDataKey");
                            if (sessionDataKey != null) {
                        %>
                        <div>
                            <input type="hidden" name="sessionDataKey"
                                   value="<%=Encode.forHtmlAttribute(sessionDataKey) %>"/>
                        </div>
                        <%
                            }
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
                        <%
                            }

                            if (isEmailInClaims) { %>
                        <div class="field">
                            <label class="control-label"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "Email")%></label>
                            <input id="email" type="email" name="http://wso2.org/claims/emailaddress"
                                   class="form-control claims" data-validate="email">
                        </div>
                        <% } %>

                        <% if (!isSaaSApp && (StringUtils.isNotEmpty(tenantDomain) && !error)) { %>
                        <div>
                            <input id="tenant-domain" type="hidden" name="tenantDomain" value="<%=Encode.forHtmlAttribute(tenantDomain)%>"/>
                        </div>
                        <% } else { %>
                        <div class="field">
                            <label class="control-label">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Tenant.domain")%>
                            </label>
                            <input id="tenant-domain" type="text" name="tenantDomain" class="form-control">
                        </div>
                        <% } %>
                        <% for (Claim claim : claims) {
                            if (claim.getRequired() &&
                                    !StringUtils.equals(claim.getUri(),
                                            IdentityManagementEndpointConstants.ClaimURIs.FIRST_NAME_CLAIM) &&
                                    !StringUtils.equals(claim.getUri(),
                                            IdentityManagementEndpointConstants.ClaimURIs.LAST_NAME_CLAIM) &&
                                    !StringUtils.equals(claim.getUri(),
                                            IdentityManagementEndpointConstants.ClaimURIs.EMAIL_CLAIM)) {
                        %>

                        <div class="field">
                            <label class="control-label"><%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle,
                                    claim.getDisplayName())%>
                            </label>
                            <input type="text" name="<%= Encode.forHtmlAttribute(claim.getUri()) %>"
                                   class="form-control claims"/>
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
                                data-action="passwordRecovery"
                                data-sitekey="<%=Encode.forHtmlContent(reCaptchaKey)%>"
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
                                    class="ui primary large button"
                                    type="submit"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "Submit")%>
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
            $('#recoverDetailsForm').submit();
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
                var errorMessage = $("#error-msg");
                errorMessage.hide();

                var claimFields = document.querySelectorAll(".claims");
                var filled = 0;
                for(var i = 0;i < claimFields.length;i++){
                    var input = claimFields[i];
                    if(input.value.length > 0)
                    {
                        filled++;
                    }
                }
                if(filled < 1) {
                    errorMessage.text("Please fill at least one user details field.");
                    errorMessage.show();
                    $("html, body").animate({scrollTop: errorMessage.offset().top}, 'slow');
                    return false;
                }


                return true;
            });

        });
    </script>
</body>
</html>
