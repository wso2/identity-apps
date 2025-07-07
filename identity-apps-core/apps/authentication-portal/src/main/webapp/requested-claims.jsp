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

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS_MSG" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.CONFIGURATION_ERROR" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String[] missingClaimList = null;
    HashMap<String,String> displayNamesOfMissingClaims = new HashMap<String, String>();
    String appName = null;
    Boolean isFederated = false;
    String errorCode = request.getParameter("errorCode");
    String errorMsg = request.getParameter("errorMessage");
    // "SUO-10001" error code is thrown when claim value doesn't match with regex pattern.
    if (!"SUO-10001".equals(errorCode) && StringUtils.isNotBlank(errorMsg)) {
        request.setAttribute(STATUS_MSG, errorMsg);
        if (!StringUtils.equals(errorMsg, "User attribute update is not allowed")) {
            request.setAttribute(STATUS, AuthenticationEndpointUtil.i18n(resourceBundle, CONFIGURATION_ERROR));
        }
        request.getRequestDispatcher("error.do").forward(request, response);
        return;
    }
    if (request.getParameter(Constants.MISSING_CLAIMS) != null) {
        missingClaimList = request.getParameter(Constants.MISSING_CLAIMS).split(",");
    }
    if (request.getParameter(Constants.DISPLAY_NAMES) != null) {
        String[] displayNamesParam = request.getParameter(Constants.DISPLAY_NAMES).split(",");
        for (String displayName: displayNamesParam) {
            displayNamesOfMissingClaims.put(displayName.split("\\|")[0],displayName.split("\\|")[1]);
        }
    }
    if (request.getParameter(Constants.REQUEST_PARAM_SP) != null) {
        appName = request.getParameter(Constants.REQUEST_PARAM_SP);
    }
%>

