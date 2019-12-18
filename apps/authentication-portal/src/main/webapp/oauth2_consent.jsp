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

<%@ page import="org.apache.commons.collections.CollectionUtils" %>
<%@ page import="org.apache.commons.lang.ArrayUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="java.util.stream.Stream" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
    
<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%
    String app = request.getParameter("application");
    String scopeString = request.getParameter("scope");
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
%>

<!doctype html>
<html>
<head>
    <!-- header -->
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
        if (headerFile.exists()) {
    %>
        <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
        <jsp:directive.include file="includes/header.jsp"/>
    <% } %>
</head>
<body>
    <main class="center-segment">
        <div class="ui container medium center aligned middle aligned">

            <!-- product-title -->
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
                <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
                <jsp:directive.include file="includes/product-title.jsp"/>
            <% } %>

            <div class="ui segment">
                <form class="ui large form" action="<%=oauth2AuthorizeURL%>" method="post" id="profile" name="oauth2_authz">
                    <p class="margin-bottom-double">
                        <strong><%=Encode.forHtml(request.getParameter("application"))%></strong>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile")%>
                    </p>

                    <div class="ui divider hidden"></div>
                    
                    <div class="segment-form">
                        <div class="field">
                            <% if (userClaimsConsentOnly) {
                                // If we are getting consent for user claims only we don't need to display OIDC
                                // scopes in the consent page
                            } else {%>
                            <%
                                if (displayScopes && StringUtils.isNotBlank(scopeString)) {
                                    // Remove "openid" from the scope list to display.
                                    List<String> openIdScopes = Stream.of(scopeString.split(" "))
                                            .filter(x -> !StringUtils.equalsIgnoreCase(x, "openid"))
                                            .collect(Collectors.toList());
                    
                                    if (CollectionUtils.isNotEmpty(openIdScopes)) {
                            %>

                            <div class="ui segment" style="text-align: left;">
                                <h5><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.scopes")%></h5>
                                <div class="scopes-list ui list">
                                    <%
                                        for (String scopeID : openIdScopes) {
                                    %>
                                    <div class="item">
                                        <i class="check circle outline icon"></i>
                                        <div class="content">
                                            <%=Encode.forHtml(scopeID)%>
                                        </div>
                                    </div>
                                    <%
                                        }
                                    %>
                                </div>
                            </div>

                            <%
                                    }
                                }
                            %>

                            <div class="ui secondary segment" style="text-align: left;">
                                <div class="ui form">
                                    <div class="grouped fields">
                                        <div class="field">
                                            <div class="ui radio checkbox">
                                                <input type="radio" class="hidden" name="scope-approval" id="approveCb" value="approve">
                                                <label for="approveCb"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "approve.once")%></label>
                                            </div>
                                        </div>
                                        <div class="field">
                                            <div class="ui radio checkbox">
                                                <input type="radio" class="hidden" name="scope-approval" id="approveAlwaysCb" value="approveAlways">
                                                <label for="approveAlwaysCb"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "approve.always")%></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <%
                                }
                            %>
                        </div>
                        <!-- Prompting for consent is only needed if we have mandatory or requested claims without any consent -->
                        <% if (ArrayUtils.isNotEmpty(mandatoryClaimList) || ArrayUtils.isNotEmpty(requestedClaimList)) { %>
                        <input type="hidden" name="user_claims_consent" id="user_claims_consent" value="true"/>
                        <!-- validation -->
                        <div class="ui secondary segment" style="text-align: left;">
                            <h3><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.attributes")%> :</h3>
                            <div class="border-gray margin-bottom-double">
                                <div class="claim-alert" role="alert">
                                    <p class="margin-bottom-double">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "by.selecting.following.attributes")%>
                                    </p>
                                </div>
                                <div>
                                    <div class="ui divider hidden"></div>
                                    <div class="select-all">
                                        <div class="ui checkbox claim-cb">
                                            <input type="checkbox" class="hidden" name="consent_select_all" id="consent_select_all" />
                                            <label for="consent_select_all"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "select.all")%></label>
                                        </div>
                                    </div>
                                    <div class="ui divider"></div>
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
                                        <span class="mandatory"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims.recommendation")%></span>
                                        <span class="required font-medium">( * )</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <% } %>
                        <div class="ui divider hidden"></div>
                        <div class="feild">
                            <div class="ui visible warning message" role="alert">
                                <div>
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.privacy.short.description.approving")%>
                                    <a href="privacy_policy.do" target="policy-pane">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.general")%>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="ui divider hidden"></div>

                        <div class="align-right buttons">
                            <input type="hidden" name="<%=Constants.SESSION_DATA_KEY_CONSENT%>"
                                    value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY_CONSENT))%>"/>
                            <input type="hidden" name="consent" id="consent" value="deny"/>
               
                            <input class="ui large button link-button" type="reset"
                                onclick="deny(); return false;"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"cancel")%>" />
                            <input type="button" class="ui primary large button" id="approve" name="approve"
                                    onclick="approved(); return false;"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"continue")%> "/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <!-- product-footer -->
    <%
        File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
        if (productFooterFile.exists()) {
    %>
        <jsp:include page="extensions/product-footer.jsp"/>
    <% } else { %>
        <jsp:directive.include file="includes/product-footer.jsp"/>
    <% } %>

    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
        <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
        <jsp:directive.include file="includes/footer.jsp"/>
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
            var scopeApproval = $("input[name='scope-approval']");

            // If scope approval radio button is rendered then we need to validate that it's checked
            if (scopeApproval.length > 0) {
                if (scopeApproval.is(":checked")) {
                    var checkScopeConsent = $("input[name='scope-approval']:checked");
                    $('#consent').val(checkScopeConsent.val());
                } else {
                    $("#modal_scope_validation").modal("show");
                    return;
                }
            } else {
                // Scope radio button was not rendered therefore set the consent to 'approve'
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
