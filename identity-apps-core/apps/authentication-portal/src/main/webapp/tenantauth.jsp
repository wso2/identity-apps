<%--
  ~ Copyright (c) 2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.TenantDataManager" %>
<%@ page import="java.util.List" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.core.URLBuilderException" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>

<form class="ui large form" action="<%=commonauthURL%>" method="post" id="loginForm">
    <% if (Boolean.parseBoolean(loginFailed)) { %>
    <div class="ui visible negative message" id="error-msg">
        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "username.or.password.invalid")%>
    </div>
    <% } %>

    <div class="field">
        <select class="ui fluid dropdown" id='tenantList' name="tenantList" size='1'>
            <option value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "select.tenant.dropdown.display.name")%>">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "select.tenant.dropdown.display.name")%>
            </option>
            <option value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "super.tenant")%>">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "super.tenant.display.name")%>
            </option>
            <%
                List<String> tenantDomainsList = TenantDataManager.getAllActiveTenantDomains();
                if (!tenantDomainsList.isEmpty()) {
                    for (String tenant : tenantDomainsList) {
            %>
            <option value="<%=Encode.forHtmlAttribute(tenant)%>"><%=Encode.forHtmlContent(tenant)%></option>
            <%
                    }
                }
            %>
        </select>
    </div>

    <input type="hidden" id='username' name='username'/>

    <div class="field">
        <div class="ui fluid left icon input">
            <input
                type="text"
                id="username_tmp"
                value=""
                name="username_tmp"
                tabindex="0"
                placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "username")%>"
                required>
            <i aria-hidden="true" class="user icon"></i>
        </div>
    </div>

    <div class="field">
        <div class="ui fluid left icon input">
            <input
                type="password"
                id="password"
                name="password"
                value=""
                autocomplete="off"
                placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "password")%>">
            <i aria-hidden="true" class="lock icon"></i>
        </div>
    </div>

    <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>

    <%
        String recoveryEPAvailable = application.getInitParameter("EnableRecoveryEndpoint");
        String enableSelfSignUpEndpoint = application.getInitParameter("EnableSelfSignUpEndpoint");
        Boolean isRecoveryEPAvailable = false;
        Boolean isSelfSignUpEPAvailable = false;
        String identityMgtEndpointContext = "";
        String accountRegistrationEndpointURL = "";
        String urlEncodedURL = "";
        String urlParameters = "";

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
            String scheme = request.getScheme();
            String serverName = request.getServerName();
            int serverPort = request.getServerPort();
            String uri = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_REQUEST_URI);
            String prmstr = URLDecoder.decode(((String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING)), UTF_8);
            String urlWithoutEncoding = scheme + "://" +serverName + ":" + serverPort + uri + "?" + prmstr;

            urlEncodedURL = URLEncoder.encode(urlWithoutEncoding, UTF_8);
            urlParameters = prmstr;

            identityMgtEndpointContext = application.getInitParameter("IdentityManagementEndpointContextURL");
            if (StringUtils.isBlank(identityMgtEndpointContext)) {
                try {
                    identityMgtEndpointContext = ServiceURLBuilder.create().addPath(ACCOUNT_RECOVERY_ENDPOINT).build()
                            .getAbsolutePublicURL();
                } catch (URLBuilderException e) {
                    request.setAttribute(STATUS, AuthenticationEndpointUtil.i18n(resourceBundle, CONFIGURATION_ERROR));
                    request.setAttribute(STATUS_MSG, AuthenticationEndpointUtil
                            .i18n(resourceBundle, ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL));
                    request.getRequestDispatcher("error.do").forward(request, response);
                    return;
                }
            }

            accountRegistrationEndpointURL = application.getInitParameter("AccountRegisterEndpointURL");
            if (StringUtils.isBlank(accountRegistrationEndpointURL)) {
                accountRegistrationEndpointURL = identityMgtEndpointContext + ACCOUNT_RECOVERY_ENDPOINT_REGISTER;
            }
        }
    %>

    <div class="field">
        <div class="ui checkbox">
            <input type="checkbox" id="chkRemember" name="chkRemember">
            <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "remember.me")%></label>
        </div>
    </div>

    <div class="ui two column stackable grid">
        <% if(request.getParameter("relyingParty").equals("wso2.my.dashboard")) { %>
        <div class="column align-left buttons">
            <% if (isSelfSignUpEPAvailable && !isIdentifierFirstLogin(inputType)) { %>
            <button
                type="submit"
                onclick="window.location.href='<%=getRegistrationUrl(accountRegistrationEndpointURL, urlEncodedURL, urlParameters)%>';"
                class="ui large button secondary"
                id="registerLink"
                role="button">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "create.account")%>
            </button>
            <% } %>
        </div>
        <% } %>
        <div class="column align-right buttons">
            <button
                type="submit"
                onclick="appendTenantDomain();"
                class="ui primary large button"
                role="button">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>
            </button>
        </div>
    </div>

</form>

<script>

    /**
     * Append the tenant domain to the username
     */
        function appendTenantDomain() {
        var element = document.getElementById("tenantList");
        var tenantDomain = element.options[element.selectedIndex].value;

        setSelectedTenantCookie(tenantDomain, 30);

        if (tenantDomain != "<%=AuthenticationEndpointUtil.i18n(resourceBundle,"select.tenant.dropdown.display.name")%>") {

            var username = document.getElementsByName("username_tmp")[0].value;
            var userWithDomain = username + "@" + tenantDomain;

            document.getElementsByName("username")[0].value = userWithDomain;
        }
    }

    /**
     * Write the selected tenant domain to the cookie
     */
    function setSelectedTenantCookie(cvalue, exdays) {
        var date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = "selectedTenantDomain=" + cvalue + "; " + expires + "; secure";
    }

    /**
     * Get the previously selected tenant domain from the cookie
     */
    function getSelectedTenantCookie() {
        var selectedTenantDomain = "";
        var name = "selectedTenantDomain=";
        var cookieItems = document.cookie.split(';');

        for (var i = 0; i < cookieItems.length; i++) {
            var item = cookieItems[i];
            item = item.trim();

            if (item.indexOf(name) != -1) {
                selectedTenantDomain = item.substring(name.length, item.length);
                break;
            }
        }
        return selectedTenantDomain;
    }

    /**
     * Select the tenant domain based on the previously selected tenant domain in cookie
     */
    function selectTenantFromCookie() {
        var tenant = getSelectedTenantCookie();
        var element = document.getElementById("tenantList");

        for (var i = 0; i < element.options.length; i++) {
            if (element.options[i].value == tenant) {
                element.value = tenant;
                break;
            }
        }

        //remove super tenant from dropdown based on the properties
        var superTenant = "<%=AuthenticationEndpointUtil.i18n(resourceBundle,"super.tenant")%>";
        if (superTenant == null || superTenant == "") {
            for (i = 0; i < element.options.length; i++) {
                if (element.options[i].value == superTenant) {
                    element.remove(i);
                    break;
                }
            }
        }
    }

    // Handle form submission preventing double submission.
    $(document).ready(function(){
        $.fn.preventDoubleSubmission = function() {
            $(this).on('submit',function(e){
                var $form = $(this);
                if ($form.data('submitted') === true) {
                    // Previously submitted - don't submit again.
                    e.preventDefault();
                    console.warn("Prevented a possible double submit event");
                } else {
                    // Mark it so that the next submit can be ignored.
                    $form.data('submitted', true);
                }
            });

            return this;
        };
        $('#loginForm').preventDoubleSubmission();
    });

    $('select.dropdown').dropdown();

</script>
