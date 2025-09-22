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

<%@ page import="org.apache.commons.collections.CollectionUtils" %>
<%@ page import="org.apache.commons.collections.MapUtils" %>
<%@ page import="org.apache.commons.lang.ArrayUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.oauth2.OAuth2ScopeService" %>
<%@ page import="org.wso2.carbon.identity.oauth2.bean.Scope" %>
<%@ page import="org.wso2.carbon.identity.oauth2.IdentityOAuth2ScopeException" %>
<%@ page import="org.wso2.carbon.identity.oauth.dto.ScopeDTO" %>
<%@ page import="org.wso2.carbon.identity.oauth.IdentityOAuthAdminException" %>
<%@ page import="org.wso2.carbon.identity.oauth.OAuthAdminServiceImpl" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="java.util.stream.Stream" %>
<%@ page import="java.util.Set" %>
<%@ page import="org.json.JSONArray" %>
<%@ page import="org.json.JSONException" %>
<%@ page import="org.json.JSONObject" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String app = request.getParameter("application");
    String scopeString = request.getParameter("scope");

    boolean isConsentPageRedirectParamsAllowed = AuthenticationEndpointUtil.isConsentPageRedirectParamsAllowed();

    List<String> scopesWithMetadata = new ArrayList<>();
    Map<String,List<String>> scopeDetails = new TreeMap<>();
    if (isConsentPageRedirectParamsAllowed) {
        String scopeMetaData = request.getParameter("scopeMetadata");

        if (scopeMetaData != null) {
            JSONArray scopeMetadataArray  = new JSONArray(scopeMetaData);

            for (int count = 0; count < scopeMetadataArray.length(); count++) {
                JSONObject jsonObj = (JSONObject) scopeMetadataArray.get(count);
                String key = Encode.forHtml((String) jsonObj.get("name"));
                List<String> scopes = new ArrayList<>();
                JSONArray scopeArray = new JSONArray (jsonObj.get("scopes").toString());
                for (int scopeCount = 0; scopeCount < scopeArray.length(); scopeCount++) {
                    JSONObject scope = (JSONObject) scopeArray.get(scopeCount);

                    // Get the displayName.
                    String displayName = Encode.forHtml((String) scope.get("displayName"));

                    // Use optString to get description; it returns "" if the key is not found.
                    String description = Encode.forHtml(scope.optString("description", ""));

                    // Check if description is not empty, otherwise use displayName.
                    String scopeName = !StringUtils.isBlank(description) ? description : displayName;

                    // Add the determined scopeName to the scopes list.
                    scopes.add(scopeName);

                    // Add the identifier to the scopesWithMetadata list
                    scopesWithMetadata.add(Encode.forHtml((String) scope.get("identifier")));
                }
                scopeDetails.put(key,scopes);
            }
        }
    }

    boolean displayScopes = Boolean.parseBoolean(getServletContext().getInitParameter("displayScopes"));

    String[] requestedClaimList = new String[0];
    String[] mandatoryClaimList = new String[0];
    if (request.getParameter(Constants.REQUESTED_CLAIMS) != null) {
        requestedClaimList = request.getParameter(Constants.REQUESTED_CLAIMS).split(Constants.CLAIM_SEPARATOR);
    }

    if (request.getParameter(Constants.MANDATORY_CLAIMS) != null) {
        mandatoryClaimList = request.getParameter(Constants.MANDATORY_CLAIMS).split(Constants.CLAIM_SEPARATOR);
    }

    /*
        This parameter decides whether the consent page will only be used to get consent for sharing claims with the
        Service Provider. If this param is 'true' and user has already given consents for the OIDC scopes, we will be
        hiding the scopes being displayed and the approve always button.
    */
    boolean userClaimsConsentOnly = Boolean.parseBoolean(request.getParameter(Constants.USER_CLAIMS_CONSENT_ONLY));

    Map<String, String> queryParamMap = new HashMap<String, String>();
    String queryString = request.getParameter("spQueryParams");
    if (StringUtils.isNotBlank(queryString)) {
        String[] queryParams = queryString.split("&");
        for (String queryParam : queryParams) {
            String[] queryParamKeyValueArray = queryParam.split("=", 2);
            if (queryParamKeyValueArray.length == 2) {
                queryParamMap.put(queryParamKeyValueArray[0], queryParamKeyValueArray[1]);
            }
        }
    }

    List<String> openIdScopes = null;
    String requestedOIDCScopeString = "";
    if (queryParamMap.containsKey("requested_oidc_scopes")) {
        requestedOIDCScopeString = URLDecoder.decode(queryParamMap.get("requested_oidc_scopes"), "UTF-8");
    }

    String consentSkipScopesString = "";
    if (queryParamMap.containsKey("consent_skip_scopes")) {
        consentSkipScopesString = URLDecoder.decode(queryParamMap.get("consent_skip_scopes"), "UTF-8");
    }
    // Initialize empty arrays for safety.
    String[] scopesArray = StringUtils.isNotBlank(scopeString) ? scopeString.split(" ") : new String[0];
    String[] consentSkipScopesArray = StringUtils.isNotBlank(consentSkipScopesString) ? consentSkipScopesString.split(" ") : new String[0];

    // Convert consentSkipScopesArray into a Set for efficient lookup.
    Set<String> consentSkipScopesSet = new HashSet<>(Arrays.asList(consentSkipScopesArray));

    StringBuilder filteredScopes = new StringBuilder();

    // Iterate over scopesArray and append to filteredScopes if not in consentSkipScopesSet.
    for (String scope : scopesArray) {
        if (!consentSkipScopesSet.contains(scope)) {
            if (filteredScopes.length() > 0) {
                filteredScopes.append(" ");
            }
            filteredScopes.append(scope);
        }
    }
    // The resulting string with the filtered scopes.
    scopeString = filteredScopes.toString();

    if (!userClaimsConsentOnly && displayScopes && StringUtils.isNotBlank(scopeString)) {
        if (StringUtils.isNotBlank(requestedOIDCScopeString)) {
            // Remove oidc scopes from the scope list to display.
            Set<String> requestedOIDCScopes = Set.of(requestedOIDCScopeString.split(" "));
            openIdScopes = Stream.of(scopeString.split(" "))
                .filter(x -> !requestedOIDCScopes.contains(x.toLowerCase()) &&
                    !StringUtils.equalsIgnoreCase(x, "openid") &&
                    !StringUtils.equalsIgnoreCase(x, "internal_login"))
                .collect(Collectors.toList());
        } else {
            openIdScopes = Stream.of(scopeString.split(" "))
                .filter(x -> !StringUtils.equalsIgnoreCase(x, "openid") &&
                    !StringUtils.equalsIgnoreCase(x, "internal_login"))
                .collect(Collectors.toList());
        }
        
        if (CollectionUtils.isNotEmpty(scopesWithMetadata)) {
            for (String scope : scopesWithMetadata) {
                if (openIdScopes.contains(scope)) {
                    openIdScopes.remove(scope);
                }
            }
        }
    }

    int claimListLimit = 3;
    int scopesSize = 0;
    if (CollectionUtils.isNotEmpty(openIdScopes)) {
        scopesSize = openIdScopes.size();
    }
    int claimSize = requestedClaimList.length + mandatoryClaimList.length;

    final Map<String, String> authorizationDetailsToBeDisplayed = new HashMap<>();
    if (isConsentPageRedirectParamsAllowed) {
        try {
            final String authorizationDetailsParam = request.getParameter("authorization_details");
            if (StringUtils.isNotBlank(authorizationDetailsParam)) {
                org.json.JSONArray authorizationDetails  = new JSONArray(authorizationDetailsParam);
                for (int index = 0; index < authorizationDetails.length(); index++) {
                    JSONObject authorizationDetail = authorizationDetails.getJSONObject(index);

                    // Check if consent description is not empty, otherwise use type.
                    final String description = Encode.forHtml(authorizationDetail.optString("_description", authorizationDetail.getString("type")));
                    final String authorizationDetailId = "authorization_detail_id_" + Encode.forHtml(authorizationDetail.getString("_id"));
                    authorizationDetailsToBeDisplayed.put(authorizationDetailId, description);
                }
            }
        } catch (JSONException e) {
            // Ignore the error
        }
    }
