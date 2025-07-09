<%--
  ~ Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
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

<%!
    private boolean isMultiAuthAvailable(String multiOptionURI) {

        boolean isMultiAuthAvailable = true;
        if (multiOptionURI == null || multiOptionURI.equals("null")) {
            isMultiAuthAvailable = false;
        } else {
            int authenticatorIndex = multiOptionURI.indexOf("authenticators=");
            if (authenticatorIndex == -1) {
                isMultiAuthAvailable = false;
            } else {
                String authenticators = multiOptionURI.substring(authenticatorIndex + 15);
                int authLastIndex = authenticators.indexOf("&") != -1 ? authenticators.indexOf("&") : authenticators.length();
                authenticators = authenticators.substring(0, authLastIndex);
                List<String> authList = Arrays.asList(authenticators.split("%3B"));
                if (authList.size() < 2) {
                    isMultiAuthAvailable = false;
                }
                else if (authList.size() == 2 && authList.contains("backup-code-authenticator%3ALOCAL")) {
                    isMultiAuthAvailable = false;
                }
            }
        }
        return isMultiAuthAvailable;
    }
%>

<%
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

    try {
        PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
        isMultiAttributeLoginEnabledInTenant = preferenceRetrievalClient.checkMultiAttributeLogin(tenantDomain);
        allowedAttributes = preferenceRetrievalClient.checkMultiAttributeLoginProperty(tenantDomain);
    } catch (PreferenceRetrievalClientException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", AuthenticationEndpointUtil
                .i18n(resourceBundle, "something.went.wrong.contact.admin"));
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    if (isEmailUsernameEnabled == true) {
        usernameLabel = "email.username";
    } else if (isMultiAttributeLoginEnabledInTenant) {
        usernameLabel = getUsernameLabel(resourceBundle, allowedAttributes);
        usernamePlaceHolder = "enter.your.identifier";
    }
%>

<%
    final String IS_SAAS_APP = "isSaaSApp";

    String clientId = Encode.forJavaScriptBlock(request.getParameter("client_id"));
    String sp = Encode.forJava(request.getParameter("sp"));
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

    function onCompleted() {
        $("#identifierForm").submit();
    }

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

        $.fn.preventDoubleSubmission = function () {
            $(this).on("submit", function (e) {
                var $form = $(this);
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

                var genericReCaptchaEnabled = "<%=genericReCaptchaEnabled%>";
                if (genericReCaptchaEnabled === "true") {
                    if (!grecaptcha.getResponse()) {
                        grecaptcha.execute();
                        return;
                    }
                }

                if (username.value) {
                    trackEvent("authentication-portal-identifierauth-click-continue", {
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
            });
            return this;
        };
        $('#identifierForm').preventDoubleSubmission();
    });

    trackEvent("page-visit-authentication-portal-identifierauth", {
        "app": insightsAppIdentifier,
        "tenant": insightsTenantIdentifier !== "null" ? insightsTenantIdentifier : ""
    });

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

<form class="ui large form" action="<%= Encode.forHtmlAttribute(loginFormActionURL) %>" method="post" id="identifierForm" novalidate>
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
    <% } else if ((Boolean.TRUE.toString()).equals(Encode.forJava(request.getParameter("authz_failure")))) { %>
    <div class="ui visible negative message" id="error-msg">
        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unauthorized.to.login")%>
    </div>
    <% } else { %>
        <div class="ui visible negative message" style="display: none;" id="error-msg"></div>
    <% } %>

    <div class="field">
     <% if (StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT) &&
        Boolean.parseBoolean(request.getParameter(IS_SAAS_APP))) { %>
        
            <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "email")%></label>
            <div class="ui fluid left icon input">
                <input
                    type="text"
                    id="usernameUserInput"
                    value=""
                    name="usernameUserInput"
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
        <% } else {
            if (isMultiAttributeLoginEnabledInTenant) { %>
            <label><%=usernameLabel %></label>
            <% } else {%>
            <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, usernameLabel)%></label>
        <% } %>
        <div class="ui fluid left icon input">
            <input
                type="text"
                id="usernameUserInput"
                value=""
                name="usernameUserInput"
                placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, usernamePlaceHolder)%>"
                required
            />
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
        <input id="multiOptionURI" type="hidden" name="multiOptionURI"
            value='<%=Encode.forHtmlAttribute(request.getParameter("multiOptionURI"))%>' />
    <% } %>
    </div>
    <%
    if (genericReCaptchaEnabled) { 
        String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
    %>
        <div class="field">
            <div class="g-recaptcha"
                data-size="invisible"
                data-callback="onCompleted"
                data-action="login"
                data-sitekey="<%=Encode.forHtmlContent(reCaptchaKey)%>">
            </div>
        </div>
    <% } %>

    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute
        (request.getParameter("sessionDataKey"))%>'/>

    <div class="mt-4">
        <div class="buttons">
            <button type="submit" class="ui primary fluid large button" role="button" data-testid="identifier-auth-continue-button">
                <%=StringEscapeUtils.escapeHtml4(AuthenticationEndpointUtil.i18n(resourceBundle, "continue"))%>
            </button>
        </div>
    </div>
    <div class="ui divider hidden"></div>
    <div class="align-center">
        <%
            String multiOptionURI = Encode.forJava(request.getParameter("multiOptionURI"));
            if (multiOptionURI != null && AuthenticationEndpointUtil.isValidMultiOptionURI(multiOptionURI) &&
            isMultiAuthAvailable(multiOptionURI)) {
        %>
            <a class="ui primary basic button link-button" id="goBackLink"
            href='<%=Encode.forHtmlAttribute(multiOptionURI)%>'>
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "choose.other.option")%>
            </a>
        <%
            }
        %>
    </div>
</form>
<%
if (!StringUtils.equals("CONSOLE",clientId)
        && !StringUtils.equals("MY_ACCOUNT",clientId) && !isMagicLink &&
        isSelfSignUpEnabledInTenant && isSelfSignUpEnabledInTenantPreferences) {
        String urlParameters = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING);
%>
    <div class="mt-4 mb-4">
        <div class="mt-3 external-link-container text-small">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "dont.have.an.account")%>
            <a
                <% if(StringUtils.isNotBlank(selfSignUpOverrideURL)) { %>
                href="<%=i18nLink(userLocale, selfSignUpOverrideURL)%>"
                <% } else { %>
                href="<%=StringEscapeUtils.escapeHtml4(getRegistrationPortalUrl(accountRegistrationEndpointContextURL, srURLEncodedURL, urlParameters))%>"
                <% } %>
                target="_self"
                class="clickable-link"
                rel="noopener noreferrer"
                id="registerLink"
                tabindex="4"
                data-testid="login-page-create-account-button"
                style="cursor: pointer;"
            >
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "register")%>
            </a>
        </div>
    </div>
<%
}
%>
