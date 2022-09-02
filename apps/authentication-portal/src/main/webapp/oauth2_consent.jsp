<%--
  ~ Copyright (c) 2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
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

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.apache.commons.collections.CollectionUtils" %>
<%@ page import="org.apache.commons.lang.ArrayUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.oauth2.OAuth2ScopeService" %>
<%@ page import="org.wso2.carbon.identity.oauth2.bean.Scope" %>
<%@ page import="org.wso2.carbon.identity.oauth2.IdentityOAuth2ScopeException" %>
<%@ page import="org.wso2.carbon.identity.oauth.dto.ScopeDTO" %>
<%@ page import="org.wso2.carbon.identity.oauth.IdentityOAuthAdminException" %>
<%@ page import="org.wso2.carbon.identity.oauth.OAuthAdminServiceImpl" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="java.util.stream.Stream" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.util.StringTokenizer" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    String app = request.getParameter("application");
    String scopeString = request.getParameter("scope");
    boolean displayScopes = Boolean.parseBoolean(getServletContext().getInitParameter("displayScopes"));

    Map<String, String> queryParamMap = new HashMap<String, String>();
    String queryString = request.getParameter("spQueryParams");
    if (StringUtils.isNotBlank(queryString)) {
        String[] queryParams = queryString.split("&");
        for (String queryParam : queryParams) {
            String[] queryParamKeyValueArray = queryParam.split("=", 2);
                queryParamMap.put(queryParamKeyValueArray[0], queryParamKeyValueArray[1]);
        }
    }

    String clientId = queryParamMap.get("client_id");
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

    List<String> openIdScopes = null;
    if (!userClaimsConsentOnly && displayScopes && StringUtils.isNotBlank(scopeString)) {
            // Remove "openid" from the scope list to display.
           openIdScopes = Stream.of(scopeString.split(" "))
                    .filter(x -> !StringUtils.equalsIgnoreCase(x, "openid"))
                    .collect(Collectors.toList());
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<!doctype html>
<html>
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
<body class="login-portal layout authentication-portal-layout">

    <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
        <jsp:include page="extensions/timeout.jsp"/>
    <% } else { %>
        <jsp:include page="util/timeout.jsp"/>
    <% } %>

    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader" >
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
                if (!(ArrayUtils.isNotEmpty(mandatoryClaimList) || ArrayUtils.isNotEmpty(requestedClaimList) || CollectionUtils.isNotEmpty(openIdScopes))){
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
        <layout:component componentName="MainSection" >
            <div class="ui segment">
                <form class="ui large form" action="<%=oauth2AuthorizeURL%>" method="post" id="profile" name="oauth2_authz">
                    <h4><%=Encode.forHtml(request.getParameter("application"))%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile")%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile2")%>
                        <%=Encode.forHtml(request.getParameter("application"))%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile3")%>
                    </h4>

                    <div class="ui divider hidden"></div>

                    <div class="segment-form">

                        <%-- Prompting for consent is only needed if we have mandatory or requested claims without any consent --%>
                        <% if (ArrayUtils.isNotEmpty(mandatoryClaimList) || ArrayUtils.isNotEmpty(requestedClaimList)) { %>
                            <input type="hidden" name="user_claims_consent" id="user_claims_consent" value="true"/>
                            <%-- validation --%>
                            <div class="ui secondary segment" style="text-align: left;">
                                <h5><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.attributes")%>:</h5>

                                <div class="border-gray margin-bottom-double">
                                    <div class="claim-alert" role="alert">
                                        <p class="margin-bottom-double">
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "by.selecting.following.attributes")%>
                                            <%=Encode.forHtml(request.getParameter("application"))%>.
                                        </p>
                                    </div>
                                    <div>
                                        <div class="ui divider hidden"></div>
                                        <% if (ArrayUtils.isNotEmpty(requestedClaimList)) { %>
                                        <div class="select-all">
                                            <div class="ui checkbox claim-cb">
                                                <input type="checkbox" class="hidden" name="consent_select_all" id="consent_select_all" />
                                                <label for="consent_select_all"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "select.all")%></label>
                                            </div>
                                        </div>
                                        <div class="ui divider"></div>
                                        <%
                                            }
                                        %>
                                        <div class="claim-list">
                                            <% for (String claim : mandatoryClaimList) {
                                                String[] mandatoryClaimData = claim.split("_", 2);
                                                if (mandatoryClaimData.length == 2) {
                                                    String claimId = mandatoryClaimData[0];
                                                    String displayName = mandatoryClaimData[1];
                                            %>
                                            <div class="field required">
                                                <div class="ui checkbox checked read-only disabled claim-cb">
                                                    <input type="checkbox" class="mandatory-claim hidden" name="consent_<%=Encode.forHtmlAttribute(claimId)%>" id="consent_<%=Encode.forHtmlAttribute(claimId)%>" required checked readonly />
                                                    <label for="consent_<%=Encode.forHtmlAttribute(claimId)%>"><%=Encode.forHtml(displayName)%></label>
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
                                            <div class="field">
                                                <div class="ui checkbox claim-cb">
                                                    <input type="checkbox" class="hidden" name="consent_<%=Encode.forHtmlAttribute(claimId)%>" id="consent_<%=Encode.forHtmlAttribute(claimId)%>" />
                                                    <label for="consent_<%=Encode.forHtmlAttribute(claimId)%>"><%=Encode.forHtml(displayName)%></label>
                                                </div>
                                            </div>
                                            <%
                                                    }
                                                }
                                            %>
                                        </div>

                                        <div class="ui divider hidden"></div>
                                        <div class="text-left padding-top-double">
                                        <% if (ArrayUtils.isNotEmpty(mandatoryClaimList)) { %>
                                            <span class="mandatory"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims.recommendation")%></span>
                                            <span class="required font-medium">( * )</span>
                                        <%
                                            }
                                        %>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <% } %>

                        <div class="field">
                            <% if (userClaimsConsentOnly) {
                                // If we are getting consent for user claims only we don't need to display OIDC
                                // scopes in the consent page
                            } else { %>
                                <%
                                    if (displayScopes && StringUtils.isNotBlank(scopeString)) {
                                        if (CollectionUtils.isNotEmpty(openIdScopes)) {
                                %>

                                <div class="ui segment" style="text-align: left;">
                                    <h5><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.scopes")%>:</h5>
                                    <div class="scopes-list ui list">
                                        <%
                                            try {
                                                String scopesAsString = String.join(" ", openIdScopes);
                                                Set<Scope> scopes = new OAuth2ScopeService().getScopes(null, null,
                                                        true, scopesAsString, clientId);

                                                for (Scope scope : scopes) {
                                                    String displayName = scope.getDisplayName();
                                                    String description = scope.getDescription();
                                                    openIdScopes.remove(scope.getName());

                                                    if (displayName != null) {
                                        %>
                                        <div class="item">
                                            <i class="check circle outline icon"></i>
                                            <div class="content">
                                                <div class="header">
                                                    <%=Encode.forHtml(displayName)%>
                                                </div>
                                                <% if (description != null) { %>
                                                <div class="description">
                                                    <%=Encode.forHtml(description)%>
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
                                                for (String scope : openIdScopes) {
                                        %>
                                        <div class="item">
                                            <i class="check circle outline icon"></i>
                                            <div class="content">
                                                <div class="header">
                                                    <%=Encode.forHtml(scope)%>
                                                </div>
                                            </div>
                                        </div>
                                        <%
                                                }
                                            }
                                        %>
                                    </div>
                                </div>

                                <%
                                        }
                                    }
                                %>

                                <div class="ui divider hidden"></div>
                                <div class="feild">
                                <div class="cookie-policy-message">
                                <h5><%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.privacy.short.description.approving.head")%> <%=Encode.forHtml(request.getParameter("application"))%></h5>

                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.privacy.short.description.approving")%>
                                    <%=Encode.forHtml(request.getParameter("application"))%>
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.privacy.short.description.approving2")%>
                                <a href="privacy_policy.do" target="policy-pane"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.general")%></a>.
                                </div>
                                </div>

                                <div class="ui divider hidden"></div>

                                <div class="field">
                                    <div class="ui checkbox">
                                        <input
                                            tabindex="3"
                                            type="checkbox"
                                            id="rememberApproval"
                                            name="rememberApproval"
                                            data-testid="consent-page-remember-approval-checkbox"
                                        />
                                        <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "remember.my.consent")%></label>
                                    </div>
                                </div>
                            <%
                                }
                            %>
                        </div>

                        <div class="ui divider hidden"></div>

                        <div class="align-right buttons">
                            <input type="hidden" name="<%=Constants.SESSION_DATA_KEY_CONSENT%>"
                                    value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY_CONSENT))%>"/>
                            <input type="hidden" name="consent" id="consent" value="deny"/>

                            <input class="ui large button secondary" type="reset"
                                onclick="deny(); return false;"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"deny")%>" />
                            <input type="button" class="ui primary large button" id="approve" name="approve"
                                    onclick="approved(); return false;"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"allow")%> "/>
                        </div>
                    </div>
                </form>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter" >
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
        function approved() {
            var mandatoryClaimCBs = $(".mandatory-claim");
            var checkedMandatoryClaimCBs = $(".mandatory-claim:checked");
            var isApproveAlwaysChecked = $("#rememberApproval").is(':checked');

            // Check if the remember approval checkbox is selected, if so set the consent
            // input value to `approveAlways` else set it to `approve`.
            if (isApproveAlwaysChecked) {
                document.getElementById('consent').value = "approveAlways";
            } else {
                document.getElementById('consent').value = "approve";
            }

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

        $(document).ready(function () {
            $("#consent_select_all").click(function () {
                if (this.checked) {
                    $('.checkbox:not(.read-only) input:checkbox').each(function () {
                        $(this).prop("checked", true);
                    });
                } else {
                    $('.checkbox:not(.read-only) input:checkbox').each(function () {
                        $(this).prop("checked", false);
                    });
                }
            });

            $(".checkbox input").click(function () {
                var claimCheckedCheckboxes = $(".claim-cb input:checked").length;
                var claimCheckboxes = $(".claim-cb input").length;

                if (claimCheckedCheckboxes !== claimCheckboxes) {
                    $("#consent_select_all").prop("checked", false);
                } else {
                    $("#consent_select_all").prop("checked", true);
                }
            });
        });
    </script>
</body>
</html>
