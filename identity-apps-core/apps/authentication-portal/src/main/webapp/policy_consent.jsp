<%--
  ~ Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.LinkedHashMap" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.util.HashSet" %>
<%@ page import="org.json.JSONArray" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="java.util.regex.Matcher" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.framework.handler.request.impl.consent.PolicyConsentUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String sessionDataKey = request.getParameter(Constants.SESSION_DATA_KEY);
    PolicyConsentUtil.ClassifiedPolicies classifiedPolicies = null;
    try {
        classifiedPolicies = PolicyConsentUtil.classifyUnconsentedPolicies(sessionDataKey);
    } catch (Exception e) {
        // Fallback to empty result on error; the handler will re-validate on form submit.
        classifiedPolicies = null;
    }

    String[] mandatoryPurposeIds = (classifiedPolicies != null && classifiedPolicies.getMandatoryUnconsentedIds() != null)
            ? classifiedPolicies.getMandatoryUnconsentedIds().toArray(new String[0]) : new String[0];
    String[] mandatoryNewVersionIds = (classifiedPolicies != null && classifiedPolicies.getMandatoryNewVersionIds() != null)
            ? classifiedPolicies.getMandatoryNewVersionIds().toArray(new String[0]) : new String[0];
    String[] optionalPurposeIds = (classifiedPolicies != null && classifiedPolicies.getOptionalUnconsentedIds() != null)
            ? classifiedPolicies.getOptionalUnconsentedIds().toArray(new String[0]) : new String[0];
    String[] optionalNewVersionIds = (classifiedPolicies != null && classifiedPolicies.getOptionalNewVersionIds() != null)
            ? classifiedPolicies.getOptionalNewVersionIds().toArray(new String[0]) : new String[0];

    // Build all mandatory and optional IDs for hidden inputs (sent back to handler on form submit).
    List<String> allMandatoryIds = new java.util.ArrayList<>();
    for (String id : mandatoryPurposeIds) allMandatoryIds.add(id);
    for (String id : mandatoryNewVersionIds) allMandatoryIds.add(id);
    List<String> allOptionalIds = new java.util.ArrayList<>();
    for (String id : optionalPurposeIds) allOptionalIds.add(id);
    for (String id : optionalNewVersionIds) allOptionalIds.add(id);

    // Parse purposeMetadata to build display labels server-side (no client-side API calls needed).
    Map<String, String> purposeLabelMap = new LinkedHashMap<>();
    Set<String> newVersionPurposeIds = new HashSet<>();
    String purposeMetadataParam = (classifiedPolicies != null) ? classifiedPolicies.getPurposeMetadataJson() : null;
    if (StringUtils.isNotBlank(purposeMetadataParam)) {
        try {
            JSONArray metadataArray = new JSONArray(purposeMetadataParam);
            String agreePrefix = AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.agree.prefix");
            if (StringUtils.isBlank(agreePrefix) || agreePrefix.startsWith("policy.consent")) {
                agreePrefix = "I have read and agree to the";
            }

            for (int i = 0; i < metadataArray.length(); i++) {
                JSONObject obj = metadataArray.getJSONObject(i);
                String purposeId = obj.optString("purposeId", "");
                String name = obj.optString("name", purposeId);
                String rawDescription = obj.optString("description", "");
                String policyUrl = obj.optString("policyUrl", "");
                if (obj.optBoolean("newVersion", false)) {
                    newVersionPurposeIds.add(purposeId.trim());
                }

                // Mirrors the buildPurposeLabel JS function: prefer description, else build link from name/policyUrl.
                String labelHtml;
                if (StringUtils.isNotBlank(rawDescription)) {
                    if (rawDescription.startsWith("{{") && rawDescription.endsWith("}}")) {
                        String i18nKey = rawDescription.substring(2, rawDescription.length() - 2);
                        String resolved;
                        try {
                            resolved = resourceBundle.getString(i18nKey);
                        } catch (Exception e) {
                            resolved = null;
                        }
                        labelHtml = StringUtils.isNotBlank(resolved) ? resolved : Encode.forHtml(i18nKey);
                    } else {
                        labelHtml = rawDescription;
                    }
                    Matcher hrefMatcher = Pattern.compile("href=\"([^\"]+)\"").matcher(labelHtml);
                    StringBuffer processed = new StringBuffer();
                    while (hrefMatcher.find()) {
                        hrefMatcher.appendReplacement(processed,
                            Matcher.quoteReplacement("href=\"" + i18nLink(userLocale, hrefMatcher.group(1)) + "\""));
                    }
                    hrefMatcher.appendTail(processed);
                    labelHtml = processed.toString();
                } else if (StringUtils.isNotBlank(policyUrl)) {
                    labelHtml = Encode.forHtml(agreePrefix) + " <a href=\""
                            + Encode.forHtmlAttribute(i18nLink(userLocale, policyUrl))
                            + "\" target=\"_blank\" rel=\"noopener noreferrer\">"
                            + Encode.forHtml(name) + "</a>";
                } else {
                    continue;
                }
                purposeLabelMap.put(purposeId.trim(), labelHtml);
            }
        } catch (Exception e) {
            // Fallback: labels will display raw purpose IDs
        }
    }

    String spId = request.getParameter("spId");
