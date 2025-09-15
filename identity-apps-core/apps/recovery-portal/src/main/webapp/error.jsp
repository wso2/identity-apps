<%--
  ~ Copyright (c) 2016-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page isErrorPage="true" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.event.IdentityEventException" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.recovery.IdentityRecoveryConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.constants.SelfRegistrationStatusCodes" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URISyntaxException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    // Add the email-link-expiry screen to the list to retrieve text branding customizations.
    screenNames.add("email-link-expiry");
%>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    String errorCode = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorCode"));
    String invalidConfirmationErrorCode = IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_INVALID_CODE.getCode();
    String callback = request.getParameter("callback");
    boolean isValidCallback = true;

    if (invalidConfirmationErrorCode.equals(errorCode)) {
        tenantDomain = StringUtils.EMPTY;
        if (StringUtils.isNotBlank(request.getParameter("tenantdomain"))){
            tenantDomain = request.getParameter("tenantdomain").trim();
        } else if (StringUtils.isNotBlank(request.getParameter("tenantDomain"))){
            tenantDomain = request.getParameter("tenantDomain").trim();
        }

        Boolean isValidCallBackURL = false;
        try {
            if (StringUtils.isNotBlank(callback)) {
                PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
                isValidCallBackURL = preferenceRetrievalClient.checkIfRecoveryCallbackURLValid(tenantDomain, callback);
            }
        } catch (PreferenceRetrievalClientException e) {
            request.setAttribute("error", true);
            request.setAttribute("errorMsg", IdentityManagementEndpointUtil
                .i18n(recoveryResourceBundle, "something.went.wrong.contact.admin"));
            IdentityManagementEndpointUtil.addErrorInformation(request, e);
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }

        if (StringUtils.isNotBlank(callback) && !isValidCallBackURL) {
                    isValidCallback = false;
        }
    }

    try {
        IdentityManagementEndpointUtil.getURLEncodedCallback(callback);
    } catch (URISyntaxException e) {
        isValidCallback = false;
    }
    if (StringUtils.isBlank(errorMsg)) {
        errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Server.failed.to.respond");
    }
%>

<% request.setAttribute("pageName", "error"); %>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("isResponsePage", true);
    layoutData.put("isErrorResponse", true);
