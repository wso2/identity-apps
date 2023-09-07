<%--
 ~
 ~ Copyright (c) 2021, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%@ page import="org.apache.cxf.jaxrs.client.JAXRSClientFactory" %>
<%@ page import="org.apache.cxf.jaxrs.provider.json.JSONProvider" %>
<%@ page import="org.apache.http.HttpStatus" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.client.SelfUserRegistrationResource" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.bean.ResendCodeRequestDTO" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.bean.UserDTO" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="javax.ws.rs.core.Response" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ConfiguredAuthenticatorsRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ConfiguredAuthenticatorsRetrievalClientException" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isSelfSignUpEPAvailable" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isRecoveryEPAvailable" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isEmailUsernameEnabled" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL" %>
<%@ page import="org.wso2.carbon.identity.core.URLBuilderException" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>
<%@ page import="org.json.JSONArray" %>
<%@ page import="org.json.JSONObject" %>

<jsp:directive.include file="includes/init-loginform-action-url.jsp"/>

<%
    String emailUsernameEnable = application.getInitParameter("EnableEmailUserName");
    Boolean isEmailUsernameEnabled = false;
    String usernameLabel = "username";

    if (StringUtils.isNotBlank(emailUsernameEnable)) {
        isEmailUsernameEnabled = Boolean.valueOf(emailUsernameEnable);
    } else {
        isEmailUsernameEnabled = isEmailUsernameEnabled();
    }

    if (isEmailUsernameEnabled == true) {
        usernameLabel = "email.username";
    }
%>

<%
    String clientId = request.getParameter("client_id");
    String sp = request.getParameter("sp");
    String spId = "";
    boolean isFederatedOptionsAvailable = false;
    boolean isMagicLink = false;
    JSONArray configuredAuthenticators = null;
    JSONArray federatedAuthenticators = new JSONArray();
    JSONArray localAuthenticators = new JSONArray();

    ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
    try {
        // Retrieve application Id.
        spId = applicationDataRetrievalClient.getApplicationID(tenantDomain,sp);
    } catch (Exception e) {
        // Nothing happens.
    }

    // Get authenticators configured for an application.
    if (!StringUtils.equalsIgnoreCase(spId,"")) {
        try {
            ConfiguredAuthenticatorsRetrievalClient configuredAuthenticatorsRetrievalClient = new ConfiguredAuthenticatorsRetrievalClient();
            configuredAuthenticators = configuredAuthenticatorsRetrievalClient.getConfiguredAuthenticators(spId, tenantDomain);
        } catch (Exception e) {
            configuredAuthenticators = null;
        }
    }
    if (configuredAuthenticators != null) {
        for ( int index = 0; index < configuredAuthenticators.length(); index++) {
            JSONObject step = (JSONObject)configuredAuthenticators.get(index);
            int stepId = (int)step.get("stepId");
            if (stepId == 1) {
                federatedAuthenticators = (JSONArray)step.get("federatedAuthenticators");
                if (federatedAuthenticators.length() > 0) {
                    isFederatedOptionsAvailable = true;
                }
            }
            if (stepId == 2) {
                localAuthenticators = (JSONArray)step.get("localAuthenticators");
                for (int i = 0; i < localAuthenticators.length(); i++) {
                    JSONObject localAuth = (JSONObject)localAuthenticators.get(i);
                    if (StringUtils.equalsIgnoreCase(MAGIC_LINK_AUTHENTICATOR, (String)localAuth.get("type"))) {
                        isMagicLink = true;
                    }
                }
            }
        }
    }
%>

<script>
    var insightsAppIdentifier = "<%=clientId%>";
    var insightsTenantIdentifier = "<%=userTenant%>";

    if (insightsAppIdentifier == "MY_ACCOUNT") {
        insightsAppIdentifier = "my-account";
    } else if (insightsAppIdentifier == "CONSOLE") {
        insightsAppIdentifier = "console";
    } else if (insightsTenantIdentifier !== "<%=org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME%>") {
        insightsAppIdentifier = "business-app";
    }

    $(document).ready(function(){
        var usernameInput = $("#usernameUserInput");

        // Hides invalid form error message on user input.
        if (usernameInput) {
            usernameInput.on("input", function (e) {
                hideUsernameInvalidMessage();
            });
        }
    });

    function waitForAppInsights(callback){
        if(typeof AppInsights !== "undefined"){
            callback();
        }
        else{
            setTimeout(waitForAppInsights, 250, callback);
        }
    }

    waitForAppInsights(
        function() {
            AppInsights.getInstance().trackEvent("page-visit-authentication-portal-identifierauth", {
                "app": insightsAppIdentifier,
                "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
            });
        }
    );

    function submitIdentifier (e) {
        e.preventDefault();
        var userName = document.getElementById("username");
        var usernameUserInput = document.getElementById("usernameUserInput");

        if (usernameUserInput) {
            var sanitizedUsername = usernameUserInput.value.trim();

            if (sanitizedUsername.length <= 0) {
                showUsernameInvalidMessage();
            }

            userName.value = sanitizedUsername.toLowerCase();
        }

        if (username.value) {
            AppInsights.getInstance().trackEvent("authentication-portal-identifierauth-click-continue", {
                "app": insightsAppIdentifier,
                "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
            });
            var $form = $(this);

            // store the username in session storage
            sessionStorage.setItem("username", username.value);

            $.ajax({
                type: "GET",
                url: "<%= Encode.forJavaScriptBlock(loginContextRequestUrl) %>",
                xhrFields: { withCredentials: true },
                success: function (data) {
                    if (data && data.status === "redirect" && data.redirectUrl && data.redirectUrl.length > 0) {
                        window.location.href = data.redirectUrl;
                    } else if ($form.data('submitted') !== true) {
                        $form.data('submitted', true);
                        document.getElementById("identifierForm").submit();
                    } else {
                        console.warn("Prevented a possible double submit event.");
                    }
                },
                cache: false
            });
        }
    }

    // Function to show error message when username is empty.
    function showUsernameInvalidMessage() {
        var usernameError = $("#usernameError");
        usernameError.show();
    }

    // Function to hide error message when username is empty.
    function hideUsernameInvalidMessage() {
        var usernameError = $("#usernameError");
        usernameError.hide();
    }