%>

<% request.setAttribute("pageName", "oauth2-consent"); %>

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
</head>
<body class="login-portal layout authentication-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
    <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
        <jsp:include page="extensions/timeout.jsp"/>
    <% } else { %>
        <jsp:include page="util/timeout.jsp"/>
    <% } %>

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
            <%
                if (!(ArrayUtils.isNotEmpty(mandatoryClaimList) || ArrayUtils.isNotEmpty(requestedClaimList) || CollectionUtils.isNotEmpty(openIdScopes)
                    || CollectionUtils.isNotEmpty(scopesWithMetadata) || MapUtils.isNotEmpty(authorizationDetailsToBeDisplayed))) {
            %>
                <form action="<%=oauth2AuthorizeURL%>" method="post" id="profile2" name="oauth2_authz">
                    <input type="hidden" name="<%=Constants.SESSION_DATA_KEY_CONSENT%>"
                    value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY_CONSENT))%>"/>
                    <input type="hidden" name="consent" id="consent" value="approve"/>
                </form>
                <script>
                    document.getElementById("profile2").submit();
                </script>
            <%
                }
            %>
        </layout:component>
        <layout:component componentName="MainSection">
            <div class="ui segment">
                <form class="ui large form" action="<%=oauth2AuthorizeURL%>" method="post" id="profile" name="oauth2_authz">
                    <div class="field light-font">
                        <div>
                            <h4 class="app-name-container">
                                <strong id="app-name"
                                        class="text-capitalize text-typography primary login-portal-app-font"
                                        data-content=<%=Encode.forHtml(request.getParameter("application"))%>>
                                    <%=Encode.forHtml(request.getParameter("application"))%>
                                </strong>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile")%>
                            </h4>
                        </div>
                    </div>

                        <p class="login-portal-app-consent-request larger-font">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "this.will.allow.application.to")%>:
                        </p>

                    <div class="segment-form">

                        <%-- Prompting for consent is only needed if we have mandatory or requested claims without any consent --%>

                            <%-- validation --%>
                            <div class="ui" style="text-align: left;">
                                <div class="ui list">
                                <% if (ArrayUtils.isNotEmpty(mandatoryClaimList) || ArrayUtils.isNotEmpty(requestedClaimList)) { %>
                                    <input type="hidden" name="user_claims_consent" id="user_claims_consent" value="true"/>
                                        <div class="item">
                                            <i aria-hidden="true" class="circle tiny icon primary consent-item-bullet" id="claim_section_icon"></i>
                                            <div class="content">
                                                <div class="header light-font consentItem">
                                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "read.your.profile")%>
                                                </div>
                                            </div>
                                            <div class="content light-font" id="claim_sections">
                                                <%--
                                                    A select all trigger checkbox that is initially hidden
                                                    and selects all the non-mandatory claims at once or
                                                    uncheck them at once.
                                                --%>
                                                <% if (requestedClaimList.length > 1) { %>
                                                    <div class="mt-1 pl-5 required mandatoryClaim"
                                                        title="Select All Claims">
                                                        <div class="ui checkbox sticky-checkbox claim-cb">
                                                            <input type="checkbox"
                                                                class="hidden"
                                                                name="select_all_claims"
                                                                id="select_all_claims"
                                                                required/>
                                                            <label for="select_all_claims">
                                                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "select.all")%>
                                                            </label>
                                                        </div>
                                                    </div>
                                                <% } %>
                                                <div class="border-gray margin-bottom-double">
                                                    <div>
                                                        <div class="mt-3 mb-3 claim-list">
                                                            <% for (String claim : mandatoryClaimList) {
                                                                String[] mandatoryClaimData = claim.split("_", 2);
                                                                if (mandatoryClaimData.length == 2) {
                                                                    String claimId = mandatoryClaimData[0];
                                                                    String displayName = mandatoryClaimData[1];
                                                            %>
                                                            <div class="mt-1 pl-5 required mandatoryClaim" title="This is a mandatory claim">
                                                                <div class="ui checkbox checked read-only disabled claim-cb">
                                                                    <input tabindex="-1" type="checkbox" class="mandatory-claim hidden" name="consent_<%=Encode.forHtmlAttribute(claimId)%>" id="consent_<%=Encode.forHtmlAttribute(claimId)%>" required checked readonly/>
                                                                    <label for="consent_<%=Encode.forHtmlAttribute(claimId)%>" >
                                                                        <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, displayName)%> <b class="login-portal-app-font">*</b></label>
                                                                </div>
                                                            </div>
                                                            <%
                                                                    }
                                                                }
                                                            %>
                                                            <% for (String claim : requestedClaimList) {
                                                                String[] requestedClaimData = claim.split("_", 2);
                                                                if (requestedClaimData.length == 2) {
                                                                    String claimId = requestedClaimData[0];
                                                                    String displayName = requestedClaimData[1];
                                                            %>
                                                            <div class="mt-1 pl-5">
                                                                <div class="ui checkbox claim-cb">
                                                                    <input type="checkbox" class="hidden" name="consent_<%=Encode.forHtmlAttribute(claimId)%>" id="consent_<%=Encode.forHtmlAttribute(claimId)%>" />
                                                                    <label for="consent_<%=Encode.forHtmlAttribute(claimId)%>">
                                                                        <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, displayName)%>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <%
                                                                    }
                                                                }
                                                            %>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                <% } %>
                                    <%
                                        if (!userClaimsConsentOnly && displayScopes && (StringUtils.isNotBlank(scopeString) ||
                                            CollectionUtils.isNotEmpty(scopesWithMetadata))) {
                                            if (CollectionUtils.isNotEmpty(openIdScopes)) {
                                                    try {
                                                        String scopesAsString = String.join(" ", openIdScopes);
                                                        Set<Scope> scopes = new OAuth2ScopeService().getScopes(null, null,
                                                                true, scopesAsString);

                                                        for (Scope scope : scopes) {
                                                            String displayName = scope.getDisplayName();
                                                            String description = scope.getDescription();
                                                            openIdScopes.remove(scope.getName());

                                                            if (displayName != null) {
                                    %>
                                                <div class="item">
                                                    <i aria-hidden="true" class="circle tiny icon primary consent-item-bullet"></i>
                                                    <div class="content mt-2">
                                                        <div class="header light-font">
                                                            <%=Encode.forHtml(displayName)%>
                                                        </div>
                                                        <% if (description != null) { %>
                                                        <div class="description scope_section">
                                                            <p><%=Encode.forHtml(description)%></p>
                                                        </div>
                                                        <% } %>
                                                    </div>
                                                </div>
                                                <%
                                                            }
                                                        }
                                                    } catch (IdentityOAuth2ScopeException e) {
                                                        // Ignore the error
                                                    }

                                                    // Unregistered scopes if exist, get the consent with provided scope name.
                                                    if (CollectionUtils.isNotEmpty(openIdScopes)) {
                                                        Map<String, List<String>> scopeMap = new TreeMap<>();
                                                        for (String scope : openIdScopes) {
                                                %>
                                                <div class="item mt-2">
                                                    <i aria-hidden="true" class="circle tiny icon primary consent-item-bullet" id=("<%=scope%>")></i>
                                                    <div class="content mt-2 pl-1 consentItem">
                                                        <div class="header light-font">
                                                            <%=Encode.forHtml(scope)%>
                                                        </div>
                                                    </div>
                                                </div>
                                                <%
                                                        }
                                                    }
                                                }
                                                Set<Map.Entry<String, List<String>>> scopeEntries = scopeDetails.entrySet();
                                                if (CollectionUtils.isNotEmpty(scopeEntries)) {
                                                    for (Map.Entry<String, List<String>> scopeEntry : scopeEntries) {
                                                %>
                                                    <% for (String permission : scopeEntry.getValue()) { %>
                                                        <div class="required mandatoryClaim mb-2 consentItem">
                                                            <div class="ui" style="display: flex">
                                                                <i aria-hidden="true" class="circle tiny icon primary consent-item-bullet" id=("<%=scopeEntry.getKey()%>")></i>
                                                                <div class="header light-font">
                                                                    <%=Encode.forHtml(permission)%>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    <% } %>
                                                    <%
                                                    }
                                                }
                                            }
                                %>

                                <%
                                    if (MapUtils.isNotEmpty(authorizationDetailsToBeDisplayed)) {
                                %>
                                    <div class="item">
                                        <i aria-hidden="true" class="circle tiny icon primary consent-item-bullet" id="Grant access"></i>
                                        <div class="content mt-2 pl-1 consentItem">
                                            <div class="header light-font">
                                                <%= i18n(resourceBundle, customText, "requested.authorization.details") %>
                                            </div>
                                        </div>
                                        <div class="content light-font">
                                            <div class="border-gray margin-bottom-double">
                                                <div class="claim-list">
                                                    <%
                                                        for (Map.Entry<String, String> authorizationDetailEntry : authorizationDetailsToBeDisplayed.entrySet()) {
                                                    %>
                                                        <div class="mt-1 pl-2">
                                                            <div class="ui checkbox" style="display: flex">
                                                                <input type="checkbox" class="hidden" name="<%=authorizationDetailEntry.getKey()%>" id="<%=authorizationDetailEntry.getKey()%>" />
                                                                <label id="<%=authorizationDetailEntry.getKey()%>" for="<%=authorizationDetailEntry.getKey()%>">
                                                                    <%=Encode.forHtml(authorizationDetailEntry.getValue())%>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    <%
                                                        }
                                                    %>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <%
                                    }
                                %>

                                </div>
                            </div>
                        <div class="ui divider hidden"></div>
                        <div class="field mt-4 text-center login-portal-app-des-font">
                            <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "by.giving.consent.you.agree.to.share.data")%> <span class="break-all-words">
                                <%=Encode.forHtml(request.getParameter("application"))%></span>.
                            </p>
                        </div>
                        <input type="hidden" name="<%=Constants.SESSION_DATA_KEY_CONSENT%>"
                                    value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY_CONSENT))%>"/>
                        <div class="mt-0">
                            <input type="button" class="ui primary fluid large button" id="approve" name="approve"
                                    onclick="approved(); return false;"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"allow")%> "/>
                        </div>
                        <div class="mt-3 align-center">
                            <input type="hidden" name="consent" id="consent" value="deny"/>
                            <input class="ui fluid large button secondary" type="reset"
                            onclick="deny(); return false; login-portal-app-font"
                            value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"deny")%>" />
                        </div>
                    </div>
                </form>
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

    <div class="ui modal mini" id="modal_claim_validation">
        <div class="header">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims")%>
        </div>
        <div class="content">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims.warning.msg.1")%>
            <span class="mandatory-msg"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims.warning.msg.2")%></span>
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims.warning.msg.3")%>
        </div>
        <div class="actions">
            <button class="ui primary button" onclick="hideModal(this)">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "ok")%>
            </button>
        </div>
    </div>

    <div class="ui modal mini" id="modal_scope_validation">
        <div class="header">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.scopes")%>
        </div>
        <div class="content">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "please.select.approve.always")%>
        </div>
        <div class="actions">
            <button class="ui primary button" onclick="hideModal(this)">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "ok")%>
            </button>
        </div>
    </div>

    <script type="text/javascript">

        $(document).ready(function () {
            var appName = $("#app-name"), appNameContainer = $(".app-name-container");
            var NATIVE_ELEMENT = 0;
            if (appName && appNameContainer && appName[NATIVE_ELEMENT] && appNameContainer[NATIVE_ELEMENT]) {
                if (appName[NATIVE_ELEMENT].offsetWidth > appNameContainer[NATIVE_ELEMENT].offsetWidth) {
                    appName.popup({
                        lastResort: "top center",
                        className: {
                            popup: "ui popup light-popup"
                        }
                    }).show();
                }
            }
        });

        function attachConsentListEvents() {

            /**
            * Query the select all checkbox from the DOM.
            */
            const selectAllClaimsCheckbox = $("#select_all_claims");

            /**
            * If the queried element is null then no point of
            * executing the rest of body in this function.
            */
            if (!selectAllClaimsCheckbox) return;

            /**
            * {@code consentList} once the expression is evaluated, the
            * query operation will return us all the non-mandatory claims
            * input checkbox elements. `id^=consent_` means all the elements
            * with ids starting with `consent_`.
            *
            * @type {*|jQuery} Array of elements
            */
            var consentList = $("[id^=consent_]").filter(":not(.mandatory-claim)");

            /**
            * This inner function is responsible to check whether all the
            * checkboxes in {@code consentList} is checked or not.
            *
            * @return {Boolean} true if every checkbox is checked else false.
            */
            function evaluateConsentListState() {
                // { 0: true, 1: false: 2: true } => [true, false, true]
                const checkedStates = Object.values(
                    consentList.map(function (index, element) {
                        return $(element).is(":checked");
                    })
                );
                // Shorthand for predicate (value) { return value === true; }
                return checkedStates.every(Boolean);
            }

            /**
            * On every click on this checkbox we need to mark
            * all the items in consent list as checked.
            */
            selectAllClaimsCheckbox.click(function () {
                const checked = $(this).is(":checked");
                /**
                * Toggles all the elements in {@code consentList} to
                * their targeted checked state.
                */
                consentList.each(function (index, element) {
                    $(element).prop("checked", checked);
                });
            });

            /**
            * Now we need to make sure the events are also reactively
            * two way bind-ed to checkboxes. For example, if one
            * checkbox has been manually unchecked then we can't keep the
            * {@code selectAllClaimsCheckbox} in checked state.
            */
            consentList.each(function (index, element) {
                $(element).click(function () {
                    var claimCheckedCheckboxes = $(".claim-cb input:checked").length;
                    var claimCheckboxes = $(".claim-cb input").length;

                    if (claimCheckedCheckboxes == 0) {
                        selectAllClaimsCheckbox.prop("indeterminate", false);
                        selectAllClaimsCheckbox.prop("checked", false);
                    } else if (!element.checked) {
                        selectAllClaimsCheckbox.prop("indeterminate", true);
                    } else if (claimCheckboxes != claimCheckedCheckboxes + 1 && claimCheckedCheckboxes >= 1 && claimCheckboxes > 1) {
                        selectAllClaimsCheckbox.prop("indeterminate", true);
                    } else if (evaluateConsentListState()) {
                        selectAllClaimsCheckbox.prop("indeterminate", false);
                        selectAllClaimsCheckbox.prop("checked", true);
                    }
                });
            });

            /**
            * When the document is ready we will make sure that the consent
            * list is unchecked by default and also select all checkbox.
            */
            $(document).ready(function () {
                selectAllClaimsCheckbox.prop("checked", false);
                consentList.each(function (index, element) {
                    $(element).prop("checked", false);
                });
            });

        }

        /**
        * Attach, execute, and bind the logic to "Select All" consent
        * feature checkbox for consent list.
        */
        attachConsentListEvents();

        $(".scope_section").hide();
        $(".clickable").css('cursor', 'pointer');

        function approved() {
            var mandatoryClaimCBs = $(".mandatory-claim");
            var checkedMandatoryClaimCBs = $(".mandatory-claim:checked");
            var isApproveAlwaysChecked = $("#rememberApproval").is(':checked');

            document.getElementById('consent').value = "approveAlways";

            if (checkedMandatoryClaimCBs.length === mandatoryClaimCBs.length) {
                document.getElementById("profile").submit();
            } else {
                $("#modal_claim_validation").modal("show");
            }
        }

        function approvedAlways() {
            var mandatoryClaimCBs = $(".mandatory-claim");
            var checkedMandatoryClaimCBs = $(".mandatory-claim:checked");

            if (checkedMandatoryClaimCBs.length === mandatoryClaimCBs.length) {
                document.getElementById('consent').value = "approveAlways";
                document.getElementById("profile").submit();
            } else {
                $("#modal_claim_validation").modal("show");
            }
        }

        function hideClaimsSection() {
            $("#claim_sections").toggle("slow", function(){
                // check paragraph once toggle effect is completed
                if($("#claim_sections").is(":visible")){
                    $("#claim_section_icon").removeClass("angle down icon large");
                    $("#claim_section_icon").addClass("angle up icon large")
                } else{
                    $("#claim_section_icon").removeClass("angle up icon large");
                    $("#claim_section_icon").addClass("angle down icon large")
                }
            });
        }

        // TODO: check the logic again
        function hideScopeSection(iconId) {
            var scopeID="#" + iconId;
            var contentID="#content_" + iconId;
            $(contentID).toggle("slow", function(){
                // check paragraph once toggle effect is completed
                if($(contentID).is(":visible")){
                    $(scopeID).removeClass("angle down icon large");
                    $(scopeID).addClass("angle up icon large")
                } else{
                    $(scopeID).removeClass("angle up icon large");
                    $(scopeID).addClass("angle down icon large")
                }
            });
        }

        function deny() {
            document.getElementById('consent').value = "deny";
            document.getElementById("profile").submit();
        }

        function hideModal(elem) {
            $(elem).closest('.modal').modal('hide');
        }

        $('.checkbox.read-only').checkbox({
            uncheckable: false
        });

    </script>
</body>
</html>
