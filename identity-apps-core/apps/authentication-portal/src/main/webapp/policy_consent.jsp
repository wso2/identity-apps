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
<%@ page import="java.util.Map" %>
<%@ page import="java.util.LinkedHashMap" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.util.HashSet" %>
<%@ page import="org.json.JSONArray" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="java.util.regex.Matcher" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String mandatoryPurposeIdsParam = request.getParameter("mandatoryPurposeIds");
    String[] mandatoryPurposeIds = new String[0];
    if (mandatoryPurposeIdsParam != null && !mandatoryPurposeIdsParam.trim().isEmpty()) {
        mandatoryPurposeIds = mandatoryPurposeIdsParam.split(",");
    }

    String mandatoryNewVersionIdsParam = request.getParameter("mandatoryNewVersionPurposeIds");
    String[] mandatoryNewVersionIds = new String[0];
    if (mandatoryNewVersionIdsParam != null && !mandatoryNewVersionIdsParam.trim().isEmpty()) {
        mandatoryNewVersionIds = mandatoryNewVersionIdsParam.split(",");
    }

    String optionalPurposeIdsParam = request.getParameter("optionalPurposeIds");
    String[] optionalPurposeIds = new String[0];
    if (optionalPurposeIdsParam != null && !optionalPurposeIdsParam.trim().isEmpty()) {
        optionalPurposeIds = optionalPurposeIdsParam.split(",");
    }

    String optionalNewVersionIdsParam = request.getParameter("optionalNewVersionPurposeIds");
    String[] optionalNewVersionIds = new String[0];
    if (optionalNewVersionIdsParam != null && !optionalNewVersionIdsParam.trim().isEmpty()) {
        optionalNewVersionIds = optionalNewVersionIdsParam.split(",");
    }

    // Parse purposeMetadata to build display labels server-side (no client-side API calls needed).
    Map<String, String> purposeLabelMap = new LinkedHashMap<>();
    Set<String> newVersionPurposeIds = new HashSet<>();
    String purposeMetadataParam = request.getParameter("purposeMetadata");
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
                            + Encode.forHtmlAttribute(policyUrl)
                            + "\" target=\"_blank\" rel=\"noopener noreferrer\">"
                            + Encode.forHtml(name) + "</a>";
                } else {
                    labelHtml = Encode.forHtml(StringUtils.isNotBlank(name) ? name : purposeId);
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
                        <h4>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.title")%>
                        </h4>
                    </div>

                    <p class="login-portal-app-consent-request">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.description")%>
                    </p>

                    <div class="segment-form">
                        <div class="ui" style="text-align: left;">
                            <div class="ui list">
                                <%-- Mandatory: first-time policies --%>
                                <% for (String purposeId : mandatoryPurposeIds) {
                                    String trimmedId = purposeId.trim();
                                    String label = purposeLabelMap.containsKey(trimmedId)
                                            ? purposeLabelMap.get(trimmedId)
                                            : Encode.forHtml(trimmedId);
                                %>
                                <div class="item" style="margin-bottom: 0.5em;">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="mandatoryPurposeId"
                                            value="<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            id="mandatory-<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            class="mandatory-consent"/>
                                        <label for="mandatory-<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            class="light-font">
                                            <%=label%>
                                            <span title="required" style="color: red; margin-left: 2px;">*</span>
                                        </label>
                                    </div>
                                </div>
                                <% } %>
                                <%-- Mandatory: updated policy versions --%>
                                <% for (String purposeId : mandatoryNewVersionIds) {
                                    String trimmedId = purposeId.trim();
                                    String label = purposeLabelMap.containsKey(trimmedId)
                                            ? purposeLabelMap.get(trimmedId)
                                            : Encode.forHtml(trimmedId);
                                %>
                                <div class="item" style="margin-bottom: 0.5em;">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="mandatoryPurposeId"
                                            value="<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            id="mandatory-<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            class="mandatory-consent"/>
                                        <label for="mandatory-<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            class="light-font">
                                            <%=label%>
                                            <span title="required" style="color: red; margin-left: 2px;">*</span>
                                            <span class="ui mini orange label" style="margin-left: 4px;">
                                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.updated")%>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <% } %>
                                <%-- Optional: first-time policies --%>
                                <% for (String purposeId : optionalPurposeIds) {
                                    String trimmedId = purposeId.trim();
                                    String label = purposeLabelMap.containsKey(trimmedId)
                                            ? purposeLabelMap.get(trimmedId)
                                            : Encode.forHtml(trimmedId);
                                %>
                                <div class="item" style="margin-bottom: 0.5em;">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="optionalPurposeId"
                                            value="<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            id="optional-<%=Encode.forHtmlAttribute(trimmedId)%>"/>
                                        <label for="optional-<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            class="light-font">
                                            <%=label%>
                                        </label>
                                    </div>
                                </div>
                                <% } %>
                                <%-- Optional: updated policy versions --%>
                                <% for (String purposeId : optionalNewVersionIds) {
                                    String trimmedId = purposeId.trim();
                                    String label = purposeLabelMap.containsKey(trimmedId)
                                            ? purposeLabelMap.get(trimmedId)
                                            : Encode.forHtml(trimmedId);
                                %>
                                <div class="item" style="margin-bottom: 0.5em;">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="optionalPurposeId"
                                            value="<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            id="optional-<%=Encode.forHtmlAttribute(trimmedId)%>"/>
                                        <label for="optional-<%=Encode.forHtmlAttribute(trimmedId)%>"
                                            class="light-font">
                                            <%=label%>
                                            <span class="ui mini orange label" style="margin-left: 4px;">
                                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.updated")%>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <% } %>
                            </div>
                        </div>

                        <div class="ui divider hidden"></div>

                        <div class="mt-0">
                            <input type="button" class="ui primary fluid large button" id="approve"
                                name="approve"
                                onclick="javascript: approved(); return false;"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.button.accept")%>"/>
                        </div>
                        <div class="mt-2 align-center">
                            <input class="ui fluid large button secondary" type="reset"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "policy.consent.button.decline")%>"
                                onclick="javascript: deny(); return false;"/>
                        </div>

                        <input type="hidden" name="<%="sessionDataKey"%>"
                                value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY))%>"/>
                        <% if (spId != null && !spId.trim().isEmpty()) { %>
                        <input type="hidden" name="spId" value="<%=Encode.forHtmlAttribute(spId.trim())%>"/>
                        <% } %>
                        <input type="hidden" name="consent" id="consent" value="deny"/>
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
    </script>
</body>
</html>