%>

<% request.setAttribute("pageName", "policy_consent"); %>

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
        </layout:component>
        <layout:component componentName="MainSection">
            <div class="ui segment">
                <form class="ui large form" action="<%=commonauthURL%>" method="post" id="policy-consent-form">
                    <div class="field light-font">
                        <div>
                            <h4>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.title")%>
                            </h4>
                        </div>
                    </div>

                    <p class="login-portal-app-consent-request larger-font">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.description")%>
                    </p>

                    <div class="segment-form">
                        <div class="ui" style="text-align: left;">
                            <div class="ui list">
                                <%-- New policies section --%>
                                <% if (mandatoryPurposeIds.length > 0 || optionalPurposeIds.length > 0) { %>
                                <div class="item">
                                    <i aria-hidden="true" class="circle tiny icon primary consent-item-bullet" id="new_policies_section_icon"></i>
                                    <div class="content">
                                        <div class="header light-font consentItem">
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.section.new.title")%>
                                        </div>
                                    </div>
                                    <div class="content light-font">
                                        <div class="border-gray margin-bottom-double">
                                            <div class="mt-3 mb-3 claim-list">
                                                <% for (String purposeId : mandatoryPurposeIds) {
                                                    String trimmedId = purposeId.trim();
                                                    String label = purposeLabelMap.containsKey(trimmedId)
                                                            ? purposeLabelMap.get(trimmedId)
                                                            : Encode.forHtml(trimmedId);
                                                %>
                                                <div class="mt-1 pl-5 required mandatoryClaim" title="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.mandatory")%>">
                                                    <div class="ui checkbox claim-cb">
                                                        <input type="checkbox" class="mandatory-consent hidden" name="mandatoryPurposeId"
                                                            value="<%=Encode.forHtmlAttribute(trimmedId)%>"
                                                            id="mandatory-<%=Encode.forHtmlAttribute(trimmedId)%>"/>
                                                        <label for="mandatory-<%=Encode.forHtmlAttribute(trimmedId)%>">
                                                            <%=label%> <b class="login-portal-app-font">*</b>
                                                        </label>
                                                    </div>
                                                </div>
                                                <% } %>
                                                <% for (String purposeId : optionalPurposeIds) {
                                                    String trimmedId = purposeId.trim();
                                                    String label = purposeLabelMap.containsKey(trimmedId)
                                                            ? purposeLabelMap.get(trimmedId)
                                                            : Encode.forHtml(trimmedId);
                                                %>
                                                <div class="mt-1 pl-5">
                                                    <div class="ui checkbox claim-cb">
                                                        <input type="checkbox" class="hidden" name="optionalPurposeId"
                                                            value="<%=Encode.forHtmlAttribute(trimmedId)%>"
                                                            id="optional-<%=Encode.forHtmlAttribute(trimmedId)%>"/>
                                                        <label for="optional-<%=Encode.forHtmlAttribute(trimmedId)%>">
                                                            <%=label%>
                                                        </label>
                                                    </div>
                                                </div>
                                                <% } %>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <% } %>

                                <%-- Updated policies section --%>
                                <% if (mandatoryNewVersionIds.length > 0 || optionalNewVersionIds.length > 0) { %>
                                <div class="item">
                                    <i aria-hidden="true" class="circle tiny icon primary consent-item-bullet" id="updated_policies_section_icon"></i>
                                    <div class="content">
                                        <div class="header light-font consentItem">
                                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.section.updated.title")%>
                                        </div>
                                    </div>
                                    <div class="content light-font">
                                        <div class="border-gray margin-bottom-double">
                                            <div class="mt-3 mb-3 claim-list">
                                                <% for (String purposeId : mandatoryNewVersionIds) {
                                                    String trimmedId = purposeId.trim();
                                                    String label = purposeLabelMap.containsKey(trimmedId)
                                                            ? purposeLabelMap.get(trimmedId)
                                                            : Encode.forHtml(trimmedId);
                                                %>
                                                <div class="mt-1 pl-5 required mandatoryClaim" title="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.mandatory")%>">
                                                    <div class="ui checkbox claim-cb">
                                                        <input type="checkbox" class="mandatory-consent hidden" name="mandatoryPurposeId"
                                                            value="<%=Encode.forHtmlAttribute(trimmedId)%>"
                                                            id="mandatory-<%=Encode.forHtmlAttribute(trimmedId)%>"/>
                                                        <label for="mandatory-<%=Encode.forHtmlAttribute(trimmedId)%>">
                                                            <%=label%> <b class="login-portal-app-font">*</b>
                                                        </label>
                                                    </div>
                                                </div>
                                                <% } %>
                                                <% for (String purposeId : optionalNewVersionIds) {
                                                    String trimmedId = purposeId.trim();
                                                    String label = purposeLabelMap.containsKey(trimmedId)
                                                            ? purposeLabelMap.get(trimmedId)
                                                            : Encode.forHtml(trimmedId);
                                                %>
                                                <div class="mt-1 pl-5">
                                                    <div class="ui checkbox claim-cb">
                                                        <input type="checkbox" class="hidden" name="optionalPurposeId"
                                                            value="<%=Encode.forHtmlAttribute(trimmedId)%>"
                                                            id="optional-<%=Encode.forHtmlAttribute(trimmedId)%>"/>
                                                        <label for="optional-<%=Encode.forHtmlAttribute(trimmedId)%>">
                                                            <%=label%>
                                                        </label>
                                                    </div>
                                                </div>
                                                <% } %>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <% } %>
                            </div>
                        </div>

                        <div class="ui divider hidden"></div>
                        <input type="hidden" name="<%="sessionDataKey"%>"
                                value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY))%>"/>
                        <% if (spId != null && !spId.trim().isEmpty()) { %>
                        <input type="hidden" name="spId" value="<%=Encode.forHtmlAttribute(spId.trim())%>"/>
                        <% } %>
                        <%-- Hidden inputs carrying all purpose IDs back to the handler (avoids session storage). --%>
                        <% for (String hiddenId : allMandatoryIds) { %>
                        <input type="hidden" name="policyMandatoryIds"
                               value="<%=Encode.forHtmlAttribute(hiddenId)%>"/>
                        <% } %>
                        <% for (String hiddenId : allOptionalIds) { %>
                        <input type="hidden" name="policyOptionalIds"
                               value="<%=Encode.forHtmlAttribute(hiddenId)%>"/>
                        <% } %>
                        <div class="mt-0">
                            <input type="button" class="ui primary fluid large button" id="approve"
                                name="approve"
                                onclick="javascript: approved(); return false;"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>"/>
                        </div>
                        <div class="mt-3 align-center">
                            <input type="hidden" name="consent" id="consent" value="deny"/>
                            <input class="ui fluid large button secondary" type="reset"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "cancel")%>"
                                onclick="javascript: deny(); return false;"/>
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

    <script type="text/javascript">
        function updateApproveButton() {
            var unchecked = document.querySelectorAll("input.mandatory-consent:not(:checked)");
            document.getElementById("approve").disabled = unchecked.length > 0;
        }

        function approved() {
            var unchecked = document.querySelectorAll("input.mandatory-consent:not(:checked)");
            if (unchecked.length > 0) {
                unchecked[0].focus();
                return false;
            }
            document.getElementById('consent').value = "approve";
            document.getElementById("policy-consent-form").submit();
        }

        function deny() {
            document.getElementById('consent').value = "deny";
            document.getElementById("policy-consent-form").submit();
        }

        document.addEventListener("DOMContentLoaded", function() {
            updateApproveButton();
            document.querySelectorAll("input.mandatory-consent").forEach(function(cb) {
                cb.addEventListener("change", updateApproveButton);
            });
        });
    </script>
</body>
</html>