</script>

<form class="ui large form" action="<%= Encode.forHtmlAttribute(loginFormActionURL) %>" method="post" id="identifierForm">
    <%
        if (loginFormActionURL.equals(samlssoURL) || loginFormActionURL.equals(oauth2AuthorizeURL)) {
    %>
    <input id="tocommonauth" name="tocommonauth" type="hidden" value="true">
    <%
        }
    %>
    <% if (Boolean.parseBoolean(loginFailed)) { %>
    <div class="ui visible negative message" id="error-msg">
        <%= AuthenticationEndpointUtil.i18n(resourceBundle, Encode.forJava(errorMessage)) %>
    </div>
    <% } else if ((Boolean.TRUE.toString()).equals(request.getParameter("authz_failure"))) { %>
    <div class="ui visible negative message" id="error-msg">
        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unauthorized.to.login")%>
    </div>
    <% } else { %>
        <div class="ui visible negative message" style="display: none;" id="error-msg"></div>
    <% } %>

    <div class="field">
       <% if (StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT)) { %>
            <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "email")%></label>
            <div class="ui fluid left icon input">
                <input
                    type="text"
                    id="usernameUserInput"
                    value=""
                    name="usernameUserInput"
                    maxlength="50"
                    placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.your.email")%>"
                    required />
                <i aria-hidden="true" class="envelope outline icon"></i>
            </div>
            <div class="mt-1" id="usernameError" style="display: none;">
                <i class="red exclamation circle fitted icon"></i>
                <span class="validation-error-message" id="usernameErrorText">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "username.cannot.be.empty")%>
                </span>
            </div>
            <input id="username" name="username" type="hidden" value="">
            <input id="authType" name="authType" type="hidden" value="idf">
        <% } else { %>
            <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "username")%></label>
            <div class="ui fluid left icon input">
                <input
                    type="text"
                    id="usernameUserInput"
                    value=""
                    name="usernameUserInput"
                    maxlength="50"
                    placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.your.username")%>"
                    required />
                <i aria-hidden="true" class="user outline icon"></i>
            </div>
            <div class="mt-1" id="usernameError" style="display: none;">
                <i class="red exclamation circle fitted icon"></i>
                <span class="validation-error-message" id="usernameErrorText">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "username.cannot.be.empty")%>
                </span>
            </div>
            <input id="username" name="username" type="hidden" value="">
            <input id="authType" name="authType" type="hidden" value="idf">
        <% } %>
    </div>
    <%
        if (reCaptchaEnabled) {
            String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
    %>
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

    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute
        (request.getParameter("sessionDataKey"))%>'/>

    <div class="mt-4">
        <div class="buttons">
            <input
                type="submit"
                onclick="submitIdentifier(event)"
                class="ui primary large fluid button"
                role="button"
                data-testid="identifier-auth-continue-button"
                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>" />
        </div>
    </div>
</form>
<%
if (!StringUtils.equals("CONSOLE",clientId)
        && !StringUtils.equals("MY_ACCOUNT",clientId) && isFederatedOptionsAvailable && !isMagicLink &&
        isSelfSignUpEnabledInTenant && isSelfSignUpEnabledInTenantPreferences) {
        String urlParameters = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING);
%>
    <div class="mt-0">
        <div class="buttons">
            <button
                type="button"
                <% if(StringUtils.isNotBlank(selfSignUpOverrideURL)) { %>
                onclick="window.location.href='<%=StringEscapeUtils.escapeHtml4(selfSignUpOverrideURL)%>';"
                <% } else { %>
                onclick="window.location.href='<%=StringEscapeUtils.escapeHtml4(getRegistrationUrl(accountRegistrationEndpointContextURL, srURLEncodedURL, urlParameters))%>';"
                <% } %>
                class="ui large fluid button secondary"
                id="registerLink"
                tabindex="4"
                role="button"
                data-testid="login-page-create-account-button"
            >
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "create.an.account")%>
            </button>
        </div>
    </div>
<%
}
%>