<% request.setAttribute("pageName", "requested-claims"); %>

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

    <link rel="stylesheet" href="libs/addons/calendar.min.css"/>
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
        </layout:component>
        <layout:component componentName="MainSection">
            <div class="ui segment">
                <div class="ui header text-center">
                    <h3 data-testid="request-claims-page-mandatory-header-text">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "complete.your.profile")%>
                    </h3>
                    <% if (errorMsg != null) { %>
                        <div class="ui visible login-portal-app-des2-font negative message" id="error-msg"
                            data-testid="request-claims-page-error-message">
                            <%= AuthenticationEndpointUtil.i18n(resourceBundle, errorMsg) %>
                        </div>
                    <% }%>
                </div>
                <div class="ui text-center login-portal-app-des2-font">
                    <p data-testid="request-claims-page-recommendation">
                        <strong class="text-capitalize text-typography primary"
                                data-testid="request-claims-page-application-name">
                            <%=Encode.forHtmlContent(appName)%>
                        </strong>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "needs.following.details.that.are.missing.in.profile")%>
                    </p>
                </div>
                <form class="ui large form" novalidate action="<%=commonauthURL%>" method="post" id="claimForm">
                    <div class="segment-form mt-4">
                        <div>
                            <% for (String claim : missingClaimList) {
                                String claimDisplayName = displayNamesOfMissingClaims.get(claim);
                                if (claimDisplayName == null) {
                                   claimDisplayName = claim.replaceAll(".*/", "");
                                   claimDisplayName = claimDisplayName.substring(0, 1).toUpperCase() + claimDisplayName.substring(1);
                                }
                                if (claim.contains("claims/dob")) {
                                    claimDisplayName = AuthenticationEndpointUtil.i18n(resourceBundle, "dob.yyyy.mm.dd");
                                }
                            %>
                                <div class="mt-3">
                                    <label for="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                        style="font-size: 0.9em; color: grey;"
                                        data-testid="request-claims-page-form-field-<%=Encode.forHtmlAttribute(claim)%>-label">
                                        <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, claimDisplayName)%>
                                    </label>
                                    <% if (claim.contains("claims/dob")) { %>
                                        <div class="mt-1">
                                            <div class="ui calendar" id="date_picker">
                                                <div class="ui input left icon" style="width: 100%;">
                                                    <i class="calendar icon"></i>
                                                    <input type="text"
                                                        autocomplete="off"
                                                        data-testid="request-claims-page-form-field-claim-<%=Encode.forHtmlAttribute(claim)%>-input"
                                                        id="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                        name="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                        placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter")%> <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, claimDisplayName)%>"
                                                        required="required">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-1" id="val_claim_mand_<%=Encode.forHtmlAttribute(claim)%>" style="display: none;">
                                            <i class="red exclamation circle fitted icon"></i>
                                            <span class="validation-error-message"></span>
                                        </div>
                                    <% } else if (claim.contains("claims/country")) {  %>
                                        <div class="mt-1">
                                            <jsp:include page="includes/country-dropdown.jsp">
                                                <jsp:param name="required" value="required"/>
                                                <jsp:param name="claim" value="<%=Encode.forHtmlAttribute(claim)%>"/>
                                            </jsp:include>
                                        </div>
                                        <div class="mt-1" id="val_claim_mand_<%=Encode.forHtmlAttribute(claim)%>" style="display: none;">
                                            <i class="red exclamation circle fitted icon"></i>
                                            <span class="validation-error-message"></span>
                                        </div>
                                    <% } else { %>
                                        <div class="mt-1">
                                            <input type="text"
                                                name="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                id="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                required="required"
                                                data-testid="request-claims-page-form-field-claim-<%=Encode.forHtmlAttribute(claim)%>-input"
                                                placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter")%> <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, claimDisplayName)%>"
                                            />
                                        </div>
                                        <div class="mt-1" id="val_claim_mand_<%=Encode.forHtmlAttribute(claim)%>" style="display: none;">
                                            <i class="red exclamation circle fitted icon"></i>
                                            <span class="validation-error-message"></span>
                                        </div>
                                    <% } %>
                                </div>
                            <% } %>
                            <input type="hidden"
                                name="sessionDataKey"
                                data-testid="request-claims-page-session-data-key"
                                value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                        </div>
                        <div class="mt-5">
                            <button class="ui primary fluid large button"
                                    type="submit"
                                    data-testid="request-claims-page-continue-button">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>
                            </button>
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

    <script src="libs/addons/calendar.min.js"></script>
    <script>

    function getDiplayName(claimURI) {

    var claim = claimURI.split("/").pop();
    return claim.charAt(0).toUpperCase() + claim.slice(1);
    }

    function validateForm() {
        var isValid = true;
        $("input[name^='claim_mand_']").each(function () {
            var claimId = $(this).attr("name");
            var claimValue = $(this).val();
            if (!claimValue) {
                $("[id='val_" + claimId + "'] .validation-error-message").text(
                    "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "For.required.fields.cannot.be.empty")%>"
                );
                $("[id='val_" + claimId + "']").show();
                isValid = false;
            }
        });
        return isValid;
    }

    $(document).ready(function () {

        $("input[name^='claim_mand_']").on("input", function () {
            var claimId = $(this).attr("name");
            if ($(this).val()) {
                $("[id='val_" + claimId + "']").hide();
            }
        });

        $("input[name^='claim_mand_http://wso2.org/claims/dob']").on("click", function () {
            $("[id='val_claim_mand_http://wso2.org/claims/dob']").hide();
        });

        $("input[name^='claim_mand_http://wso2.org/claims/country']").on("change", function () {
            $("[id='val_claim_mand_http://wso2.org/claims/country']").hide();
        });

        $("#claimForm").submit(function (e) {
            if (!validateForm()) {
                e.preventDefault();
            }
        });
    });

    /**
     * Event handler and trigger for #date_picker element.
     * This is a extension we've added to facilitate a ui
     * calendar for Semantic-UI. The extension files are
     * added manually to lib/ directory of authentication
     * portal. calendar.min.js and calendar.min.css.
     *
     * If you do want to change these settings in the future
     * refer [1] since this API is not officially merged to
     * Semantic-UI.
     *
     * [1] https://github.com/mdehoog/Semantic-UI-Calendar#settings
     */
    $("#date_picker").calendar({
        type: 'date',
        formatter: {
            date: function (date, settings) {
                var EMPTY_STRING = "";
                var DATE_SEPARATOR = "-";
                var STRING_ZERO = "0";
                if (!date) return EMPTY_STRING;
                var day = date.getDate() + EMPTY_STRING;
                if (day.length < 2) {
                    day = STRING_ZERO + day;
                }
                var month = (date.getMonth() + 1) + EMPTY_STRING;
                if (month.length < 2) {
                    month = STRING_ZERO + month;
                }
                var year = date.getFullYear();
                return year + DATE_SEPARATOR + month + DATE_SEPARATOR + day;
            }
        }
    });

    </script>
</body>
</html>