%>

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
<body class="login-portal layout recovery-layout" data-response-type="error" data-page="<%= request.getAttribute("pageName") %>">
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
        <layout:component componentName="MainSection" >
            <div class="ui orange attached segment mt-3">
                <h3 class="ui header text-center slogan-message mt-3 mb-6" data-testid="error-page-header">
                    <%
                        if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_INVALID_CODE.getCode()
                                .equals(errorCode)) {
                    %>
                        <%=i18n(recoveryResourceBundle, customText, "email.link.expiry.message")%>
                    <%
                        } else if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_EXPIRED_CODE.getCode()
                                .equals(errorCode)) {
                    %>
                        <%=i18n(recoveryResourceBundle, customText, "email.link.expiry.message")%>
                    <% } else if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_EXPIRED_OTP.getCode()
                                .equals(errorCode)) {
                    %>
                        <%=i18n(recoveryResourceBundle, customText, "otp.expired.message")%>
                    <% } else if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_LOCKED_ACCOUNT.getCode()
                                .equals(errorCode)) {
                            String[] splitErrorMsg = errorMsg.split("-");
                            String username = splitErrorMsg[1].trim();
                            String finalMessage = i18n(recoveryResourceBundle, customText, "user.account.locked") + (" - ") + username;
                    %>
                        <%=finalMessage%>
                    <% } else if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_PENDING_SELF_REGISTERED_ACCOUNT.getCode().equals(errorCode)) {
                        String[] splitErrorMsg = errorMsg.split("-");
                        String username = splitErrorMsg[1].trim();
                        String finalMessage = i18n(recoveryResourceBundle, customText, "pending.user.account.verification") + (" - ") + username;
                    %>
                        <%=finalMessage%>
                    <% } else if ( SelfRegistrationStatusCodes.ERROR_CODE_DUPLICATE_CLAIM_VALUE.equals(errorCode)) {
                        String[] splitErrorMsg = errorMsg.split("for");
                        String[] attributeList = splitErrorMsg[1].split("are|is")[0].trim().split(",");
                        String attributeString = " ";
                        String finalMessage = "";
                        for (int i = 0; i < attributeList.length; i++) {
                            attributeString = attributeString + IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, attributeList[i].trim());

                            if (i < attributeList.length - 1) {
                                attributeString = attributeString + (", ");
                            } else {
                                attributeString = attributeString + (" ");
                            }
                        }

                        if (errorMsg.contains("is")) {
                            finalMessage = new StringBuilder()
                                .append(i18n(recoveryResourceBundle, customText, "values.defined.for"))
                                .append(attributeString)
                                .append(i18n(recoveryResourceBundle, customText, "are.already.used.by.different.users"))
                                .toString();
                        } else {
                            finalMessage = new StringBuilder()
                                .append(i18n(recoveryResourceBundle, customText, "values.defined.for"))
                                .append(attributeString)
                                .append(i18n(recoveryResourceBundle, customText, "are.already.used.by.different.users"))
                                .toString();
                        }
                    %>
                        <%=finalMessage%>
                    <% } else if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_DISABLED_ACCOUNT.getCode().equals(errorCode)) {
                        String[] splitErrorMsg = errorMsg.split(" ");
                        String username = splitErrorMsg[4].trim();
                        String finalMessage = i18n(recoveryResourceBundle, customText, "user.account.disabled") + (" ") + username;
                    %>
                        <%=finalMessage%>
                    <% } else if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_INVALID_USER.getCode().equals(errorCode)) {
                        String[] splitErrorMsg = errorMsg.split(" ");
                        String username = splitErrorMsg[2].trim();
                        String finalMessage = i18n(recoveryResourceBundle, customText, "invalid.user") + (" ") + username;
                    %>
                        <%=finalMessage%>
                    <%
                    } else if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_UNEXPECTED.getCode().equals(errorCode)) {
                    %>
                        <%=i18n(recoveryResourceBundle, customText, "internal.server.error")%>
                    <%
                    } else { %>
                        <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                    <% } %>
                </h3>
            </div>
            <div class="ui bottom attached warning message">
                <p class="text-left mt-0">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "need.help.contact.us")%>
                    <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                        <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %>
                        </span>
                    </a>
                <%
                    if (config.getServletContext().getResource("extensions/error-tracking-reference.jsp") != null) {
                %>
                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "with.tracking.reference.below")%>
                </p>
                <div class="ui divider hidden"></div>
                <jsp:include page="extensions/error-tracking-reference.jsp"/>
                <% } else { %>
                </p>
                <% } %>
                <div class="ui divider hidden"></div>
                <% if (isValidCallback) { %>
                <div id="action-buttons" class="buttons">
                    <a href="javascript:goBack()" class="ui button primary button">
                        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "go.back")%>
                    </a>
                </div>
                <% } %>
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
    <script>
        $(document).ready(function () {
            // Checks if the `callback` URL param is present, and if not, hides the `Go Back` button.
            if ("<%=StringUtils.isEmpty(callback)%>" === "true") {
                $("#action-buttons").hide();
            }
            if ("<%=isValidCallback%>" === "false") {
                $("#go-back-button").addClass("disabled");
                $("#action-buttons").attr("title", "<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "request.has.an.invalid.callback.URL")%>.");
            }
        });

        <% if (isValidCallback) { %>
        function goBack() {

            var errorCodeFromParams = "<%=errorCode%>";
            var invalidConfirmationErrorCode = "<%=invalidConfirmationErrorCode%>";

            // Check if the error is related to the confirmation code being invalid.
            // If so, navigate the users to the URL defined in `callback` URL param.
            if (errorCodeFromParams === invalidConfirmationErrorCode) {
                window.location.href = "<%=Encode.forJavaScript(callback)%>";

                return;
            }
            window.history.back();
        }
        <% } %>
    </script>
</body>
</html>
