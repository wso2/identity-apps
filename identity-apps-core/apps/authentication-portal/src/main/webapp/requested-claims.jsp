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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ClaimRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.LocalClaim" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.LabelValue" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.InputFormat" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ClaimRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.apache.commons.logging.Log" %>
<%@ page import="org.apache.commons.logging.LogFactory" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%!
    private Log log = LogFactory.getLog(this.getClass());
%>

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

    // Define input types constants
    final String INPUT_TYPE_TEXT = "text_input";
    final String INPUT_TYPE_NUMBER = "number_input";
    final String INPUT_TYPE_CHECKBOX = "checkbox";
    final String INPUT_TYPE_TOGGLE = "toggle";
    final String INPUT_TYPE_DROPDOWN = "dropdown";
    final String INPUT_TYPE_RADIO_GROUP = "radio_group";
    final String INPUT_TYPE_DATE_PICKER = "date_picker";

    // Get claim properties dynamically using ClaimRetrievalClient
    Map<String, LocalClaim> claimPropertiesOfMissingClaims = new HashMap<String, LocalClaim>();
    
    if (missingClaimList != null && missingClaimList.length > 0) {
        try {
            ClaimRetrievalClient claimRetrievalClient = new ClaimRetrievalClient();
            List<String> claimURIs = Arrays.asList(missingClaimList);
            claimPropertiesOfMissingClaims = claimRetrievalClient.getLocalClaimsByURIs(tenantDomain, claimURIs);
        } catch (ClaimRetrievalClientException e) {
            log.error("Error retrieving local claim details for missing claims: ", e);
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

                                // Extract claim properties.
                                String inputType = null;
                                Boolean isMultiValued = false;
                                LocalClaim localClaim = null;
                                List<LabelValue> canonicalValues = null;
                                
                                localClaim = claimPropertiesOfMissingClaims.get(claim);
                                if (localClaim != null) {
                                    // Get input type from InputFormat
                                    InputFormat inputFormat = localClaim.getInputFormat();
                                    if (inputFormat != null && inputFormat.getInputType() != null) {
                                        inputType = inputFormat.getInputType().toLowerCase();
                                    }

                                    // Get canonical values for dropdowns and radio groups
                                    canonicalValues = localClaim.getCanonicalValues();
                                    isMultiValued = localClaim.getMultiValued();
                                }
                            %>
                                <div class="mt-3">
                                    <% if (!INPUT_TYPE_CHECKBOX.equals(inputType) && !INPUT_TYPE_TOGGLE.equals(inputType)) { %>
                                        <label for="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                            style="font-size: 0.9em; color: grey;"
                                            data-testid="request-claims-page-form-field-<%=Encode.forHtmlAttribute(claim)%>-label">
                                            <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, claimDisplayName)%>
                                        </label>
                                    <% } %>
                                    <% if (claim.contains("claims/dob")) { %>
                                        <div class="mt-1">
                                            <div class="ui calendar" id="date_picker_<%=Encode.forHtmlAttribute(claim.replaceAll("[^a-zA-Z0-9]", "_"))%>">
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
                                    <% } else if (claim.contains("claims/country")) { %>
                                        <div class="mt-1">
                                            <jsp:include page="includes/country-dropdown.jsp">
                                                <jsp:param name="required" value="required"/>
                                                <jsp:param name="claim" value="<%=Encode.forHtmlAttribute(claim)%>"/>
                                            </jsp:include>
                                        </div>
                                    <% } else if (!isMultiValued && INPUT_TYPE_DATE_PICKER.equals(inputType)) { %>
                                        <div class="mt-1">
                                            <div class="ui calendar" id="date_picker_<%=Encode.forHtmlAttribute(claim.replaceAll("[^a-zA-Z0-9]", "_"))%>">
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
                                    <% } else if (!isMultiValued && INPUT_TYPE_CHECKBOX.equals(inputType)) { %>
                                        <div class="mt-1">
                                            <div class="ui checkbox">
                                                <input type="checkbox"
                                                    name="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                    id="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                    data-testid="request-claims-page-form-field-claim-<%=Encode.forHtmlAttribute(claim)%>-input"
                                                    value="true">
                                                 <label for="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                    style="font-size: 0.9em; color: grey;"
                                                    data-testid="request-claims-page-form-field-<%=Encode.forHtmlAttribute(claim)%>-label">
                                                    <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, claimDisplayName)%>
                                                </label>
                                            </div>
                                        </div>
                                    <% } else if (!isMultiValued && INPUT_TYPE_TOGGLE.equals(inputType)) { %>
                                        <div class="mt-1">
                                            <div class="ui toggle checkbox">
                                                <input type="checkbox"
                                                    name="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                    id="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                    data-testid="request-claims-page-form-field-claim-<%=Encode.forHtmlAttribute(claim)%>-input"
                                                    value="true"
                                                    data-off-value="false">
                                                <label for="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                    style="font-size: 0.9em; color: grey;"
                                                    data-testid="request-claims-page-form-field-<%=Encode.forHtmlAttribute(claim)%>-label">
                                                    <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, claimDisplayName)%>
                                                </label>
                                            </div>
                                        </div>
                                    <% } else if (!isMultiValued && INPUT_TYPE_DROPDOWN.equals(inputType)) { %>
                                        <div class="mt-1">
                                            <select name="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                    id="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                    class="ui dropdown"
                                                    required="required"
                                                    data-testid="request-claims-page-form-field-claim-<%=Encode.forHtmlAttribute(claim)%>-input"
                                                    placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "select")%> <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, claimDisplayName)%>"
                                                    >
                                                <%
                                                    // Render dropdown options from canonical values
                                                    if (canonicalValues != null && !canonicalValues.isEmpty()) {
                                                        for (LabelValue option : canonicalValues) {
                                                            String optionLabel = option.getLabel();
                                                            String optionValue = option.getValue();
                                                %>
                                                            <option value="<%=Encode.forHtmlAttribute(optionValue)%>"><%=Encode.forHtmlContent(optionLabel)%></option>
                                                <%
                                                        }
                                                    }
                                                %>
                                            </select>
                                        </div>
                                    <% } else if (!isMultiValued && INPUT_TYPE_RADIO_GROUP.equals(inputType)) { %>
                                        <div class="mt-1">
                                            <div class="ui form">
                                                <div class="grouped fields">
                                                    <%
                                                        if (canonicalValues != null && !canonicalValues.isEmpty()) {
                                                            int radioIndex = 0;
                                                            for (LabelValue option : canonicalValues) {
                                                                String optionLabel = option.getLabel();
                                                                String optionValue = option.getValue();
                                                                String radioId = Encode.forHtmlAttribute(claim.replaceAll("[^a-zA-Z0-9]", "_")) + "_" + radioIndex;
                                                    %>
                                                                <div class="field">
                                                                    <div class="ui radio checkbox">
                                                                        <input type="radio" name="claim_mand_<%=Encode.forHtmlAttribute(claim)%>" value="<%=Encode.forHtmlAttribute(optionValue)%>" id="<%=radioId%>">
                                                                        <label for="<%=radioId%>"><%=Encode.forHtmlContent(optionLabel)%></label>
                                                                    </div>
                                                                </div>
                                                    <%
                                                                radioIndex++;
                                                            }
                                                        }
                                                    %>
                                                </div>
                                            </div>
                                        </div>
                                    <% } else if (!isMultiValued && INPUT_TYPE_NUMBER.equals(inputType)) { %>
                                        <div class="mt-1">
                                            <input type="number"
                                                name="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                id="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                required="required"
                                                data-testid="request-claims-page-form-field-claim-<%=Encode.forHtmlAttribute(claim)%>-input"
                                                placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter")%> <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle, claimDisplayName)%>"
                                                step="any"
                                            />
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
                                    <% } %>
                                    <div class="mt-1" id="val_claim_mand_<%=Encode.forHtmlAttribute(claim)%>" style="display: none;">
                                        <i class="red exclamation circle fitted icon"></i>
                                        <span class="validation-error-message"></span>
                                    </div>
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
        var processedRadioGroups = new Set();
        
        // Handle unchecked checkboxes and toggles by setting their value to "false".
        $("input[type='checkbox'][name^='claim_mand_']").each(function () {
            var claimId = $(this).attr("name");
            if (!$(this).is(":checked")) {
                // Create a hidden input with value "false" for unchecked checkboxes/toggles.
                if ($("input[name='" + claimId + "_unchecked']").length === 0) {
                    $("<input>").attr({
                        type: "hidden",
                        name: claimId,
                        value: "false"
                    }).appendTo("#claimForm");
                }
            } else {
                // Remove any existing hidden input if checkbox is checked
                $("input[name='" + claimId + "'][type='hidden']").remove();
            }
        });
        
        $("input[name^='claim_mand_']").each(function () {
            var claimId = $(this).attr("name");
            var claimValue = $(this).val();
            var inputType = $(this).attr("type");

            if (inputType === "checkbox") {
                // For checkboxes and toggles, no validation error if unchecked.
                return;
            }

            if (inputType === "radio") {
                // For radio groups, check if any radio with the same name is selected.
                var radioGroupName = $(this).attr("name");
                if (!processedRadioGroups.has(radioGroupName)) {
                    processedRadioGroups.add(radioGroupName);
                    if ($("input[name='" + radioGroupName + "']:checked").length === 0) {
                        $("[id='val_" + claimId + "'] .validation-error-message").text(
                            "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "For.required.fields.cannot.be.empty")%>"
                        );
                        $("[id='val_" + claimId + "']").show();
                        isValid = false;
                    }
                }
                return;
            }

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

        $("input[name^='claim_mand_http://wso2.org/claims/dob']").on("click", function () {
            $("[id='val_claim_mand_http://wso2.org/claims/dob']").hide();
        });

        $("input[name^='claim_mand_http://wso2.org/claims/country']").on("change", function () {
            $("[id='val_claim_mand_http://wso2.org/claims/country']").hide();
        });

        $("input[name^='claim_mand_']").on("input change", function () {
            var claimId = $(this).attr("name");
            var inputType = $(this).attr("type");

            if (inputType === "radio") {
                // Hide validation when any radio in the group is selected.
                var radioGroupName = $(this).attr("name");
                if ($("input[name='" + radioGroupName + "']:checked").length > 0) {
                    $("[id='val_" + claimId + "']").hide();
                }
            } else if ($(this).val()) {
                $("[id='val_" + claimId + "']").hide();
            }
        });

        $("#claimForm").submit(function (e) {
            if (!validateForm()) {
                e.preventDefault();
            }
        });
    });

    /**
     * Event handler and trigger for date picker elements.
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
    $("[id^='date_picker']").calendar({
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
        },
        onChange: function(date, text, mode) {
            // Hide validation when a date is selected from the calendar.
            var input = $(this).find('input[name^="claim_mand_"]');
            if (input.length > 0) {
                var claimId = input.attr("name");
                $("[id='val_" + claimId + "']").hide();
            }
        }
    });

    </script>
</body>
</html>
