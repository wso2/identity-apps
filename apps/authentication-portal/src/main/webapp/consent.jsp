<%--
  ~ Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%
    String[] requestedClaimList = new String[0];
    String[] mandatoryClaimList = new String[0];
    String appName = null;
    if (request.getParameter(Constants.REQUESTED_CLAIMS) != null) {
        requestedClaimList = request.getParameter(Constants.REQUESTED_CLAIMS).split(Constants.CLAIM_SEPARATOR);
    }

    if (request.getParameter(Constants.MANDATORY_CLAIMS) != null) {
        mandatoryClaimList = request.getParameter(Constants.MANDATORY_CLAIMS).split(Constants.CLAIM_SEPARATOR);
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
        </layout:component>
        <layout:component componentName="MainSection" >
            <div class="ui segment">
                <form class="ui large form" action="<%=commonauthURL%>" method="post" id="profile" name="">
                    <h4>
                        <%=Encode.forHtml(request.getParameter("sp"))%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile")%>:
                    </h4>

                    <div class="ui divider hidden"></div>

                    <div class="segment-form">
                        <div class="ui secondary segment">
                            <h5><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.attributes")%> :</h5>

                            <div>
                                <div class="claim-alert" role="alert">
                                    <p class="margin-bottom-double">
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "by.selecting.following.attributes")%>
                                        <%=Encode.forHtml(request.getParameter("sp"))%>.
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
                        <div class="ui divider hidden"></div>
                        <div class="feild">
                            <div class="cookie-policy-message">
                                <h5><%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.privacy.short.description.approving.head")%> <%=Encode.forHtml(request.getParameter("sp"))%></h5>

                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.privacy.short.description.approving")%>
                                <%=Encode.forHtml(request.getParameter("sp"))%>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.privacy.short.description.approving2")%>
                                <a href="privacy_policy.do" target="policy-pane"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.general")%></a>.
                            </div>
                        </div>

                        <div class="ui divider hidden"></div>

                        <div class="align-right buttons">
                            <input class="ui large button secondary" type="reset"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"cancel")%>"
                                onclick="javascript: deny(); return false;"/>
                            <input type="button" class="ui primary large button" id="approve"
                                    name="approve"
                                    onclick="javascript: approved(); return false;"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,
                                "continue")%>"/>

                            <input type="hidden" name="<%="sessionDataKey"%>"
                                    value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY))%>"/>
                            <input type="hidden" name="consent" id="consent" value="deny"/>
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

    <div class="ui modal mini" id="modal_claim_validation" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
        <div class="header">
            <h4 class="modal-title"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims")%></h4>
        </div>
        <div class="content">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims.warning.msg.1")%>
            <span class="mandatory-msg"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims.warning.msg.2")%></span>
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.claims.warning.msg.3")%>
        </div>
        <div class="actions">
            <button type="button" class="ui primary button"  onclick="hideModal(this)">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "ok")%>
            </button>
        </div>
    </div>

    <script type="text/javascript">
        function approved() {
            var mandatoryClaimCBs = $(".mandatory-claim");
            var checkedMandatoryClaimCBs = $(".mandatory-claim:checked");

            if (checkedMandatoryClaimCBs.length == mandatoryClaimCBs.length) {
                document.getElementById('consent').value = "approve";
                document.getElementById("profile").submit();
            } else{
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
